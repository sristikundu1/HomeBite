import { Bell, Menu, Moon, PanelLeftClose, PanelLeftOpen, Sun } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { useTheme } from '../../providers/ThemeProvider';
import UserAvatar from '../navbar/UserAvatar';
import Breadcrumb from './Breadcrumb';

const pageTitles = {
  '/dashboard': 'Overview',
  '/dashboard/profile': 'Profile',
  '/dashboard/settings': 'Settings'
};

export default function Topbar({ sidebarCollapsed, onToggleSidebar, onOpenMobileSidebar }) {
  const { user, dbUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isDark = theme === 'dark';
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-surface)]/90 backdrop-blur-xl">
      <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--icon)] transition hover:bg-[var(--bg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] lg:hidden"
            aria-label="Open dashboard menu"
          >
            <Menu size={20} />
          </button>
          <button
            type="button"
            onClick={onToggleSidebar}
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--icon)] transition hover:bg-[var(--bg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] lg:inline-flex"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
          <div className="min-w-0">
            <Breadcrumb />
            <h2 className="mt-1 truncate text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--icon)] transition hover:bg-[var(--bg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
            aria-label="Notifications"
          >
            <Bell size={19} />
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--icon)] transition hover:bg-[var(--bg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
            aria-label="Toggle theme"
          >
            {isDark ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <UserAvatar user={user} dbUser={dbUser} className="h-10 w-10" />
        </div>
      </div>
    </header>
  );
}
