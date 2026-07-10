import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Bell,
  ChefHat,
  CircleDollarSign,
  Clock3,
  Heart,
  PackageCheck,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  UserRound,
  Utensils
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import useCart from '../../hooks/useCart';
import useNotifications from '../../hooks/useNotifications';
import useWishlist from '../../hooks/useWishlist';
import { useAuth } from '../../providers/AuthProvider';
import { getCustomerOrders } from '../../services/ordersApi';

const CustomerOverviewCharts = lazy(() => import('../../components/dashboard/CustomerOverviewCharts'));
const documentId = (value) => value?.$oid || value || '';
const normalizeStatus = (value) => String(value || 'pending').trim().toLowerCase().replace(/[\s_]+/g, '-');
const statusLabel = (value) => normalizeStatus(value).replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const money = (value) => new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(Number(value || 0));
const dateTime = (value) => new Intl.DateTimeFormat('en-BD', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value));

const statDefinitions = [
  { key: 'activeOrders', label: 'Active Orders', icon: ShoppingBag, tone: 'from-blue-500/15 to-cyan-500/5 text-blue-500' },
  { key: 'pendingOrders', label: 'Pending Orders', icon: Clock3, tone: 'from-amber-500/15 to-orange-500/5 text-amber-500' },
  { key: 'deliveredOrders', label: 'Delivered Orders', icon: PackageCheck, tone: 'from-emerald-500/15 to-green-500/5 text-emerald-500' },
  { key: 'wishlistCount', label: 'Wishlist Count', icon: Heart, tone: 'from-pink-500/15 to-rose-500/5 text-pink-500' },
  { key: 'cartItems', label: 'Cart Items', icon: ShoppingCart, tone: 'from-violet-500/15 to-purple-500/5 text-violet-500' },
  { key: 'totalSpent', label: 'Total Spent', icon: CircleDollarSign, money: true, tone: 'from-orange-500/15 to-amber-500/5 text-orange-500' }
];

const quickActions = [
  { label: 'Browse Foods', description: 'Discover something delicious', to: '/foods', icon: Utensils },
  { label: 'My Cart', description: 'Review your selected meals', to: '/dashboard/cart', icon: ShoppingCart },
  { label: 'Wishlist', description: 'Return to saved favorites', to: '/dashboard/wishlist', icon: Heart },
  { label: 'Become a Chef', description: 'Share food from your kitchen', to: '/cook', icon: ChefHat }
];

export default function CustomerOverview() {
  const { user, dbUser } = useAuth();
  const { wishlistIds } = useWishlist();
  const { cartCount, loading: cartLoading } = useCart();
  const { notifications, loading: notificationsLoading } = useNotifications();
  const email = (dbUser?.email || user?.email || '').trim().toLowerCase();
  const customerName = dbUser?.name || user?.displayName || 'Food Lover';
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    if (!email) return undefined;
    setOrdersLoading(true); setError('');
    getCustomerOrders(email)
      .then((response) => { if (active) setOrders(response.data.data || []); })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || 'Unable to load your customer overview.'); })
      .finally(() => { if (active) setOrdersLoading(false); });
    return () => { active = false; };
  }, [email, reloadKey]);

  const stats = useMemo(() => ({
    activeOrders: orders.filter((order) => !['delivered', 'rejected'].includes(normalizeStatus(order.status))).length,
    pendingOrders: orders.filter((order) => normalizeStatus(order.status) === 'pending').length,
    deliveredOrders: orders.filter((order) => normalizeStatus(order.status) === 'delivered').length,
    wishlistCount: wishlistIds.length,
    cartItems: cartCount,
    totalSpent: orders.filter((order) => String(order.paymentStatus).toLowerCase() === 'paid').reduce((sum, order) => sum + Number(order.total || 0), 0)
  }), [cartCount, orders, wishlistIds.length]);

  const loading = ordersLoading || cartLoading || notificationsLoading;
  if (loading) return <OverviewSkeleton />;

  return <div className="mx-auto max-w-[1550px] space-y-8">
    <DashboardHeader title="Customer Overview" description="Your orders, favorites, spending, and HomeBite activity in one place." />
    <WelcomeBanner name={customerName} activeOrders={stats.activeOrders} />
    {error && <div role="alert" className="flex flex-col gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-red-500">{error}</p><button type="button" onClick={() => setReloadKey((value) => value + 1)} className="inline-flex items-center gap-2 self-start rounded-full border border-red-500/20 px-4 py-2 text-sm font-semibold text-red-500"><RefreshCw className="h-4 w-4" /> Retry</button></div>}

    <motion.section initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055 } } }} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">{statDefinitions.map((item) => <StatCard key={item.key} item={item} value={stats[item.key]} />)}</motion.section>

    <Suspense fallback={<ChartsSkeleton />}><CustomerOverviewCharts orders={orders} /></Suspense>

    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
      <Panel title="Recent Orders" description="Your latest five orders" icon={ShoppingBag}>{orders.length ? <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.065 } } }} className="space-y-3">{orders.slice(0, 5).map((order) => <RecentOrder key={documentId(order._id)} order={order} />)}</motion.div> : <EmptyState icon={ShoppingBag} text="Your recent orders will appear here." />}</Panel>
      <Panel title="Recent Notifications" description="Latest updates from HomeBite" icon={Bell}>{notifications.length ? <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }} className="space-y-2">{notifications.slice(0, 5).map((notification) => <RecentNotification key={documentId(notification._id)} notification={notification} />)}</motion.div> : <EmptyState icon={Bell} text="You are all caught up." />}</Panel>
    </section>

    <Panel title="Quick Actions" description="Jump back into your favorite HomeBite activities" icon={Sparkles}><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{quickActions.map((action, index) => <QuickAction key={action.label} action={action} index={index} />)}</div></Panel>
  </div>;
}

function WelcomeBanner({ name, activeOrders }) {
  const reduceMotion = useReducedMotion();
  return <motion.section initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative isolate overflow-hidden rounded-[2.25rem] border border-white/15 bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-6 text-white shadow-[0_30px_90px_rgba(249,115,22,0.24)] sm:p-8 lg:p-10"><motion.div animate={reduceMotion ? {} : { x: [0, 18, 0], y: [0, -12, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-yellow-300/25 blur-3xl" /><motion.div animate={reduceMotion ? {} : { x: [0, -14, 0], y: [0, 15, 0] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-28 right-10 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl" /><div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_25%,rgba(255,255,255,0.2),transparent_28%)]" /><div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_340px]"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-white/75"><Sparkles className="h-4 w-4" /> Your HomeBite table</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">👋 Welcome back, {name}!</h2><p className="mt-4 text-sm leading-7 text-white/85 sm:text-base">You currently have <strong className="text-white">{activeOrders} active {activeOrders === 1 ? 'order' : 'orders'}</strong>.</p><p className="mt-1 text-sm text-white/80 sm:text-base">Ready to discover something delicious today?</p><Link to="/foods" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-orange-600 shadow-xl transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-white/30">Explore meals <ArrowRight className="h-4 w-4" /></Link></div><FoodDeliveryArt reduceMotion={reduceMotion} /></div></motion.section>;
}

function FoodDeliveryArt({ reduceMotion }) { return <div className="relative hidden h-56 lg:block" aria-hidden="true"><motion.div animate={reduceMotion ? {} : { y: [0, -8, 0], rotate: [0, 1.5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-x-8 bottom-1 top-2 rounded-[2rem] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md"><svg viewBox="0 0 300 205" className="h-full w-full"><path d="M69 136h162c-5 32-31 48-81 48s-76-16-81-48Z" fill="rgba(255,255,255,.9)"/><path d="M54 132h192" stroke="white" strokeWidth="6" strokeLinecap="round"/><path d="M92 122c10-32 29-48 58-48s48 16 58 48" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.75)" strokeWidth="4"/><motion.path animate={reduceMotion ? {} : { pathLength: [0.2, 1, 0.2], opacity: [0.25, 0.85, 0.25] }} transition={{ duration: 3, repeat: Infinity }} d="M122 66c-15-17 12-21 0-40m31 38c-12-15 12-20 1-37m29 43c-11-17 13-19 4-39" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round"/><circle cx="111" cy="104" r="9" fill="#facc15"/><circle cx="146" cy="99" r="11" fill="#fb7185"/><circle cx="181" cy="106" r="9" fill="#4ade80"/></svg></motion.div><motion.span animate={reduceMotion ? {} : { y: [0, -10, 0], rotate: [-7, 5, -7] }} transition={{ duration: 4.5, repeat: Infinity }} className="absolute right-0 top-2 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur"><ShoppingBag className="h-6 w-6 text-white" /></motion.span><motion.span animate={reduceMotion ? {} : { x: [0, 7, 0], y: [0, 5, 0] }} transition={{ duration: 5.5, repeat: Infinity }} className="absolute bottom-0 left-0 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-yellow-300/20 backdrop-blur"><Star className="h-5 w-5 fill-white text-white" /></motion.span></div>; }

function StatCard({ item, value }) { const Icon = item.icon; return <motion.article variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -6, scale: 1.01 }} transition={{ type: 'spring', stiffness: 280, damping: 24 }} className="group relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5"><div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--accent-soft)] opacity-0 blur-2xl transition group-hover:opacity-65" /><div className="relative flex items-center justify-between"><motion.span whileHover={{ rotate: -8, scale: 1.08 }} className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tone}`}><Icon className="h-5 w-5" /></motion.span><span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_16px_var(--accent)]" /></div><p className="relative mt-6 text-3xl font-bold tracking-tight text-[var(--text-primary)]"><AnimatedNumber value={value} moneyValue={item.money} /></p><p className="relative mt-2 text-sm text-[var(--text-secondary)]">{item.label}</p></motion.article>; }
function AnimatedNumber({ value, moneyValue }) { const reduceMotion = useReducedMotion(); const [display, setDisplay] = useState(reduceMotion ? Number(value || 0) : 0); useEffect(() => { if (reduceMotion) { setDisplay(Number(value || 0)); return undefined; } const target = Number(value || 0); const start = performance.now(); let frame; const tick = (time) => { const progress = Math.min((time - start) / 750, 1); setDisplay(target * (1 - (1 - progress) ** 3)); if (progress < 1) frame = requestAnimationFrame(tick); }; frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame); }, [reduceMotion, value]); return moneyValue ? money(display) : Math.round(display).toLocaleString('en-BD'); }
function Panel({ title, description, icon: Icon, children }) { return <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }} className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5 sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon className="h-5 w-5" /></span><div><h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2><p className="mt-1 text-xs text-[var(--text-muted)]">{description}</p></div></div>{children}</motion.section>; }

function RecentOrder({ order }) { const food = order.foods?.[0]; const chefs = Array.isArray(order.chef) ? order.chef : [order.chef].filter(Boolean); const chef = chefs[0]; const status = normalizeStatus(order.status); const tone = { pending: 'border-amber-500/20 bg-amber-500/10 text-amber-500', accepted: 'border-blue-500/20 bg-blue-500/10 text-blue-500', preparing: 'border-violet-500/20 bg-violet-500/10 text-violet-500', ready: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-500', 'out-for-delivery': 'border-orange-500/20 bg-orange-500/10 text-orange-500', delivered: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500', rejected: 'border-red-500/20 bg-red-500/10 text-red-500' }[status] || 'border-slate-500/20 bg-slate-500/10 text-slate-500'; return <motion.article variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }} whileHover={{ x: 4, y: -2 }} className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-4 transition-shadow hover:shadow-lg sm:flex-row sm:items-center"><div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[var(--bg-surface)]">{food?.image ? <img src={food.image} alt={food.name || 'Ordered food'} className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center text-[var(--accent)]"><Utensils className="h-5 w-5" /></span>}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[var(--text-primary)]">{food?.name || 'Food order'}{order.foods?.length > 1 ? ` +${order.foods.length - 1}` : ''}</p><div className="mt-2 flex items-center gap-2">{chef?.photo ? <img src={chef.photo} alt="" className="h-5 w-5 rounded-full object-cover" /> : <UserRound className="h-4 w-4 text-[var(--text-muted)]" />}<span className="truncate text-xs text-[var(--text-secondary)]">{chef?.name || 'HomeBite Chef'}</span><span className="text-[10px] text-[var(--text-muted)]">· {dateTime(order.orderDate)}</span></div></div><div className="flex items-center justify-between gap-4 sm:block sm:text-right"><motion.span animate={{ opacity: [0.78, 1, 0.78] }} transition={{ duration: 2.6, repeat: Infinity }} className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${tone}`}>{statusLabel(status)}</motion.span><p className="mt-2 text-sm font-bold text-[var(--text-primary)]">{money(order.total)}</p></div></motion.article>; }

function timeAgo(value) { const seconds = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 1000)); if (seconds < 60) return 'Just now'; const minutes = Math.floor(seconds / 60); if (minutes < 60) return `${minutes}m ago`; const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours}h ago`; const days = Math.floor(hours / 24); return `${days}d ago`; }
function RecentNotification({ notification }) { const Icon = notification.type === 'order' ? ShoppingBag : notification.type === 'review' ? Star : notification.type === 'chef-application' ? ChefHat : Bell; return <motion.article variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} whileHover={{ x: 3 }} className={`flex gap-3 rounded-2xl border p-4 transition ${notification.isRead ? 'border-[var(--border)] bg-[var(--bg-muted)]' : 'border-[var(--accent)]/20 bg-[var(--accent-soft)]'}`}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--accent)]"><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><p className="truncate text-sm font-semibold text-[var(--text-primary)]">{notification.title}</p>{!notification.isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" aria-label="Unread" />}</div><p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-secondary)]">{notification.message}</p><p className="mt-2 text-[10px] text-[var(--text-muted)]">{timeAgo(notification.createdAt)}</p></div></motion.article>; }
function QuickAction({ action, index }) { const Icon = action.icon; return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.055 }} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}><Link to={action.to} className="group relative flex h-full items-center gap-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-4 transition hover:border-[var(--accent)] hover:shadow-lg"><span className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[var(--accent-soft)] to-transparent transition-transform duration-300 group-hover:scale-x-100" /><motion.span whileHover={{ rotate: -8, scale: 1.1 }} className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon className="h-5 w-5" /></motion.span><span className="relative min-w-0 flex-1"><span className="block text-sm font-semibold text-[var(--text-primary)]">{action.label}</span><span className="mt-1 block text-xs text-[var(--text-muted)]">{action.description}</span></span><ArrowRight className="relative h-4 w-4 text-[var(--text-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--accent)]" /></Link></motion.div>; }
function EmptyState({ icon: Icon, text }) { return <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--bg-muted)] px-5 py-12 text-center"><Icon className="mx-auto h-8 w-8 text-[var(--accent)]" /><p className="mt-3 text-sm text-[var(--text-muted)]">{text}</p></div>; }
function Shimmer({ className }) { return <div className={`relative overflow-hidden rounded-[2rem] bg-[var(--bg-muted)] ${className}`}><motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" /></div>; }
function ChartsSkeleton() { return <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]" role="status" aria-label="Loading customer charts"><Shimmer className="h-[430px]" /><Shimmer className="h-[430px]" /></div>; }
function OverviewSkeleton() { return <div className="mx-auto max-w-[1550px] space-y-8" role="status" aria-label="Loading customer overview"><div className="space-y-3"><div className="h-4 w-28 animate-pulse rounded bg-[var(--bg-muted)]" /><div className="h-10 w-64 animate-pulse rounded bg-[var(--bg-muted)]" /></div><Shimmer className="h-64" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">{Array.from({ length: 6 }, (_, index) => <Shimmer key={index} className="h-48" />)}</div><ChartsSkeleton /><div className="grid gap-6 xl:grid-cols-2"><Shimmer className="h-96" /><Shimmer className="h-96" /></div></div>; }
