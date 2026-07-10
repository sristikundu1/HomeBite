import { motion } from 'framer-motion';
import { CalendarDays, Camera, Clock3, ImageOff, Loader2, Mail, MapPin, Phone, Save, ShieldCheck, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { useAuth } from '../../providers/AuthProvider';
import { updateAdminProfile } from '../../services/adminApi';

const fieldClass = 'mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]';
const formatDate = (value, withTime = false) => value ? new Intl.DateTimeFormat('en-BD', withTime ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'long' }).format(new Date(value)) : 'Not available';

export default function AdminProfile() {
  const { user, dbUser, refreshDbUser, updateUserProfile } = useAuth();
  const email = (dbUser?.email || user?.email || '').trim().toLowerCase();
  const [imageFailed, setImageFailed] = useState(false);
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting, isDirty } } = useForm({ defaultValues: { photo: '', phone: '', address: '', bio: '' } });
  const photo = watch('photo');

  useEffect(() => { reset({ photo: dbUser?.photo || user?.photoURL || '', phone: dbUser?.phone || '', address: dbUser?.address || '', bio: dbUser?.bio || '' }); setImageFailed(false); }, [dbUser, reset, user?.photoURL]);

  async function save(values) {
    try {
      const payload = { photo: values.photo.trim(), phone: values.phone.trim(), address: values.address.trim(), bio: values.bio.trim() };
      await updateAdminProfile(email, payload);
      if (user && payload.photo !== (user.photoURL || '')) await updateUserProfile({ photoURL: payload.photo || null });
      const refreshed = await refreshDbUser();
      reset({ photo: refreshed?.photo || '', phone: refreshed?.phone || '', address: refreshed?.address || '', bio: refreshed?.bio || '' });
      toast.success('Admin profile updated successfully.');
    } catch (error) { toast.error(error.response?.data?.message || error.message || 'Unable to update admin profile.'); }
  }

  return <div className="mx-auto max-w-[1200px] space-y-8">
    <DashboardHeader title="Admin Profile" description="Review your administrator identity and keep your profile information current."/>
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative isolate overflow-hidden rounded-[2.25rem] border border-white/10 bg-gradient-to-br from-slate-950 via-violet-950 to-orange-950 p-6 text-white shadow-[0_30px_90px_rgba(79,70,229,0.18)] sm:p-8">
      <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl"/><div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl"/>
      <div className="relative flex flex-col items-center gap-7 text-center sm:flex-row sm:text-left"><ProfileImage photo={photo} name={dbUser?.name || user?.displayName} failed={imageFailed} onError={() => setImageFailed(true)}/><div className="min-w-0 flex-1"><span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-300"><ShieldCheck className="h-3.5 w-3.5"/>Administrator</span><h2 className="mt-4 truncate text-3xl font-semibold text-white sm:text-4xl">{dbUser?.name || user?.displayName || 'HomeBite Admin'}</h2><p className="mt-3 flex items-center justify-center gap-2 text-sm text-white/75 sm:justify-start"><Mail className="h-4 w-4"/>{email}</p></div></div>
    </motion.section>
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><InfoCard icon={Mail} label="Email" value={email} delay={0}/><InfoCard icon={ShieldCheck} label="Role" value={dbUser?.role || 'admin'} capitalize delay={0.04}/><InfoCard icon={CalendarDays} label="Joined Date" value={formatDate(dbUser?.createdAt)} delay={0.08}/><InfoCard icon={Clock3} label="Last Login" value={formatDate(dbUser?.lastLogin, true)} delay={0.12}/></section>
    <motion.form onSubmit={handleSubmit(save)} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-soft)] sm:p-8" noValidate>
      <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)]">Editable information</p><h2 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">Profile details</h2></div>
      <div className="mt-7 grid gap-5 md:grid-cols-2"><FormField label="Profile Photo URL" icon={Camera} error={errors.photo?.message} full><input type="url" placeholder="https://example.com/photo.jpg" className={fieldClass} {...register('photo', { validate: (value) => !value || /^https?:\/\//i.test(value) || 'Enter a valid image URL.' })} onInput={() => setImageFailed(false)}/></FormField><FormField label="Phone" icon={Phone} error={errors.phone?.message}><input type="tel" placeholder="+880 1XXX-XXXXXX" className={fieldClass} {...register('phone', { validate: (value) => !value || /^[+\d][\d\s()-]{5,19}$/.test(value) || 'Enter a valid phone number.' })}/></FormField><FormField label="Address" icon={MapPin} error={errors.address?.message}><input placeholder="Office or correspondence address" className={fieldClass} {...register('address', { maxLength: { value: 300, message: 'Address cannot exceed 300 characters.' } })}/></FormField><FormField label="Bio" icon={UserRound} error={errors.bio?.message} full><textarea rows={6} placeholder="Tell the team about your administrative responsibilities..." className={`${fieldClass} resize-y leading-6`} {...register('bio', { maxLength: { value: 1000, message: 'Bio cannot exceed 1000 characters.' } })}/><span className="mt-2 block text-right text-xs text-[var(--text-muted)]">{watch('bio')?.length || 0}/1000</span></FormField></div>
      <div className="mt-8 flex justify-end"><motion.button type="submit" disabled={isSubmitting || !isDirty} whileHover={!isSubmitting && isDirty ? { y: -2 } : {}} whileTap={!isSubmitting && isDirty ? { scale: 0.98 } : {}} className="inline-flex min-w-44 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-45">{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4"/>}{isSubmitting ? 'Saving...' : 'Save Changes'}</motion.button></div>
    </motion.form>
  </div>;
}

function ProfileImage({ photo, name, failed, onError }) { return <div className="relative h-32 w-32 shrink-0"><div className="h-full w-full overflow-hidden rounded-[2rem] border-4 border-white/15 bg-white/10 shadow-2xl">{photo && !failed ? <img src={photo} alt={`${name || 'Admin'} profile`} onError={onError} className="h-full w-full object-cover"/> : <span className="flex h-full items-center justify-center text-white/60">{failed ? <ImageOff className="h-9 w-9"/> : <UserRound className="h-12 w-12"/>}</span>}</div><span className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-slate-950 bg-orange-500 text-white"><Camera className="h-4 w-4"/></span></div>; }
function InfoCard({ icon: Icon, label, value, delay, capitalize }) { return <motion.article initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} whileHover={{ y: -3 }} className="min-w-0 rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon className="h-4 w-4"/></span><p className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">{label}</p><p className={`mt-2 break-words text-sm font-semibold text-[var(--text-primary)] ${capitalize ? 'capitalize' : ''}`}>{value || 'Not available'}</p></motion.article>; }
function FormField({ label, icon: Icon, error, full, children }) { return <label className={full ? 'md:col-span-2' : ''}><span className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]"><Icon className="h-4 w-4 text-[var(--accent)]"/>{label}</span>{children}{error && <motion.span initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} role="alert" className="mt-2 block text-xs text-red-500">{error}</motion.span>}</label>; }
