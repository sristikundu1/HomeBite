import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Settings, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../providers/AuthProvider';
import UserAvatar from './UserAvatar';

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Profile', path: '/dashboard/profile', icon: User },
  { label: 'Account Settings', path: '/dashboard/settings', icon: Settings }
];

export default function UserMenu({ onAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const { user, dbUser, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = dbUser?.name || user?.displayName || 'Guest User';
  const email = dbUser?.email || user?.email || 'No Email';
  const role = dbUser?.role || 'Customer';

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) {
        closeMenu();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleItemClick = () => {
    closeMenu();
    onAction?.();
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
      onAction?.();
      toast.success('Logged out successfully.');
      navigate('/', { replace: true });
    } catch {
      toast.error('Unable to log out. Please try again.');
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300/40"
        aria-label="Open account menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="user-account-menu"
      >
        <UserAvatar user={user} dbUser={dbUser} interactive className="h-[38px] w-[38px] lg:h-[42px] lg:w-[42px]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            id="user-account-menu"
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed right-4 top-[76px] z-[60] w-[min(320px,calc(100vw-2rem))] origin-top-right overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xl shadow-black/20 backdrop-blur-xl lg:absolute lg:right-0 lg:top-full lg:mt-3"
          >
            <div className="flex items-center gap-4 border-b border-[var(--border)] p-4">
              <UserAvatar user={user} dbUser={dbUser} className="h-12 w-12" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{displayName}</p>
                <p className="truncate text-xs text-[var(--text-secondary)]">{email}</p>
                <p className="mt-1 text-xs font-medium text-[var(--accent)]">{role}</p>
              </div>
            </div>

            <div className="p-2">
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    role="menuitem"
                    onClick={handleItemClick}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] focus:bg-[var(--bg-muted)] focus:text-[var(--text-primary)] focus:outline-none"
                  >
                    <Icon className="h-4 w-4 text-[var(--icon)]" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-[var(--border)] p-2">
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-500 transition hover:bg-red-500/10 focus:bg-red-500/10 focus:outline-none"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
