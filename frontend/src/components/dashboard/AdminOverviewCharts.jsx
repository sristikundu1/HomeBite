import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3, CircleDollarSign, PackageSearch, UsersRound } from 'lucide-react';

const statusColors = ['#f59e0b', '#3b82f6', '#8b5cf6', '#06b6d4', '#f97316', '#10b981', '#ef4444'];
const money = (value) => new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', notation: 'compact', maximumFractionDigits: 1 }).format(Number(value || 0));
const label = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function AdminOverviewCharts({ charts }) {
  const revenue = useMemo(() => (charts.monthlyRevenue || []).map((item) => ({ ...item, revenue: item.value })), [charts.monthlyRevenue]);
  const growth = useMemo(() => (charts.userGrowth || []).map((item) => ({ ...item, users: item.value })), [charts.userGrowth]);
  const statuses = useMemo(() => (charts.ordersByStatus || []).map((item) => ({ ...item, name: label(item.status) })), [charts.ordersByStatus]);

  return <section className="grid gap-6 xl:grid-cols-2" aria-label="Admin analytics charts">
    <ChartCard title="Monthly Revenue" subtitle="Paid order revenue over the last 12 months" icon={CircleDollarSign}>
      <ResponsiveContainer width="100%" height="100%"><LineChart data={revenue} margin={{ top: 12, right: 10, left: 0, bottom: 0 }}><defs><linearGradient id="adminRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f97316" stopOpacity="0.35"/><stop offset="100%" stopColor="#f97316" stopOpacity="0"/></linearGradient></defs><CartesianGrid stroke="var(--border)" strokeDasharray="4 5" vertical={false}/><XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false}/><YAxis tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(value) => money(value)}/><Tooltip content={<AdminTooltip formatter={money} />} /><Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={{ r: 3, fill: '#f97316' }} activeDot={{ r: 6 }} animationDuration={1000}/></LineChart></ResponsiveContainer>
    </ChartCard>
    <ChartCard title="Orders by Status" subtitle="Distribution across the complete order lifecycle" icon={PackageSearch}>
      <div className="grid h-full items-center gap-4 sm:grid-cols-[1fr_180px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statuses} dataKey="count" nameKey="name" innerRadius="48%" outerRadius="78%" paddingAngle={4} animationDuration={950}>{statuses.map((item, index) => <Cell key={item.status} fill={statusColors[index % statusColors.length]} />)}</Pie><Tooltip content={<AdminTooltip />} /></PieChart></ResponsiveContainer><div className="space-y-2">{statuses.map((item, index) => <div key={item.status} className="flex items-center justify-between gap-3 text-xs"><span className="flex min-w-0 items-center gap-2 text-[var(--text-secondary)]"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: statusColors[index % statusColors.length] }} /><span className="truncate">{item.name}</span></span><strong className="text-[var(--text-primary)]">{item.count}</strong></div>)}</div></div>
    </ChartCard>
    <ChartCard title="User Growth" subtitle="New customer, chef, and admin registrations" icon={UsersRound}>
      <ResponsiveContainer width="100%" height="100%"><BarChart data={growth} margin={{ top: 12, right: 10, left: -12, bottom: 0 }}><CartesianGrid stroke="var(--border)" strokeDasharray="4 5" vertical={false}/><XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false}/><YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false}/><Tooltip content={<AdminTooltip />} /><Bar dataKey="users" fill="#8b5cf6" radius={[8, 8, 0, 0]} animationDuration={1000}/></BarChart></ResponsiveContainer>
    </ChartCard>
    <ChartCard title="Top Categories" subtitle="Most represented active food categories" icon={BarChart3}>
      <ResponsiveContainer width="100%" height="100%"><BarChart data={charts.topCategories || []} layout="vertical" margin={{ top: 8, right: 15, left: 15, bottom: 0 }}><CartesianGrid stroke="var(--border)" strokeDasharray="4 5" horizontal={false}/><XAxis type="number" allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false}/><YAxis type="category" dataKey="category" width={90} tick={axisTick} axisLine={false} tickLine={false}/><Tooltip content={<AdminTooltip />} /><Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]} animationDuration={1000}/></BarChart></ResponsiveContainer>
    </ChartCard>
  </section>;
}

const axisTick = { fill: 'var(--text-muted)', fontSize: 11 };
function ChartCard({ title, subtitle, icon: Icon, children }) { return <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5 sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon className="h-5 w-5" /></span><div><h2 className="font-semibold text-[var(--text-primary)]">{title}</h2><p className="mt-1 text-xs text-[var(--text-muted)]">{subtitle}</p></div></div><div className="h-[310px]">{children}</div></article>; }
function AdminTooltip({ active, payload, label: tooltipLabel, formatter }) { if (!active || !payload?.length) return null; return <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 shadow-xl"><p className="text-xs font-semibold text-[var(--text-primary)]">{tooltipLabel || payload[0]?.name}</p><p className="mt-1 text-xs text-[var(--accent)]">{formatter ? formatter(payload[0].value) : payload[0].value}</p></div>; }
