import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Banknote,
  CalendarDays,
  ChefHat,
  Clock3,
  HeartHandshake,
  MessageCircle,
  PackageCheck,
  Plus,
  RefreshCw,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  UserRound,
  UsersRound,
  Utensils
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { useAuth } from '../../providers/AuthProvider';
import { getChefFoods } from '../../services/foodsApi';
import { getChefOrders } from '../../services/ordersApi';
import { getChefReviews } from '../../services/reviewsApi';

const ChefOverviewCharts = lazy(() => import('../../components/dashboard/ChefOverviewCharts'));
const documentId = (value) => value?.$oid || value || '';
const money = (value) => new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(Number(value || 0));
const dateTime = (value) => new Intl.DateTimeFormat('en-BD', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
const normalizedStatus = (status) => String(status || 'pending').toLowerCase();
const statusLabel = (status) => normalizedStatus(status).replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

function dayStart(value) { const date = new Date(value); date.setHours(0, 0, 0, 0); return date; }
function isSameDay(first, second) { return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate(); }
function isSameMonth(first, second) { return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth(); }
function percentChange(current, previous) { if (!previous) return current ? 100 : 0; return Math.round(((current - previous) / previous) * 100); }

const statDefinitions = [
  { key: 'todayOrders', label: "Today's Orders", icon: CalendarDays, tone: 'from-blue-500/15 to-cyan-500/5 text-blue-500', spark: 'orderSparkline' },
  { key: 'pending', label: 'Pending Orders', icon: Clock3, tone: 'from-amber-500/15 to-orange-500/5 text-amber-500', spark: 'orderSparkline' },
  { key: 'preparing', label: 'Preparing Orders', icon: ChefHat, tone: 'from-violet-500/15 to-purple-500/5 text-violet-500', spark: 'orderSparkline' },
  { key: 'delivered', label: 'Delivered Orders', icon: PackageCheck, tone: 'from-emerald-500/15 to-green-500/5 text-emerald-500', spark: 'orderSparkline' },
  { key: 'todayRevenue', label: "Today's Revenue", icon: Banknote, money: true, tone: 'from-rose-500/15 to-pink-500/5 text-rose-500', spark: 'revenueSparkline' },
  { key: 'monthlyRevenue', label: 'Monthly Revenue', icon: CalendarDays, money: true, tone: 'from-orange-500/15 to-amber-500/5 text-orange-500', spark: 'revenueSparkline' },
  { key: 'activeFoods', label: 'Active Foods', icon: Utensils, tone: 'from-teal-500/15 to-cyan-500/5 text-teal-500', spark: 'foodSparkline' },
  { key: 'averageRating', label: 'Average Rating', icon: Star, decimal: true, tone: 'from-yellow-500/15 to-amber-500/5 text-amber-500', spark: 'ratingSparkline' },
  { key: 'totalCustomers', label: 'Total Customers', icon: UsersRound, tone: 'from-indigo-500/15 to-blue-500/5 text-indigo-500', spark: 'customerSparkline' },
  { key: 'repeatCustomers', label: 'Repeat Customers', icon: HeartHandshake, tone: 'from-pink-500/15 to-rose-500/5 text-pink-500', spark: 'customerSparkline' }
];

const quickActions = [
  { label: 'Add New Food', description: 'Publish a fresh meal', to: '/dashboard/chef/add-food', icon: Plus },
  { label: 'Manage Foods', description: 'Update your menu', to: '/dashboard/chef/manage-foods', icon: Utensils },
  { label: 'Open Messages', description: 'Reply to customers', to: '/dashboard/messages', icon: MessageCircle },
  { label: 'Manage Orders', description: 'Update kitchen progress', to: '/dashboard/chef/orders', icon: PackageCheck },
  { label: 'Availability', description: 'Set your working hours', to: '/dashboard/chef/availability', icon: Clock3 },
  { label: 'Profile', description: 'Review your chef profile', to: '/dashboard/profile', icon: UserRound }
];

export default function ChefOverview() {
  const { user, dbUser } = useAuth();
  const email = (dbUser?.email || user?.email || '').trim().toLowerCase();
  const chefName = dbUser?.name || user?.displayName || 'Chef';
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    if (!email) return undefined;
    setLoading(true);
    setError('');
    Promise.all([getChefOrders(email), getChefReviews(email), getChefFoods(email)])
      .then(([ordersResponse, reviewsResponse, foodsResponse]) => {
        if (!active) return;
        setOrders(ordersResponse.data.data || []);
        setReviews(reviewsResponse.data.data || []);
        setFoods(foodsResponse.data.data || []);
      })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || 'Unable to load your overview.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [email, reloadKey]);

  const stats = useMemo(() => {
    const now = new Date();
    const today = dayStart(now);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const paidDelivered = orders.filter((order) => normalizedStatus(order.status) === 'delivered' && order.paymentStatus === 'paid');
    const todayOrders = orders.filter((order) => isSameDay(new Date(order.orderDate), now));
    const yesterdayOrders = orders.filter((order) => isSameDay(new Date(order.orderDate), yesterday));
    const todayRevenue = paidDelivered.filter((order) => isSameDay(new Date(order.orderDate), now)).reduce((sum, order) => sum + Number(order.total || 0), 0);
    const yesterdayRevenue = paidDelivered.filter((order) => isSameDay(new Date(order.orderDate), yesterday)).reduce((sum, order) => sum + Number(order.total || 0), 0);
    const monthlyRevenue = paidDelivered.filter((order) => isSameMonth(new Date(order.orderDate), now)).reduce((sum, order) => sum + Number(order.total || 0), 0);
    const previousMonthRevenue = paidDelivered.filter((order) => { const date = new Date(order.orderDate); return date >= previousMonthStart && date < monthStart; }).reduce((sum, order) => sum + Number(order.total || 0), 0);
    const customerCounts = new Map();
    orders.forEach((order) => { const customer = order.customer?.email?.toLowerCase(); if (customer) customerCounts.set(customer, (customerCounts.get(customer) || 0) + 1); });
    const lastSeven = Array.from({ length: 7 }, (_, index) => { const date = new Date(today); date.setDate(date.getDate() - (6 - index)); const next = new Date(date); next.setDate(next.getDate() + 1); const dailyOrders = orders.filter((order) => new Date(order.orderDate) >= date && new Date(order.orderDate) < next); return { orders: dailyOrders.length, revenue: dailyOrders.filter((order) => normalizedStatus(order.status) === 'delivered' && order.paymentStatus === 'paid').reduce((sum, order) => sum + Number(order.total || 0), 0), customers: new Set(dailyOrders.map((order) => order.customer?.email).filter(Boolean)).size }; });
    const averageRating = reviews.length ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length : 0;
    return {
      todayOrders: todayOrders.length,
      pending: orders.filter((order) => normalizedStatus(order.status) === 'pending').length,
      preparing: orders.filter((order) => normalizedStatus(order.status) === 'preparing').length,
      delivered: orders.filter((order) => normalizedStatus(order.status) === 'delivered').length,
      todayRevenue,
      monthlyRevenue,
      activeFoods: foods.filter((food) => food.status === 'active').length,
      averageRating,
      totalCustomers: customerCounts.size,
      repeatCustomers: [...customerCounts.values()].filter((count) => count > 1).length,
      todayOrderChange: percentChange(todayOrders.length, yesterdayOrders.length),
      todayRevenueChange: percentChange(todayRevenue, yesterdayRevenue),
      monthlyRevenueChange: percentChange(monthlyRevenue, previousMonthRevenue),
      orderSparkline: lastSeven.map((item) => item.orders),
      revenueSparkline: lastSeven.map((item) => item.revenue),
      customerSparkline: lastSeven.map((item) => item.customers),
      foodSparkline: foods.slice(0, 7).map((food) => Number(food.orderCount || 0)),
      ratingSparkline: reviews.slice(0, 7).reverse().map((review) => Number(review.rating || 0))
    };
  }, [foods, orders, reviews]);

  const recentOrders = orders.slice(0, 5);
  const recentReviews = reviews.slice(0, 5);
  const foodMap = useMemo(() => new Map(foods.map((food) => [documentId(food._id), food])), [foods]);

  if (loading) return <OverviewSkeleton />;

  return (
    <div className="mx-auto max-w-[1600px] space-y-8">
      <DashboardHeader title="Chef Overview" description="Keep an eye on today's kitchen activity, revenue, orders, and recent customer feedback." />

      <WelcomeBanner chefName={chefName} stats={stats} />

      {error && <div role="alert" className="flex flex-col gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-red-500">{error}</p><button type="button" onClick={() => setReloadKey((value) => value + 1)} className="inline-flex items-center gap-2 self-start rounded-full border border-red-500/20 px-4 py-2 text-sm font-semibold text-red-500"><RefreshCw className="h-4 w-4" /> Retry</button></div>}

      <motion.section initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045 } } }} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statDefinitions.map((item) => <StatCard key={item.key} item={item} value={stats[item.key]} stats={stats} />)}
      </motion.section>

      <Suspense fallback={<ChartsLoading />}><ChefOverviewCharts orders={orders} reviews={reviews} /></Suspense>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <Panel title="Recent Orders" subtitle="Latest five orders" icon={PackageCheck} action={<Link to="/dashboard/chef/orders" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)]">View all <ArrowRight className="h-3.5 w-3.5" /></Link>}>
          {recentOrders.length ? <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }} className="space-y-3">{recentOrders.map((order) => <OrderRow key={documentId(order._id)} order={order} />)}</motion.div> : <EmptyPanel icon={PackageCheck} text="No orders have arrived yet." />}
        </Panel>
        <Panel title="Recent Reviews" subtitle="Latest five customer reviews" icon={Star} action={<Link to="/dashboard/chef/reviews" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)]">View all <ArrowRight className="h-3.5 w-3.5" /></Link>}>
          {recentReviews.length ? <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }} className="space-y-3">{recentReviews.map((review) => <ReviewRow key={documentId(review._id)} review={review} food={foodMap.get(documentId(review.foodIds?.[0]))} />)}</motion.div> : <EmptyPanel icon={Star} text="No customer reviews yet." />}
        </Panel>
      </section>

      <Panel title="Quick Actions" subtitle="Common chef tasks" icon={ArrowRight}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{quickActions.map((action, index) => <QuickAction key={action.label} action={action} index={index} />)}</div>
      </Panel>
    </div>
  );
}

function WelcomeBanner({ chefName, stats }) {
  const reduceMotion = useReducedMotion();
  const revenueUp = stats.todayRevenueChange >= 0;
  return <motion.section initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="group relative isolate overflow-hidden rounded-[2.25rem] border border-white/15 bg-gradient-to-br from-orange-500 via-orange-500 to-rose-500 p-6 text-white shadow-[0_30px_90px_rgba(249,115,22,0.24)] sm:p-8 lg:p-10"><motion.div animate={reduceMotion ? {} : { x: [0, 18, 0], y: [0, -10, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" /><motion.div animate={reduceMotion ? {} : { x: [0, -16, 0], y: [0, 14, 0] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-28 right-10 h-80 w-80 rounded-full bg-pink-300/20 blur-3xl" /><div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.18),transparent_28%)]" /><div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_320px]"><div><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-white/75"><Sparkles className="h-4 w-4" /> Kitchen command center</motion.p><motion.h2 initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Welcome back, Chef {chefName}</motion.h2><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4 space-y-1"><p className="text-sm text-white/85 sm:text-base">Today you have <strong className="text-white">{stats.pending} new {stats.pending === 1 ? 'order' : 'orders'}</strong> waiting.</p><p className="flex flex-wrap items-center gap-1.5 text-sm text-white/80">Today&apos;s revenue {revenueUp ? 'increased' : 'changed'} by <strong className="text-white">{Math.abs(stats.todayRevenueChange)}%</strong>{revenueUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />} Keep serving amazing meals!</p></motion.div><Link to="/dashboard/chef/orders" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-orange-600 shadow-xl transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-white/30">Review orders <ArrowRight className="h-4 w-4" /></Link></div><ChefKitchenArt reduceMotion={reduceMotion} /></div></motion.section>;
}

function ChefKitchenArt({ reduceMotion }) {
  return <div className="relative hidden h-52 lg:block" aria-hidden="true"><motion.div animate={reduceMotion ? {} : { y: [0, -8, 0], rotate: [0, 2, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-x-7 bottom-0 top-2 rounded-[2rem] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md"><svg viewBox="0 0 260 190" className="h-full w-full"><path d="M45 142c16-39 47-62 85-62s69 23 85 62" fill="rgba(255,255,255,.17)" stroke="rgba(255,255,255,.55)" strokeWidth="3"/><path d="M72 79c0-29 24-52 54-52 17 0 32 7 42 18 4-2 9-3 14-3 17 0 30 13 30 29 0 15-11 27-26 29H88C79 96 72 89 72 79Z" fill="rgba(255,255,255,.9)"/><path d="M112 98v35m36-35v35" stroke="#fb7185" strokeWidth="5" strokeLinecap="round"/><circle cx="116" cy="67" r="4" fill="#f97316"/><circle cx="150" cy="67" r="4" fill="#f97316"/><path d="M119 81c8 7 20 7 28 0" stroke="#f97316" strokeWidth="4" strokeLinecap="round" fill="none"/><path d="M39 152h182" stroke="white" strokeWidth="4" strokeLinecap="round"/></svg></motion.div><motion.span animate={reduceMotion ? {} : { y: [0, -10, 0], rotate: [-8, 5, -8] }} transition={{ duration: 4.5, repeat: Infinity }} className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur"><Utensils className="h-6 w-6 text-white" /></motion.span><motion.span animate={reduceMotion ? {} : { y: [0, 9, 0], rotate: [6, -5, 6] }} transition={{ duration: 5.5, repeat: Infinity }} className="absolute bottom-2 left-0 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-yellow-300/20 backdrop-blur"><Star className="h-5 w-5 fill-white text-white" /></motion.span></div>;
}

function comparisonFor(item, stats, value) {
  if (item.key === 'todayOrders') return { value: stats.todayOrderChange, label: 'vs yesterday' };
  if (item.key === 'todayRevenue') return { value: stats.todayRevenueChange, label: 'vs yesterday' };
  if (item.key === 'monthlyRevenue') return { value: stats.monthlyRevenueChange, label: 'vs last month' };
  if (item.key === 'pending') return { text: value ? 'Needs attention' : 'All caught up' };
  if (item.key === 'preparing') return { text: value ? 'In the kitchen' : 'Kitchen clear' };
  if (item.key === 'delivered') return { text: 'Lifetime completed' };
  if (item.key === 'activeFoods') return { text: 'Published menu items' };
  if (item.key === 'averageRating') return { text: `${stats.ratingSparkline.length} recent ratings` };
  if (item.key === 'totalCustomers') return { text: 'Unique customers' };
  return { text: `${stats.totalCustomers ? Math.round((value / stats.totalCustomers) * 100) : 0}% return rate` };
}

function StatCard({ item, value, stats }) {
  const Icon = item.icon;
  const comparison = comparisonFor(item, stats, value);
  const positive = comparison.value >= 0;
  return <motion.article variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -6, scale: 1.01 }} transition={{ type: 'spring', stiffness: 280, damping: 24 }} title={`${item.label}: ${item.money ? money(value) : item.decimal ? Number(value).toFixed(1) : value}`} className="group relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5 before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[var(--accent)] before:to-transparent before:opacity-0 before:transition group-hover:before:opacity-80"><div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--accent-soft)] opacity-0 blur-2xl transition group-hover:opacity-60" /><div className="relative flex items-start justify-between gap-4"><motion.span whileHover={{ rotate: -8, scale: 1.08 }} className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tone}`}><Icon className="h-5 w-5" /></motion.span><MiniSparkline values={stats[item.spark]} /></div><p className="relative mt-5 text-3xl font-bold tracking-tight text-[var(--text-primary)]"><AnimatedNumber value={value} moneyValue={item.money} decimal={item.decimal} /></p><p className="relative mt-1 text-sm text-[var(--text-secondary)]">{item.label}</p><div className="relative mt-4 flex min-h-5 items-center gap-1.5 text-[10px] font-semibold">{comparison.value !== undefined ? <><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${positive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{Math.abs(comparison.value)}%</span><span className="text-[var(--text-muted)]">{comparison.label}</span></> : <span className="text-[var(--text-muted)]">{comparison.text}</span>}</div></motion.article>;
}

function AnimatedNumber({ value, moneyValue, decimal }) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? Number(value || 0) : 0);
  useEffect(() => {
    if (reduceMotion) { setDisplay(Number(value || 0)); return undefined; }
    const target = Number(value || 0); const start = performance.now(); let frame;
    const tick = (time) => { const progress = Math.min((time - start) / 750, 1); const eased = 1 - (1 - progress) ** 3; setDisplay(target * eased); if (progress < 1) frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [reduceMotion, value]);
  if (moneyValue) return money(display);
  if (decimal) return display.toFixed(1);
  return Math.round(display).toLocaleString('en-BD');
}

function MiniSparkline({ values = [] }) {
  const safe = values.length > 1 ? values : [0, 0]; const max = Math.max(...safe, 1); const min = Math.min(...safe); const span = Math.max(max - min, 1); const points = safe.map((value, index) => `${(index / (safe.length - 1)) * 58 + 2},${24 - ((value - min) / span) * 19}`).join(' ');
  return <svg viewBox="0 0 62 28" className="h-8 w-16 overflow-visible" aria-hidden="true"><defs><linearGradient id={`spark-${points.length}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity=".3"/><stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/></linearGradient></defs><polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/><polygon points={`2,27 ${points} 60,27`} fill={`url(#spark-${points.length})`} /></svg>;
}

function Panel({ title, subtitle, icon: Icon, action, children }) { return <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }} transition={{ duration: 0.45 }} className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5 sm:p-6"><div className="mb-5 flex items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon className="h-5 w-5" /></span><div><h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2><p className="text-xs text-[var(--text-muted)]">{subtitle}</p></div></div>{action}</div>{children}</motion.section>; }

function OrderRow({ order }) {
  const foods = (order.foods || []).map((food) => food.name).filter(Boolean).join(', '); const status = normalizedStatus(order.status); const tone = { pending: 'border-amber-500/20 bg-amber-500/10 text-amber-500', preparing: 'border-violet-500/20 bg-violet-500/10 text-violet-500', delivered: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500' }[status] || 'border-blue-500/20 bg-blue-500/10 text-blue-500';
  return <motion.div variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }} whileHover={{ x: 4, y: -2 }} className="group flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-4 transition-shadow hover:shadow-lg sm:flex-row sm:items-center"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--bg-surface)] text-[var(--accent)]"><PackageCheck className="h-5 w-5" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold text-[var(--text-primary)]">#{documentId(order._id).slice(-8).toUpperCase()}</p><motion.span animate={{ opacity: [0.78, 1, 0.78] }} transition={{ duration: 2.5, repeat: Infinity }} className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${tone}`}>{statusLabel(status)}</motion.span></div><p className="mt-2 truncate text-xs text-[var(--text-secondary)]">{order.customer?.name || order.customer?.email || 'Customer'} · {foods || 'Food order'}</p><p className="mt-1 text-[10px] text-[var(--text-muted)]">{dateTime(order.orderDate)}</p></div><p className="shrink-0 text-sm font-bold text-[var(--text-primary)]">{money(order.total)}</p></motion.div>;
}

function ReviewRow({ review, food }) {
  return <motion.article variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -3 }} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-4 transition-shadow hover:shadow-lg"><div className="flex items-start gap-3">{review.customer?.photo ? <img src={review.customer.photo} alt={review.customer.name || 'Customer'} className="h-10 w-10 rounded-full object-cover" /> : <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]"><UserRound className="h-4 w-4" /></span>}<div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><p className="truncate text-sm font-semibold text-[var(--text-primary)]">{review.customer?.name || 'HomeBite Customer'}</p><p className="mt-1 text-[10px] text-[var(--text-muted)]">{dateTime(review.date)}</p></div>{food?.thumbnail && <img src={food.thumbnail} alt="" className="h-10 w-10 rounded-xl object-cover" />}</div><div className="mt-2 flex" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <motion.span key={index} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.06 }}><Star className={`h-3.5 w-3.5 ${index < review.rating ? 'fill-amber-400 text-amber-400' : 'text-[var(--text-muted)]'}`} /></motion.span>)}</div></div></div><p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">{review.comment}</p></motion.article>;
}

function QuickAction({ action, index }) {
  const Icon = action.icon;
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.045 }} whileHover={{ y: -4 }} whileTap={{ scale: 0.985 }}><Link to={action.to} className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-4 transition hover:border-[var(--accent)] hover:shadow-lg"><span className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[var(--accent-soft)] to-transparent transition-transform duration-300 group-hover:scale-x-100" /><motion.span whileHover={{ rotate: -8, scale: 1.1 }} className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon className="h-5 w-5" /></motion.span><span className="relative min-w-0 flex-1"><span className="block text-sm font-semibold text-[var(--text-primary)]">{action.label}</span><span className="mt-1 block text-xs text-[var(--text-muted)]">{action.description}</span></span><ArrowRight className="relative h-4 w-4 text-[var(--text-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--accent)]" /></Link></motion.div>;
}

function EmptyPanel({ icon: Icon, text }) { return <div className="relative overflow-hidden rounded-3xl border border-dashed border-[var(--border)] bg-[var(--bg-muted)] px-5 py-12 text-center"><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-soft),transparent_60%)] opacity-40" /><motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-surface)] text-[var(--accent)] shadow"><Icon className="h-7 w-7" /></motion.span><p className="relative mt-4 text-sm text-[var(--text-muted)]">{text}</p></div>; }
function ChartsLoading() { return <section className="space-y-6" role="status" aria-label="Loading performance charts"><div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]"><Shimmer className="h-[420px]" /><Shimmer className="h-[420px]" /></div><div className="grid gap-6 xl:grid-cols-2"><Shimmer className="h-[410px]" /><Shimmer className="h-[410px]" /></div><div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]"><Shimmer className="h-[390px]" /><Shimmer className="h-[390px]" /></div></section>; }
function Shimmer({ className }) { return <div className={`relative overflow-hidden rounded-[2rem] bg-[var(--bg-muted)] ${className}`}><motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }} className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" /></div>; }
function OverviewSkeleton() { return <div className="mx-auto max-w-[1600px] space-y-8" role="status" aria-label="Loading chef overview"><div className="space-y-3"><div className="h-4 w-28 animate-pulse rounded bg-[var(--bg-muted)]" /><div className="h-10 w-64 animate-pulse rounded bg-[var(--bg-muted)]" /></div><Shimmer className="h-64" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{Array.from({ length: 10 }, (_, index) => <Shimmer key={index} className="h-48" />)}</div><ChartsLoading /><div className="grid gap-6 xl:grid-cols-2"><Shimmer className="h-96" /><Shimmer className="h-96" /></div></div>; }
