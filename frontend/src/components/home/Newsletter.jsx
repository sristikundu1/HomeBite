import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../providers/AuthProvider';
import { subscribeToNewsletter } from '../../services/newsletterApi';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Newsletter() {
  const { user, dbUser } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function sendWelcomeEmail(subscriberEmail) {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (!serviceId || !templateId || !publicKey) throw new Error('EmailJS is not configured');

    return emailjs.send(serviceId, templateId, {
      to_email: subscriberEmail,
      email: subscriberEmail,
      subject: 'Welcome to HomeBite!',
      title: 'Welcome to HomeBite!',
      message: `Hi there,\n\nThank you for subscribing to the HomeBite Newsletter.\n\nYou'll now receive updates about:\n\n🍲 New homemade meals\n👨‍🍳 New local chefs\n🎁 Exclusive discounts\n🍰 Seasonal specials\n📢 Platform announcements\n\nThank you for being part of the HomeBite community.\n\nVisit HomeBite anytime to discover delicious homemade meals prepared by trusted local chefs.\n\nBest Regards,\n\nThe HomeBite Team`
    }, { publicKey });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) { toast.error('Email is required.'); return; }
    if (!EMAIL_PATTERN.test(normalizedEmail)) { toast.error('Please enter a valid email address.'); return; }

    setSubmitting(true);
    try {
      await subscribeToNewsletter(normalizedEmail, dbUser?.email || user?.email || '');
      toast.success('Successfully Subscribed! Thank you for joining the HomeBite Newsletter.');
      setEmail('');
      try { await sendWelcomeEmail(normalizedEmail); }
      catch { toast.error('Subscribed successfully, but the confirmation email could not be sent.'); }
    } catch (error) {
      if (error.response?.status === 409) toast('You are already subscribed.', { icon: 'ℹ️' });
      else toast.error(error.response?.data?.message || 'Unable to subscribe right now.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative overflow-hidden bg-[var(--bg-page)] py-24" id="newsletter">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="overflow-hidden rounded-[40px] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)]"
        >
          <div className="grid gap-8 px-8 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-12 lg:px-16 lg:py-16">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">
                Fresh updates from HomeBite
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">
                Get curated meal drops, chef stories, and neighborhood favorites.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[var(--text-secondary)]">
                Subscribe for weekly inspiration from local home chefs and new dishes near you.
              </p>
            </div>

            <div className="flex items-center justify-center">
              <form onSubmit={handleSubmit} className="w-full max-w-[480px] rounded-[32px] border border-[var(--border)] bg-[var(--bg-muted)] p-6 shadow-inner" noValidate>
                <label className="text-sm font-semibold text-[var(--text-primary)]" htmlFor="newsletter-email">
                  Email address
                </label>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={submitting}
                    required
                    autoComplete="email"
                    aria-describedby="newsletter-privacy"
                    placeholder="Enter your email"
                    className="h-12 flex-1 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-4 text-[var(--text-primary)] outline-none ring-0 placeholder:text-[var(--text-muted)]"
                  />
                  <button type="submit" disabled={submitting} aria-busy={submitting} className="inline-flex min-w-28 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-semibold text-[var(--button-text)] shadow-lg shadow-orange-500/20 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60">
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}{submitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
                <p id="newsletter-privacy" className="mt-4 text-sm text-[var(--text-secondary)]">
                  No spam. Just delicious updates and community highlights.
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Newsletter;
