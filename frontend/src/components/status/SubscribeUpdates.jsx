import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SubscribeUpdates() {
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }

    toast.success('Status updates subscription is ready for backend integration.');
    setEmail('');
  };

  return (
    <section className="bg-[var(--bg-page)] px-5 pb-24 lg:px-8 lg:pb-[140px]">
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
        className="mx-auto max-w-[1100px] rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-6 text-center shadow-[var(--shadow-elevated)] sm:p-10 lg:p-14"
      >
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-muted)] text-[var(--accent)]">
          <Bell size={24} />
        </span>
        <h2 className="mt-6 text-3xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-4xl">
          Subscribe for Status Updates
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
          Get notified when incidents are opened, resolved, or scheduled maintenance begins.
        </p>
        <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <label htmlFor="status-subscribe-email" className="sr-only">
            Email address
          </label>
          <input
            id="status-subscribe-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            className="min-h-[56px] flex-1 rounded-full border border-[var(--border)] bg-[var(--bg-muted)] px-5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          />
          <motion.button
            type="submit"
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-7 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:brightness-110"
          >
            Subscribe
            <Send size={16} />
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}
