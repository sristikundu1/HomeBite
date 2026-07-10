import { motion } from 'framer-motion';
import {
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  PackageCheck,
  ReceiptText,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { useAuth } from '../../providers/AuthProvider';
import { getChefOrders } from '../../services/ordersApi';

const documentId = (value) => value?.$oid || value || '';
const normalizeStatus = (value) => String(value || 'pending').trim().toLowerCase().replace(/[\s_]+/g, '-');
const money = (value) => new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 2 }).format(Number(value || 0));
const dateTime = (value) => new Intl.DateTimeFormat('en-BD', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

function sameDay(first, second) {
  return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
}

function sameMonth(first, second) {
  return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth();
}

const cards = [
  { key: 'totalRevenue', label: 'Total Revenue', icon: Banknote, money: true, tone: 'from-orange-500/15 to-rose-500/5 text-orange-500' },
  { key: 'monthlyRevenue', label: 'This Month', icon: CalendarDays, money: true, tone: 'from-blue-500/15 to-cyan-500/5 text-blue-500' },
  { key: 'todayRevenue', label: "Today's Revenue", icon: TrendingUp, money: true, tone: 'from-violet-500/15 to-purple-500/5 text-violet-500' },
  { key: 'completedOrders', label: 'Completed Orders', icon: CheckCircle2, tone: 'from-emerald-500/15 to-green-500/5 text-emerald-500' },
  { key: 'pendingOrders', label: 'Pending Orders', icon: Clock3, tone: 'from-amber-500/15 to-yellow-500/5 text-amber-500' },
  { key: 'averageOrderValue', label: 'Average Order Value', icon: ReceiptText, money: true, tone: 'from-pink-500/15 to-rose-500/5 text-pink-500' }
];

export default function ChefRevenue() {
  const { user, dbUser } = useAuth();
  const email = (dbUser?.email || user?.email || '').trim().toLowerCase();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    if (!email) return undefined;
    setLoading(true);
    setError('');
    getChefOrders(email)
      .then((response) => { if (active) setOrders(response.data.data || []); })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || 'Unable to load revenue information.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [email, reloadKey]);

  const summary = useMemo(() => {
    const now = new Date();
    const completed = orders.filter((order) => normalizeStatus(order.status) === 'delivered' && String(order.paymentStatus).toLowerCase() === 'paid');
    const totalRevenue = completed.reduce((total, order) => total + Number(order.total || 0), 0);
    return {
      transactions: completed.slice(0, 8),
      totalRevenue,
      monthlyRevenue: completed.filter((order) => sameMonth(new Date(order.orderDate), now)).reduce((total, order) => total + Number(order.total || 0), 0),
      todayRevenue: completed.filter((order) => sameDay(new Date(order.orderDate), now)).reduce((total, order) => total + Number(order.total || 0), 0),
      completedOrders: completed.length,
      pendingOrders: orders.filter((order) => normalizeStatus(order.status) === 'pending').length,
      averageOrderValue: completed.length ? totalRevenue / completed.length : 0
    };
  }, [orders]);

  if (loading) return <RevenueSkeleton />;

  return (
    <div className="mx-auto max-w-[1500px] space-y-8">
      <DashboardHeader title="Revenue" description="Review completed-order earnings, pending activity, and your latest paid transactions." />

      {error && <div role="alert" className="flex flex-col gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-red-500">{error}</p><button type="button" onClick={() => setReloadKey((value) => value + 1)} className="inline-flex items-center gap-2 self-start rounded-full border border-red-500/20 px-4 py-2 text-sm font-semibold text-red-500"><RefreshCw className="h-4 w-4" /> Retry</button></div>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => <RevenueCard key={card.key} card={card} value={summary[card.key]} index={index} />)}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-lg shadow-black/5">
          <div className="flex items-center gap-3 border-b border-[var(--border)] p-5 sm:p-6"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><CreditCard className="h-5 w-5" /></span><div><h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Transactions</h2><p className="mt-1 text-xs text-[var(--text-muted)]">Latest paid, delivered orders</p></div></div>
          {summary.transactions.length ? <><div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[760px] text-left"><thead className="bg-[var(--bg-muted)] text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]"><tr><th className="px-5 py-4">Transaction</th><th className="px-5 py-4">Order</th><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Date</th><th className="px-5 py-4 text-right">Amount</th></tr></thead><tbody>{summary.transactions.map((order, index) => <TransactionRow key={documentId(order._id)} order={order} index={index} />)}</tbody></table></div><div className="space-y-3 p-4 md:hidden">{summary.transactions.map((order, index) => <TransactionCard key={documentId(order._id)} order={order} index={index} />)}</div></> : <EmptyTransactions />}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5 sm:p-6">
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><TrendingUp className="h-5 w-5" /></span><div><h2 className="text-lg font-semibold text-[var(--text-primary)]">Revenue by Month</h2><p className="mt-1 text-xs text-[var(--text-muted)]">Monthly performance overview</p></div></div>
          <div className="relative mt-8 h-72 overflow-hidden rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-muted)] p-5" aria-label="Revenue by month chart placeholder">
            <div className="absolute inset-x-5 top-1/4 border-t border-dashed border-[var(--border)]" /><div className="absolute inset-x-5 top-1/2 border-t border-dashed border-[var(--border)]" /><div className="absolute inset-x-5 top-3/4 border-t border-dashed border-[var(--border)]" />
            <div className="relative flex h-full items-end justify-between gap-2 opacity-45">{[38, 54, 45, 70, 62, 82].map((height, index) => <motion.div key={index} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: 0.6, delay: index * 0.06 }} className="w-full rounded-t-xl bg-gradient-to-t from-orange-500 to-rose-400" />)}</div>
            <div className="absolute inset-0 flex items-center justify-center"><span className="rounded-full border border-[var(--border)] bg-[var(--bg-surface)]/95 px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] shadow-lg backdrop-blur">Chart coming soon</span></div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function RevenueCard({ card, value, index }) {
  const Icon = card.icon;
  return <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -4 }} className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5"><div className="flex items-center justify-between gap-4"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.tone}`}><Icon className="h-5 w-5" /></span><span className="rounded-full bg-[var(--bg-muted)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">Live</span></div><p className="mt-6 break-words text-3xl font-bold text-[var(--text-primary)]">{card.money ? money(value) : value}</p><p className="mt-2 text-sm text-[var(--text-secondary)]">{card.label}</p></motion.article>;
}

function TransactionRow({ order, index }) {
  return <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.035 }} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-muted)]/60"><td className="px-5 py-4"><p className="max-w-36 truncate text-xs font-semibold text-[var(--text-primary)]" title={order.transactionId}>{order.transactionId || 'Stripe payment'}</p><span className="mt-1 inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-500">Paid</span></td><td className="px-5 py-4 text-xs font-semibold text-[var(--text-primary)]">#{documentId(order._id).slice(-8).toUpperCase()}</td><td className="px-5 py-4"><p className="max-w-32 truncate text-xs font-semibold text-[var(--text-primary)]">{order.customer?.name || 'Customer'}</p><p className="mt-1 max-w-32 truncate text-[10px] text-[var(--text-muted)]">{order.customer?.email}</p></td><td className="px-5 py-4 text-xs text-[var(--text-secondary)]">{dateTime(order.orderDate)}</td><td className="px-5 py-4 text-right text-sm font-bold text-[var(--text-primary)]">{money(order.total)}</td></motion.tr>;
}

function TransactionCard({ order, index }) {
  return <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold text-[var(--text-primary)]">#{documentId(order._id).slice(-8).toUpperCase()}</p><p className="mt-1 text-[10px] text-[var(--text-muted)]">{dateTime(order.orderDate)}</p></div><p className="text-sm font-bold text-[var(--text-primary)]">{money(order.total)}</p></div><div className="mt-4 flex items-center justify-between gap-3"><div className="min-w-0"><p className="truncate text-xs font-semibold text-[var(--text-secondary)]">{order.customer?.name || 'Customer'}</p><p className="mt-1 truncate text-[10px] text-[var(--text-muted)]">{order.transactionId || 'Stripe payment'}</p></div><span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[9px] font-bold uppercase text-emerald-500">Paid</span></div></motion.article>;
}

function EmptyTransactions() { return <div className="px-6 py-20 text-center"><PackageCheck className="mx-auto h-9 w-9 text-[var(--text-muted)]" /><h3 className="mt-4 text-base font-semibold text-[var(--text-primary)]">No completed transactions</h3><p className="mt-2 text-sm text-[var(--text-muted)]">Paid transactions appear after orders are delivered.</p></div>; }
function RevenueSkeleton() { return <div className="mx-auto max-w-[1500px] space-y-8" role="status" aria-label="Loading chef revenue"><div className="space-y-3"><div className="h-4 w-24 animate-pulse rounded bg-[var(--bg-muted)]" /><div className="h-10 w-52 animate-pulse rounded bg-[var(--bg-muted)]" /></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-40 animate-pulse rounded-[1.75rem] bg-[var(--bg-muted)]" />)}</div><div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]"><div className="h-[520px] animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /><div className="h-[420px] animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /></div></div>; }
