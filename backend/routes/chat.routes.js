import express from 'express';
import {
  createConversation,
  getChatContacts,
  getConversations,
  getMessages,
  markConversationRead,
  sendMessage
} from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/contacts/:email', getChatContacts);
router.get('/conversations/:email', getConversations);
router.post('/conversations', createConversation);
router.get('/conversations/:id/messages', getMessages);
router.post('/conversations/:id/messages', sendMessage);
router.patch('/conversations/:id/read', markConversationRead);

export default router;
