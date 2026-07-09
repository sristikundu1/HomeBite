import { motion } from 'framer-motion';
import { Globe2, Mail, Phone } from 'lucide-react';

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.77l-.44 2.91h-2.33V22C18.34 21.24 22 17.08 22 12.06Z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect width="17" height="17" x="3.5" y="3.5" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.3" cy="6.9" r="1.1" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.53V9H7.1v11.45Z" />
    </svg>
  );
}

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.86 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.37 9.37 0 0 1 12 6.94c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.17 10.17 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function YouTubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.58 7.19a2.57 2.57 0 0 0-1.8-1.82C18.18 4.93 12 4.93 12 4.93s-6.18 0-7.78.44a2.57 2.57 0 0 0-1.8 1.82C2 8.8 2 12.16 2 12.16s0 3.36.42 4.97c.23.89.94 1.58 1.8 1.82 1.6.44 7.78.44 7.78.44s6.18 0 7.78-.44a2.57 2.57 0 0 0 1.8-1.82c.42-1.61.42-4.97.42-4.97s0-3.36-.42-4.97ZM10 15.23V9.09l5.23 3.07L10 15.23Z" />
    </svg>
  );
}

const socials = [
  { icon: Globe2, label: 'Website', href: '/', color: 'hover:text-[var(--accent)]' },
  { icon: FacebookIcon, label: 'Facebook', href: 'https://facebook.com', color: 'hover:text-[#1877F2]' },
  { icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com', color: 'hover:text-[#E4405F]' },
  { icon: LinkedInIcon, label: 'LinkedIn', href: 'https://linkedin.com', color: 'hover:text-[#0A66C2]' },
  { icon: GitHubIcon, label: 'GitHub', href: 'https://github.com', color: 'hover:text-[var(--text-primary)]' },
  { icon: YouTubeIcon, label: 'YouTube', href: 'https://youtube.com', color: 'hover:text-[#FF0000]' },
  { icon: Mail, label: 'Email', href: 'mailto:hello@homebite.com', color: 'hover:text-[var(--accent)]' },
  { icon: Phone, label: 'Phone', href: 'tel:+14155550198', color: 'hover:text-[var(--accent)]' }
];

export default function SocialLinks() {
  return (
    <section className="bg-[var(--bg-page)] px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8 lg:pb-[140px]">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="mx-auto max-w-[1400px] rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-[var(--shadow-soft)] sm:p-10"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Social Links</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-4xl">
              Stay close to the HomeBite table.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {socials.map((social) => {
              const Icon = social.icon;
              const external = social.href.startsWith('http');

              return (
                <motion.a
                  key={social.label}
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  href={social.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer' : undefined}
                  className={`inline-flex items-center justify-center gap-3 rounded-full border border-[var(--border)] bg-[var(--bg-muted)] px-5 py-4 text-sm font-semibold text-[var(--text-primary)] transition duration-300 hover:border-current hover:shadow-lg ${social.color}`}
                >
                  <Icon className="h-5 w-5" />
                  {social.label}
                </motion.a>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
