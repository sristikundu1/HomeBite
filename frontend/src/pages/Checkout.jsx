import { motion } from 'framer-motion';
import { CreditCard, ImageOff, LockKeyhole, MapPin, PackageCheck, Phone, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useCart from '../hooks/useCart';

const SHIPPING_STORAGE_KEY = 'checkoutShipping';
const DELIVERY_FEE = 60;
const TAX_RATE = 0.05;

const inputClass = 'mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]';

function getShippingDraft() {
  if (typeof window === 'undefined') return { phone: '', address: '', city: '', postalCode: '' };

  try {
    const draft = JSON.parse(window.localStorage.getItem(SHIPPING_STORAGE_KEY));
    return {
      phone: typeof draft?.phone === 'string' ? draft.phone : '',
      address: typeof draft?.address === 'string' ? draft.address : '',
      city: typeof draft?.city === 'string' ? draft.city : '',
      postalCode: typeof draft?.postalCode === 'string' ? draft.postalCode : ''
    };
  } catch {
    return { phone: '', address: '', city: '', postalCode: '' };
  }
}

function saveShippingDraft(data) {
  try {
    window.localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Form state remains usable when browser storage is unavailable.
  }
}

function formatPrice(value) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 2
  }).format(value || 0);
}

export default function Checkout() {
  const { cartItems, cartCount, totalPrice, loading } = useCart();
  const [savedAt, setSavedAt] = useState(null);
  const deliveryFee = cartItems.length ? DELIVERY_FEE : 0;
  const estimatedTax = totalPrice * TAX_RATE;
  const grandTotal = totalPrice + deliveryFee + estimatedTax;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({ defaultValues: getShippingDraft(), mode: 'onBlur' });

  useEffect(() => {
    const subscription = watch((values) => saveShippingDraft(values));
    return () => subscription.unsubscribe();
  }, [watch]);

  function onSubmit(values) {
    saveShippingDraft(values);
    setSavedAt(new Date());
    toast.success('Shipping information saved.');
  }

  if (loading) return <CheckoutSkeleton />;

  return (
    <main className="min-h-screen bg-[var(--bg-page)] pb-24 pt-28 text-[var(--text-primary)] sm:pt-32">
      <div className="container">
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">Secure checkout</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Complete your order</h1>
          <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">Add your delivery details and review your order before payment.</p>
        </motion.header>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_400px] xl:items-start">
          <div className="space-y-8">
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-soft)] sm:p-8" aria-labelledby="shipping-title">
              <div className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><MapPin className="h-6 w-6" aria-hidden="true" /></span><div><h2 id="shipping-title" className="text-xl font-semibold">Shipping Information</h2><p className="mt-1 text-sm text-[var(--text-secondary)]">Saved locally until payment succeeds.</p></div></div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <Field label="Phone" name="phone" error={errors.phone} icon={Phone}>
                  <input id="phone" type="tel" autoComplete="tel" placeholder="01XXXXXXXXX" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} className={`${inputClass} pl-11`} {...register('phone', { required: 'Phone number is required.', pattern: { value: /^\+?[0-9][0-9\s-]{7,14}$/, message: 'Enter a valid phone number.' } })} />
                </Field>
                <Field label="City" name="city" error={errors.city}>
                  <input id="city" type="text" autoComplete="address-level2" placeholder="Dhaka" aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? 'city-error' : undefined} className={inputClass} {...register('city', { required: 'City is required.', minLength: { value: 2, message: 'Enter a valid city.' } })} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Address" name="address" error={errors.address}>
                    <textarea id="address" rows={4} autoComplete="street-address" placeholder="House, road, area, and delivery instructions" aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? 'address-error' : undefined} className={`${inputClass} resize-y`} {...register('address', { required: 'Address is required.', minLength: { value: 10, message: 'Please provide a more complete address.' } })} />
                  </Field>
                </div>
                <Field label="Postal Code" name="postalCode" error={errors.postalCode}>
                  <input id="postalCode" type="text" inputMode="numeric" autoComplete="postal-code" placeholder="1207" aria-invalid={Boolean(errors.postalCode)} aria-describedby={errors.postalCode ? 'postalCode-error' : undefined} className={inputClass} {...register('postalCode', { required: 'Postal code is required.', pattern: { value: /^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/, message: 'Enter a valid postal code.' } })} />
                </Field>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5 sm:p-8" aria-labelledby="payment-title">
              <div className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><CreditCard className="h-6 w-6" aria-hidden="true" /></span><div><h2 id="payment-title" className="text-xl font-semibold">Payment</h2><p className="mt-1 text-sm text-[var(--text-secondary)]">Payment integration is coming next.</p></div></div>
              <div className="mt-7 flex min-h-40 flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--border)] bg-[var(--bg-muted)] px-6 text-center"><LockKeyhole className="h-8 w-8 text-[var(--accent)]" aria-hidden="true" /><p className="mt-4 text-sm font-semibold">Secure Payment Placeholder</p><p className="mt-2 max-w-md text-xs leading-6 text-[var(--text-muted)]">Stripe has not been connected yet. Your shipping draft will remain saved locally.</p></div>
            </motion.section>
          </div>

          <OrderSummary items={cartItems} cartCount={cartCount} subtotal={totalPrice} deliveryFee={deliveryFee} tax={estimatedTax} grandTotal={grandTotal} isSubmitting={isSubmitting} savedAt={savedAt} />
        </form>
      </div>
    </main>
  );
}

function Field({ label, name, error, icon: Icon, children }) {
  return <label htmlFor={name} className="relative block text-sm font-semibold text-[var(--text-secondary)]">{label}<span className="ml-1 text-red-500" aria-hidden="true">*</span>{Icon && <Icon className="pointer-events-none absolute left-4 top-[3.25rem] h-4 w-4 text-[var(--text-muted)]" aria-hidden="true" />}{children}{error && <span id={`${name}-error`} role="alert" className="mt-2 block text-xs font-medium text-red-500">{error.message}</span>}</label>;
}

function OrderSummary({ items, cartCount, subtotal, deliveryFee, tax, grandTotal, isSubmitting, savedAt }) {
  return (
    <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }} className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-soft)] xl:sticky xl:top-28">
      <div className="flex items-center gap-3"><ShoppingBag className="h-6 w-6 text-[var(--accent)]" /><div><h2 className="text-xl font-semibold">Order Summary</h2><p className="mt-1 text-xs text-[var(--text-muted)]">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p></div></div>
      <div className="mt-6 max-h-72 space-y-3 overflow-y-auto pr-1">
        {items.length ? items.map((item) => <div key={item._id?.$oid || item._id} className="flex items-center gap-3 rounded-2xl bg-[var(--bg-muted)] p-3"><div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[var(--bg-page)]">{item.foodImage ? <img src={item.foodImage} alt={item.foodName} className="h-full w-full object-cover" /> : <ImageOffFallback />}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.foodName}</p><p className="mt-1 text-xs text-[var(--text-muted)]">Qty {item.quantity}</p></div><p className="text-sm font-semibold">{formatPrice(item.subtotal)}</p></div>) : <div className="rounded-2xl bg-[var(--bg-muted)] p-5 text-center text-sm text-[var(--text-muted)]">Your cart is empty.</div>}
      </div>
      <dl className="mt-6 space-y-4 border-y border-[var(--border)] py-6 text-sm"><SummaryRow label="Subtotal" value={subtotal} /><SummaryRow label="Delivery Fee" value={deliveryFee} /><SummaryRow label="Estimated Tax" value={tax} /></dl>
      <div className="flex items-end justify-between gap-4 py-6"><span className="font-semibold">Grand Total</span><span className="text-2xl font-bold">{formatPrice(grandTotal)}</span></div>
      <motion.button type="submit" whileHover={items.length ? { y: -2 } : {}} whileTap={items.length ? { scale: 0.98 } : {}} disabled={!items.length || isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-45"><PackageCheck className="h-5 w-5" />Save & Continue</motion.button>
      {savedAt && <p className="mt-3 text-center text-xs text-emerald-500" aria-live="polite">Shipping saved at {savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
    </motion.aside>
  );
}

function SummaryRow({ label, value }) {
  return <div className="flex items-center justify-between gap-4"><dt className="text-[var(--text-secondary)]">{label}</dt><dd className="font-semibold">{formatPrice(value)}</dd></div>;
}

function ImageOffFallback() {
  return <div className="flex h-full items-center justify-center text-[var(--text-muted)]"><ShoppingBag className="h-5 w-5" /></div>;
}

function CheckoutSkeleton() {
  return <main className="min-h-screen bg-[var(--bg-page)] pb-24 pt-32" role="status" aria-label="Loading checkout"><div className="container"><div className="h-12 w-72 animate-pulse rounded bg-[var(--bg-muted)]" /><div className="mt-10 grid gap-8 xl:grid-cols-[1fr_400px]"><div className="space-y-8"><div className="h-[460px] animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /><div className="h-64 animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /></div><div className="h-[560px] animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /></div></div></main>;
}
