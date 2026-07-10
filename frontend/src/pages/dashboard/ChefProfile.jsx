import { motion } from 'framer-motion';
import {
  Award,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChefHat,
  CircleUserRound,
  Clock3,
  Globe2,
  Image,
  Loader2,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Save,
  Star,
  Store,
  Utensils
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { useAuth } from '../../providers/AuthProvider';
import { getChefProfile, updateChefProfile } from '../../services/chefProfileApi';

const inputClass = 'mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-70';
const defaultValues = { profilePhoto: '', fullName: '', email: '', phone: '', address: '', city: '', country: '', kitchenName: '', kitchenDescription: '', cuisineSpecialties: '', yearsOfExperience: '', preparationStyle: '', deliveryRadius: '', bio: '' };
const documentId = (value) => value?.$oid || value || '';

function cuisineList(value) {
  return String(value || '').split(',').map((item) => item.trim()).filter(Boolean);
}

export default function ChefProfile() {
  const { user, dbUser, refreshDbUser } = useAuth();
  const email = (dbUser?.email || user?.email || '').trim().toLowerCase();
  const [profileId, setProfileId] = useState('');
  const [stats, setStats] = useState({ averageRating: 0, reviewCount: 0, completedOrders: 0, totalFoods: 0 });
  const [chefStatus, setChefStatus] = useState('active');
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [imageFailed, setImageFailed] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm({ defaultValues, mode: 'onBlur' });

  useEffect(() => {
    let active = true;
    if (!email) return undefined;
    setLoading(true);
    setLoadError('');
    getChefProfile(email)
      .then((response) => {
        if (!active) return;
        const profile = response.data.data;
        setProfileId(documentId(profile._id));
        setStats(profile.stats || {});
        setChefStatus(profile.chefStatus || 'active');
        setVerificationStatus(profile.verificationStatus || 'pending');
        reset({
          profilePhoto: profile.profilePhoto || '',
          fullName: profile.fullName || '',
          email: profile.email || email,
          phone: profile.phone || '',
          address: profile.address || '',
          city: profile.city || '',
          country: profile.country || '',
          kitchenName: profile.kitchenName || '',
          kitchenDescription: profile.kitchenDescription || '',
          cuisineSpecialties: (profile.cuisineSpecialties || []).join(', '),
          yearsOfExperience: profile.yearsOfExperience ?? '',
          preparationStyle: profile.preparationStyle || '',
          deliveryRadius: profile.deliveryRadius ?? '',
          bio: profile.bio || ''
        });
      })
      .catch((error) => setLoadError(error.response?.data?.message || 'Unable to load chef profile.'))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [email, reset]);

  const photo = watch('profilePhoto');
  const name = watch('fullName') || dbUser?.name || user?.displayName || 'HomeBite Chef';
  const kitchenName = watch('kitchenName') || 'Your Kitchen';
  const bio = watch('bio') || '';
  const cuisineValue = watch('cuisineSpecialties');
  const specialties = useMemo(() => cuisineList(cuisineValue), [cuisineValue]);

  useEffect(() => { setImageFailed(false); }, [photo]);

  async function onSubmit(values) {
    if (!profileId) return;
    try {
      const response = await updateChefProfile(profileId, {
        ...values,
        cuisineSpecialties: cuisineList(values.cuisineSpecialties),
        yearsOfExperience: Number(values.yearsOfExperience),
        deliveryRadius: values.deliveryRadius === '' ? '' : Number(values.deliveryRadius)
      });
      const updated = response.data.data;
      setStats(updated.stats || stats);
      setChefStatus(updated.chefStatus || chefStatus);
      setVerificationStatus(updated.verificationStatus || verificationStatus);
      reset({ ...values, cuisineSpecialties: updated.cuisineSpecialties.join(', '), yearsOfExperience: updated.yearsOfExperience, deliveryRadius: updated.deliveryRadius });
      await refreshDbUser().catch(() => {});
      toast.success('Chef profile updated successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update chef profile.');
    }
  }

  if (loading) return <ProfileSkeleton />;
  if (loadError) return <div className="mx-auto max-w-3xl rounded-[2rem] border border-red-500/20 bg-red-500/5 p-10 text-center"><ChefHat className="mx-auto h-10 w-10 text-red-500" /><h1 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">Profile unavailable</h1><p className="mt-2 text-sm text-red-500">{loadError}</p></div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mx-auto max-w-[1400px] space-y-8 pb-8">
      <DashboardHeader title="Chef Profile" description="Manage the professional identity customers see across HomeBite." />

      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2.25rem] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-elevated)] sm:p-8">
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-r from-orange-500 via-orange-400 to-rose-500" /><div className="absolute right-12 top-5 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
        <div className="relative mt-16 flex flex-col gap-6 sm:mt-14 sm:flex-row sm:items-end">
          <div className="h-32 w-32 shrink-0 overflow-hidden rounded-[2rem] border-4 border-[var(--bg-surface)] bg-[var(--bg-muted)] shadow-xl sm:h-36 sm:w-36">{photo && !imageFailed ? <img src={photo} alt={`${name} profile`} onError={() => setImageFailed(true)} className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center text-[var(--accent)]"><CircleUserRound className="h-16 w-16" /></span>}</div>
          <div className="min-w-0 flex-1 pb-1"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">{name}</h2>{verificationStatus === 'approved' && <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-500"><CheckCircle2 className="h-3.5 w-3.5" /> Verified Chef</span>}</div><p className="mt-2 text-base font-semibold text-[var(--accent)]">{kitchenName}</p><div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]"><span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{Number(stats.averageRating || 0).toFixed(1)} average rating</span><span className="inline-flex items-center gap-1.5"><PackageCheck className="h-4 w-4 text-emerald-500" />{stats.completedOrders || 0} completed orders</span></div><div className="mt-4 flex flex-wrap gap-2">{specialties.length ? specialties.map((specialty) => <span key={specialty} className="rounded-full border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">{specialty}</span>) : <span className="text-xs text-[var(--text-muted)]">Add cuisine specialties below.</span>}</div></div>
        </div>
      </motion.section>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)] xl:items-start">
        <div className="space-y-8">
          <FormSection icon={CircleUserRound} title="Personal Information" description="Your contact and personal profile details." delay={0.04}>
            <div className="grid gap-5 sm:grid-cols-2"><Field label="Profile Photo" name="profilePhoto" error={errors.profilePhoto} icon={Image}><input id="profilePhoto" type="url" placeholder="https://example.com/photo.jpg" className={inputClass} {...register('profilePhoto', { pattern: { value: /^https?:\/\/.+/i, message: 'Enter a valid image URL.' } })} /></Field><Field label="Full Name" name="fullName" error={errors.fullName} icon={CircleUserRound}><input id="fullName" type="text" autoComplete="name" className={inputClass} {...register('fullName')} /></Field><Field label="Email" name="email" icon={Mail}><input id="email" type="email" readOnly aria-readonly="true" className={inputClass} {...register('email')} /></Field><Field label="Phone" name="phone" error={errors.phone} icon={Phone}><input id="phone" type="tel" autoComplete="tel" className={inputClass} {...register('phone', { pattern: { value: /^\+?[0-9\s-]{7,18}$/, message: 'Enter a valid phone number.' } })} /></Field><Field label="Address" name="address" error={errors.address} icon={MapPin}><input id="address" type="text" autoComplete="street-address" className={inputClass} {...register('address')} /></Field><Field label="City" name="city" error={errors.city} icon={Building2}><input id="city" type="text" autoComplete="address-level2" className={inputClass} {...register('city')} /></Field><Field label="Country" name="country" error={errors.country} icon={Globe2}><input id="country" type="text" autoComplete="country-name" className={inputClass} {...register('country')} /></Field></div>
          </FormSection>

          <FormSection icon={Store} title="Kitchen Information" description="Tell customers what makes your kitchen distinctive." delay={0.08}>
            <div className="grid gap-5 sm:grid-cols-2"><Field label="Kitchen Name" name="kitchenName" required error={errors.kitchenName} icon={Store}><input id="kitchenName" type="text" className={inputClass} aria-invalid={Boolean(errors.kitchenName)} {...register('kitchenName', { required: 'Kitchen name is required.' })} /></Field><Field label="Cuisine Specialties" name="cuisineSpecialties" required error={errors.cuisineSpecialties} icon={Utensils}><input id="cuisineSpecialties" type="text" placeholder="Bangla, Italian, Desserts" className={inputClass} aria-invalid={Boolean(errors.cuisineSpecialties)} {...register('cuisineSpecialties', { validate: (value) => cuisineList(value).length > 0 || 'At least one cuisine is required.' })} /></Field><div className="sm:col-span-2"><Field label="Kitchen Description" name="kitchenDescription" error={errors.kitchenDescription}><textarea id="kitchenDescription" rows={4} className={`${inputClass} resize-y`} placeholder="Describe your kitchen, signature dishes, and ingredients." {...register('kitchenDescription')} /></Field></div><Field label="Years of Experience" name="yearsOfExperience" required error={errors.yearsOfExperience} icon={BriefcaseBusiness}><input id="yearsOfExperience" type="number" min="0" step="1" className={inputClass} aria-invalid={Boolean(errors.yearsOfExperience)} {...register('yearsOfExperience', { required: 'Experience is required.', min: { value: 0, message: 'Experience cannot be negative.' } })} /></Field><Field label="Preparation Style" name="preparationStyle" error={errors.preparationStyle} icon={ChefHat}><select id="preparationStyle" className={inputClass} {...register('preparationStyle')}><option value="">Select preparation style</option><option>Traditional home cooking</option><option>Modern home cooking</option><option>Health-focused</option><option>Artisanal</option><option>Fusion</option><option>Family-style</option></select></Field><Field label="Delivery Radius (km)" name="deliveryRadius" optional error={errors.deliveryRadius} icon={MapPin}><input id="deliveryRadius" type="number" min="0" step="0.5" className={inputClass} {...register('deliveryRadius', { min: { value: 0, message: 'Radius cannot be negative.' } })} /></Field></div>
          </FormSection>

          <FormSection icon={ChefHat} title="About Chef" description="Share the story, experience, and philosophy behind your food." delay={0.12}>
            <Field label="Professional Bio" name="bio" required error={errors.bio}><textarea id="bio" rows={9} maxLength={1000} aria-invalid={Boolean(errors.bio)} aria-describedby="bio-counter bio-error" className={`${inputClass} resize-y leading-7`} placeholder="Tell customers about your culinary journey, signature style, and what inspires your cooking..." {...register('bio', { required: 'Bio is required.', minLength: { value: 50, message: 'Bio must be at least 50 characters.' } })} /><div id="bio-counter" className="mt-2 flex items-center justify-between text-xs"><span className={bio.length < 50 ? 'text-amber-500' : 'text-emerald-500'}>{bio.length < 50 ? `${50 - bio.length} more characters required` : 'Minimum length reached'}</span><span className="text-[var(--text-muted)]">{bio.length}/1000</span></div></Field>
          </FormSection>
        </div>

        <div className="space-y-8 xl:sticky xl:top-28">
          <FormSection icon={Award} title="Professional Stats" description="Live performance information from HomeBite." delay={0.1}><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2"><Stat label="Average Rating" value={Number(stats.averageRating || 0).toFixed(1)} icon={Star} tone="text-amber-500 bg-amber-500/10" /><Stat label="Review Count" value={stats.reviewCount || 0} icon={Award} tone="text-violet-500 bg-violet-500/10" /><Stat label="Completed Orders" value={stats.completedOrders || 0} icon={PackageCheck} tone="text-emerald-500 bg-emerald-500/10" /><Stat label="Total Foods" value={stats.totalFoods || 0} icon={Utensils} tone="text-orange-500 bg-orange-500/10" /><Stat label="Chef Status" value={chefStatus} icon={Clock3} capitalize tone="text-blue-500 bg-blue-500/10" /><Stat label="Verification" value={verificationStatus} icon={CheckCircle2} capitalize tone="text-cyan-500 bg-cyan-500/10" /></div></FormSection>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]/95 p-4 shadow-[var(--shadow-elevated)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-[var(--text-muted)]">{isDirty ? 'You have unsaved profile changes.' : 'Your profile is up to date.'}</p><motion.button whileHover={!isSubmitting ? { y: -2 } : {}} whileTap={!isSubmitting ? { scale: 0.98 } : {}} type="submit" disabled={isSubmitting} className="inline-flex min-w-44 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-55">{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{isSubmitting ? 'Saving...' : 'Save Changes'}</motion.button></motion.div>
    </form>
  );
}

function Field({ label, name, required, optional, error, icon: Icon, children }) { return <label htmlFor={name} className="relative block text-sm font-semibold text-[var(--text-secondary)]">{label}{required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}{optional && <span className="ml-2 text-[10px] font-normal text-[var(--text-muted)]">Optional</span>}{Icon && <Icon className="pointer-events-none absolute left-4 top-[3.2rem] z-10 h-4 w-4 text-[var(--text-muted)]" aria-hidden="true" />}<div className={Icon ? '[&>input]:pl-11 [&>select]:pl-11' : ''}>{children}</div>{error && <span id={`${name}-error`} role="alert" className="mt-2 block text-xs font-medium text-red-500">{error.message}</span>}</label>; }
function FormSection({ icon: Icon, title, description, children, delay }) { return <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5 sm:p-6"><div className="mb-6 flex items-center gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon className="h-5 w-5" /></span><div><h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2><p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{description}</p></div></div>{children}</motion.section>; }
function Stat({ label, value, icon: Icon, tone, capitalize }) { return <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-4"><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}><Icon className="h-4 w-4" /></span><p className={`mt-4 text-xl font-bold text-[var(--text-primary)] ${capitalize ? 'capitalize' : ''}`}>{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</p></motion.div>; }
function ProfileSkeleton() { return <div className="mx-auto max-w-[1400px] space-y-8" role="status" aria-label="Loading chef profile"><div className="space-y-3"><div className="h-4 w-24 animate-pulse rounded bg-[var(--bg-muted)]" /><div className="h-10 w-56 animate-pulse rounded bg-[var(--bg-muted)]" /></div><div className="h-80 animate-pulse rounded-[2.25rem] bg-[var(--bg-muted)]" /><div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]"><div className="space-y-8">{[1, 2, 3].map((item) => <div key={item} className="h-96 animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" />)}</div><div className="h-[560px] animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /></div></div>; }
