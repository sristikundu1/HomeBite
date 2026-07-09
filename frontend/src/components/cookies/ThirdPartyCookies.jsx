import { motion } from 'framer-motion';
import { CreditCard, DatabaseZap, LineChart, ShieldCheck } from 'lucide-react';

const thirdParties = [
  {
    title: 'Authentication',
    description: 'Secure account sessions and sign-in workflows may rely on trusted identity tools.',
    icon: ShieldCheck
  },
  {
    title: 'Payments',
    description: 'Payment providers may use cookies or similar technologies for checkout and fraud prevention.',
    icon: CreditCard
  },
  {
    title: 'Analytics',
    description: 'Analytics services may measure traffic, page performance, and feature usage.',
    icon: LineChart
  },
  {
    title: 'Infrastructure',
    description: 'Hosting and reliability services may use technical identifiers to protect availability.',
    icon: DatabaseZap
  }
];

export default function ThirdPartyCookies() {
  return (
    <section id="third-party-cookies" aria-labelledby="third-party-cookies-title" className="scroll-mt-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Third-Party Cookies</p>
        <h2 id="third-party-cookies-title" className="mt-4 text-3xl font-semibold tracking-normal text-[var(--text-primary)]">
          Services that may support the platform.
        </h2>
      </motion.div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {thirdParties.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5"
            >
              <Icon className="h-6 w-6 text-[var(--accent)]" />
              <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.description}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
