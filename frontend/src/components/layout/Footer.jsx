import { Link } from "react-router-dom";
import { Mail, Send } from 'lucide-react';
import HomeBiteLogo from '../brand/HomeBiteLogo';

const companyLinks = [
  { name: "About", path: "/about" },
  { name: "Pricing", path: "/pricing" },
  { name: "Blog", path: "/blog" },
  { name: "Careers", path: "/careers" },
];

const resourceLinks = [
  { name: "Help Center", path: "/help-center" },
  { name: "Cooking Guides", path: "/cooking-guides" },
  { name: "Gift Cards", path: "/gift-cards" },
  { name: "Community", path: "/community" },
];

const supportLinks = [
  { name: "Contact", path: "/contact" },
  { name: "Status", path: "/status" },
  { name: "Terms", path: "/terms" },
  { name: "Email Us", path: "mailto:hello@homebite.com" },
];


function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-surface)] py-16">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_1.1fr]">
          <div className="max-w-sm">
            <HomeBiteLogo iconClassName="h-12 w-12" wordmarkClassName="text-lg" />
            <p className="mt-6 text-base leading-8 text-[var(--text-secondary)]">
              Premium local meals from trusted home chefs, delivered with warmth, care, and modern convenience.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:hello@homebite.com" aria-label="Email HomeBite"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--icon)] transition duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--text-primary)]">Company</h3>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-[var(--text-secondary)] transition hover:text-[var(--accent)]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--text-primary)]">Resources</h3>
            <ul className="mt-5 space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-[var(--text-secondary)] transition hover:text-[var(--accent)]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--text-primary)]">Support</h3>
            <ul className="mt-5 space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  {link.path.startsWith("mailto:") ? (
                    <a
                      href={link.path}
                      className="text-[var(--text-secondary)] transition hover:text-[var(--accent)]"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-[var(--text-secondary)] transition hover:text-[var(--accent)]"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--text-primary)]">Newsletter</h3>
            <p className="mt-5 text-base leading-8 text-[var(--text-secondary)]">
              Stay inspired with new chefs, seasonal dishes, and neighborhood stories.
            </p>
            <div className="mt-5 flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--bg-muted)] p-2">
              <Mail size={18} className="ml-2 text-[var(--icon)]" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              />
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white transition hover:brightness-110">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--border)] pt-8 text-sm text-[var(--text-muted)] md:flex-row md:items-center md:justify-between">
          <p>© 2026 HomeBite. Crafted for home chefs and food lovers.</p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/privacy"
              className="transition hover:text-[var(--accent)]"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="transition hover:text-[var(--accent)]"
            >
              Terms
            </Link>

            <Link
              to="/cookies"
              className="transition hover:text-[var(--accent)]"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
