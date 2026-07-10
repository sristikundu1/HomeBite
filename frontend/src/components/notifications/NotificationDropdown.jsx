import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import useNotifications from '../../hooks/useNotifications';

function documentId(value) {
  return value?.$oid || value || '';
}

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-BD', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export default function NotificationDropdown({ buttonClassName, iconSize = 19 }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const { notifications, unreadCount, loading, markAsRead, deleteNotification } = useNotifications();

  useEffect(() => {
    if (!open) return undefined;

    function closeOnOutside(event) {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    }

    function closeOnEscape(event) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={buttonClassName}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Bell size={iconSize} />
        {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-label="Notifications"
            className="fixed right-4 top-[76px] z-[80] w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-2xl shadow-black/20 lg:absolute lg:right-0 lg:top-full lg:mt-3"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4"><div><h2 className="font-semibold text-[var(--text-primary)]">Notifications</h2><p className="mt-1 text-xs text-[var(--text-muted)]">{unreadCount} unread</p></div><Bell className="h-5 w-5 text-[var(--accent)]" /></div>
            <div className="max-h-[420px] overflow-y-auto">
              {loading ? (
                <div className="space-y-3 p-4" role="status">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-20 animate-pulse rounded-xl bg-[var(--bg-muted)]" />)}</div>
              ) : notifications.length ? notifications.map((notification) => (
                <div key={documentId(notification._id)} className={`group flex gap-3 border-b border-[var(--border)] p-4 last:border-0 ${notification.isRead ? 'bg-[var(--bg-surface)]' : 'bg-[var(--accent-soft)]'}`}>
                  <button type="button" onClick={() => !notification.isRead && markAsRead(notification._id)} className="min-w-0 flex-1 text-left focus:outline-none" aria-label={`${notification.isRead ? 'Read' : 'Mark as read'}: ${notification.title}`}>
                    <div className="flex items-center gap-2"><p className="truncate text-sm font-semibold text-[var(--text-primary)]">{notification.title}</p>{notification.isRead && <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />}</div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-secondary)]">{notification.message}</p>
                    <p className="mt-2 text-[10px] text-[var(--text-muted)]">{formatDate(notification.createdAt)}</p>
                  </button>
                  <button type="button" onClick={() => deleteNotification(notification._id)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--text-muted)] opacity-70 transition hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100" aria-label={`Delete ${notification.title}`}><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              )) : (
                <div className="px-6 py-12 text-center"><Bell className="mx-auto h-8 w-8 text-[var(--text-muted)]" /><p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">No notifications</p><p className="mt-1 text-xs text-[var(--text-muted)]">You are all caught up.</p></div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

