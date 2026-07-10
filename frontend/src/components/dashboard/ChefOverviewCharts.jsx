import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { BarChart3, CircleDollarSign, Clock3, Star, TrendingUp, Utensils } from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';

const STATUS_COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#06b6d4', '#f97316', '#10b981', '#ef4444'];
const RATING_COLORS = ['#f59e0b', '#fb923c', '#f97316', '#f43f5e', '#94a3b8'];
const normalizeStatus = (value) => String(value || 'pending').trim().toLowerCase().replace(/[\s_]+/g, '-');
const paidDelivered = (order) => normalizeStatus(order.status) === 'delivered' && String(order.paymentStatus).toLowerCase() === 'paid';
const shortDate = (date) => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date);
const money = (value) => new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(Number(value || 0));

function dayStart(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function revenueTrend(orders, range) {
  const now = new Date();
  if (range === '12m') {
    return Array.from({ length: 12 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
      const value = orders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return paidDelivered(order) && orderDate.getFullYear() === date.getFullYear() && orderDate.getMonth() === date.getMonth();
      }).reduce((sum, order) => sum + Number(order.total || 0), 0);
      return { label: new Intl.DateTimeFormat('en', { month: 'short' }).format(date), value };
    });
  }
  const days = range === '30d' ? 30 : 7;
  return Array.from({ length: days }, (_, index) => {
    const date = dayStart(new Date());
    date.setDate(date.getDate() - (days - 1 - index));
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    const value = orders.filter((order) => paidDelivered(order) && new Date(order.orderDate) >= date && new Date(order.orderDate) < next).reduce((sum, order) => sum + Number(order.total || 0), 0);
    return { label: shortDate(date), value };
  });
}

function statusData(orders) {
  const statuses = [
    ['pending', 'Pending'], ['accepted', 'Accepted'], ['preparing', 'Preparing'], ['ready', 'Ready'],
    ['out-for-delivery', 'Out For Delivery'], ['delivered', 'Delivered'], ['rejected', 'Cancelled']
  ];
  return statuses.map(([status, name]) => ({ name, value: orders.filter((order) => normalizeStatus(order.status) === status).length }));
}

function topFoodData(orders) {
  const totals = new Map();
  orders.forEach((order) => (order.foods || []).forEach((food) => totals.set(food.name || 'Food item', (totals.get(food.name || 'Food item') || 0) + Number(food.quantity || 0))));
  return [...totals.entries()].map(([name, ordersCount]) => ({ name, orders: ordersCount })).sort((a, b) => b.orders - a.orders).slice(0, 5).reverse();
}

function monthlyData(orders) {
  const now = new Date();
  return Array.from({ length: 12 }, (_, month) => ({
    month: new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(now.getFullYear(), month, 1)),
    revenue: orders.filter((order) => {
      const date = new Date(order.orderDate);
      return paidDelivered(order) && date.getFullYear() === now.getFullYear() && date.getMonth() === month;
    }).reduce((sum, order) => sum + Number(order.total || 0), 0)
  }));
}

function weeklyData(orders) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = dayStart(new Date());
    date.setDate(date.getDate() - (6 - index));
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    return { day: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date), orders: orders.filter((order) => new Date(order.orderDate) >= date && new Date(order.orderDate) < next).length };
  });
}

function ratingData(reviews) {
  return [5, 4, 3, 2, 1].map((rating) => ({ name: `${rating} star`, value: reviews.filter((review) => Number(review.rating) === rating).length, rating }));
}

function ChartTooltip({ active, payload, label, moneyValue = false }) {
  if (!active || !payload?.length) return null;
  return <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 shadow-xl"><p className="text-xs font-semibold text-[var(--text-primary)]">{label || payload[0]?.payload?.name}</p><p className="mt-1 text-xs text-[var(--accent)]">{moneyValue ? money(payload[0].value) : payload[0].value}</p></div>;
}

function ChartCard({ title, subtitle, icon: Icon, controls, children, className = '' }) {
  return <motion.section initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }} transition={{ duration: 0.45 }} className={`min-w-0 rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5 sm:p-6 ${className}`}><div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon className="h-5 w-5" /></span><div><h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2><p className="mt-1 text-xs text-[var(--text-muted)]">{subtitle}</p></div></div>{controls}</div>{children}</motion.section>;
}

function EmptyChart({ text }) {
  return <div className="flex h-[280px] items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-muted)]"><p className="text-sm text-[var(--text-muted)]">{text}</p></div>;
}

export default function ChefOverviewCharts({ orders, reviews }) {
  const { isDark } = useTheme();
  const [range, setRange] = useState('7d');
  const grid = isDark ? 'rgba(148,163,184,0.12)' : 'rgba(148,163,184,0.18)';
  const axis = isDark ? '#94a3b8' : '#64748b';
  const trends = useMemo(() => revenueTrend(orders, range), [orders, range]);
  const statuses = useMemo(() => statusData(orders), [orders]);
  const topFoods = useMemo(() => topFoodData(orders), [orders]);
  const monthly = useMemo(() => monthlyData(orders), [orders]);
  const weekly = useMemo(() => weeklyData(orders), [orders]);
  const ratings = useMemo(() => ratingData(reviews), [reviews]);

  return (
    <section className="space-y-6" aria-label="Chef performance charts">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <ChartCard title="Revenue Trend" subtitle="Paid revenue over time" icon={TrendingUp} controls={<div className="flex rounded-full bg-[var(--bg-muted)] p-1">{[['7d', '7 Days'], ['30d', '30 Days'], ['12m', '12 Months']].map(([value, label]) => <button key={value} type="button" onClick={() => setRange(value)} className={`rounded-full px-3 py-1.5 text-[10px] font-semibold transition ${range === value ? 'bg-[var(--bg-surface)] text-[var(--accent)] shadow' : 'text-[var(--text-muted)]'}`}>{label}</button>)}</div>}>
          <div className="h-[310px]" aria-label="Revenue trend line chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={trends} margin={{ top: 8, right: 10, bottom: 0, left: -20 }}><defs><linearGradient id="revenueLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#f43f5e" /></linearGradient></defs><CartesianGrid stroke={grid} strokeDasharray="4 5" vertical={false} /><XAxis dataKey="label" stroke={axis} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} minTickGap={24} /><YAxis stroke={axis} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(value) => `${Math.round(value / 1000)}k`} /><Tooltip content={<ChartTooltip moneyValue />} /><Line type="monotone" dataKey="value" stroke="url(#revenueLine)" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: '#f97316', strokeWidth: 3, stroke: isDark ? '#181b24' : '#fff' }} animationDuration={1100} /></LineChart></ResponsiveContainer></div>
        </ChartCard>
        <ChartCard title="Orders by Status" subtitle="Current order distribution" icon={Clock3}>
          <div className="h-[310px]" aria-label="Orders by status doughnut chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statuses} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="82%" paddingAngle={3} animationDuration={950}>{statuses.map((entry, index) => <Cell key={entry.name} fill={STATUS_COLORS[index]} />)}</Pie><Tooltip content={<ChartTooltip />} /></PieChart></ResponsiveContainer></div>
          <div className="grid grid-cols-2 gap-2">{statuses.map((item, index) => <div key={item.name} className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[index] }} />{item.name} ({item.value})</div>)}</div>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Top Selling Foods" subtitle="Highest ordered quantities" icon={Utensils}>{topFoods.length ? <div className="h-[310px]" aria-label="Top selling foods horizontal bar chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={topFoods} layout="vertical" margin={{ left: 12, right: 18 }}><CartesianGrid stroke={grid} strokeDasharray="4 5" horizontal={false} /><XAxis type="number" stroke={axis} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} /><YAxis type="category" dataKey="name" stroke={axis} width={112} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} /><Tooltip content={<ChartTooltip />} /><Bar dataKey="orders" fill="#f97316" radius={[0, 10, 10, 0]} animationDuration={1000} /></BarChart></ResponsiveContainer></div> : <EmptyChart text="Top foods appear after customers place orders." />}</ChartCard>
        <ChartCard title="Monthly Revenue" subtitle={`${new Date().getFullYear()} paid revenue`} icon={CircleDollarSign}><div className="h-[310px]" aria-label="Monthly revenue bar chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthly} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}><defs><linearGradient id="monthlyBars" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#f43f5e" /></linearGradient></defs><CartesianGrid stroke={grid} strokeDasharray="4 5" vertical={false} /><XAxis dataKey="month" stroke={axis} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} /><YAxis stroke={axis} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(value) => `${Math.round(value / 1000)}k`} /><Tooltip content={<ChartTooltip moneyValue />} /><Bar dataKey="revenue" fill="url(#monthlyBars)" radius={[8, 8, 0, 0]} animationDuration={1050} /></BarChart></ResponsiveContainer></div></ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
        <ChartCard title="Weekly Orders" subtitle="Order volume during the last seven days" icon={BarChart3}><div className="h-[290px]" aria-label="Weekly orders area chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={weekly} margin={{ top: 8, right: 10, bottom: 0, left: -26 }}><defs><linearGradient id="weeklyArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.48} /><stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.03} /></linearGradient></defs><CartesianGrid stroke={grid} strokeDasharray="4 5" vertical={false} /><XAxis dataKey="day" stroke={axis} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} /><YAxis stroke={axis} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} /><Tooltip content={<ChartTooltip />} /><Area type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={3} fill="url(#weeklyArea)" animationDuration={1050} /></AreaChart></ResponsiveContainer></div></ChartCard>
        <ChartCard title="Rating Distribution" subtitle="Customer ratings across all reviews" icon={Star}><div className="h-[250px]" aria-label="Rating distribution doughnut chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={ratings} dataKey="value" nameKey="name" innerRadius="52%" outerRadius="80%" paddingAngle={4} animationDuration={950}>{ratings.map((entry, index) => <Cell key={entry.name} fill={RATING_COLORS[index]} />)}</Pie><Tooltip content={<ChartTooltip />} /></PieChart></ResponsiveContainer></div><div className="space-y-2">{ratings.map((item, index) => <div key={item.rating} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-amber-400">{'★'.repeat(item.rating)}<span className="text-[var(--text-muted)]">{'☆'.repeat(5 - item.rating)}</span></span><span className="font-semibold text-[var(--text-secondary)]">{item.value}</span></div>)}</div></ChartCard>
      </div>
    </section>
  );
}

export function ChartsSkeleton() {
  return <section className="space-y-6" role="status" aria-label="Loading dashboard charts"><div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]"><div className="h-[410px] animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /><div className="h-[410px] animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /></div><div className="grid gap-6 xl:grid-cols-2"><div className="h-[410px] animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /><div className="h-[410px] animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /></div><div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]"><div className="h-[390px] animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /><div className="h-[390px] animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /></div></section>;
}
