import { motion } from 'framer-motion';

export default function AuthHeader({ title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6 rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)]/90 p-10 shadow-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
    >
      <p className="text-sm uppercase tracking-[0.28em] text-[var(--accent)]">Authentication</p>
      <h1 className="text-4xl font-semibold tracking-tight text-[var(--text-primary)]">{title}</h1>
      <p className="max-w-2xl text-base leading-7 text-[var(--text-secondary)]">{description}</p>
    </motion.div>
  );
}
