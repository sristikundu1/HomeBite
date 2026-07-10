import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  PackageCheck,
  RefreshCw,
  Search,
  ShoppingBag,
  X,
  XCircle
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { useAuth } from '../../providers/AuthProvider';
import { getChefOrders, updateOrderStatus } from '../../services/ordersApi';

const PAGE_SIZE = 8;
const filters = ['all', 'pending', 'accepted', 'preparing', 'ready', 'out-for-delivery', 'delivered'];
const workflow = ['pending', 'accepted', 'preparing', 'ready', 'out-for-delivery', 'delivered'];
const documentId = (value) => value?.$oid || value || '';
const normalizeStatus = (value) => String(value || 'pending').trim().toLowerCase().replace(/[\s_]+/g, '-');
const statusLabel = (value) => normalizeStatus(value).replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const money = (value) => new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 2 }).format(Number(value || 0));
const dateTime = (value) => new Intl.DateTimeFormat('en-BD', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

const statusTone = {
  pending: 'border-amber-500/20 bg-amber-500/10 text-amber-500',
  accepted: 'border-blue-500/20 bg-blue-500/10 text-blue-500',
  rejected: 'border-red-500/20 bg-red-500/10 text-red-500',
  preparing: 'border-violet-500/20 bg-violet-500/10 text-violet-500',
  ready: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-500',
  'out-for-delivery': 'border-orange-500/20 bg-orange-500/10 text-orange-500',
  delivered: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
};

function orderedFoods(order) {
  return (order.foods || []).map((food) => food.name).filter(Boolean).join(', ') || 'Food order';
}

function totalQuantity(order) {
  return (order.foods || []).reduce((sum, food) => sum + Number(food.quantity || 0), 0);
}

export default function ChefOrders() {
  const { user, dbUser } = useAuth();
  const email = (dbUser?.email || user?.email || '').trim().toLowerCase();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    if (!email) return undefined;
    setLoading(true);
    setError('');
    getChefOrders(email)
      .then((response) => { if (active) setOrders(response.data.data || []); })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || 'Unable to load chef orders.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [email, reloadKey]);

  useEffect(() => { setPage(1); }, [filter, search]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = filter === 'all' || normalizeStatus(order.status) === filter;
      const searchable = [documentId(order._id), order.customer?.name, order.customer?.email, orderedFoods(order)].filter(Boolean).join(' ').toLowerCase();
      return matchesStatus && (!query || searchable.includes(query));
    });
  }, [filter, orders, search]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const pageOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  async function changeStatus(order, nextStatus) {
    const id = documentId(order._id);
    const previous = order;
    if (!id || busyId || normalizeStatus(order.status) === nextStatus) return;

    setBusyId(id);
    setOrders((current) => current.map((item) => documentId(item._id) === id ? { ...item, status: nextStatus } : item));
    setSelectedOrder((current) => documentId(current?._id) === id ? { ...current, status: nextStatus } : current);
    try {
      const response = await updateOrderStatus(id, nextStatus);
      const updated = response.data.data;
      setOrders((current) => current.map((item) => documentId(item._id) === id ? updated : item));
      setSelectedOrder((current) => documentId(current?._id) === id ? updated : current);
      toast.success(`Order ${statusLabel(nextStatus).toLowerCase()}.`);
    } catch (requestError) {
      setOrders((current) => current.map((item) => documentId(item._id) === id ? previous : item));
      setSelectedOrder((current) => documentId(current?._id) === id ? previous : current);
      toast.error(requestError.response?.data?.message || 'Unable to update order status.');
    } finally {
      setBusyId('');
    }
  }

  if (loading) return <OrdersSkeleton />;

  return (
    <div className="mx-auto max-w-[1600px] space-y-8">
      <DashboardHeader title="Chef Orders" description="Review incoming orders, update kitchen progress, and keep customers informed." />

      <div className="flex flex-col gap-4 rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-lg shadow-black/5 sm:p-5">
        <label className="flex w-full items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3 sm:max-w-md"><Search className="h-4 w-4 text-[var(--text-muted)]" /><span className="sr-only">Search orders</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order, customer, or food" className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none" /></label>
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filter orders by status">{filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${filter === item ? 'bg-[var(--accent)] text-white shadow-lg shadow-orange-500/15' : 'border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--accent)]'}`}>{item === 'all' ? 'All Orders' : statusLabel(item)}</button>)}</div>
      </div>

      {error && <div role="alert" className="flex flex-col gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-red-500">{error}</p><button type="button" onClick={() => setReloadKey((value) => value + 1)} className="inline-flex items-center gap-2 self-start rounded-full border border-red-500/20 px-4 py-2 text-sm font-semibold text-red-500"><RefreshCw className="h-4 w-4" /> Retry</button></div>}

      {!pageOrders.length ? <EmptyOrders filtered={Boolean(search || filter !== 'all')} /> : (
        <>
          <div className="hidden overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-lg shadow-black/5 xl:block">
            <div className="overflow-x-auto"><table className="w-full min-w-[1250px] text-left"><thead className="border-b border-[var(--border)] bg-[var(--bg-muted)] text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]"><tr><Header>Order Number</Header><Header>Customer</Header><Header>Ordered Foods</Header><Header>Quantity</Header><Header>Total</Header><Header>Payment</Header><Header>Status</Header><Header>Date</Header><Header>Actions</Header></tr></thead><tbody>{pageOrders.map((order, index) => <OrderTableRow key={documentId(order._id)} order={order} index={index} busy={busyId === documentId(order._id)} onView={() => setSelectedOrder(order)} onStatus={(status) => changeStatus(order, status)} />)}</tbody></table></div>
          </div>

          <div className="grid gap-4 xl:hidden sm:grid-cols-2">{pageOrders.map((order, index) => <OrderCard key={documentId(order._id)} order={order} index={index} busy={busyId === documentId(order._id)} onView={() => setSelectedOrder(order)} onStatus={(status) => changeStatus(order, status)} />)}</div>

          <Pagination page={page} totalPages={totalPages} count={filteredOrders.length} onPage={setPage} />
        </>
      )}

      <AnimatePresence>{selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}</AnimatePresence>
    </div>
  );
}

function Header({ children }) { return <th className="px-4 py-4">{children}</th>; }

function OrderTableRow({ order, index, busy, onView, onStatus }) {
  const status = normalizeStatus(order.status);
  return <motion.tr initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.035 }} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-muted)]/60"><td className="px-4 py-5 text-sm font-semibold text-[var(--text-primary)]">#{documentId(order._id).slice(-8).toUpperCase()}</td><td className="px-4 py-5"><p className="max-w-36 truncate text-sm font-semibold text-[var(--text-primary)]">{order.customer?.name || 'Customer'}</p><p className="mt-1 max-w-36 truncate text-xs text-[var(--text-muted)]">{order.customer?.email}</p></td><td className="px-4 py-5"><p className="max-w-56 truncate text-sm text-[var(--text-secondary)]" title={orderedFoods(order)}>{orderedFoods(order)}</p></td><td className="px-4 py-5 text-sm font-semibold text-[var(--text-primary)]">{totalQuantity(order)}</td><td className="px-4 py-5 text-sm font-bold text-[var(--text-primary)]">{money(order.total)}</td><td className="px-4 py-5"><PaymentBadge status={order.paymentStatus} /></td><td className="px-4 py-5"><StatusBadge status={status} /></td><td className="px-4 py-5 text-xs text-[var(--text-secondary)]">{dateTime(order.orderDate)}</td><td className="px-4 py-5"><OrderActions order={order} busy={busy} onView={onView} onStatus={onStatus} /></td></motion.tr>;
}

function OrderCard({ order, index, busy, onView, onStatus }) {
  const status = normalizeStatus(order.status);
  return <motion.article initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-[var(--text-primary)]">#{documentId(order._id).slice(-8).toUpperCase()}</p><p className="mt-1 text-xs text-[var(--text-muted)]">{dateTime(order.orderDate)}</p></div><StatusBadge status={status} /></div><div className="mt-5 space-y-4"><Detail label="Customer" value={order.customer?.name || order.customer?.email || 'Customer'} /><Detail label="Ordered Foods" value={orderedFoods(order)} /><div className="grid grid-cols-3 gap-3"><Detail label="Quantity" value={totalQuantity(order)} /><Detail label="Total" value={money(order.total)} /><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">Payment</p><div className="mt-1"><PaymentBadge status={order.paymentStatus} /></div></div></div></div><div className="mt-5 border-t border-[var(--border)] pt-4"><OrderActions order={order} busy={busy} onView={onView} onStatus={onStatus} mobile /></div></motion.article>;
}

function Detail({ label, value }) { return <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</p><p className="mt-1 break-words text-sm font-semibold text-[var(--text-primary)]">{value}</p></div>; }
function StatusBadge({ status }) { return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusTone[status] || statusTone.pending}`}>{statusLabel(status)}</span>; }
function PaymentBadge({ status }) { const paid = String(status).toLowerCase() === 'paid'; return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${paid ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{status || 'pending'}</span>; }

function OrderActions({ order, busy, onView, onStatus, mobile = false }) {
  const status = normalizeStatus(order.status);
  const terminal = status === 'delivered' || status === 'rejected';
  return <div className={`flex flex-wrap items-center gap-2 ${mobile ? '' : 'min-w-[250px]'}`}><button type="button" onClick={onView} disabled={busy} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--border)] px-3 text-xs font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] hover:text-[var(--accent)] disabled:opacity-50"><Eye className="h-3.5 w-3.5" /> View</button>{status === 'pending' && <><button type="button" onClick={() => onStatus('accepted')} disabled={busy} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-500 transition hover:bg-emerald-500/20 disabled:opacity-50"><Check className="h-3.5 w-3.5" /> Accept</button><button type="button" onClick={() => onStatus('rejected')} disabled={busy} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-red-500/10 px-3 text-xs font-semibold text-red-500 transition hover:bg-red-500/20 disabled:opacity-50"><XCircle className="h-3.5 w-3.5" /> Reject</button></>}{!terminal && <label className="relative"><span className="sr-only">Update status</span><select value={status} onChange={(event) => onStatus(event.target.value)} disabled={busy} className="h-9 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-3 pr-7 text-xs font-semibold text-[var(--text-secondary)] outline-none focus:border-[var(--accent)] disabled:opacity-50">{workflow.map((item) => <option key={item} value={item}>{statusLabel(item)}</option>)}</select></label>}{busy && <Loader2 className="h-4 w-4 animate-spin text-[var(--accent)]" />}</div>;
}

function Pagination({ page, totalPages, count, onPage }) {
  return <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 sm:flex-row"><p className="text-xs text-[var(--text-muted)]">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, count)} of {count} orders</p><div className="flex items-center gap-2"><button type="button" onClick={() => onPage(page - 1)} disabled={page === 1} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] disabled:opacity-35" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button><span className="px-3 text-xs font-semibold text-[var(--text-primary)]">Page {page} of {totalPages}</span><button type="button" onClick={() => onPage(page + 1)} disabled={page === totalPages} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] disabled:opacity-35" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button></div></div>;
}

function OrderDetailsModal({ order, onClose }) {
  useEffect(() => { const close = (event) => event.key === 'Escape' && onClose(); window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, [onClose]);
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="order-details-title" onMouseDown={onClose}><motion.div initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }} onMouseDown={(event) => event.stopPropagation()} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-elevated)] sm:p-7"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Order Details</p><h2 id="order-details-title" className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">#{documentId(order._id).slice(-8).toUpperCase()}</h2></div><button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)]" aria-label="Close order details"><X className="h-4 w-4" /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><ModalDetail label="Customer" value={order.customer?.name || 'Customer'} /><ModalDetail label="Customer Email" value={order.customer?.email} /><ModalDetail label="Order Date" value={dateTime(order.orderDate)} /><ModalDetail label="Payment" value={String(order.paymentStatus || 'pending').toUpperCase()} /><ModalDetail label="Current Status" value={statusLabel(order.status)} /><ModalDetail label="Total" value={money(order.total)} /></div><div className="mt-6"><h3 className="text-sm font-semibold text-[var(--text-primary)]">Ordered Foods</h3><div className="mt-3 space-y-3">{(order.foods || []).map((food, index) => <div key={`${documentId(food.foodId)}-${index}`} className="flex items-center gap-3 rounded-2xl bg-[var(--bg-muted)] p-3">{food.image ? <img src={food.image} alt="" className="h-14 w-14 rounded-xl object-cover" /> : <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"><ShoppingBag className="h-5 w-5" /></span>}<div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[var(--text-primary)]">{food.name}</p><p className="mt-1 text-xs text-[var(--text-muted)]">{money(food.price)} × {food.quantity}</p></div><p className="text-sm font-bold text-[var(--text-primary)]">{money(food.subtotal)}</p></div>)}</div></div>{order.shippingAddress && <div className="mt-6"><h3 className="text-sm font-semibold text-[var(--text-primary)]">Delivery Address</h3><p className="mt-3 rounded-2xl bg-[var(--bg-muted)] p-4 text-sm leading-6 text-[var(--text-secondary)]">{[order.shippingAddress.address, order.shippingAddress.city, order.shippingAddress.postalCode, order.shippingAddress.phone].filter(Boolean).join(', ')}</p></div>}</motion.div></motion.div>;
}

function ModalDetail({ label, value }) { return <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">{label}</p><p className="mt-2 break-words text-sm font-semibold text-[var(--text-primary)]">{value || 'Not available'}</p></div>; }
function EmptyOrders({ filtered }) { return <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] px-6 py-20 text-center"><PackageCheck className="mx-auto h-10 w-10 text-[var(--text-muted)]" /><h2 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">{filtered ? 'No matching orders' : 'No orders yet'}</h2><p className="mt-2 text-sm text-[var(--text-muted)]">{filtered ? 'Try another search or status filter.' : 'New customer orders will appear here.'}</p></div>; }
function OrdersSkeleton() { return <div className="mx-auto max-w-[1600px] space-y-8" role="status" aria-label="Loading chef orders"><div className="space-y-3"><div className="h-4 w-24 animate-pulse rounded bg-[var(--bg-muted)]" /><div className="h-10 w-64 animate-pulse rounded bg-[var(--bg-muted)]" /></div><div className="h-32 animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /><div className="hidden h-[560px] animate-pulse rounded-[2rem] bg-[var(--bg-muted)] xl:block" /><div className="grid gap-4 sm:grid-cols-2 xl:hidden">{[1, 2, 3, 4].map((item) => <div key={item} className="h-72 animate-pulse rounded-[1.75rem] bg-[var(--bg-muted)]" />)}</div></div>; }
