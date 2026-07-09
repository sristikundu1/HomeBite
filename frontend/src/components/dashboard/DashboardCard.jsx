import { motion } from 'framer-motion';

export default function DashboardCard({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5 ${className}`}
    >
      {children}
    </motion.div>
  );
}
