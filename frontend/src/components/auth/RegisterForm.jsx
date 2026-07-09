import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { User, Mail } from 'lucide-react';
import { registerSchema } from '../../validation/registerSchema';
import PasswordInput from './PasswordInput';

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = () => {
    toast.success('Registration form is ready for integration.');
  };

  const password = watch('password');
  const passwordScore = [
    password?.length >= 8,
    /[A-Z]/.test(password || ''),
    /[0-9]/.test(password || ''),
    /[^A-Za-z0-9]/.test(password || '')
  ].filter(Boolean).length;
  const strengthWidth = password ? `${Math.max(passwordScore, 1) * 25}%` : '0%';

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-5"
    >
      <div className="space-y-3">
        <label htmlFor="register-name" className="block text-sm font-medium text-[var(--text-secondary)]">
          Full name
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon)]" />
          <input
            id="register-name"
            type="text"
            placeholder="Jane Doe"
            autoComplete="name"
            {...register('name')}
            className="w-full rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] py-4 pl-12 pr-4 text-sm text-[var(--text-primary)] outline-none transition duration-300 placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:bg-[var(--bg-surface)] focus:ring-2 focus:ring-[var(--accent-soft)] focus:shadow-[0_0_0_4px_var(--accent-soft)]"
          />
        </div>
        {errors.name?.message && (
          <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-[var(--accent)]">
            {errors.name.message}
          </motion.p>
        )}
      </div>

      <div className="space-y-3">
        <label htmlFor="register-email" className="block text-sm font-medium text-[var(--text-secondary)]">
          Email address
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon)]" />
          <input
            id="register-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register('email')}
            className="w-full rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] py-4 pl-12 pr-4 text-sm text-[var(--text-primary)] outline-none transition duration-300 placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:bg-[var(--bg-surface)] focus:ring-2 focus:ring-[var(--accent-soft)] focus:shadow-[0_0_0_4px_var(--accent-soft)]"
          />
        </div>
        {errors.email?.message && (
          <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-[var(--accent)]">
            {errors.email.message}
          </motion.p>
        )}
      </div>

      <PasswordInput
        label="Password"
        name="password"
        placeholder="Create a password"
        register={register}
        error={errors.password}
      />

      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-muted)]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500"
          initial={{ width: 0 }}
          animate={{ width: strengthWidth }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>

      <PasswordInput
        label="Confirm password"
        name="confirmPassword"
        placeholder="Repeat your password"
        register={register}
        error={errors.confirmPassword}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:brightness-110 hover:shadow-orange-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        Create account
      </button>
    </motion.form>
  );
}
