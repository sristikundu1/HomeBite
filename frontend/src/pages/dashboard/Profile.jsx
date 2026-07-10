import { motion } from 'framer-motion';
import { CalendarDays, Camera, CheckCircle2, ClipboardList, Heart, ImageOff, Loader2, Mail, MapPin, MessageSquareText, Phone, Save, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import useWishlist from '../../hooks/useWishlist';
import { useAuth } from '../../providers/AuthProvider';
import { getCustomerOrders } from '../../services/ordersApi';
import { getCustomerReviews } from '../../services/reviewsApi';
import { updateCustomerProfile } from '../../services/usersApi';

const fieldClass = 'mt-2 h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] px-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-65';

function formatDate(value) {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-BD', { dateStyle: 'long' }).format(new Date(value));
}

export default function Profile() {
  const { user, dbUser, refreshDbUser, updateUserProfile } = useAuth();
  const { wishlistIds } = useWishlist();
  const [stats, setStats] = useState({ orders: 0, reviews: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);
  const email = (dbUser?.email || user?.email || '').trim().toLowerCase();
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting, isDirty } } = useForm({
    defaultValues: { photo: '', name: '', email: '', phone: '', address: '', city: '', country: '' }
  });
  const photo = watch('photo');

  useEffect(() => {
    reset({ photo: dbUser?.photo || user?.photoURL || '', name: dbUser?.name || user?.displayName || '', email, phone: dbUser?.phone || '', address: dbUser?.address || '', city: dbUser?.city || '', country: dbUser?.country || '' });
  }, [dbUser, email, reset, user?.displayName, user?.photoURL]);

  useEffect(() => {
    let active = true;
    if (!email) return () => { active = false; };
    setStatsLoading(true);
    Promise.allSettled([getCustomerOrders(email), getCustomerReviews(email)])
      .then(([ordersResult, reviewsResult]) => {
        if (!active) return;
        setStats({
          orders: ordersResult.status === 'fulfilled' ? (ordersResult.value.data.data || []).length : 0,
          reviews: reviewsResult.status === 'fulfilled' ? (reviewsResult.value.data.data || []).length : 0
        });
      })
      .finally(() => { if (active) setStatsLoading(false); });
    return () => { active = false; };
  }, [email]);

  async function save(values) {
    try {
      const payload = { name: values.name.trim(), photo: values.photo.trim(), phone: values.phone.trim(), address: values.address.trim(), city: values.city.trim(), country: values.country.trim() };
      await updateCustomerProfile(email, payload);
      if (user && (payload.name !== user.displayName || payload.photo !== (user.photoURL || ''))) {
        await updateUserProfile({ displayName: payload.name, photoURL: payload.photo || null });
      }
      const refreshed = await refreshDbUser();
      reset({ ...payload, email: refreshed?.email || email });
      toast.success('Profile updated successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Unable to update your profile.');
    }
  }

  return (
    <div className="mx-auto max-w-[1300px] space-y-8">
      <DashboardHeader title="Customer Profile" description="Keep your personal information and delivery details up to date." />

      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <ProfileImage photo={photo} name={watch('name')} failed={imageFailed} onError={() => setImageFailed(true)} />
          <div className="min-w-0 flex-1"><span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-500"><CheckCircle2 className="h-3.5 w-3.5" /> Active Customer</span><h2 className="mt-4 truncate text-3xl font-semibold text-[var(--text-primary)]">{watch('name') || 'HomeBite Customer'}</h2><p className="mt-2 flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)] sm:justify-start"><Mail className="h-4 w-4 text-[var(--accent)]" />{email}</p><p className="mt-2 flex items-center justify-center gap-2 text-xs text-[var(--text-muted)] sm:justify-start"><CalendarDays className="h-4 w-4" />Member since {formatDate(dbUser?.createdAt)}</p></div>
        </div>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={ClipboardList} label="Total Orders" value={stats.orders} loading={statsLoading} delay={0} tone="bg-blue-500/10 text-blue-500" />
        <StatCard icon={MessageSquareText} label="Total Reviews" value={stats.reviews} loading={statsLoading} delay={0.06} tone="bg-amber-500/10 text-amber-500" />
        <StatCard icon={Heart} label="Wishlist Count" value={wishlistIds.length} delay={0.12} tone="bg-rose-500/10 text-rose-500" />
      </section>

      <motion.form onSubmit={handleSubmit(save)} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-soft)] sm:p-8" noValidate>
        <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)]">Personal information</p><h2 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">Profile details</h2></div>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <FormField label="Profile Photo URL" icon={Camera} error={errors.photo?.message} full><input type="url" placeholder="https://example.com/photo.jpg" className={fieldClass} {...register('photo', { validate: (value) => !value || /^https?:\/\//i.test(value) || 'Enter a valid image URL.' })} onChange={(event) => { register('photo').onChange(event); setImageFailed(false); }} /></FormField>
          <FormField label="Name" icon={UserRound} error={errors.name?.message}><input className={fieldClass} {...register('name', { required: 'Name is required.', minLength: { value: 2, message: 'Name must be at least 2 characters.' } })} /></FormField>
          <FormField label="Email" icon={Mail}><input className={fieldClass} {...register('email')} readOnly aria-readonly="true" /></FormField>
          <FormField label="Phone" icon={Phone} error={errors.phone?.message}><input type="tel" placeholder="+880 1XXX-XXXXXX" className={fieldClass} {...register('phone', { validate: (value) => !value || /^[+\d][\d\s()-]{5,19}$/.test(value) || 'Enter a valid phone number.' })} /></FormField>
          <FormField label="Address" icon={MapPin} error={errors.address?.message}><input placeholder="Street address" className={fieldClass} {...register('address')} /></FormField>
          <FormField label="City" icon={MapPin}><input placeholder="City" className={fieldClass} {...register('city')} /></FormField>
          <FormField label="Country" icon={MapPin}><input placeholder="Country" className={fieldClass} {...register('country')} /></FormField>
        </div>
        <div className="mt-8 flex justify-end"><motion.button type="submit" disabled={isSubmitting || !isDirty} whileHover={!isSubmitting && isDirty ? { y: -2 } : {}} whileTap={!isSubmitting && isDirty ? { scale: 0.98 } : {}} className="inline-flex min-w-44 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-45">{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{isSubmitting ? 'Saving...' : 'Save Changes'}</motion.button></div>
      </motion.form>
    </div>
  );
}

function ProfileImage({ photo, name, failed, onError }) { return <div className="relative h-32 w-32 shrink-0"><div className="h-full w-full overflow-hidden rounded-[2rem] border-4 border-[var(--bg-surface)] bg-[var(--bg-muted)] shadow-xl">{photo && !failed ? <img src={photo} alt={`${name || 'Customer'} profile`} onError={onError} className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-[var(--text-muted)]">{failed ? <ImageOff className="h-9 w-9" /> : <UserRound className="h-12 w-12" />}</span>}</div><span className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[var(--bg-surface)] bg-[var(--accent)] text-white"><Camera className="h-4 w-4" /></span></div>; }
function StatCard({ icon: Icon, label, value, loading, delay, tone }) { return <motion.article initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} whileHover={{ y: -4 }} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5"><span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}><Icon className="h-5 w-5" /></span><p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">{label}</p>{loading ? <div className="mt-2 h-8 w-16 animate-pulse rounded bg-[var(--bg-muted)]" /> : <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">{value}</p>}</motion.article>; }
function FormField({ label, icon: Icon, error, full, children }) { return <label className={full ? 'md:col-span-2' : ''}><span className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]"><Icon className="h-4 w-4 text-[var(--accent)]" />{label}</span>{children}{error && <motion.span initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} className="mt-2 block text-xs text-red-500">{error}</motion.span>}</label>; }
