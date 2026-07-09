import { motion } from 'framer-motion';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

const contactItems = [
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@homebite.com',
    detail: 'For support, partnerships, and chef onboarding.'
  },
  {
    icon: Phone,
    title: 'Phone',
    value: '+1 (415) 555-0198',
    detail: 'Monday to Friday, 9:00 AM to 6:00 PM.'
  },
  {
    icon: MapPin,
    title: 'Office',
    value: 'San Francisco, CA',
    detail: 'Built for local food communities everywhere.'
  },
  {
    icon: MessageCircle,
    title: 'Live Support',
    value: 'Average reply under 2 hours',
    detail: 'Priority help for active orders and chef accounts.'
  }
];

export default function ContactInfo() {
  return (
    <div className="grid gap-5">
      {contactItems.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: index * 0.06, ease: 'easeOut' }}
            whileHover={{ y: -5 }}
            className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-soft)] transition duration-300 hover:shadow-[var(--shadow-elevated)]"
          >
            <div className="flex gap-4">
              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-3xl bg-[var(--bg-muted)] p-4 text-[var(--accent)]">
                <Icon size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-normal text-[var(--text-primary)]">{item.title}</h3>
                <p className="mt-1 font-semibold text-[var(--accent)]">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.detail}</p>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
