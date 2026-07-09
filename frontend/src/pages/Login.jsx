import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import LoginForm from '../components/auth/LoginForm';

const backgroundImage =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80';

export default function Login() {
  return (
    <main className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] pt-[80px] sm:pt-[90px] lg:pt-[100px]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 overflow-hidden lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative hidden lg:block">
          <div className="absolute inset-0">
            <img
              src={backgroundImage}
              alt="Homemade food on a table"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-slate-950/65 dark:bg-slate-950/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.35),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.22),transparent_30%)]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative z-10 flex h-full flex-col justify-end px-12 pb-24"
          >
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/70 shadow-lg shadow-black/20">
              Premium access
            </span>
            <h1 className="mt-10 max-w-xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Your next meal is just a few clicks away.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-slate-200/85 sm:text-lg">
              Login to unlock a curated experience of homemade dishes, saved favorites, and faster ordering with the HomeBite premium dashboard.
            </p>
          </motion.div>
        </section>

        <section className="flex items-center justify-center px-4 py-16 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-[500px] rounded-[32px] border border-[var(--border)] bg-[var(--bg-surface)]/95 p-12 shadow-[0_48px_120px_-48px_rgba(15,23,42,0.65)] backdrop-blur-xl sm:p-12"
          >
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.32em] text-[var(--accent)]/85">Member login</p>
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">Welcome back</h2>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                Sign in with your email to access your profile, order history, and personalized meal suggestions.
              </p>
            </div>

            <div className="mt-10">
              <LoginForm />
            </div>

            <div className="mt-8 border-t border-[var(--border)] pt-6 text-center text-sm text-[var(--text-secondary)]">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]">
                Create account
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
      <Toaster position="top-right" />
    </main>
  );
}
