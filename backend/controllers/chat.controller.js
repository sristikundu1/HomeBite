import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { getSocketServer, userRoom } from '../config/socket.js';
import { notifyRecipients } from '../services/notifications.service.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();
const effectiveRole = (user) => user?.role === 'admin' ? 'admin' : user?.chefStatus === 'approved' ? 'chef' : 'customer';
const conversationId = (value) => ObjectId.isValid(value) ? new ObjectId(value) : null;

function users() { return getDB().collection('users'); }
function conversations() { return getDB().collection('conversations'); }
function messages() { return getDB().collection('messages'); }

function allowedPair(firstRole, secondRole) {
  if (firstRole === secondRole) return false;
  const roles = new Set([firstRole, secondRole]);
  return roles.has('admin') || (roles.has('customer') && roles.has('chef'));
}

function publicUser(user) {
  return {
    email: normalizeEmail(user.email),
    name: user.name || user.email,
    photo: user.photo || '',
    role: effectiveRole(user)
  };
}

async function findParticipantConversation(id, email) {
  return conversations().findOne({ _id: id, participantEmails: email });
}

function fail(res, error, action) {
  console.error(`${action} failed:`, error.message);
  return sendError(res, 500, `Failed to ${action.toLowerCase()}`);
}

export async function getChatContacts(req, res) {
  try {
    const email = normalizeEmail(req.params.email);
    const currentUser = await users().findOne({ email });
    if (!currentUser) return sendError(res, 404, 'User not found');

    const role = effectiveRole(currentUser);
    const candidates = await users().find({ email: { $ne: email }, status: { $ne: 'deleted' } }).toArray();
    const contacts = candidates
      .filter((candidate) => allowedPair(role, effectiveRole(candidate)))
      .map(publicUser)
      .sort((a, b) => a.name.localeCompare(b.name));

    return sendSuccess(res, 200, 'Chat contacts retrieved successfully', contacts);
  } catch (error) {
    return fail(res, error, 'Get chat contacts');
  }
}

export async function getConversations(req, res) {
  try {
    const email = normalizeEmail(req.params.email);
    if (!email) return sendError(res, 400, 'User email is required');

    const list = await conversations().find({ participantEmails: email }).sort({ lastMessageAt: -1, createdAt: -1 }).toArray();
    const data = await Promise.all(list.map(async (conversation) => ({
      ...conversation,
      unreadCount: await messages().countDocuments({ conversationId: conversation._id, receiverEmail: email, readAt: null })
    })));
    return sendSuccess(res, 200, 'Conversations retrieved successfully', data);
  } catch (error) {
    return fail(res, error, 'Get conversations');
  }
}

export async function createConversation(req, res) {
  try {
    const userEmail = normalizeEmail(req.body.userEmail);
    const participantEmail = normalizeEmail(req.body.participantEmail);
    if (!userEmail || !participantEmail || userEmail === participantEmail) return sendError(res, 400, 'Two different participant emails are required');

    const participantUsers = await users().find({ email: { $in: [userEmail, participantEmail] } }).toArray();
    if (participantUsers.length !== 2) return sendError(res, 404, 'One or more participants were not found');
    if (!allowedPair(...participantUsers.map(effectiveRole))) return sendError(res, 403, 'This chat relationship is not supported');

    const participantKey = [userEmail, participantEmail].sort().join('|');
    const now = new Date();
    await conversations().updateOne(
      { participantKey },
      {
        $setOnInsert: {
          participantKey,
          participantEmails: [userEmail, participantEmail],
          participants: participantUsers.map(publicUser),
          lastMessage: '',
          lastMessageAt: now,
          createdAt: now
        },
        $set: { updatedAt: now }
      },
      { upsert: true }
    );
    const conversation = await conversations().findOne({ participantKey });
    return sendSuccess(res, 201, 'Conversation ready', { ...conversation, unreadCount: 0 });
  } catch (error) {
    return fail(res, error, 'Create conversation');
  }
}

export async function getMessages(req, res) {
  try {
    const _id = conversationId(req.params.id);
    const email = normalizeEmail(req.query.email);
    if (!_id || !email) return sendError(res, 400, 'Valid conversation id and user email are required');
    if (!await findParticipantConversation(_id, email)) return sendError(res, 404, 'Conversation not found');

    const data = await messages().find({ conversationId: _id }).sort({ createdAt: 1 }).limit(500).toArray();
    return sendSuccess(res, 200, 'Messages retrieved successfully', data);
  } catch (error) {
    return fail(res, error, 'Get messages');
  }
}

export async function sendMessage(req, res) {
  try {
    const _id = conversationId(req.params.id);
    const senderEmail = normalizeEmail(req.body.senderEmail);
    const text = String(req.body.text || '').trim();
    if (!_id || !senderEmail || !text) return sendError(res, 400, 'Conversation, sender, and message are required');
    if (text.length > 2000) return sendError(res, 400, 'Message cannot exceed 2000 characters');

    const conversation = await findParticipantConversation(_id, senderEmail);
    if (!conversation) return sendError(res, 404, 'Conversation not found');
    const receiverEmail = conversation.participantEmails.find((email) => email !== senderEmail);
    const message = { conversationId: _id, senderEmail, receiverEmail, text, createdAt: new Date(), readAt: null };
    const result = await messages().insertOne(message);
    message._id = result.insertedId;

    await conversations().updateOne({ _id }, { $set: { lastMessage: text, lastMessageAt: message.createdAt, updatedAt: message.createdAt } });
    const payload = { message, conversationId: _id, conversation: { ...conversation, lastMessage: text, lastMessageAt: message.createdAt } };
    const io = getSocketServer();
    io?.to(userRoom(senderEmail)).to(userRoom(receiverEmail)).emit('chat:message', payload);
    const sender = conversation.participants?.find((participant) => normalizeEmail(participant.email) === senderEmail);
    await notifyRecipients([receiverEmail], {
      type: 'message',
      title: `New message from ${sender?.name || 'HomeBite user'}`,
      message: text.length > 120 ? `${text.slice(0, 117)}...` : text
    });
    return sendSuccess(res, 201, 'Message sent successfully', message);
  } catch (error) {
    return fail(res, error, 'Send message');
  }
}

export async function markConversationRead(req, res) {
  try {
    const _id = conversationId(req.params.id);
    const email = normalizeEmail(req.body.email);
    if (!_id || !email) return sendError(res, 400, 'Valid conversation id and user email are required');
    if (!await findParticipantConversation(_id, email)) return sendError(res, 404, 'Conversation not found');

    await messages().updateMany({ conversationId: _id, receiverEmail: email, readAt: null }, { $set: { readAt: new Date() } });
    getSocketServer()?.to(userRoom(email)).emit('chat:read', { conversationId: _id, email });
    return sendSuccess(res, 200, 'Conversation marked as read', { conversationId: _id });
  } catch (error) {
    return fail(res, error, 'Mark conversation read');
  }
}
