import { motion } from 'framer-motion';
import {
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Eye,
  ImageOff,
  PackageSearch,
  RefreshCw,
  Search,
  Star,
  Truck
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { useAuth } from '../../providers/AuthProvider';
import { getCustomerOrders } from '../../services/ordersApi';

const PAGE_SIZE = 8;
const filters = [
  { value: 'all', label: 'All Orders' }, { value: 'pending', label: 'Pending' }, { value: 'accepted', label: 'Accepted' },
  { value: 'preparing', label: 'Preparing' }, { value: 'ready', label: 'Ready' }, { value: 'out-for-delivery', label: 'Out For Delivery' },
  { value: 'delivered', label: 'Delivered' }, { value: 'rejected', label: 'Cancelled' }
];
const documentId = (value) => value?.$oid || value || '';
const normalizeStatus = (value) => String(value || 'pending').trim().toLowerCase().replace(/[\s_]+/g, '-');
const statusLabel = (value) => value === 'rejected' ? 'Cancelled' : normalizeStatus(value).replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const money = (value) => new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 2 }).format(Number(value || 0));
const dateTime = (value) => new Intl.DateTimeFormat('en-BD', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
const statusTone = { pending: 'border-amber-500/20 bg-amber-500/10 text-amber-500', accepted: 'border-blue-500/20 bg-blue-500/10 text-blue-500', preparing: 'border-violet-500/20 bg-violet-500/10 text-violet-500', ready: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-500', 'out-for-delivery': 'border-orange-500/20 bg-orange-500/10 text-orange-500', delivered: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500', rejected: 'border-red-500/20 bg-red-500/10 text-red-500' };

function chefsFor(order) { return Array.isArray(order.chef) ? order.chef : [order.chef].filter(Boolean); }
function foodNames(order) { return (order.foods || []).map((food) => food.name).filter(Boolean).join(', ') || 'Food order'; }

export default function CustomerOrders() {
  const { user, dbUser } = useAuth();
  const email = (dbUser?.email || user?.email || '').trim().toLowerCase();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    if (!email) return undefined;
    setLoading(true); setError('');
    getCustomerOrders(email)
      .then((response) => { if (active) setOrders(response.data.data || []); })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || 'Unable to load your orders.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [email, reloadKey]);

  useEffect(() => { setPage(1); }, [filter, search]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const status = normalizeStatus(order.status);
      const searchable = [documentId(order._id), foodNames(order), ...chefsFor(order).flatMap((chef) => [chef.name, chef.email]), statusLabel(status)].filter(Boolean).join(' ').toLowerCase();
      return (filter === 'all' || status === filter) && (!query || searchable.includes(query));
    });
  }, [filter, orders, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageOrders = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  if (loading) return <OrdersSkeleton />;

  return <div className="mx-auto max-w-[1600px] space-y-8">
    <DashboardHeader title="My Orders" description="Review your order history, follow live progress, and share feedback after delivery." />
    <section className="space-y-4 rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-lg shadow-black/5 sm:p-5"><label className="flex w-full items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3 sm:max-w-md"><Search className="h-4 w-4 text-[var(--text-muted)]" /><span className="sr-only">Search orders</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order, food, or chef" className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none" /></label><div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filter orders by status">{filters.map((item) => <button key={item.value} type="button" onClick={() => setFilter(item.value)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${filter === item.value ? 'bg-[var(--accent)] text-white shadow-lg shadow-orange-500/15' : 'border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--accent)]'}`}>{item.label}</button>)}</div></section>
    {error && <div role="alert" className="flex flex-col gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-red-500">{error}</p><button type="button" onClick={() => setReloadKey((value) => value + 1)} className="inline-flex items-center gap-2 self-start rounded-full border border-red-500/20 px-4 py-2 text-sm font-semibold text-red-500"><RefreshCw className="h-4 w-4" /> Retry</button></div>}
    {!pageOrders.length ? <EmptyOrders filtered={Boolean(search || filter !== 'all')} /> : <><DesktopTable orders={pageOrders} /><div className="grid gap-4 md:grid-cols-2 xl:hidden">{pageOrders.map((order, index) => <OrderCard key={documentId(order._id)} order={order} index={index} />)}</div><Pagination page={page} totalPages={totalPages} count={filtered.length} onPage={setPage} /></>}
  </div>;
}

function DesktopTable({ orders }) { return <div className="hidden overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-lg shadow-black/5 xl:block"><div className="overflow-x-auto"><table className="w-full min-w-[1280px] text-left"><thead className="border-b border-[var(--border)] bg-[var(--bg-muted)] text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]"><tr>{['Order ID', 'Foods', 'Chef', 'Date', 'Amount', 'Payment', 'Current Status', 'Actions'].map((label) => <th key={label} className="px-5 py-4">{label}</th>)}</tr></thead><tbody>{orders.map((order, index) => <OrderRow key={documentId(order._id)} order={order} index={index} />)}</tbody></table></div></div>; }
function OrderRow({ order, index }) { const id = documentId(order._id); const chefs = chefsFor(order); const status = normalizeStatus(order.status); const firstFood = order.foods?.[0]; return <motion.tr initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.035 }} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-muted)]/60"><td className="px-5 py-5 text-sm font-semibold text-[var(--text-primary)]">#{id.slice(-8).toUpperCase()}</td><td className="px-5 py-5"><div className="flex max-w-60 items-center gap-3"><FoodImage food={firstFood} /><div className="min-w-0"><p className="truncate text-sm font-semibold text-[var(--text-primary)]">{firstFood?.name || 'Food order'}</p>{order.foods?.length > 1 && <p className="mt-1 text-xs text-[var(--text-muted)]">+{order.foods.length - 1} more</p>}</div></div></td><td className="px-5 py-5"><ChefDisplay chefs={chefs} /></td><td className="px-5 py-5 text-xs text-[var(--text-secondary)]">{dateTime(order.orderDate)}</td><td className="px-5 py-5 text-sm font-bold text-[var(--text-primary)]">{money(order.total)}</td><td className="px-5 py-5"><PaymentBadge status={order.paymentStatus} /></td><td className="px-5 py-5"><StatusBadge status={status} /></td><td className="px-5 py-5"><OrderActions order={order} /></td></motion.tr>; }
function OrderCard({ order, index }) { const id = documentId(order._id); const status = normalizeStatus(order.status); const food = order.foods?.[0]; return <motion.article initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-[var(--text-primary)]">#{id.slice(-8).toUpperCase()}</p><p className="mt-1 text-xs text-[var(--text-muted)]">{dateTime(order.orderDate)}</p></div><StatusBadge status={status} /></div><div className="mt-5 flex gap-3"><FoodImage food={food} large /><div className="min-w-0"><p className="truncate text-sm font-semibold text-[var(--text-primary)]">{food?.name || 'Food order'}</p><p className="mt-1 text-xs text-[var(--text-muted)]">{order.foods?.length || 0} {(order.foods?.length || 0) === 1 ? 'food' : 'foods'}</p><div className="mt-3"><ChefDisplay chefs={chefsFor(order)} /></div></div></div><div className="mt-5 grid grid-cols-2 gap-3 border-y border-[var(--border)] py-4"><Detail label="Amount" value={money(order.total)} /><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">Payment</p><div className="mt-1"><PaymentBadge status={order.paymentStatus} /></div></div></div><div className="mt-4"><OrderActions order={order} mobile /></div></motion.article>; }
function FoodImage({ food, large }) { const [failed, setFailed] = useState(false); return <div className={`${large ? 'h-20 w-20' : 'h-12 w-12'} shrink-0 overflow-hidden rounded-2xl bg-[var(--bg-muted)]`}>{food?.image && !failed ? <img src={food.image} alt={food.name || 'Ordered food'} onError={() => setFailed(true)} className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center text-[var(--text-muted)]"><ImageOff className="h-5 w-5" /></span>}</div>; }
function ChefDisplay({ chefs }) { const chef = chefs[0]; return <div className="flex max-w-44 items-center gap-2">{chef?.photo ? <img src={chef.photo} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" /> : <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]"><ChefHat className="h-4 w-4" /></span>}<div className="min-w-0"><p className="truncate text-xs font-semibold text-[var(--text-primary)]">{chef?.name || 'HomeBite Chef'}</p>{chefs.length > 1 && <p className="text-[10px] text-[var(--text-muted)]">+{chefs.length - 1} chef</p>}</div></div>; }
function StatusBadge({ status }) { return <motion.span animate={{ opacity: [0.82, 1, 0.82] }} transition={{ duration: 2.5, repeat: Infinity }} className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusTone[status] || 'border-slate-500/20 bg-slate-500/10 text-slate-500'}`}>{statusLabel(status)}</motion.span>; }
function PaymentBadge({ status }) { const paid = String(status).toLowerCase() === 'paid'; return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${paid ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{status || 'pending'}</span>; }
function Detail({ label, value }) { return <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</p><p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{value}</p></div>; }
function OrderActions({ order, mobile }) { const id = documentId(order._id); const delivered = normalizeStatus(order.status) === 'delivered'; const base = 'inline-flex h-9 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]'; return <div className={`flex flex-wrap gap-2 ${mobile ? '' : 'min-w-[285px]'}`}><Link to={`/dashboard/orders/${id}`} className={`${base} border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)]`}><Eye className="h-3.5 w-3.5" /> View Details</Link><Link to={`/dashboard/orders/${id}#tracking`} className={`${base} border-blue-500/20 text-blue-500 hover:bg-blue-500/10`}><Truck className="h-3.5 w-3.5" /> Track Order</Link>{delivered && <Link to={`/dashboard/orders/${id}#review`} className={`${base} border-amber-500/20 text-amber-500 hover:bg-amber-500/10`}><Star className="h-3.5 w-3.5" /> Leave Review</Link>}</div>; }
function Pagination({ page, totalPages, count, onPage }) { return <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 sm:flex-row"><p className="text-xs text-[var(--text-muted)]">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, count)} of {count} orders</p><div className="flex items-center gap-2"><button type="button" onClick={() => onPage(page - 1)} disabled={page === 1} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] disabled:opacity-35" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button><span className="px-3 text-xs font-semibold text-[var(--text-primary)]">Page {page} of {totalPages}</span><button type="button" onClick={() => onPage(page + 1)} disabled={page === totalPages} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] disabled:opacity-35" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button></div></div>; }
function EmptyOrders({ filtered }) { return <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--bg-surface)] px-6 py-20 text-center"><PackageSearch className="mx-auto h-11 w-11 text-[var(--accent)]" /><h2 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">{filtered ? 'No matching orders' : 'No orders yet'}</h2><p className="mt-2 text-sm text-[var(--text-muted)]">{filtered ? 'Try another search or status filter.' : 'Your HomeBite order history will appear here.'}</p>{!filtered && <Link to="/foods" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white">Browse Foods</Link>}</motion.div>; }
function OrdersSkeleton() { return <div className="mx-auto max-w-[1600px] space-y-8" role="status" aria-label="Loading customer orders"><div className="space-y-3"><div className="h-4 w-24 animate-pulse rounded bg-[var(--bg-muted)]" /><div className="h-10 w-56 animate-pulse rounded bg-[var(--bg-muted)]" /></div><div className="h-32 animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /><div className="hidden h-[580px] animate-pulse rounded-[2rem] bg-[var(--bg-muted)] xl:block" /><div className="grid gap-4 md:grid-cols-2 xl:hidden">{[1, 2, 3, 4].map((item) => <div key={item} className="h-80 animate-pulse rounded-[1.75rem] bg-[var(--bg-muted)]" />)}</div></div>; }
