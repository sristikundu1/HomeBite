import { motion } from 'framer-motion';
import CookieFAQ from './CookieFAQ';
import CookieManagement from './CookieManagement';
import CookieTypes from './CookieTypes';
import ThirdPartyCookies from './ThirdPartyCookies';
import { cookieSections } from './cookiesData';

const tocItems = [
  ...cookieSections.slice(0, 2).map((section) => ({ id: section.id, title: section.title })),
  { id: 'types-of-cookies', title: 'Types of Cookies' },
  ...cookieSections.slice(2, 6).map((section) => ({ id: section.id, title: section.title })),
  { id: 'third-party-cookies', title: 'Third-Party Cookies' },
  { id: 'managing-cookies', title: 'Managing Cookies' },
  { id: 'browser-settings', title: 'Browser Settings' },
  { id: 'frequently-asked-questions', title: 'Frequently Asked Questions' },
  { id: 'contact', title: 'Contact' }
];

export default function CookiesContent() {
  return (
    <section className="bg-[var(--bg-page)] py-20 sm:py-24 lg:py-[120px]">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="hidden lg:sticky lg:top-[100px] lg:block lg:self-start">
          <nav
            aria-label="Cookies policy table of contents"
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">Contents</p>
            <ul className="mt-5 space-y-2">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] focus:bg-[var(--bg-muted)] focus:text-[var(--text-primary)] focus:outline-none"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className="min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5 sm:p-8"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Effective July 9, 2026</p>
            <p className="mt-5 text-base leading-8 text-[var(--text-secondary)]">
              This policy is structured for future cookie consent integration while explaining current cookie categories.
            </p>
          </motion.div>

          <div className="mt-8 space-y-8">
            {cookieSections.slice(0, 2).map((section, index) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.03, ease: 'easeOut' }}
                className="scroll-mt-28 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5 sm:p-8"
              >
                <h2 className="text-2xl font-semibold tracking-normal text-[var(--text-primary)]">{section.title}</h2>
                <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">{section.body}</p>
              </motion.section>
            ))}

            <CookieTypes />

            {cookieSections.slice(2, 6).map((section, index) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.03, ease: 'easeOut' }}
                className="scroll-mt-28 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5 sm:p-8"
              >
                <h2 className="text-2xl font-semibold tracking-normal text-[var(--text-primary)]">{section.title}</h2>
                <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">{section.body}</p>
              </motion.section>
            ))}

            <ThirdPartyCookies />
            <CookieManagement />

            {cookieSections.slice(6).map((section, index) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.03, ease: 'easeOut' }}
                className="scroll-mt-28 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5 sm:p-8"
              >
                <h2 className="text-2xl font-semibold tracking-normal text-[var(--text-primary)]">{section.title}</h2>
                <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">{section.body}</p>
              </motion.section>
            ))}

            <CookieFAQ />
          </div>
        </article>
      </div>
    </section>
  );
}
