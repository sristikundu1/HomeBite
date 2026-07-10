import { lazy, Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, CircleDollarSign, ReceiptText, RefreshCw, UserRound, Utensils } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { getAdminOverview } from '../../services/adminApi';

const AdminOverviewCharts = lazy(() => import('../../components/dashboard/AdminOverviewCharts'));
const money = (value) => new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(Number(value || 0));
const cards = [
  { key: 'totalRevenue', label: 'Total Revenue', icon: CircleDollarSign, money: true },
  { key: 'totalOrders', label: 'Total Orders', icon: ReceiptText },
  { key: 'customers', label: 'Customers', icon: UserRound },
  { key: 'chefs', label: 'Approved Chefs', icon: ChefHat },
  { key: 'totalFoods', label: 'Foods', icon: Utensils }
];

export default function AdminAnalytics() {
  const [data, setData] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [reload, setReload] = useState(0);
  useEffect(() => { let active = true; setLoading(true); setError(''); getAdminOverview().then((response) => { if (active) setData(response.data.data); }).catch((requestError) => { if (active) setError(requestError.response?.data?.message || 'Unable to load analytics.'); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [reload]);
  if (loading) return <AnalyticsSkeleton/>;
  return <div className="mx-auto max-w-[1600px] space-y-8"><DashboardHeader title="Admin Analytics" description="Historical revenue, orders, user growth, and marketplace distribution."/>{error && <div role="alert" className="flex items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-500">{error}<button type="button" onClick={() => setReload((value) => value + 1)}><RefreshCw className="h-4 w-4"/></button></div>}<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{cards.map((card, index) => { const Icon = card.icon; return <motion.article key={card.key} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon className="h-5 w-5"/></span><p className="mt-5 text-2xl font-bold text-[var(--text-primary)]">{card.money ? money(data?.stats?.[card.key]) : Number(data?.stats?.[card.key] || 0).toLocaleString()}</p><p className="mt-2 text-xs text-[var(--text-muted)]">{card.label}</p></motion.article>; })}</section><Suspense fallback={<ChartsSkeleton/>}><AdminOverviewCharts charts={data?.charts || {}}/></Suspense></div>;
}
function ChartsSkeleton() { return <div className="grid gap-6 xl:grid-cols-2">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-[400px] animate-pulse rounded-[2rem] bg-[var(--bg-muted)]"/>)}</div>; }
function AnalyticsSkeleton() { return <div className="mx-auto max-w-[1600px] space-y-8"><div className="h-16 w-72 animate-pulse rounded-2xl bg-[var(--bg-muted)]"/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-40 animate-pulse rounded-3xl bg-[var(--bg-muted)]"/>)}</div><ChartsSkeleton/></div>; }
