import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import {
  Area,
  ComposedChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { CircleDollarSign, PackageSearch } from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';

const normalizeStatus = (value) => String(value || 'pending').trim().toLowerCase().replace(/[\s_]+/g, '-');
const money = (value) => new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(Number(value || 0));
const STATUS_COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#06b6d4', '#f97316', '#10b981', '#ef4444'];

function startOfDay(value) { const date = new Date(value); date.setHours(0, 0, 0, 0); return date; }

function spendingData(orders, range) {
  const now = new Date();
  const paid = orders.filter((order) => String(order.paymentStatus).toLowerCase() === 'paid');
  if (range === '12m') {
    return Array.from({ length: 12 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
      return {
        label: new Intl.DateTimeFormat('en', { month: 'short' }).format(date),
        value: paid.filter((order) => { const orderDate = new Date(order.orderDate); return orderDate.getFullYear() === date.getFullYear() && orderDate.getMonth() === date.getMonth(); }).reduce((sum, order) => sum + Number(order.total || 0), 0)
      };
    });
  }
  const days = range === '30d' ? 30 : 7;
  return Array.from({ length: days }, (_, index) => {
    const date = startOfDay(new Date()); date.setDate(date.getDate() - (days - 1 - index));
    const next = new Date(date); next.setDate(next.getDate() + 1);
    return { label: new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date), value: paid.filter((order) => new Date(order.orderDate) >= date && new Date(order.orderDate) < next).reduce((sum, order) => sum + Number(order.total || 0), 0) };
  });
}

function orderStatusData(orders) {
  const statuses = [['pending', 'Pending'], ['accepted', 'Confirmed'], ['preparing', 'Preparing'], ['ready', 'Ready'], ['out-for-delivery', 'Out For Delivery'], ['delivered', 'Delivered'], ['rejected', 'Cancelled']];
  return statuses.map(([status, name]) => ({ name, value: orders.filter((order) => normalizeStatus(order.status) === status).length }));
}

function CustomTooltip({ active, payload, label, moneyValue = false }) {
  if (!active || !payload?.length) return null;
  return <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 shadow-xl"><p className="text-xs font-semibold text-[var(--text-primary)]">{label || payload[0]?.payload?.name}</p><p className="mt-1 text-xs font-bold text-[var(--accent)]">{moneyValue ? money(payload[0].value) : payload[0].value}</p></div>;
}

function ChartCard({ title, description, icon: Icon, controls, children }) {
  return <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }} className="min-w-0 rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5 sm:p-6"><div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon className="h-5 w-5" /></span><div><h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2><p className="mt-1 text-xs text-[var(--text-muted)]">{description}</p></div></div>{controls}</div>{children}</motion.section>;
}

export default function CustomerOverviewCharts({ orders }) {
  const { isDark } = useTheme();
  const [range, setRange] = useState('7d');
  const spending = useMemo(() => spendingData(orders, range), [orders, range]);
  const statuses = useMemo(() => orderStatusData(orders), [orders]);
  const grid = isDark ? 'rgba(148,163,184,0.12)' : 'rgba(148,163,184,0.18)';
  const axis = isDark ? '#94a3b8' : '#64748b';

  return <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]" aria-label="Customer order charts">
    <ChartCard title="Monthly Spending" description="Your paid order spending over time" icon={CircleDollarSign} controls={<div className="flex rounded-full bg-[var(--bg-muted)] p-1">{[['7d', '7 Days'], ['30d', '30 Days'], ['12m', '12 Months']].map(([value, label]) => <button key={value} type="button" onClick={() => setRange(value)} className={`rounded-full px-3 py-1.5 text-[10px] font-semibold transition ${range === value ? 'bg-[var(--bg-surface)] text-[var(--accent)] shadow' : 'text-[var(--text-muted)]'}`}>{label}</button>)}</div>}>
      <div className="h-[320px]" aria-label="Monthly spending line chart"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={spending} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}><defs><linearGradient id="customerSpending" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f97316" stopOpacity={0.4} /><stop offset="100%" stopColor="#f97316" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid stroke={grid} strokeDasharray="4 5" vertical={false} /><XAxis dataKey="label" stroke={axis} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} minTickGap={24} /><YAxis stroke={axis} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(value) => `${Math.round(value / 1000)}k`} /><Tooltip content={<CustomTooltip moneyValue />} /><Area type="monotone" dataKey="value" fill="url(#customerSpending)" stroke="none" animationDuration={950} /><Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: '#f97316', stroke: isDark ? '#181b24' : '#fff', strokeWidth: 3 }} animationDuration={1100} /></ComposedChart></ResponsiveContainer></div>
    </ChartCard>
    <ChartCard title="Order Status" description="Distribution across your order journey" icon={PackageSearch}>
      <div className="h-[275px]" aria-label="Order status pie chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statuses} dataKey="value" nameKey="name" innerRadius="48%" outerRadius="80%" paddingAngle={3} animationDuration={1000}>{statuses.map((item, index) => <Cell key={item.name} fill={STATUS_COLORS[index]} />)}</Pie><Tooltip content={<CustomTooltip />} /></PieChart></ResponsiveContainer></div>
      <div className="grid grid-cols-2 gap-2">{statuses.map((item, index) => <div key={item.name} className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[index] }} />{item.name} ({item.value})</div>)}</div>
    </ChartCard>
  </section>;
}
