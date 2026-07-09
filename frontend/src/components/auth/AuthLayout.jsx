import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import AuthHeader from './AuthHeader';

export default function AuthLayout({ title, description, children }) {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.16),transparent_32%),radial-gradient(circle_at_top_right,_rgba(236,72,153,0.14),transparent_28%)] py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="space-y-8"
          >
            <AuthHeader title={title} description={description} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
            className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)]/95 p-8 shadow-2xl shadow-[0_35px_120px_rgba(15,23,42,0.08)] backdrop-blur-xl"
          >
            {children}
          </motion.div>
        </div>
      </div>
      <Toaster position="top-right" />
    </section>
  );
}
