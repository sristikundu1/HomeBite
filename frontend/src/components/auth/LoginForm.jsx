import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, GitBranch, Globe2, Loader2, Mail, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../providers/AuthProvider';
import { getFirebaseErrorMessage } from '../../utils/firebaseErrorMessage';
import { loginSchema } from '../../validation/loginSchema';

const REMEMBERED_EMAIL_KEY = 'rememberedEmail';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { login, googleSignIn, resetPassword, saveAuthenticatedUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const redirectPath = from ? `${from.pathname}${from.search || ''}${from.hash || ''}` : '/';

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    const rememberedEmail = window.localStorage.getItem(REMEMBERED_EMAIL_KEY);

    if (rememberedEmail) {
      setValue('email', rememberedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      if (rememberMe) {
        window.localStorage.setItem(REMEMBERED_EMAIL_KEY, data.email);
      } else {
        window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }

      const userCredential = await login(data.email, data.password);
      await saveAuthenticatedUser(userCredential.user);
      toast.success('Welcome back!');
      navigate(redirectPath, { replace: true });
    } catch (error) {
      toast.error(getFirebaseErrorMessage(error));
    }
  };

  const handleRememberMeChange = (event) => {
    const checked = event.target.checked;
    const email = getValues('email');

    setRememberMe(checked);

    if (checked && email) {
      window.localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
      return;
    }

    if (!checked) {
      window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }
  };

  const handleForgotPassword = async () => {
    const email = getValues('email')?.trim();

    if (!email) {
      toast.error('Please enter your email address first.');
      return;
    }

    setIsResettingPassword(true);

    try {
      await resetPassword(email);
      toast.success('Password reset email has been sent. Please check your inbox.');
    } catch (error) {
      toast.error(getFirebaseErrorMessage(error));
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSocialLoading('Google');

    try {
      const userCredential = await googleSignIn();
      await saveAuthenticatedUser(userCredential.user);
      toast.success('Signed in with Google.');
      navigate(redirectPath, { replace: true });
    } catch (error) {
      toast.error(getFirebaseErrorMessage(error));
    } finally {
      setSocialLoading(null);
    }
  };

  const handleUnavailableLogin = (provider) => {
    toast(`${provider} login is not available.`);
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="space-y-5"
    >
      <div className="space-y-4">
        <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)]">
          Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon)]" />
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register('email')}
            className="w-full rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] py-4 pl-12 pr-4 text-sm text-[var(--text-primary)] outline-none transition duration-300 focus:border-[var(--accent)] focus:bg-[var(--bg-surface)] focus:ring-2 focus:ring-[var(--accent-soft)] placeholder:text-[var(--placeholder)]"
          />
        </div>
        {errors.email?.message && <p className="text-sm text-[var(--accent)]">{errors.email.message}</p>}
      </div>

      <div className="space-y-4">
        <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)]">
          Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon)]" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            autoComplete="current-password"
            {...register('password')}
            className="w-full rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] py-4 pl-12 pr-14 text-sm text-[var(--text-primary)] outline-none transition duration-300 focus:border-[var(--accent)] focus:bg-[var(--bg-surface)] focus:ring-2 focus:ring-[var(--accent-soft)] placeholder:text-[var(--placeholder)]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--bg-muted)] text-[var(--icon)] transition duration-300 hover:bg-[var(--bg-panel)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password?.message && <p className="text-sm text-[var(--accent)]">{errors.password.message}</p>}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex items-center gap-3 text-sm text-[var(--text-secondary)]">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={handleRememberMeChange}
            className="h-4 w-4 rounded border-[var(--border)] bg-[var(--bg-surface)] text-[var(--accent)] focus:ring-[var(--accent)]"
          />
          Remember me
        </label>
        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={isResettingPassword}
          className="text-sm font-medium text-[var(--accent)] transition hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-60"
          aria-busy={isResettingPassword}
        >
          {isResettingPassword ? 'Sending...' : 'Forgot password?'}
        </button>
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ y: -1 }}
        className="mt-6 w-full rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="inline-flex items-center justify-center gap-2">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </span>
      </motion.button>

      <div className="relative mt-8 py-4 text-center text-sm text-[var(--text-secondary)]">
        <span className="absolute left-4 right-4 top-1/2 h-px bg-[var(--border)]" />
        <span className="relative bg-[var(--bg-page)] px-4">Or continue with</span>
      </div>

      <div className="grid gap-3">
        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          onClick={handleGoogleLogin}
          disabled={socialLoading === 'Google'}
          className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-[var(--border)] bg-white text-slate-900 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-400/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:shadow-black/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {socialLoading === 'Google' ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Globe2 className="h-6 w-6" />}
          <span className="text-sm font-semibold">{socialLoading === 'Google' ? 'Loading...' : 'Continue with Google'}</span>
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          onClick={() => handleUnavailableLogin('GitHub')}
          className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-transparent bg-slate-900 text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/25 dark:bg-slate-800 dark:hover:shadow-black/25"
        >
          <GitBranch className="h-5 w-5 text-white" />
          <span className="text-sm font-semibold">Continue with GitHub</span>
        </motion.button>
      </div>
    </motion.form>
  );
}
