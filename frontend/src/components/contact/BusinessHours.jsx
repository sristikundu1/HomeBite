import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const hours = [
  { day: 'Monday - Friday', time: '9:00 AM - 6:00 PM' },
  { day: 'Saturday', time: '10:00 AM - 4:00 PM' },
  { day: 'Sunday', time: 'Emergency order support only' }
];

export default function BusinessHours() {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-7 shadow-[var(--shadow-soft)]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[var(--bg-muted)] text-[var(--accent)]">
          <Clock size={26} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-normal text-[var(--text-primary)]">Business Hours</h2>
          <p className="text-sm text-[var(--text-secondary)]">Support availability for customers and chefs.</p>
        </div>
      </div>

      <div className="mt-7 space-y-4">
        {hours.map((item) => (
          <div key={item.day} className="flex flex-col gap-1 border-b border-[var(--border)] pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-semibold text-[var(--text-primary)]">{item.day}</span>
            <span className="text-sm text-[var(--text-secondary)]">{item.time}</span>
          </div>
        ))}
      </div>
    </motion.article>
  );
}
