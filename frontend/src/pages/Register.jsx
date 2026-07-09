import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import RegisterForm from '../components/auth/RegisterForm';
import SocialLogin from '../components/auth/SocialLogin';
import Divider from '../components/auth/Divider';

const backgroundImage =
  'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1600&q=80';

export default function Register() {
  return (
    <main className="min-h-screen bg-[var(--bg-page)] pt-[80px] text-[var(--text-primary)] sm:pt-[95px] lg:pt-[116px]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="mx-auto grid min-h-[calc(100vh-80px)] max-w-[1600px] grid-cols-1 overflow-hidden sm:min-h-[calc(100vh-95px)] lg:min-h-[calc(100vh-116px)] lg:grid-cols-[1.08fr_0.92fr]"
      >
        <section className="relative hidden min-h-[320px] sm:block lg:min-h-full">
          <div className="absolute inset-0">
            <img
              src={backgroundImage}
              alt="Fresh homemade dishes being prepared"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-slate-950/58 dark:bg-slate-950/78" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.32),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.2),transparent_32%)]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut', delay: 0.1 }}
            className="relative z-10 flex h-full flex-col justify-end px-8 py-12 sm:min-h-[320px] lg:px-12 lg:pb-24"
          >
            <span className="inline-flex w-fit rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/75 shadow-lg shadow-black/20 backdrop-blur-xl">
              HomeBite community
            </span>
            <h1 className="mt-8 max-w-xl text-4xl font-semibold tracking-normal text-white sm:text-5xl lg:text-6xl">
              Homemade food starts with a trusted table.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-slate-200/85 sm:text-lg">
              Save favorite cooks, discover local dishes, and keep every order beautifully organized in one place.
            </p>
          </motion.div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="w-full max-w-[500px] rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)]/90 p-8 shadow-[0_48px_120px_-48px_rgba(15,23,42,0.65)] backdrop-blur-xl sm:p-12"
          >
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.32em] text-[var(--accent)]/85">Get started</p>
              <h2 className="text-3xl font-semibold tracking-normal text-[var(--text-primary)]">
                Create your account
              </h2>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                Join thousands of food lovers discovering authentic homemade meals.
              </p>
            </div>

            <div className="mt-8">
              <RegisterForm />
            </div>

            <div className="mt-8">
              <Divider text="or sign up with" />
              <SocialLogin />
            </div>

            <div className="mt-7 border-t border-[var(--border)] pt-6 text-center text-sm text-[var(--text-secondary)]">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]">
                Sign in
              </Link>
            </div>
          </motion.div>
        </section>
      </motion.div>
      <Toaster position="top-right" />
    </main>
  );
}
