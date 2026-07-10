import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Circle, Loader2, MessageCircle, Search, Send, UserRound } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import useSocket from '../../hooks/useSocket';
import { useAuth } from '../../providers/AuthProvider';
import {
  createConversation,
  getChatContacts,
  getConversationMessages,
  getConversations,
  markChatRead,
  sendChatMessage
} from '../../services/chatApi';

const documentId = (value) => value?.$oid || value || '';
const normalizeEmail = (value) => String(value || '').trim().toLowerCase();
const formatTime = (value) => new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(value));

function otherParticipant(conversation, email) {
  return conversation?.participants?.find((participant) => normalizeEmail(participant.email) !== email) || null;
}

function mergeById(current, incoming) {
  const items = new Map(current.map((item) => [documentId(item._id), item]));
  incoming.forEach((item) => items.set(documentId(item._id), item));
  return [...items.values()].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

function Avatar({ person, size = 'h-11 w-11' }) {
  return person?.photo ? (
    <img src={person.photo} alt="" className={`${size} shrink-0 rounded-2xl object-cover`} />
  ) : (
    <span className={`${size} flex shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]`}><UserRound className="h-5 w-5" /></span>
  );
}

export default function Chat({
  title = 'Messages',
  description = 'Chat with your HomeBite customers, chefs, and support team in real time.'
}) {
  const { user, dbUser } = useAuth();
  const { socket } = useSocket();
  const email = normalizeEmail(dbUser?.email || user?.email);
  const [conversations, setConversations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [typingEmail, setTypingEmail] = useState('');
  const [online, setOnline] = useState({});
  const selectedIdRef = useRef('');
  const typingTimer = useRef(null);
  const bottomRef = useRef(null);

  const selectedConversation = conversations.find((item) => documentId(item._id) === selectedId);
  const selectedPerson = otherParticipant(selectedConversation, email);
  const selectedPersonEmail = normalizeEmail(selectedPerson?.email);
  const presenceEmails = useMemo(
    () => [...new Set(conversations.map((conversation) => normalizeEmail(otherParticipant(conversation, email)?.email)).filter(Boolean))],
    [conversations, email]
  );
  const presenceKey = presenceEmails.join('|');

  const loadConversations = useCallback(async () => {
    if (!email) return;
    try {
      const [conversationResponse, contactResponse] = await Promise.all([getConversations(email), getChatContacts(email)]);
      setConversations(conversationResponse.data.data || []);
      setContacts(contactResponse.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load messages.');
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => { loadConversations(); }, [loadConversations]);
  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);
  useEffect(() => () => clearTimeout(typingTimer.current), []);

  useEffect(() => {
    function onMessage({ message, conversationId }) {
      const id = documentId(conversationId);
      if (id === selectedIdRef.current) {
        setMessages((current) => mergeById(current, [message]));
        if (normalizeEmail(message.receiverEmail) === email) markChatRead(id, email).catch(() => {});
      }
      setConversations((current) => current.map((conversation) => documentId(conversation._id) === id ? {
        ...conversation,
        lastMessage: message.text,
        lastMessageAt: message.createdAt,
        unreadCount: id === selectedIdRef.current || normalizeEmail(message.senderEmail) === email ? 0 : (conversation.unreadCount || 0) + 1
      } : conversation).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)));
    }
    function onTyping(payload) {
      if (documentId(payload.conversationId) === selectedIdRef.current) setTypingEmail(payload.isTyping ? payload.senderEmail : '');
    }
    function onPresence({ email: presenceEmail, online: isOnline }) {
      setOnline((current) => ({ ...current, [normalizeEmail(presenceEmail)]: isOnline }));
    }
    socket.on('chat:message', onMessage);
    socket.on('chat:typing', onTyping);
    socket.on('chat:presence', onPresence);
    return () => {
      socket.off('chat:message', onMessage);
      socket.off('chat:typing', onTyping);
      socket.off('chat:presence', onPresence);
    };
  }, [email, socket]);

  useEffect(() => {
    if (!selectedId) { setMessages([]); return undefined; }
    let active = true;
    setMessagesLoading(true);

    function joinConversation() {
      socket.emit('chat:join', selectedId);
    }

    socket.on('connect', joinConversation);
    if (socket.connected) joinConversation();
    getConversationMessages(selectedId, email)
      .then((response) => { if (active) setMessages(response.data.data || []); })
      .catch((error) => toast.error(error.response?.data?.message || 'Unable to load this conversation.'))
      .finally(() => { if (active) setMessagesLoading(false); });
    markChatRead(selectedId, email).then(() => setConversations((current) => current.map((item) => documentId(item._id) === selectedId ? { ...item, unreadCount: 0 } : item))).catch(() => {});
    return () => {
      active = false;
      socket.off('connect', joinConversation);
      if (socket.connected) socket.emit('chat:leave', selectedId);
    };
  }, [email, selectedId, socket]);

  useEffect(() => {
    if (!presenceEmails.length) return undefined;

    function checkPresence() {
      presenceEmails.forEach((participantEmail) => socket.emit('chat:presence:check', participantEmail));
    }

    socket.on('connect', checkPresence);
    if (socket.connected) checkPresence();
    return () => socket.off('connect', checkPresence);
    // presenceKey changes only when the conversation participant list changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presenceKey, socket]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typingEmail]);

  const visibleConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return conversations.filter((conversation) => {
      const person = otherParticipant(conversation, email);
      return !query || person?.name?.toLowerCase().includes(query) || person?.email?.includes(query);
    });
  }, [conversations, email, search]);

  const availableContacts = useMemo(() => {
    const existing = new Set(conversations.flatMap((conversation) => conversation.participantEmails || []));
    const query = search.trim().toLowerCase();
    return contacts.filter((contact) => !existing.has(contact.email) && (!query || contact.name.toLowerCase().includes(query) || contact.email.includes(query)));
  }, [contacts, conversations, search]);

  async function startConversation(contact) {
    try {
      const response = await createConversation(email, contact.email);
      const conversation = response.data.data;
      setConversations((current) => [conversation, ...current.filter((item) => documentId(item._id) !== documentId(conversation._id))]);
      setSelectedId(documentId(conversation._id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to start conversation.');
    }
  }

  function handleDraftChange(event) {
    const value = event.target.value;
    setDraft(value);
    if (!selectedPerson) return;
    socket.emit('chat:typing', { conversationId: selectedId, receiverEmail: selectedPerson.email, isTyping: true });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => socket.emit('chat:typing', { conversationId: selectedId, receiverEmail: selectedPerson.email, isTyping: false }), 900);
  }

  async function submitMessage(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !selectedId || sending) return;
    setSending(true);
    setDraft('');
    clearTimeout(typingTimer.current);
    socket.emit('chat:typing', { conversationId: selectedId, receiverEmail: selectedPerson.email, isTyping: false });
    try {
      const response = await sendChatMessage(selectedId, email, text);
      setMessages((current) => mergeById(current, [response.data.data]));
    } catch (error) {
      setDraft(text);
      toast.error(error.response?.data?.message || 'Message was not sent.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <DashboardHeader title={title} description={description} />
      <div className="mt-8 grid h-[min(720px,calc(100vh-220px))] min-h-[560px] overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)] md:grid-cols-[340px_minmax(0,1fr)]">
        <aside className={`${selectedId ? 'hidden md:flex' : 'flex'} min-h-0 flex-col border-r border-[var(--border)]`}>
          <div className="border-b border-[var(--border)] p-4">
            <label className="flex items-center gap-3 rounded-2xl bg-[var(--bg-muted)] px-4 py-3 text-[var(--text-muted)]">
              <Search className="h-4 w-4" /><span className="sr-only">Search conversations</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search people" className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none" />
            </label>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {loading ? <ConversationSkeleton /> : (
              <>
                {visibleConversations.map((conversation) => <ConversationButton key={documentId(conversation._id)} conversation={conversation} email={email} active={selectedId === documentId(conversation._id)} online={online[normalizeEmail(otherParticipant(conversation, email)?.email)]} onClick={() => setSelectedId(documentId(conversation._id))} />)}
                {availableContacts.length > 0 && <p className="px-3 pb-2 pt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Start a conversation</p>}
                {availableContacts.map((contact) => <button key={contact.email} type="button" onClick={() => startConversation(contact)} className="flex w-full items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-[var(--bg-muted)]"><Avatar person={contact} /><span className="min-w-0"><span className="block truncate text-sm font-semibold text-[var(--text-primary)]">{contact.name}</span><span className="block text-xs capitalize text-[var(--text-muted)]">{contact.role}</span></span></button>)}
                {!visibleConversations.length && !availableContacts.length && <div className="px-5 py-16 text-center"><MessageCircle className="mx-auto h-8 w-8 text-[var(--text-muted)]" /><p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">No conversations found</p></div>}
              </>
            )}
          </div>
        </aside>

        <section className={`${selectedId ? 'flex' : 'hidden md:flex'} min-h-0 flex-col`}>
          {selectedConversation && selectedPerson ? (
            <>
              <header className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-4 sm:px-6">
                <button type="button" onClick={() => setSelectedId('')} className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] md:hidden" aria-label="Back to conversations"><ArrowLeft className="h-4 w-4" /></button>
                <div className="relative"><Avatar person={selectedPerson} /><Circle className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 fill-current ${online[selectedPersonEmail] ? 'text-emerald-500' : 'text-slate-400'}`} /></div>
                <div className="min-w-0"><h2 className="truncate text-base font-semibold text-[var(--text-primary)]">{selectedPerson.name}</h2><p className="text-xs text-[var(--text-muted)]">{online[selectedPersonEmail] ? 'Online' : 'Offline'} · <span className="capitalize">{selectedPerson.role}</span></p></div>
              </header>
              <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--bg-page)]/55 p-4 sm:p-6">
                {messagesLoading ? <MessageSkeleton /> : messages.length ? messages.map((message) => <MessageBubble key={documentId(message._id)} message={message} own={normalizeEmail(message.senderEmail) === email} />) : <div className="flex h-full items-center justify-center text-center"><div><MessageCircle className="mx-auto h-10 w-10 text-[var(--accent)]" /><p className="mt-4 font-semibold text-[var(--text-primary)]">Start the conversation</p><p className="mt-1 text-sm text-[var(--text-muted)]">Messages are delivered instantly and saved securely.</p></div></div>}
                <AnimatePresence>{typingEmail && <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-xs text-[var(--text-muted)]">{selectedPerson.name} is typing…</motion.p>}</AnimatePresence>
                <div ref={bottomRef} />
              </div>
              <form onSubmit={submitMessage} className="flex items-end gap-3 border-t border-[var(--border)] p-4 sm:p-5">
                <label className="min-w-0 flex-1"><span className="sr-only">Message</span><textarea value={draft} onChange={handleDraftChange} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submitMessage(event); } }} maxLength={2000} rows={1} placeholder="Write a message…" className="max-h-32 min-h-[48px] w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]" /></label>
                <motion.button whileHover={draft.trim() && !sending ? { y: -2 } : {}} whileTap={draft.trim() && !sending ? { scale: 0.96 } : {}} type="submit" disabled={!draft.trim() || sending} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-45" aria-label="Send message">{sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}</motion.button>
              </form>
            </>
          ) : <div className="flex h-full items-center justify-center p-8 text-center"><div><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--accent-soft)] text-[var(--accent)]"><MessageCircle className="h-8 w-8" /></span><h2 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">Your conversations</h2><p className="mt-2 max-w-sm text-sm text-[var(--text-muted)]">Choose a conversation or select a person to begin chatting.</p></div></div>}
        </section>
      </div>
    </div>
  );
}

function ConversationButton({ conversation, email, active, online, onClick }) {
  const person = otherParticipant(conversation, email);
  return <button type="button" onClick={onClick} className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${active ? 'bg-[var(--accent-soft)]' : 'hover:bg-[var(--bg-muted)]'}`}><div className="relative"><Avatar person={person} /><Circle className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-current ${online ? 'text-emerald-500' : 'text-slate-400'}`} /></div><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold text-[var(--text-primary)]">{person?.name}</span>{conversation.lastMessageAt && <span className="shrink-0 text-[10px] text-[var(--text-muted)]">{formatTime(conversation.lastMessageAt)}</span>}</span><span className="mt-1 flex items-center justify-between gap-2"><span className="truncate text-xs text-[var(--text-muted)]">{conversation.lastMessage || `Chat with ${person?.role}`}</span>{conversation.unreadCount > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[10px] font-bold text-white">{conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}</span>}</span></span></button>;
}

function MessageBubble({ message, own }) {
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`mb-3 flex ${own ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[82%] rounded-3xl px-4 py-3 sm:max-w-[70%] ${own ? 'rounded-br-lg bg-gradient-to-br from-orange-500 to-rose-500 text-white' : 'rounded-bl-lg border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)]'}`}><p className={`whitespace-pre-wrap break-words text-sm leading-6 ${own ? 'text-white' : 'text-[var(--text-primary)]'}`}>{message.text}</p><p className={`mt-1 text-right text-[10px] ${own ? 'text-white/75' : 'text-[var(--text-muted)]'}`}>{formatTime(message.createdAt)}</p></div></motion.div>;
}

function ConversationSkeleton() { return <div className="space-y-2 p-2" role="status" aria-label="Loading conversations">{[1, 2, 3, 4].map((item) => <div key={item} className="flex animate-pulse gap-3 rounded-2xl p-3"><div className="h-11 w-11 rounded-2xl bg-[var(--bg-muted)]" /><div className="flex-1 space-y-2"><div className="h-3 w-2/3 rounded bg-[var(--bg-muted)]" /><div className="h-3 w-full rounded bg-[var(--bg-muted)]" /></div></div>)}</div>; }
function MessageSkeleton() { return <div className="space-y-4" role="status" aria-label="Loading messages">{[45, 65, 38, 55].map((width, index) => <div key={`${width}-${index}`} className={`h-14 animate-pulse rounded-3xl bg-[var(--bg-muted)] ${index % 2 ? 'ml-auto' : ''}`} style={{ width: `${width}%` }} />)}</div>; }
