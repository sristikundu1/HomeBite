import { AnimatePresence, motion } from 'framer-motion';
import { Bot, ChefHat, Loader2, Send, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { askFoodAssistant } from '../../services/aiAssistantApi';
import MarkdownMessage from './MarkdownMessage';

const prompts = [
  'Recommend a healthy meal',
  'What can I get on a budget?',
  'Show me popular cuisines',
  'How does HomeBite work?'
];

const welcome = {
  role: 'assistant',
  content: "Hi! I'm your **HomeBite Food Assistant**. I can recommend meals, work with your budget, answer platform questions, and help you find the right page."
};

export default function AIFoodAssistant() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([welcome]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 150); }, [open]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  async function sendMessage(value) {
    const message = String(value || draft).trim();
    if (!message || loading) return;
    const history = messages.filter((item) => !item.error);
    setMessages((current) => [...current, { role: 'user', content: message }]);
    setDraft('');
    setLoading(true);
    try {
      const response = await askFoodAssistant(message, history, location.pathname);
      setMessages((current) => [...current, { role: 'assistant', content: response.data.data.answer }]);
    } catch (error) {
      setMessages((current) => [...current, {
        role: 'assistant',
        error: true,
        content: error.response?.data?.message || 'I could not respond right now. Please try again shortly.'
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  return createPortal(
    <>
      <AnimatePresence>
        {open && (
          <motion.section initial={{ opacity: 0, y: 22, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.96 }} transition={{ duration: 0.24 }} className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-[90] flex h-[min(650px,calc(100dvh-7rem-env(safe-area-inset-bottom)))] w-[calc(100vw-2rem)] max-w-[390px] origin-bottom-right flex-col overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-elevated)] sm:bottom-[7rem] sm:right-8 sm:h-[min(650px,calc(100dvh-8.5rem))]" role="dialog" aria-label="AI Food Assistant">
            <header className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-4 text-white">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15"><ChefHat className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1"><h2 className="text-base font-semibold text-white">AI Food Assistant</h2><p className="text-xs text-white/80">Recommendations and HomeBite help</p></div>
              <button type="button" onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60" aria-label="Close AI assistant"><X className="h-4 w-4" /></button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--bg-page)]/60 px-4 py-5" aria-live="polite">
              <div className="space-y-4">
                {messages.map((message, index) => <motion.div key={index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[88%] rounded-3xl px-4 py-3 ${message.role === 'user' ? 'rounded-br-lg bg-gradient-to-br from-orange-500 to-rose-500 text-white' : `rounded-bl-lg border bg-[var(--bg-surface)] text-[var(--text-primary)] ${message.error ? 'border-red-500/30' : 'border-[var(--border)]'}`}`}><MarkdownMessage content={message.content} /></div></motion.div>)}
                {loading && <div className="flex justify-start"><div className="flex items-center gap-1 rounded-3xl rounded-bl-lg border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-4" aria-label="Assistant is typing"><TypingDot delay={0} /><TypingDot delay={0.16} /><TypingDot delay={0.32} /></div></div>}
                <div ref={bottomRef} />
              </div>
            </div>

            {messages.length <= 2 && <div className="flex gap-2 overflow-x-auto border-t border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3">{prompts.map((prompt) => <button key={prompt} type="button" onClick={() => sendMessage(prompt)} disabled={loading} className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50">{prompt}</button>)}</div>}

            <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-[var(--border)] bg-[var(--bg-surface)] p-3">
              <label className="min-w-0 flex-1"><span className="sr-only">Ask the food assistant</span><textarea ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} rows={1} maxLength={1500} placeholder="Ask about meals or HomeBite…" className="max-h-28 min-h-[46px] w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]" /></label>
              <motion.button whileTap={draft.trim() && !loading ? { scale: 0.94 } : {}} type="submit" disabled={!draft.trim() || loading} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-45" aria-label="Send question">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</motion.button>
            </form>
            <p className="border-t border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2 text-center text-[10px] text-[var(--text-muted)]">AI suggestions may be imperfect. Confirm allergens with the chef.</p>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button type="button" onClick={() => setOpen((current) => !current)} whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.94 }} className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-[91] flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-[0_20px_55px_rgba(249,115,22,0.38)] focus:outline-none focus:ring-4 focus:ring-orange-500/25 sm:bottom-8 sm:right-8 sm:h-16 sm:w-16" aria-label={open ? 'Close AI Food Assistant' : 'Open AI Food Assistant'} aria-expanded={open}><AnimatePresence mode="wait">{open ? <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X className="h-6 w-6" /></motion.span> : <motion.span key="bot" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="relative"><Bot className="h-7 w-7" /><Sparkles className="absolute -right-2 -top-2 h-3.5 w-3.5" /></motion.span>}</AnimatePresence></motion.button>
    </>,
    document.body
  );
}

function TypingDot({ delay }) {
  return <motion.span animate={{ y: [0, -5, 0], opacity: [0.45, 1, 0.45] }} transition={{ duration: 0.8, repeat: Infinity, delay }} className="h-2 w-2 rounded-full bg-[var(--accent)]" />;
}
