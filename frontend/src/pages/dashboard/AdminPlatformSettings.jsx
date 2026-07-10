import { motion } from 'framer-motion';
import { BadgeDollarSign, Building2, Globe2, Image, Languages, Loader2, Mail, Phone, Power, Save, Share2, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { getPlatformSettings, savePlatformSettings } from '../../services/adminApi';

const defaults = { platformName: 'HomeBite', supportEmail: '', supportPhone: '', logo: '', favicon: '', maintenanceMode: false, defaultCurrency: 'BDT', defaultLanguage: 'en', socialLinks: { facebook: '', instagram: '', x: '', youtube: '' } };
const inputClass = 'mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]';

export default function AdminPlatformSettings() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting, isDirty } } = useForm({ defaultValues: defaults });
  const maintenanceMode = watch('maintenanceMode');
  const logo = watch('logo');
  const favicon = watch('favicon');

  useEffect(() => {
    let active = true; setLoading(true); setLoadError('');
    getPlatformSettings().then((response) => { if (active) reset({ ...defaults, ...response.data.data, socialLinks: { ...defaults.socialLinks, ...(response.data.data?.socialLinks || {}) } }); })
      .catch((error) => { if (active) setLoadError(error.response?.data?.message || 'Unable to load platform settings.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reset]);

  async function submit(values) {
    try { const response = await savePlatformSettings(values); reset({ ...defaults, ...response.data.data, socialLinks: { ...defaults.socialLinks, ...(response.data.data?.socialLinks || {}) } }); toast.success('Platform settings saved successfully.'); }
    catch (error) { toast.error(error.response?.data?.message || 'Unable to save platform settings.'); }
  }

  if (loading) return <SettingsSkeleton/>;
  if (loadError) return <div className="mx-auto max-w-5xl"><DashboardHeader title="Platform Settings" description="Configure HomeBite platform information and defaults."/><div className="mt-8 rounded-[2rem] border border-red-500/20 bg-red-500/5 p-12 text-center text-sm font-semibold text-red-500">{loadError}</div></div>;

  return <form onSubmit={handleSubmit(submit)} className="mx-auto max-w-5xl space-y-8" noValidate>
    <DashboardHeader title="Platform Settings" description="Configure HomeBite platform information, branding, defaults, and public links."/>
    <SettingsCard icon={Building2} title="General Information" description="Core public identity and support contact details." delay={0.03}>
      <div className="grid gap-5 sm:grid-cols-2"><Field label="Platform Name" error={errors.platformName}><input className={inputClass} {...register('platformName', { required: 'Platform name is required.' })}/></Field><Field label="Support Email" error={errors.supportEmail}><div className="relative"><Mail className="absolute left-4 top-[1.15rem] h-4 w-4 text-[var(--text-muted)]"/><input type="email" className={`${inputClass} pl-11`} placeholder="support@homebite.com" {...register('supportEmail', { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address.' } })}/></div></Field><Field label="Support Phone" error={errors.supportPhone}><div className="relative"><Phone className="absolute left-4 top-[1.15rem] h-4 w-4 text-[var(--text-muted)]"/><input type="tel" className={`${inputClass} pl-11`} placeholder="+880 1XXX-XXXXXX" {...register('supportPhone')}/></div></Field></div>
    </SettingsCard>
    <SettingsCard icon={Image} title="Brand Assets" description="Use hosted image URLs for the platform logo and browser favicon." delay={0.06}>
      <div className="grid gap-5 sm:grid-cols-2"><UrlField label="Logo" name="logo" register={register} error={errors.logo} preview={logo}/><UrlField label="Favicon" name="favicon" register={register} error={errors.favicon} preview={favicon} compact/></div>
    </SettingsCard>
    <SettingsCard icon={Power} title="Maintenance Mode" description="Temporarily flag the platform as unavailable for scheduled work." delay={0.09}>
      <div className={`flex flex-col gap-5 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${maintenanceMode ? 'border-amber-500/30 bg-amber-500/5' : 'border-[var(--border)] bg-[var(--bg-muted)]'}`}><div><p className="text-sm font-semibold text-[var(--text-primary)]">{maintenanceMode ? 'Maintenance mode enabled' : 'Platform is live'}</p><p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">Save changes to persist this operational setting.</p></div><Switch checked={maintenanceMode} onChange={(value) => setValue('maintenanceMode', value, { shouldDirty: true })}/></div>
    </SettingsCard>
    <SettingsCard icon={BadgeDollarSign} title="Platform Fees" description="Configure service commissions and fee rules." delay={0.12}>
      <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-muted)] p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--bg-surface)] text-[var(--text-muted)]"><Wrench className="h-5 w-5"/></span><div><p className="text-sm font-semibold text-[var(--text-primary)]">Fee configuration</p><p className="mt-1 text-xs text-[var(--text-muted)]">Commission, service fee, and settlement controls are not available yet.</p></div></div><span className="w-fit rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--text-muted)]">Coming Soon</span></div>
    </SettingsCard>
    <SettingsCard icon={Languages} title="Regional Defaults" description="Choose the initial currency and language for HomeBite." delay={0.15}>
      <div className="grid gap-5 sm:grid-cols-2"><Field label="Default Currency"><select className={inputClass} {...register('defaultCurrency')}><option value="BDT">BDT — Bangladeshi Taka</option><option value="USD">USD — US Dollar</option><option value="EUR">EUR — Euro</option><option value="GBP">GBP — British Pound</option></select></Field><Field label="Default Language"><select className={inputClass} {...register('defaultLanguage')}><option value="en">English</option><option value="bn">বাংলা</option><option value="it">Italiano</option></select></Field></div>
    </SettingsCard>
    <SettingsCard icon={Share2} title="Social Links" description="Add official HomeBite social media profile URLs." delay={0.18}>
      <div className="grid gap-5 sm:grid-cols-2">{[['facebook','Facebook'],['instagram','Instagram'],['x','X / Twitter'],['youtube','YouTube']].map(([key, label]) => <UrlInput key={key} label={label} name={`socialLinks.${key}`} register={register} error={errors.socialLinks?.[key]}/>)}</div>
    </SettingsCard>
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg-surface)]/95 p-4 shadow-[var(--shadow-elevated)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-[var(--text-muted)]">{isDirty ? 'You have unsaved platform changes.' : 'All platform settings are saved.'}</p><motion.button whileHover={!isSubmitting ? { y: -2 } : {}} whileTap={!isSubmitting ? { scale: 0.98 } : {}} type="submit" disabled={isSubmitting || !isDirty} className="inline-flex min-w-40 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4"/>}{isSubmitting ? 'Saving...' : 'Save Changes'}</motion.button></motion.div>
  </form>;
}

function SettingsCard({ icon: Icon, title, description, children, delay }) { return <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5 sm:p-6"><div className="mb-6 flex items-center gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon className="h-5 w-5"/></span><div><h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2><p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{description}</p></div></div>{children}</motion.section>; }
function Field({ label, error, children }) { return <label className="block text-sm font-semibold text-[var(--text-secondary)]">{label}{children}{error && <span role="alert" className="mt-2 block text-xs text-red-500">{error.message}</span>}</label>; }
const urlRules = { pattern: { value: /^https?:\/\/.+/i, message: 'Enter a complete http:// or https:// URL.' } };
function UrlInput({ label, name, register, error }) { return <Field label={label} error={error}><div className="relative"><Globe2 className="absolute left-4 top-[1.15rem] h-4 w-4 text-[var(--text-muted)]"/><input type="url" placeholder="https://" className={`${inputClass} pl-11`} {...register(name, urlRules)}/></div></Field>; }
function UrlField({ label, name, register, error, preview, compact }) { return <div><UrlInput label={label} name={name} register={register} error={error}/><div className="mt-3 flex h-24 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-muted)]">{preview ? <img src={preview} alt={`${label} preview`} className={`${compact ? 'h-12 w-12' : 'max-h-16 max-w-[80%]'} object-contain`}/> : <span className="text-xs text-[var(--text-muted)]">{label} preview</span>}</div></div>; }
function Switch({ checked, onChange }) { return <button type="button" role="switch" aria-checked={checked} aria-label="Maintenance mode" onClick={() => onChange(!checked)} className={`relative h-8 w-14 shrink-0 rounded-full transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] ${checked ? 'bg-amber-500' : 'bg-slate-400/40'}`}><motion.span animate={{ x: checked ? 27 : 4 }} transition={{ type: 'spring', stiffness: 500, damping: 32 }} className="absolute left-0 top-1 h-6 w-6 rounded-full bg-white shadow"/></button>; }
function SettingsSkeleton() { return <div className="mx-auto max-w-5xl space-y-8" role="status" aria-label="Loading platform settings"><div className="space-y-3"><div className="h-4 w-28 animate-pulse rounded bg-[var(--bg-muted)]"/><div className="h-10 w-64 animate-pulse rounded bg-[var(--bg-muted)]"/></div>{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-52 animate-pulse rounded-[2rem] bg-[var(--bg-muted)]"/>)}</div>; }
