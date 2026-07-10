import { lazy, Suspense, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BadgeDollarSign, ChefHat, CircleDollarSign, Clock3, Package, ReceiptText, RefreshCw, SearchCheck, ShoppingBag, Sparkles, Star, Tags, TicketPercent, UserRound, Users, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { useAuth } from '../../providers/AuthProvider';
import { getAdminOverview } from '../../services/adminApi';

const AdminOverviewCharts = lazy(() => import('../../components/dashboard/AdminOverviewCharts'));
const documentId = (value) => value?.$oid || value || '';
const money = (value) => new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(Number(value || 0));
const dateTime = (value) => value ? new Intl.DateTimeFormat('en-BD', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value)) : 'Not available';
const statusLabel = (value) => String(value || 'pending').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const stats = [
  { key: 'totalUsers', label: 'Total Users', icon: Users, tone: 'from-blue-500/15 to-cyan-500/5 text-blue-500' },
  { key: 'customers', label: 'Customers', icon: UserRound, tone: 'from-violet-500/15 to-purple-500/5 text-violet-500' },
  { key: 'chefs', label: 'Chefs', icon: ChefHat, tone: 'from-orange-500/15 to-amber-500/5 text-orange-500' },
  { key: 'pendingApplications', label: 'Pending Applications', icon: Clock3, tone: 'from-amber-500/15 to-yellow-500/5 text-amber-500' },
  { key: 'totalFoods', label: 'Total Foods', icon: Utensils, tone: 'from-emerald-500/15 to-green-500/5 text-emerald-500' },
  { key: 'totalOrders', label: 'Total Orders', icon: ReceiptText, tone: 'from-cyan-500/15 to-sky-500/5 text-cyan-500' },
  { key: 'totalRevenue', label: 'Total Revenue', icon: CircleDollarSign, money: true, tone: 'from-rose-500/15 to-pink-500/5 text-rose-500' },
  { key: 'activeOrders', label: 'Active Orders', icon: ShoppingBag, tone: 'from-indigo-500/15 to-blue-500/5 text-indigo-500' }
];
const actions = [
  { label: 'Manage Users', description: 'Review customer and chef accounts', to: '/dashboard/admin/users', icon: Users },
  { label: 'Chef Applications', description: 'Approve pending chef requests', to: '/dashboard/admin/chef-verification', icon: SearchCheck },
  { label: 'Orders', description: 'Monitor platform orders', to: '/dashboard/admin/orders', icon: ReceiptText },
  { label: 'Foods', description: 'Review marketplace listings', to: '/dashboard/admin/foods', icon: Utensils },
  { label: 'Coupons', description: 'Manage promotional offers', to: '/dashboard/admin/coupons', icon: TicketPercent }
];

export default function AdminOverview() {
  const { user, dbUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    getAdminOverview()
      .then((response) => { if (active) setData(response.data.data); })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || 'Unable to load the admin overview.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reloadKey]);

  if (loading) return <AdminSkeleton />;
  const summary = data?.stats || {};
  const recent = data?.recent || { orders: [], users: [], reviews: [] };

  return <div className="mx-auto max-w-[1600px] space-y-8">
    <DashboardHeader title="Admin Overview" description="Platform performance, marketplace activity, and operational priorities in one place." />
    <WelcomeBanner name={dbUser?.name || user?.displayName || 'Admin'} pending={summary.pendingApplications || 0} activeOrders={summary.activeOrders || 0} />
    {error && <div role="alert" className="flex flex-col gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-red-500">{error}</p><button type="button" onClick={() => setReloadKey((value) => value + 1)} className="inline-flex items-center gap-2 self-start rounded-full border border-red-500/20 px-4 py-2 text-sm font-semibold text-red-500"><RefreshCw className="h-4 w-4" /> Retry</button></div>}
    <motion.section initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">{stats.map((item) => <StatCard key={item.key} item={item} value={summary[item.key] || 0} />)}</motion.section>
    <Suspense fallback={<ChartsSkeleton />}><AdminOverviewCharts charts={data?.charts || {}} /></Suspense>
    <section className="grid gap-6 xl:grid-cols-3"><Panel title="Latest Orders" icon={Package}>{recent.orders?.length ? <div className="space-y-3">{recent.orders.map((order, index) => <RecentOrder key={documentId(order._id)} order={order} index={index} />)}</div> : <Empty text="No orders yet." />}</Panel><Panel title="Latest Registered Users" icon={Users}>{recent.users?.length ? <div className="space-y-3">{recent.users.map((account, index) => <RecentUser key={documentId(account._id)} account={account} index={index} />)}</div> : <Empty text="No registered users yet." />}</Panel><Panel title="Latest Reviews" icon={Star}>{recent.reviews?.length ? <div className="space-y-3">{recent.reviews.map((review, index) => <RecentReview key={documentId(review._id)} review={review} index={index} />)}</div> : <Empty text="No reviews yet." />}</Panel></section>
    <Panel title="Quick Actions" icon={Sparkles}><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{actions.map((action, index) => <QuickAction key={action.label} action={action} index={index} />)}</div></Panel>
  </div>;
}

function WelcomeBanner({ name, pending, activeOrders }) { const reduceMotion = useReducedMotion(); return <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative isolate overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-slate-900 via-violet-950 to-orange-950 p-6 text-white shadow-[0_30px_90px_rgba(79,70,229,0.2)] sm:p-8 lg:p-10"><motion.div animate={reduceMotion ? {} : { x: [0, 18, 0], y: [0, -12, 0] }} transition={{ duration: 9, repeat: Infinity }} className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl"/><motion.div animate={reduceMotion ? {} : { x: [0, -14, 0], y: [0, 15, 0] }} transition={{ duration: 11, repeat: Infinity }} className="absolute -bottom-28 right-10 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl"/><div className="relative grid items-center gap-8 lg:grid-cols-[1fr_300px]"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-white/70"><BadgeDollarSign className="h-4 w-4" /> HomeBite Control Center</p><h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Welcome back, {name}</h2><p className="mt-4 text-sm leading-7 text-white/80 sm:text-base">You have <strong className="text-white">{pending} pending chef {pending === 1 ? 'application' : 'applications'}</strong> and <strong className="text-white">{activeOrders} active {activeOrders === 1 ? 'order' : 'orders'}</strong> across the platform.</p><Link to="/dashboard/admin/chef-verification" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-violet-700 shadow-xl transition hover:-translate-y-0.5">Review applications <ArrowRight className="h-4 w-4" /></Link></div><div className="hidden justify-center lg:flex"><motion.span animate={reduceMotion ? {} : { y: [0, -9, 0], rotate: [0, 2, 0] }} transition={{ duration: 5, repeat: Infinity }} className="flex h-44 w-44 items-center justify-center rounded-[3rem] border border-white/15 bg-white/10 backdrop-blur"><Tags className="h-20 w-20 text-orange-300" /></motion.span></div></div></motion.section>; }
function StatCard({ item, value }) { const Icon = item.icon; return <motion.article variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -5 }} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5"><span className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tone}`}><Icon className="h-5 w-5" /></span><p className="mt-5 text-2xl font-bold text-[var(--text-primary)]">{item.money ? money(value) : Number(value).toLocaleString('en-BD')}</p><p className="mt-2 text-xs text-[var(--text-secondary)]">{item.label}</p></motion.article>; }
function Panel({ title, icon: Icon, children }) { return <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5 sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon className="h-5 w-5" /></span><h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2></div>{children}</motion.section>; }
function RecentOrder({ order, index }) { return <motion.article initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-3 rounded-2xl bg-[var(--bg-muted)] p-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--accent)]"><Package className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[var(--text-primary)]">#{documentId(order._id).slice(-8).toUpperCase()} · {order.customer?.name || 'Customer'}</p><p className="mt-1 text-[10px] text-[var(--text-muted)]">{dateTime(order.orderDate)} · {statusLabel(order.status)}</p></div><strong className="text-xs text-[var(--text-primary)]">{money(order.total)}</strong></motion.article>; }
function RecentUser({ account, index }) { return <motion.article initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-3 rounded-2xl bg-[var(--bg-muted)] p-3">{account.photo ? <img src={account.photo} alt="" className="h-10 w-10 rounded-xl object-cover" /> : <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--accent)]"><UserRound className="h-4 w-4" /></span>}<div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[var(--text-primary)]">{account.name || account.email}</p><p className="mt-1 text-[10px] capitalize text-[var(--text-muted)]">{account.role || 'customer'} · {dateTime(account.createdAt)}</p></div></motion.article>; }
function RecentReview({ review, index }) { return <motion.article initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="rounded-2xl bg-[var(--bg-muted)] p-3"><div className="flex items-center justify-between gap-3"><p className="truncate text-sm font-semibold text-[var(--text-primary)]">{review.customer?.name || 'Customer'} · {review.food?.name || 'Meal'}</p><div className="flex shrink-0">{[1,2,3,4,5].map((value) => <Star key={value} className={`h-3 w-3 ${value <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-[var(--text-muted)]'}`} />)}</div></div><p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--text-secondary)]">{review.comment}</p><p className="mt-2 text-[10px] text-[var(--text-muted)]">{dateTime(review.date)}</p></motion.article>; }
function QuickAction({ action, index }) { const Icon = action.icon; return <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}><Link to={action.to} className="group flex h-full items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-4 transition hover:border-[var(--accent)]"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--accent)]"><Icon className="h-4 w-4" /></span><span className="min-w-0"><span className="block text-sm font-semibold text-[var(--text-primary)]">{action.label}</span><span className="mt-1 block text-[10px] leading-4 text-[var(--text-muted)]">{action.description}</span></span></Link></motion.div>; }
function Empty({ text }) { return <div className="rounded-2xl border border-dashed border-[var(--border)] px-5 py-12 text-center text-sm text-[var(--text-muted)]">{text}</div>; }
function Shimmer({ className }) { return <div className={`relative overflow-hidden rounded-[2rem] bg-[var(--bg-muted)] ${className}`}><motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" /></div>; }
function ChartsSkeleton() { return <div className="grid gap-6 xl:grid-cols-2"><Shimmer className="h-[400px]"/><Shimmer className="h-[400px]"/><Shimmer className="h-[400px]"/><Shimmer className="h-[400px]"/></div>; }
function AdminSkeleton() { return <div className="mx-auto max-w-[1600px] space-y-8" role="status" aria-label="Loading admin overview"><div className="space-y-3"><div className="h-4 w-28 animate-pulse rounded bg-[var(--bg-muted)]"/><div className="h-10 w-64 animate-pulse rounded bg-[var(--bg-muted)]"/></div><Shimmer className="h-64"/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">{Array.from({ length: 8 }, (_, index) => <Shimmer key={index} className="h-40"/>)}</div><ChartsSkeleton/><div className="grid gap-6 xl:grid-cols-3"><Shimmer className="h-96"/><Shimmer className="h-96"/><Shimmer className="h-96"/></div></div>; }
