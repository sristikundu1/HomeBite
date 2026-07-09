import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';

const navLinks = [
  { href: '/explore', label: 'Explore Meals' },
  { href: '/cook', label: 'Become a Cook' },
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' }
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }, [isOpen]);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition duration-400 ${
        scrolled
          ? 'bg-[var(--bg-surface)]/90 backdrop-blur-xl border-[var(--border)] shadow-sm'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1300px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a
         href="/"
         className="inline-flex items-center gap-3 text-lg font-semibold tracking-tight transition text-[var(--text-primary)]"
        >
         <span className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-lg shadow-orange-400/20">
           HB
         </span>
         <span className="hidden sm:inline">HomeBite</span>
        </a>

        <nav className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link) => (
           <a
             key={link.label}
             href={link.href}
             className="group relative text-sm font-medium
              text-[var(--text-secondary)] transition duration-300
               hover:text-[var(--accent)]"
           >
             <span className="relative pb-1 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:scale-x-0 after:rounded-full after:bg-[var(--accent)] after:transition-transform after:duration-300 group-hover:after:scale-x-100">
               {link.label}
             </span>
           </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border px-2 text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-300/40 border-[var(--border)] bg-[var(--bg-surface)] text-[var(--icon)] shadow-lg shadow-black/10 hover:scale-105"
            aria-label="Toggle theme"
          >
            {isDark ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Link to="/login" className="hidden rounded-full border
           border-[var(--border)] px-5 py-3 text-sm font-semibold
            text-[var(--text-primary)] transition duration-300 hover:bg-[var(--bg-muted)] lg:inline-flex">
            Login
          </Link>
          <Link to="/register" className="hidden rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-semibold text-[var(--button-text)] shadow-lg shadow-orange-500/20 transition duration-300 hover:brightness-110 hover:scale-[1.02] lg:inline-flex">
            Sign Up
          </Link>
          <button
           type="button"
           className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--icon)] shadow-sm transition hover:border-[var(--accent)] lg:hidden"
           aria-label="Open menu"
           onClick={() => setIsOpen((prev) => !prev)}
          >
           {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden"
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden bg-[var(--bg-surface)]/95 px-4 pb-6 pt-3 shadow-2xl shadow-black/10 backdrop-blur-xl"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-4 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:bg-[var(--bg-muted)]"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <Link
                  to="/login"
                  className="rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-4 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-muted)]"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-4 text-sm font-semibold text-[var(--button-text)] shadow-lg shadow-orange-500/20 transition hover:brightness-110"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;
