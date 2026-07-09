import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function PasswordInput({ label, name, register, error, placeholder, autoComplete = 'current-password' }) {
  const [isVisible, setIsVisible] = useState(false);
  const inputProps = typeof register === 'function' && name ? register(name) : { name };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-[var(--text-secondary)]">
        {label}
      </label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon)]" />
        <input
          id={name}
          type={isVisible ? 'text' : 'password'}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...inputProps}
          className="w-full rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] py-4 pl-12 pr-12 text-sm text-[var(--text-primary)] outline-none transition duration-300 placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:bg-[var(--bg-surface)] focus:ring-2 focus:ring-[var(--accent-soft)] focus:shadow-[0_0_0_4px_var(--accent-soft)]"
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="absolute right-4 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[var(--icon)] transition duration-300 hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <AnimatePresence>
        {error?.message && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-sm text-[var(--accent)]"
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
