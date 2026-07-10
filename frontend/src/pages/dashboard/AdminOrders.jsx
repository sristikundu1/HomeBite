import { AnimatePresence, motion } from 'framer-motion';
import { Ban, ChevronLeft, ChevronRight, Eye, Loader2, PackageOpen, ReceiptText, RefreshCw, RotateCcw, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { getOrders, updateOrderStatus } from '../../services/ordersApi';

const PAGE_SIZE = 10;
const FILTERS = ['all', 'pending', 'accepted', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'rejected'];
const CANCELLABLE = new Set(['pending', 'accepted']);
const documentId = (value) => value?.$oid || value || '';
const normalizeStatus = (value) => String(value || 'pending').trim().toLowerCase().replace(/[\s_]+/g, '-');
const statusLabel = (value) => normalizeStatus(value) === 'rejected' ? 'Cancelled' : normalizeStatus(value).replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const money = (value) => new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 2 }).format(Number(value || 0));
const dateTime = (value) => value ? new Intl.DateTimeFormat('en-BD', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'Not available';
const chefs = (order) => Array.isArray(order.chef) ? order.chef : [order.chef].filter(Boolean);
const chefNames = (order) => chefs(order).map((chef) => chef?.name || chef?.email).filter(Boolean).join(', ') || 'Unknown chef';
const foodNames = (order) => (order.foods || []).map((food) => food.name).filter(Boolean).join(', ') || 'Food order';

const statusTone = {
  pending: 'border-amber-500/20 bg-amber-500/10 text-amber-500', accepted: 'border-blue-500/20 bg-blue-500/10 text-blue-500',
  preparing: 'border-violet-500/20 bg-violet-500/10 text-violet-500', ready: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-500',
  'out-for-delivery': 'border-orange-500/20 bg-orange-500/10 text-orange-500', delivered: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500',
  rejected: 'border-red-500/20 bg-red-500/10 text-red-500'
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [busyId, setBusyId] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    getOrders().then((response) => { if (active) setOrders(response.data.data || []); })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || 'Unable to load orders.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reloadKey]);

  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = filter === 'all' || normalizeStatus(order.status) === filter;
      const text = [documentId(order._id), order.customer?.name, order.customer?.email, chefNames(order), foodNames(order), order.paymentStatus, order.status].filter(Boolean).join(' ').toLowerCase();
      return matchesStatus && (!query || text.includes(query));
    });
  }, [filter, orders, search]);
  const totalPages = Math.max(1, Math.ceil(visibleOrders.length / PAGE_SIZE));
  const pageOrders = visibleOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => setPage(1), [filter, search]);
  useEffect(() => setPage((current) => Math.min(current, totalPages)), [totalPages]);

  async function cancelOrder() {
    const id = documentId(cancelling?._id);
    if (!id || busyId || !CANCELLABLE.has(normalizeStatus(cancelling.status))) return;
    const previous = cancelling;
    setBusyId(id);
    setOrders((current) => current.map((order) => documentId(order._id) === id ? { ...order, status: 'rejected' } : order));
    try {
      const response = await updateOrderStatus(id, 'rejected');
      setOrders((current) => current.map((order) => documentId(order._id) === id ? response.data.data : order));
      setViewing((current) => documentId(current?._id) === id ? response.data.data : current);
      setCancelling(null);
      toast.success('Order cancelled successfully.');
    } catch (requestError) {
      setOrders((current) => current.map((order) => documentId(order._id) === id ? previous : order));
      toast.error(requestError.response?.data?.message || 'Unable to cancel this order.');
    } finally { setBusyId(''); }
  }

  return <div className="mx-auto max-w-[1600px] space-y-8">
    <DashboardHeader title="Admin Orders" description="Monitor platform orders and cancel eligible orders without changing kitchen preparation progress." />
    <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-lg shadow-black/5">
      <label className="flex w-full items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3 sm:max-w-xl"><Search className="h-4 w-4 text-[var(--text-muted)]"/><span className="sr-only">Search orders</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order, customer, chef, food, or payment" className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none"/></label>
      <div className="mt-4 flex gap-2 overflow-x-auto border-t border-[var(--border)] pt-4" role="tablist" aria-label="Order status filters">{FILTERS.map((item) => <button key={item} type="button" role="tab" aria-selected={filter === item} onClick={() => setFilter(item)} className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-semibold transition ${filter === item ? 'bg-[var(--accent)] text-white shadow-lg shadow-orange-500/15' : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--accent)]'}`}>{item === 'all' ? 'All Orders' : statusLabel(item)}</button>)}</div>
      <p className="mt-4 text-xs text-[var(--text-muted)]">Showing {pageOrders.length} of {visibleOrders.length} matching orders</p>
    </motion.section>

    {loading ? <OrdersSkeleton/> : error ? <ErrorState message={error} onRetry={() => setReloadKey((value) => value + 1)}/> : pageOrders.length ? <><DesktopTable orders={pageOrders} onView={setViewing} onCancel={setCancelling} busyId={busyId}/><MobileCards orders={pageOrders} onView={setViewing} onCancel={setCancelling} busyId={busyId}/></> : <EmptyState filtered={orders.length > 0} onReset={() => { setSearch(''); setFilter('all'); }}/>} 
    {!loading && !error && visibleOrders.length > PAGE_SIZE && <Pagination page={page} totalPages={totalPages} count={visibleOrders.length} onPage={setPage}/>} 
    <AnimatePresence>{viewing && <OrderDetailsModal order={viewing} onClose={() => setViewing(null)}/>}</AnimatePresence>
    <AnimatePresence>{cancelling && <CancelModal order={cancelling} busy={busyId === documentId(cancelling._id)} onClose={() => !busyId && setCancelling(null)} onConfirm={cancelOrder}/>}</AnimatePresence>
  </div>;
}

function DesktopTable({ orders, onView, onCancel, busyId }) { return <div className="hidden overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-lg shadow-black/5 xl:block"><div className="overflow-x-auto"><table className="w-full min-w-[1500px] text-left"><thead className="border-b border-[var(--border)] bg-[var(--bg-muted)] text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]"><tr>{['Order ID','Customer','Chef','Foods','Total','Payment Status','Current Status','Date','Actions'].map((label) => <th key={label} className="px-4 py-4">{label}</th>)}</tr></thead><tbody>{orders.map((order, index) => <OrderRow key={documentId(order._id)} order={order} index={index} onView={onView} onCancel={onCancel} busy={busyId === documentId(order._id)}/>)}</tbody></table></div></div>; }
function OrderRow({ order, index, onView, onCancel, busy }) { return <motion.tr initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.035 }} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-muted)]/60"><td className="px-4 py-5 text-sm font-bold text-[var(--text-primary)]">#{documentId(order._id).slice(-8).toUpperCase()}</td><td className="px-4 py-5"><Person name={order.customer?.name} email={order.customer?.email} photo={order.customer?.photo}/></td><td className="px-4 py-5"><p className="max-w-[180px] truncate text-xs font-semibold text-[var(--text-primary)]" title={chefNames(order)}>{chefNames(order)}</p></td><td className="px-4 py-5"><p className="max-w-[220px] truncate text-xs text-[var(--text-secondary)]" title={foodNames(order)}>{foodNames(order)}</p></td><td className="px-4 py-5 text-sm font-bold text-[var(--text-primary)]">{money(order.total)}</td><td className="px-4 py-5"><PaymentBadge status={order.paymentStatus}/></td><td className="px-4 py-5"><StatusBadge status={order.status}/></td><td className="px-4 py-5 text-xs text-[var(--text-secondary)]">{dateTime(order.orderDate)}</td><td className="px-4 py-5"><Actions order={order} busy={busy} onView={() => onView(order)} onCancel={() => onCancel(order)}/></td></motion.tr>; }
function MobileCards({ orders, onView, onCancel, busyId }) { return <div className="grid gap-4 sm:grid-cols-2 xl:hidden">{orders.map((order, index) => <motion.article key={documentId(order._id)} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5"><div className="flex items-start justify-between gap-3"><div><p className="font-bold text-[var(--text-primary)]">#{documentId(order._id).slice(-8).toUpperCase()}</p><p className="mt-1 text-xs text-[var(--text-muted)]">{dateTime(order.orderDate)}</p></div><StatusBadge status={order.status}/></div><div className="mt-5 space-y-4"><Person name={order.customer?.name} email={order.customer?.email} photo={order.customer?.photo}/><MobileDetail label="Chef" value={chefNames(order)}/><MobileDetail label="Foods" value={foodNames(order)}/><div className="grid grid-cols-2 gap-3"><MobileDetail label="Total" value={money(order.total)}/><div><p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Payment</p><div className="mt-1"><PaymentBadge status={order.paymentStatus}/></div></div></div></div><div className="mt-5 border-t border-[var(--border)] pt-4"><Actions order={order} busy={busyId === documentId(order._id)} onView={() => onView(order)} onCancel={() => onCancel(order)}/></div></motion.article>)}</div>; }
function Person({ name, email, photo }) { return <div className="flex min-w-0 items-center gap-3">{photo ? <img src={photo} alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover"/> : <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"><UserRound className="h-4 w-4"/></span>}<div className="min-w-0"><p className="max-w-[160px] truncate text-xs font-semibold text-[var(--text-primary)]">{name || 'Customer'}</p><p className="mt-1 max-w-[160px] truncate text-[10px] text-[var(--text-muted)]">{email || 'Email unavailable'}</p></div></div>; }
function MobileDetail({ label, value }) { return <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{label}</p><p className="mt-1 break-words text-sm font-semibold text-[var(--text-primary)]">{value}</p></div>; }
function StatusBadge({ status }) { const value = normalizeStatus(status); return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusTone[value] || statusTone.pending}`}>{statusLabel(value)}</span>; }
function PaymentBadge({ status }) { const value = String(status || 'pending').toLowerCase(); const paid = value === 'paid'; return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${paid ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{value}</span>; }
function Actions({ order, busy, onView, onCancel }) { const cancellable = CANCELLABLE.has(normalizeStatus(order.status)); return <div className="flex min-w-[235px] flex-wrap gap-2"><ActionButton label="View" icon={Eye} onClick={onView} disabled={busy}/>{cancellable && <ActionButton label="Cancel" icon={Ban} danger onClick={onCancel} disabled={busy}/>}<ActionButton label="Refund" icon={RotateCcw} disabled title="Refund functionality is coming soon"/>{busy && <Loader2 className="h-4 w-4 animate-spin self-center text-[var(--accent)]"/>}</div>; }
function ActionButton({ label, icon: Icon, onClick, disabled, danger, title }) { return <button type="button" onClick={onClick} disabled={disabled} title={title} className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[10px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${danger ? 'border-red-500/20 text-red-500 hover:bg-red-500/10' : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)]'}`}><Icon className="h-3.5 w-3.5"/>{label}</button>; }
function ModalShell({ title, onClose, children, danger }) { useEffect(() => { const close = (event) => event.key === 'Escape' && onClose(); window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, [onClose]); return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="admin-order-modal-title" onMouseDown={onClose}><motion.div initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }} onMouseDown={(event) => event.stopPropagation()} className={`max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-elevated)] sm:p-7 ${danger ? 'border-red-500/20' : 'border-[var(--border)]'}`}><div className="mb-6 flex items-center justify-between gap-4"><h2 id="admin-order-modal-title" className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2><button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)]" aria-label="Close modal"><X className="h-4 w-4"/></button></div>{children}</motion.div></motion.div>; }
function OrderDetailsModal({ order, onClose }) { return <ModalShell title={`Order #${documentId(order._id).slice(-8).toUpperCase()}`} onClose={onClose}><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><Detail label="Customer" value={order.customer?.name || order.customer?.email}/><Detail label="Chef" value={chefNames(order)}/><Detail label="Date" value={dateTime(order.orderDate)}/><Detail label="Payment Status" value={order.paymentStatus}/><Detail label="Current Status" value={statusLabel(order.status)}/><Detail label="Total" value={money(order.total)}/></div><section className="mt-6"><h3 className="text-sm font-semibold text-[var(--text-primary)]">Foods</h3><div className="mt-3 space-y-3">{(order.foods || []).map((food, index) => <div key={`${documentId(food.foodId)}-${index}`} className="flex items-center gap-3 rounded-2xl bg-[var(--bg-muted)] p-3">{food.image ? <img src={food.image} alt="" className="h-14 w-14 rounded-xl object-cover"/> : <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"><ShoppingBag className="h-5 w-5"/></span>}<div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[var(--text-primary)]">{food.name || 'Food item'}</p><p className="mt-1 text-xs text-[var(--text-muted)]">{money(food.price)} × {food.quantity || 0}</p></div><p className="text-sm font-bold text-[var(--text-primary)]">{money(food.subtotal)}</p></div>)}</div></section>{order.shippingAddress && <section className="mt-6"><h3 className="text-sm font-semibold text-[var(--text-primary)]">Delivery Address</h3><p className="mt-3 rounded-2xl bg-[var(--bg-muted)] p-4 text-sm leading-6 text-[var(--text-secondary)]">{[order.shippingAddress.address, order.shippingAddress.city, order.shippingAddress.postalCode, order.shippingAddress.phone].filter(Boolean).join(', ') || 'Not available'}</p></section>}</ModalShell>; }
function Detail({ label, value }) { return <div className="rounded-2xl bg-[var(--bg-muted)] p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{label}</p><p className="mt-2 break-words text-sm capitalize text-[var(--text-primary)]">{value || 'Not available'}</p></div>; }
function CancelModal({ order, busy, onClose, onConfirm }) { return <ModalShell title="Cancel Order?" onClose={onClose} danger><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500"><Ban className="h-7 w-7"/></div><p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">This will cancel the order for the customer and chef. Admins cannot change any food preparation status.</p><p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">Order #{documentId(order._id).slice(-8).toUpperCase()}</p><div className="mt-7 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={busy} className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text-secondary)]">Keep Order</button><button type="button" onClick={onConfirm} disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy && <Loader2 className="h-4 w-4 animate-spin"/>}{busy ? 'Cancelling...' : 'Cancel Order'}</button></div></ModalShell>; }
function Pagination({ page, totalPages, count, onPage }) { return <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 sm:flex-row"><p className="text-xs text-[var(--text-muted)]">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, count)} of {count} orders</p><div className="flex items-center gap-2"><PageButton label="Previous page" disabled={page === 1} onClick={() => onPage(page - 1)}><ChevronLeft className="h-4 w-4"/></PageButton><span className="px-3 text-xs font-semibold text-[var(--text-primary)]">Page {page} of {totalPages}</span><PageButton label="Next page" disabled={page === totalPages} onClick={() => onPage(page + 1)}><ChevronRight className="h-4 w-4"/></PageButton></div></div>; }
function PageButton({ label, disabled, onClick, children }) { return <button type="button" aria-label={label} disabled={disabled} onClick={onClick} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] disabled:opacity-35">{children}</button>; }
function OrdersSkeleton() { return <div className="space-y-3" role="status" aria-label="Loading orders">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-20 animate-pulse rounded-2xl bg-[var(--bg-muted)]"/>)}</div>; }
function ErrorState({ message, onRetry }) { return <div className="rounded-[2rem] border border-red-500/20 bg-red-500/5 px-6 py-16 text-center"><p className="text-sm font-semibold text-red-500">{message}</p><button type="button" onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-full border border-red-500/20 px-5 py-2.5 text-sm font-semibold text-red-500"><RefreshCw className="h-4 w-4"/>Try Again</button></div>; }
function EmptyState({ filtered, onReset }) { return <div className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--bg-surface)] px-6 py-20 text-center"><PackageOpen className="mx-auto h-10 w-10 text-[var(--accent)]"/><h2 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">{filtered ? 'No matching orders' : 'No orders found'}</h2><p className="mt-2 text-sm text-[var(--text-muted)]">{filtered ? 'Try changing the search or status filter.' : 'Platform orders will appear here.'}</p>{filtered && <button type="button" onClick={onReset} className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)]"><ReceiptText className="h-4 w-4"/>Clear Filters</button>}</div>; }
