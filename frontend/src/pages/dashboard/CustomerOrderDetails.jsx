import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ChefHat,
  Clock3,
  ImageOff,
  MapPin,
  Package,
  ReceiptText,
  Radio,
  ShoppingBag,
  Timer,
  Truck,
  Utensils,
  Wifi,
  WifiOff,
  XCircle
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useParams } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { useAuth } from '../../providers/AuthProvider';
import { getOrder } from '../../services/ordersApi';
import useSocket from '../../hooks/useSocket';
import ReviewForm from '../../components/reviews/ReviewForm';

const TRACKING_STEPS = [
  { status: 'pending', label: 'Pending', icon: Clock3 },
  { status: 'accepted', label: 'Accepted', icon: CheckCircle2 },
  { status: 'preparing', label: 'Preparing', icon: Utensils },
  { status: 'ready', label: 'Ready', icon: Package },
  { status: 'out-for-delivery', label: 'Out For Delivery', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle2 }
];

function documentId(value) {
  return value?.$oid || value || '';
}

function normalizeStatus(status) {
  return String(status || 'pending').trim().toLowerCase().replace(/[\s_]+/g, '-');
}

function statusLabel(status) {
  if (normalizeStatus(status) === 'rejected') return 'Cancelled';
  return TRACKING_STEPS.find((step) => step.status === normalizeStatus(status))?.label || status;
}

function estimatedDelivery(order) {
  const status = normalizeStatus(order?.status);
  const estimates = {
    pending: { label: 'Awaiting confirmation', minutes: 15, detail: 'The chef will confirm your order shortly.' },
    accepted: { label: '45–60 minutes', minutes: 60, detail: 'Your order has been accepted.' },
    preparing: { label: '30–45 minutes', minutes: 45, detail: 'Your meal is being freshly prepared.' },
    ready: { label: '15–25 minutes', minutes: 25, detail: 'Your order is ready for delivery.' },
    'out-for-delivery': { label: '10–20 minutes', minutes: 20, detail: 'Your order is on the way.' },
    delivered: { label: 'Delivered', minutes: 0, detail: 'Your order has reached its destination.' },
    rejected: { label: 'Cancelled', minutes: 0, detail: 'This order will not proceed.' }
  };
  const estimate = estimates[status] || estimates.pending;
  if (!estimate.minutes) return estimate;
  const startedAt = new Date(order?.statusUpdatedAt || order?.orderDate || Date.now());
  const expectedAt = new Date(startedAt.getTime() + estimate.minutes * 60_000);
  return { ...estimate, expected: expectedAt > new Date() ? `Expected by ${new Intl.DateTimeFormat('en-BD', { hour: 'numeric', minute: '2-digit' }).format(expectedAt)}` : 'Updated estimate pending' };
}

function formatPrice(value) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 2
  }).format(value || 0);
}

function formatDate(value) {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-BD', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

export default function CustomerOrderDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { user, dbUser } = useAuth();
  const { socket, connected } = useSocket();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const customerEmail = (dbUser?.email || user?.email || '').toLowerCase();

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      try {
        const response = await getOrder(id);
        const fetchedOrder = response.data.data;

        if (customerEmail && fetchedOrder.customer?.email !== customerEmail) {
          throw new Error('Order not found.');
        }

        if (active) setOrder(fetchedOrder);
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || requestError.message || 'Failed to load order.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrder();
    return () => { active = false; };
  }, [id, customerEmail]);

  useEffect(() => {
    function joinOrder() {
      socket.emit('join-order', id);
    }

    function handleStatusUpdate(update) {
      if (update.orderId !== id) return;

      setOrder((current) => current ? {
        ...current,
        status: update.status,
        statusUpdatedAt: update.statusUpdatedAt
      } : current);
      toast.success(`Order status updated: ${statusLabel(update.status)}.`);
    }

    socket.on('connect', joinOrder);
    socket.on('order-status-updated', handleStatusUpdate);
    if (socket.connected) joinOrder();

    return () => {
      socket.emit('leave-order', id);
      socket.off('connect', joinOrder);
      socket.off('order-status-updated', handleStatusUpdate);
    };
  }, [id, socket]);

  useEffect(() => {
    if (loading || !order || !location.hash) return undefined;
    const frame = window.requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    return () => window.cancelAnimationFrame(frame);
  }, [loading, location.hash, order]);

  const chefs = useMemo(() => {
    if (!order?.chef) return [];
    return Array.isArray(order.chef) ? order.chef : [order.chef];
  }, [order]);
  const estimate = useMemo(() => estimatedDelivery(order), [order]);

  if (loading) return <OrderDetailsSkeleton />;
  if (error || !order) return <OrderError message={error} />;

  return (
    <div className="mx-auto max-w-[1500px] space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <DashboardHeader title="Order Tracking" description={`Live status for order #${documentId(order._id).slice(-8).toUpperCase()}`} />
        <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${connected ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500' : 'border-amber-500/20 bg-amber-500/10 text-amber-500'}`}>
          {connected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
          {connected ? 'Live updates connected' : 'Reconnecting...'}
        </span>
      </div>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Live order summary">
        <TrackingSummaryCard icon={Package} label="Current Status" value={statusLabel(order.status)} description={`Updated ${formatDate(order.statusUpdatedAt || order.orderDate)}`} tone="text-blue-500 bg-blue-500/10" />
        <TrackingSummaryCard icon={Timer} label="Estimated Time" value={estimate.label} description={estimate.expected || estimate.detail} tone="text-orange-500 bg-orange-500/10" />
        <TrackingSummaryCard icon={Radio} label="Live Updates" value={connected ? 'Connected' : 'Reconnecting'} description={connected ? 'Status changes appear automatically.' : 'Restoring the live connection…'} tone={connected ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'} pulse={connected} />
      </section>

      <TrackingTimeline status={order.status} />

      {normalizeStatus(order.status) === 'delivered' && <ReviewForm order={order} />}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-lg shadow-black/5">
          <div className="flex items-center gap-3 border-b border-[var(--border)] p-6"><ShoppingBag className="h-5 w-5 text-[var(--accent)]" /><div><h2 className="text-xl font-semibold text-[var(--text-primary)]">Order Items</h2><p className="mt-1 text-xs text-[var(--text-muted)]">Ordered {formatDate(order.orderDate)}</p></div></div>
          <div className="divide-y divide-[var(--border)]">
            {(order.foods || []).map((food) => <OrderItem key={documentId(food.foodId)} food={food} />)}
          </div>
        </motion.section>

        <div className="space-y-6 xl:sticky xl:top-28">
          <InfoCard icon={ReceiptText} title="Order Summary">
            <dl className="space-y-3 text-sm"><SummaryRow label="Subtotal" value={formatPrice(order.subtotal)} /><SummaryRow label="Delivery Fee" value={formatPrice(order.deliveryFee)} /><SummaryRow label="Tax" value={formatPrice(order.tax)} /><div className="flex justify-between border-t border-[var(--border)] pt-4 text-base font-bold text-[var(--text-primary)]"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div></dl>
            <div className="mt-5 flex items-center justify-between rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm"><span className="text-[var(--text-secondary)]">Payment</span><span className="font-semibold capitalize text-emerald-500">{order.paymentStatus}</span></div>
          </InfoCard>

          <InfoCard icon={MapPin} title="Shipping Address">
            <p className="text-sm leading-7 text-[var(--text-secondary)]">{order.shippingAddress?.address}<br />{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />{order.shippingAddress?.phone}</p>
          </InfoCard>

          <InfoCard icon={ChefHat} title={chefs.length > 1 ? 'Your Chefs' : 'Your Chef'}>
            <div className="space-y-3">{chefs.map((chef) => <div key={documentId(chef.id) || chef.email} className="flex items-center gap-3">{chef.photo ? <img src={chef.photo} alt={chef.name} className="h-11 w-11 rounded-xl object-cover" /> : <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"><ChefHat className="h-5 w-5" /></span>}<div><p className="text-sm font-semibold text-[var(--text-primary)]">{chef.name || 'HomeBite Chef'}</p><p className="text-xs text-[var(--text-muted)]">{chef.email}</p></div></div>)}</div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function TrackingTimeline({ status }) {
  const cancelled = normalizeStatus(status) === 'rejected';
  if (cancelled) {
    return <motion.section id="tracking" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="scroll-mt-28 rounded-[2rem] border border-red-500/20 bg-red-500/5 p-6 shadow-[var(--shadow-soft)] sm:p-8" aria-label="Order progress"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><motion.span initial={{ scale: 0.7 }} animate={{ scale: 1 }} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500"><XCircle className="h-7 w-7" /></motion.span><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">Order Timeline</p><h2 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">Order Cancelled</h2><p className="mt-2 text-sm text-[var(--text-secondary)]">This order is no longer active. Historical order and payment details remain available below.</p></div></div></motion.section>;
  }
  const currentIndex = Math.max(0, TRACKING_STEPS.findIndex((step) => step.status === normalizeStatus(status)));
  const progress = `${(currentIndex / (TRACKING_STEPS.length - 1)) * 100}%`;
  const desktopProgress = `${(currentIndex / (TRACKING_STEPS.length - 1)) * 83.34}%`;

  return (
    <motion.section id="tracking" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="scroll-mt-28 rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-soft)] sm:p-8" aria-label="Order progress">
      <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Current Status</p><h2 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">{statusLabel(status)}</h2></div><motion.span key={status} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-full bg-[var(--accent-soft)] px-4 py-2 text-xs font-semibold text-[var(--accent)]">Live</motion.span></div>

      <div className="relative mt-8 hidden sm:block">
        <div className="absolute left-[8.33%] right-[8.33%] top-6 h-1 rounded-full bg-[var(--bg-muted)]" />
        <motion.div initial={{ width: 0 }} animate={{ width: desktopProgress }} transition={{ duration: 0.65, ease: 'easeOut' }} className="absolute left-[8.33%] top-6 h-1 rounded-full bg-gradient-to-r from-orange-500 to-rose-500" />
        <div className="relative grid grid-cols-6 gap-2">{TRACKING_STEPS.map((step, index) => <TimelineStep key={step.status} step={step} completed={index <= currentIndex} current={index === currentIndex} />)}</div>
      </div>

      <div className="relative mt-8 space-y-0 sm:hidden">
        <div className="absolute bottom-6 left-6 top-6 w-1 rounded-full bg-[var(--bg-muted)]" />
        <motion.div initial={{ height: 0 }} animate={{ height: progress }} transition={{ duration: 0.65, ease: 'easeOut' }} className="absolute left-6 top-6 w-1 rounded-full bg-gradient-to-b from-orange-500 to-rose-500" />
        {TRACKING_STEPS.map((step, index) => <MobileTimelineStep key={step.status} step={step} completed={index <= currentIndex} current={index === currentIndex} />)}
      </div>
    </motion.section>
  );
}

function TimelineStep({ step, completed, current }) {
  const Icon = step.icon;
  return <div className="flex flex-col items-center text-center"><motion.span animate={{ scale: current ? [1, 1.12, 1] : 1 }} transition={{ duration: 0.6 }} className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-[var(--bg-surface)] ${completed ? 'bg-gradient-to-br from-orange-500 to-rose-500 text-white' : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'}`}><Icon className="h-5 w-5" /></motion.span><p className={`mt-3 text-xs font-semibold ${completed ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>{step.label}</p></div>;
}

function MobileTimelineStep({ step, completed, current }) {
  const Icon = step.icon;
  return <div className="relative z-10 flex min-h-20 items-center gap-4"><motion.span animate={{ scale: current ? [1, 1.12, 1] : 1 }} className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-[var(--bg-surface)] ${completed ? 'bg-gradient-to-br from-orange-500 to-rose-500 text-white' : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'}`}><Icon className="h-5 w-5" /></motion.span><div><p className={`font-semibold ${completed ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>{step.label}</p>{current && <p className="mt-1 text-xs text-[var(--accent)]">Current status</p>}</div></div>;
}

function OrderItem({ food }) {
  const [failed, setFailed] = useState(false);
  return <div className="flex items-center gap-4 p-5 sm:p-6"><div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[var(--bg-muted)]">{food.image && !failed ? <img src={food.image} alt={food.name} onError={() => setFailed(true)} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-[var(--text-muted)]"><ImageOff className="h-6 w-6" /></div>}</div><div className="min-w-0 flex-1"><h3 className="truncate font-semibold text-[var(--text-primary)]">{food.name}</h3><p className="mt-1 text-sm text-[var(--text-muted)]">{formatPrice(food.price)} × {food.quantity}</p></div><p className="font-bold text-[var(--text-primary)]">{formatPrice(food.subtotal)}</p></div>;
}

function InfoCard({ icon: Icon, title, children }) {
  return <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5"><div className="mb-5 flex items-center gap-3"><Icon className="h-5 w-5 text-[var(--accent)]" /><h2 className="font-semibold text-[var(--text-primary)]">{title}</h2></div>{children}</motion.section>;
}

function TrackingSummaryCard({ icon: Icon, label, value, description, tone, pulse = false }) {
  return <motion.article initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} className="rounded-[1.6rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5"><div className="flex items-start gap-4"><motion.span animate={pulse ? { scale: [1, 1.08, 1] } : {}} transition={{ duration: 2.2, repeat: Infinity }} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tone}`}><Icon className="h-5 w-5" /></motion.span><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">{label}</p><p className="mt-1 truncate text-lg font-semibold text-[var(--text-primary)]">{value}</p><p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{description}</p></div></div></motion.article>;
}

function SummaryRow({ label, value }) {
  return <div className="flex justify-between gap-4"><dt className="text-[var(--text-secondary)]">{label}</dt><dd className="font-semibold text-[var(--text-primary)]">{value}</dd></div>;
}

function OrderDetailsSkeleton() {
  return <div className="mx-auto max-w-[1500px] space-y-8" role="status" aria-label="Loading order"><div className="h-24 animate-pulse rounded-3xl bg-[var(--bg-muted)]" /><div className="h-64 animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /><div className="grid gap-8 xl:grid-cols-[1fr_380px]"><div className="h-96 animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /><div className="h-96 animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /></div></div>;
}

function OrderError({ message }) {
  return <div className="mx-auto flex min-h-[500px] max-w-2xl flex-col items-center justify-center rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--bg-surface)] px-6 text-center"><ReceiptText className="h-12 w-12 text-[var(--accent)]" /><h1 className="mt-5 text-2xl font-semibold text-[var(--text-primary)]">Order unavailable</h1><p className="mt-3 text-sm text-[var(--text-secondary)]">{message}</p></div>;
}
