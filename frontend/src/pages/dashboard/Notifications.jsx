import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Check, CheckCheck, ChevronLeft, ChevronRight, MessageCircle, Package, ShieldCheck, Star, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import useNotifications from '../../hooks/useNotifications';

const PAGE_SIZE = 8;
const filters = [
  { key: 'all', label: 'All', icon: Bell },
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'messages', label: 'Messages', icon: MessageCircle },
  { key: 'reviews', label: 'Reviews', icon: Star },
  { key: 'system', label: 'System', icon: ShieldCheck }
];

const documentId = (value) => value?.$oid || value || '';

function notificationCategory(notification) {
  const type = String(notification?.type || '').trim().toLowerCase();
  const content = `${notification?.title || ''} ${notification?.message || ''}`.toLowerCase();
  if (type.includes('order')) return 'orders';
  if (type.includes('message') || type.includes('chat')) return 'messages';
  if (type.includes('review') || type.includes('rating')) return 'reviews';
  if (/\b(message|messaged|chat|inbox)\b/.test(content)) return 'messages';
  if (/\b(review|reviewed|rating|rated|stars?)\b/.test(content)) return 'reviews';
  if (/\b(order|ordered|delivery|delivered|preparing)\b/.test(content)) return 'orders';
  return 'system';
}

function notificationIcon(notification) {
  return { orders: Package, messages: MessageCircle, reviews: Star, system: ShieldCheck }[notificationCategory(notification)] || Bell;
}

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-BD', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export default function Notifications() {
  const { notifications, unreadCount, loading, markAsRead, deleteNotification } = useNotifications();
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [markingAll, setMarkingAll] = useState(false);
  const [deletingId, setDeletingId] = useState('');

  const filtered = useMemo(
    () => filter === 'all' ? notifications : notifications.filter((item) => notificationCategory(item) === filter),
    [filter, notifications]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [filter]);
  useEffect(() => setPage((current) => Math.min(current, totalPages)), [totalPages]);

  async function markAllRead() {
    const unread = notifications.filter((item) => !item.isRead);
    if (!unread.length || markingAll) return;
    setMarkingAll(true);
    await Promise.all(unread.map((item) => markAsRead(item._id)));
    setMarkingAll(false);
  }

  async function remove(id) {
    const notificationId = documentId(id);
    if (!notificationId || deletingId) return;
    setDeletingId(notificationId);
    await deleteNotification(notificationId);
    setDeletingId('');
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <DashboardHeader title="Notifications" description="Review your latest order, message, review, and platform updates." />
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="flex w-fit items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 shadow-sm" aria-label={`${unreadCount} unread notifications`}>
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <Bell className="h-5 w-5" aria-hidden="true" />
            {unreadCount > 0 && <span className="absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{unreadCount > 99 ? '99+' : unreadCount}</span>}
          </span>
          <span><span className="block text-xs text-[var(--text-muted)]">Unread</span><span className="text-lg font-bold text-[var(--text-primary)]">{unreadCount}</span></span>
        </motion.div>
      </div>

      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)]">
        <div className="flex flex-col gap-4 border-b border-[var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Notification filters">
            {filters.map(({ key, label, icon: Icon }) => (
              <button key={key} type="button" role="tab" aria-selected={filter === key} onClick={() => setFilter(key)} className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${filter === key ? 'bg-[var(--accent)] text-white shadow-lg shadow-orange-500/15' : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--accent)]'}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />{label}
              </button>
            ))}
          </div>
          <button type="button" onClick={markAllRead} disabled={!unreadCount || markingAll} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-45">
            <CheckCheck className={`h-4 w-4 ${markingAll ? 'animate-pulse' : ''}`} aria-hidden="true" />{markingAll ? 'Marking...' : 'Mark All Read'}
          </button>
        </div>

        {loading ? <NotificationSkeleton /> : visible.length ? (
          <motion.div layout className="divide-y divide-[var(--border)]">
            <AnimatePresence mode="popLayout">
              {visible.map((notification, index) => <NotificationItem key={documentId(notification._id)} notification={notification} index={index} onRead={markAsRead} onDelete={remove} deleting={deletingId === documentId(notification._id)} />)}
            </AnimatePresence>
          </motion.div>
        ) : <EmptyNotifications filtered={filter !== 'all'} />}

        {!loading && filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between gap-4 border-t border-[var(--border)] px-4 py-4 sm:px-5">
            <p className="text-xs text-[var(--text-muted)]">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <PageButton label="Previous page" disabled={page === 1} onClick={() => setPage((current) => current - 1)}><ChevronLeft className="h-4 w-4" /></PageButton>
              <PageButton label="Next page" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}><ChevronRight className="h-4 w-4" /></PageButton>
            </div>
          </div>
        )}
      </motion.section>
    </div>
  );
}

function NotificationItem({ notification, index, onRead, onDelete, deleting }) {
  const Icon = notificationIcon(notification);
  return (
    <motion.article layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ delay: index * 0.035 }} className={`group flex items-start gap-3 p-4 transition sm:gap-4 sm:p-5 ${notification.isRead ? 'bg-[var(--bg-surface)]' : 'bg-[var(--accent-soft)]'}`}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--accent)]"><Icon className="h-5 w-5" aria-hidden="true" /></span>
      <button type="button" onClick={() => !notification.isRead && onRead(notification._id)} className="min-w-0 flex-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" aria-label={`${notification.isRead ? 'Read notification' : 'Mark as read'}: ${notification.title}`}>
        <span className="flex items-start gap-2"><span className="line-clamp-1 text-sm font-semibold text-[var(--text-primary)] sm:text-base">{notification.title}</span>{!notification.isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" aria-label="Unread" />}</span>
        <span className="mt-1.5 block text-sm leading-6 text-[var(--text-secondary)]">{notification.message}</span>
        <span className="mt-2 block text-xs text-[var(--text-muted)]">{formatDate(notification.createdAt)}</span>
      </button>
      {notification.isRead && <Check className="mt-2 hidden h-4 w-4 shrink-0 text-emerald-500 sm:block" aria-label="Read" />}
      <motion.button whileTap={{ scale: 0.9 }} type="button" onClick={() => onDelete(notification._id)} disabled={deleting} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--text-muted)] transition hover:bg-red-500/10 hover:text-red-500 disabled:opacity-40" aria-label={`Delete ${notification.title}`}><Trash2 className={`h-4 w-4 ${deleting ? 'animate-pulse' : ''}`} /></motion.button>
    </motion.article>
  );
}

function PageButton({ label, disabled, onClick, children }) {
  return <button type="button" aria-label={label} disabled={disabled} onClick={onClick} className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-35">{children}</button>;
}

function NotificationSkeleton() {
  return <div className="divide-y divide-[var(--border)]" role="status" aria-label="Loading notifications">{Array.from({ length: 6 }, (_, index) => <div key={index} className="flex animate-pulse gap-4 p-5"><div className="h-11 w-11 rounded-2xl bg-[var(--bg-muted)]" /><div className="flex-1 space-y-3"><div className="h-4 w-1/3 rounded bg-[var(--bg-muted)]" /><div className="h-3 w-full rounded bg-[var(--bg-muted)]" /><div className="h-3 w-24 rounded bg-[var(--bg-muted)]" /></div></div>)}</div>;
}

function EmptyNotifications({ filtered }) {
  return <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[380px] flex-col items-center justify-center px-6 text-center"><span className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-[var(--accent-soft)] text-[var(--accent)]"><Bell className="h-9 w-9" /></span><h2 className="mt-6 text-xl font-semibold text-[var(--text-primary)]">{filtered ? 'No notifications in this category' : 'You are all caught up'}</h2><p className="mt-2 max-w-sm text-sm leading-6 text-[var(--text-muted)]">{filtered ? 'Choose another filter to see your other updates.' : 'New updates will appear here automatically.'}</p></motion.div>;
}
