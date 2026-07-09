import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { Mail, MessageSquare, Send, User } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

const fieldClass =
  'w-full rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] py-4 pl-12 pr-4 text-sm text-[var(--text-primary)] outline-none transition duration-300 placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:bg-[var(--bg-surface)] focus:ring-2 focus:ring-[var(--accent-soft)] focus:shadow-[0_0_0_4px_var(--accent-soft)]';

function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-[var(--accent)]">
      {message}
    </motion.p>
  );
}

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = (data) => {
    toast.success(`Thanks, ${data.name}. We will get back to you soon.`);
    reset();
  };

  return (
    <motion.form
      id="contact-form"
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)]/95 p-6 shadow-[var(--shadow-elevated)] backdrop-blur-xl sm:p-8 lg:p-10"
    >
      <div>
        <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Send us a note</span>
        <h2 className="mt-4 text-3xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-4xl">
          Tell us what you need.
        </h2>
      </div>

      <div className="mt-8 grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-3">
            <label htmlFor="name" className="text-sm font-medium text-[var(--text-secondary)]">
              Name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon)]" />
              <input id="name" type="text" placeholder="Your name" autoComplete="name" {...register('name')} className={fieldClass} />
            </div>
            <ErrorMessage message={errors.name?.message} />
          </div>

          <div className="space-y-3">
            <label htmlFor="email" className="text-sm font-medium text-[var(--text-secondary)]">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon)]" />
              <input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register('email')} className={fieldClass} />
            </div>
            <ErrorMessage message={errors.email?.message} />
          </div>
        </div>

        <div className="space-y-3">
          <label htmlFor="subject" className="text-sm font-medium text-[var(--text-secondary)]">
            Subject
          </label>
          <div className="relative">
            <MessageSquare className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon)]" />
            <input id="subject" type="text" placeholder="How can we help?" {...register('subject')} className={fieldClass} />
          </div>
          <ErrorMessage message={errors.subject?.message} />
        </div>

        <div className="space-y-3">
          <label htmlFor="message" className="text-sm font-medium text-[var(--text-secondary)]">
            Message
          </label>
          <textarea
            id="message"
            rows={6}
            placeholder="Share a few details..."
            {...register('message')}
            className="w-full resize-none rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-4 text-sm text-[var(--text-primary)] outline-none transition duration-300 placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] focus:shadow-[0_0_0_4px_var(--accent-soft)]"
          />
          <ErrorMessage message={errors.message?.message} />
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        Send Message
        <Send size={18} />
      </motion.button>
    </motion.form>
  );
}
