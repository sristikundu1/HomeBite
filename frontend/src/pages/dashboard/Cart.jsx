import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChefHat, ImageOff, Loader2, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import useCart from '../../hooks/useCart';

const DELIVERY_FEE = 60;
const TAX_RATE = 0.05;

function documentId(value) {
  return value?.$oid || value || '';
}

function formatPrice(value) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 2
  }).format(value || 0);
}

export default function Cart() {
  const { cartItems, cartCount, totalPrice, loading, updateQuantity, removeItem } = useCart();
  const [pendingAction, setPendingAction] = useState('');
  const estimatedTax = totalPrice * TAX_RATE;
  const deliveryFee = cartItems.length ? DELIVERY_FEE : 0;
  const grandTotal = totalPrice + estimatedTax + deliveryFee;

  async function changeQuantity(item, quantity) {
    const id = documentId(item._id);
    if (quantity < 1 || pendingAction) return;

    setPendingAction(`quantity:${id}`);
    try {
      await updateQuantity(id, quantity);
    } finally {
      setPendingAction('');
    }
  }

  async function remove(item) {
    const id = documentId(item._id);
    if (pendingAction) return;

    setPendingAction(`remove:${id}`);
    try {
      await removeItem(id);
    } finally {
      setPendingAction('');
    }
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-8">
      <DashboardHeader title="Shopping Cart" description="Review your selected meals and adjust quantities before moving forward." />

      {loading ? (
        <CartSkeleton />
      ) : cartItems.length ? (
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
          <motion.section layout className="space-y-4" aria-label="Cart items">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item, index) => (
                <CartItem
                  key={documentId(item._id)}
                  item={item}
                  index={index}
                  pendingAction={pendingAction}
                  onChangeQuantity={changeQuantity}
                  onRemove={remove}
                />
              ))}
            </AnimatePresence>
          </motion.section>

          <OrderSummary
            cartCount={cartCount}
            subtotal={totalPrice}
            deliveryFee={deliveryFee}
            estimatedTax={estimatedTax}
            grandTotal={grandTotal}
          />
        </div>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
}

function CartItem({ item, index, pendingAction, onChangeQuantity, onRemove }) {
  const [imageFailed, setImageFailed] = useState(false);
  const id = documentId(item._id);
  const busy = pendingAction.endsWith(`:${id}`);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, scale: 0.97 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-lg shadow-black/5 sm:p-5"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="h-40 w-full shrink-0 overflow-hidden rounded-2xl bg-[var(--bg-muted)] sm:h-28 sm:w-32">
          {item.foodImage && !imageFailed ? (
            <img src={item.foodImage} alt={item.foodName} onError={() => setImageFailed(true)} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--text-muted)]"><ImageOff className="h-7 w-7" aria-hidden="true" /></div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold text-[var(--text-primary)]">{item.foodName}</h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-[var(--text-secondary)]"><ChefHat className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />{item.chefName || 'HomeBite Chef'}</p>
          <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">{formatPrice(item.price)} <span className="font-normal text-[var(--text-muted)]">each</span></p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-4 sm:block sm:border-0 sm:pt-0 sm:text-right">
          <div className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--bg-page)] p-1">
            <motion.button type="button" whileTap={{ scale: 0.88 }} onClick={() => onChangeQuantity(item, item.quantity - 1)} disabled={busy || item.quantity <= 1} aria-label={`Decrease quantity of ${item.foodName}`} className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-35"><Minus className="h-4 w-4" /></motion.button>
            <span className="min-w-10 px-2 text-center text-sm font-bold text-[var(--text-primary)]" aria-live="polite">{item.quantity}</span>
            <motion.button type="button" whileTap={{ scale: 0.88 }} onClick={() => onChangeQuantity(item, item.quantity + 1)} disabled={busy} aria-label={`Increase quantity of ${item.foodName}`} className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-35"><Plus className="h-4 w-4" /></motion.button>
          </div>
          <div className="sm:mt-4">
            <p className="text-xs text-[var(--text-muted)]">Subtotal</p>
            <p className="mt-1 text-lg font-bold text-[var(--text-primary)]">{formatPrice(item.subtotal)}</p>
          </div>
        </div>

        <motion.button type="button" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }} onClick={() => onRemove(item)} disabled={busy} aria-label={`Remove ${item.foodName} from cart`} className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-red-500/20 text-sm font-semibold text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:w-11 sm:shrink-0">
          {pendingAction === `remove:${id}` ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
          <span className="sm:hidden">Remove Item</span>
        </motion.button>
      </div>
    </motion.article>
  );
}

function OrderSummary({ cartCount, subtotal, deliveryFee, estimatedTax, grandTotal }) {
  return (
    <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-soft)] xl:sticky xl:top-28">
      <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><ShoppingBag className="h-5 w-5" /></span><div><h2 className="text-xl font-semibold text-[var(--text-primary)]">Order Summary</h2><p className="mt-1 text-xs text-[var(--text-muted)]">{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart</p></div></div>
      <dl className="mt-7 space-y-4 border-y border-[var(--border)] py-6 text-sm">
        <SummaryRow label="Subtotal" value={subtotal} />
        <SummaryRow label="Delivery Fee" value={deliveryFee} />
        <SummaryRow label="Estimated Tax" value={estimatedTax} />
      </dl>
      <div className="flex items-end justify-between gap-4 py-6"><span className="font-semibold text-[var(--text-primary)]">Grand Total</span><span className="text-2xl font-bold text-[var(--text-primary)]">{formatPrice(grandTotal)}</span></div>
      <div className="grid gap-3">
        <Link to="/dashboard/checkout" type="button" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5">Proceed To Checkout <ArrowRight className="h-4 w-4" /></Link>
        <Link to="/foods" className="inline-flex items-center justify-center rounded-full border border-[var(--border)] px-6 py-4 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]">Continue Shopping</Link>
      </div>
    </motion.aside>
  );
}

function SummaryRow({ label, value }) {
  return <div className="flex items-center justify-between gap-4"><dt className="text-[var(--text-secondary)]">{label}</dt><dd className="font-semibold text-[var(--text-primary)]">{formatPrice(value)}</dd></div>;
}

function CartSkeleton() {
  return <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]" role="status" aria-label="Loading cart"><div className="space-y-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="flex animate-pulse gap-5 rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5"><div className="h-28 w-32 rounded-2xl bg-[var(--bg-muted)]" /><div className="flex-1 space-y-3 py-2"><div className="h-5 w-2/3 rounded bg-[var(--bg-muted)]" /><div className="h-4 w-1/3 rounded bg-[var(--bg-muted)]" /><div className="h-4 w-1/4 rounded bg-[var(--bg-muted)]" /></div><div className="h-10 w-28 rounded-full bg-[var(--bg-muted)]" /></div>)}</div><div className="h-96 animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /></div>;
}

function EmptyCart() {
  return <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[500px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--bg-surface)] px-6 text-center"><span className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-[var(--accent-soft)] text-[var(--accent)]"><ShoppingBag className="h-10 w-10" /></span><h2 className="mt-6 text-2xl font-semibold text-[var(--text-primary)]">Your cart is empty</h2><p className="mt-3 max-w-md text-sm leading-7 text-[var(--text-secondary)]">Explore homemade meals and add something delicious to your cart.</p><Link to="/foods" className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20">Continue Shopping <ArrowRight className="h-4 w-4" /></Link></motion.section>;
}
