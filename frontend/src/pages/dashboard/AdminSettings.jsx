import { motion } from 'framer-motion';
import { Bell, Check, Globe2, KeyRound, Languages, Laptop, Loader2, LockKeyhole, LogOut, MessageCircle, Moon, Save, ShieldCheck, Sun, UserRound, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { useAuth } from '../../providers/AuthProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { saveAdminNotificationPreferences } from '../../services/adminApi';
import { getFirebaseErrorMessage } from '../../utils/firebaseErrorMessage';

const inputClass = 'mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]';
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const defaults = { orderNotifications: true, userNotifications: true, chefApplicationNotifications: true, messages: true, systemUpdates: true };
const preferences = [
  { key: 'orderNotifications', label: 'Order Notifications', description: 'Platform order creation, cancellation, and payment activity.', icon: Bell },
  { key: 'userNotifications', label: 'User Notifications', description: 'Important customer and account activity.', icon: Users },
  { key: 'chefApplicationNotifications', label: 'Chef Applications', description: 'New Become a Chef applications requiring review.', icon: UserRound },
  { key: 'messages', label: 'Messages', description: 'New customer and chef support conversations.', icon: MessageCircle },
  { key: 'systemUpdates', label: 'System Updates', description: 'Security, maintenance, and platform announcements.', icon: Laptop }
];

export default function AdminSettings() {
  const { user, dbUser, changePassword, refreshDbUser } = useAuth();
  const { themePreference, setTheme } = useTheme();
  const email = (dbUser?.email || user?.email || '').trim().toLowerCase();
  const providerIds = user?.providerData?.map((provider) => provider.providerId) || [];
  const usesPassword = providerIds.includes('password');
  const usesGoogle = providerIds.includes('google.com');
  const [language, setLanguage] = useState('en');
  const passwordForm = useForm({ defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' }, mode: 'onBlur' });
  const preferenceForm = useForm({ defaultValues: defaults });
  const preferenceValues = preferenceForm.watch();

  useEffect(() => { preferenceForm.reset({ ...defaults, ...(dbUser?.notificationPreferences || {}) }); }, [dbUser?.notificationPreferences, preferenceForm.reset]);

  async function submitPassword(values) {
    try { await changePassword(values.currentPassword, values.newPassword); passwordForm.reset(); toast.success('Password updated successfully.'); }
    catch (error) { toast.error(getFirebaseErrorMessage(error)); }
  }
  async function submitPreferences(values) {
    try { await saveAdminNotificationPreferences(email, values); await refreshDbUser().catch(() => {}); preferenceForm.reset(values); toast.success('Notification preferences saved.'); }
    catch (error) { toast.error(error.response?.data?.message || 'Unable to save notification preferences.'); }
  }

  return <div className="mx-auto max-w-5xl space-y-8">
    <DashboardHeader title="Admin Settings" description="Manage administrator security, notifications, appearance, and account preferences."/>
    {usesPassword ? <Card icon={KeyRound} title="Change Password" description="Update the password for this administrator account." delay={0.03}><form onSubmit={passwordForm.handleSubmit(submitPassword)} noValidate className="space-y-5"><div className="grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2"><Password label="Current Password" name="currentPassword" form={passwordForm} rules={{ required: 'Current password is required.' }}/></div><Password label="New Password" name="newPassword" form={passwordForm} rules={{ required: 'New password is required.', pattern: { value: passwordPattern, message: 'Use 8+ characters with uppercase, lowercase, number, and special character.' } }}/><Password label="Confirm Password" name="confirmPassword" form={passwordForm} rules={{ required: 'Please confirm your password.', validate: (value) => value === passwordForm.getValues('newPassword') || 'Passwords do not match.' }}/></div><Requirements/><div className="flex justify-end"><PrimaryButton busy={passwordForm.formState.isSubmitting} icon={LockKeyhole} label="Update Password" busyLabel="Updating..."/></div></form></Card> : usesGoogle ? <Card icon={KeyRound} title="Change Password" description="Password management depends on your sign-in provider." delay={0.03}><div className="flex items-center gap-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500"><Globe2 className="h-5 w-5"/></span><div><p className="text-sm font-semibold text-[var(--text-primary)]">This account uses Google Sign-In.</p><p className="mt-1 text-xs text-[var(--text-muted)]">Manage the password through the connected Google account.</p></div></div></Card> : null}
    <Card icon={Bell} title="Notification Preferences" description="Choose which administrative events should generate notifications." delay={0.06}><form onSubmit={preferenceForm.handleSubmit(submitPreferences)} className="space-y-4">{preferences.map((option) => <Preference key={option.key} option={option} checked={Boolean(preferenceValues[option.key])} onChange={(checked) => preferenceForm.setValue(option.key, checked, { shouldDirty: true })}/>)}<div className="flex justify-end pt-2"><PrimaryButton busy={preferenceForm.formState.isSubmitting} disabled={!preferenceForm.formState.isDirty} icon={Save} label="Save Preferences" busyLabel="Saving..."/></div></form></Card>
    <Card icon={Sun} title="Theme" description="Choose the appearance used throughout this browser." delay={0.09}><fieldset><legend className="sr-only">Theme preference</legend><div className="grid gap-3 sm:grid-cols-3">{[{ value: 'light', label: 'Light', icon: Sun },{ value: 'dark', label: 'Dark', icon: Moon },{ value: 'system', label: 'System', icon: Laptop }].map((option) => <ThemeOption key={option.value} option={option} selected={themePreference === option.value} onClick={() => setTheme(option.value)}/>)}</div></fieldset></Card>
    <Card icon={Languages} title="Language" description="Language selection is a placeholder; translation is not enabled." delay={0.12}><label className="block max-w-md text-sm font-semibold text-[var(--text-secondary)]">Display Language<select value={language} onChange={(event) => setLanguage(event.target.value)} className={inputClass}><option value="en">English</option><option value="bn">বাংলা</option><option value="it">Italiano</option></select><span className="mt-2 block text-xs font-normal text-[var(--text-muted)]">Placeholder only. Your selection is not saved.</span></label></Card>
    <PlaceholderCard icon={ShieldCheck} title="Two-Factor Authentication" description="Add an additional verification step to administrator sign-in." detail="Two-factor authentication setup is not available yet." delay={0.15}/>
    <PlaceholderCard icon={LogOut} title="Logout All Devices" description="End this administrator account's sessions on every device." detail="Remote session management is not available yet." delay={0.18}/>
  </div>;
}

function Card({ icon: Icon, title, description, delay, children }) { return <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5 sm:p-6"><div className="mb-6 flex items-center gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon className="h-5 w-5"/></span><div><h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2><p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{description}</p></div></div>{children}</motion.section>; }
function Password({ label, name, form, rules }) { const error = form.formState.errors[name]; return <label className="block text-sm font-semibold text-[var(--text-secondary)]">{label}<input type="password" autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'} aria-invalid={Boolean(error)} className={inputClass} {...form.register(name, rules)}/>{error && <span role="alert" className="mt-2 block text-xs text-red-500">{error.message}</span>}</label>; }
function Requirements() { return <div className="rounded-2xl bg-[var(--bg-muted)] p-4"><p className="text-xs font-semibold text-[var(--text-primary)]">Password requirements</p><div className="mt-3 grid gap-2 text-xs text-[var(--text-muted)] sm:grid-cols-2">{['At least 8 characters','One uppercase letter','One lowercase letter','One number','One special character'].map((item) => <span key={item} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-500"/>{item}</span>)}</div></div>; }
function Preference({ option, checked, onChange }) { const Icon = option.icon; return <div className="flex items-center justify-between gap-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-4"><div className="flex min-w-0 items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--accent)]"><Icon className="h-4 w-4"/></span><div><p className="text-sm font-semibold text-[var(--text-primary)]">{option.label}</p><p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{option.description}</p></div></div><Switch checked={checked} onChange={onChange} label={option.label}/></div>; }
function Switch({ checked, onChange, label }) { return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-7 w-12 shrink-0 rounded-full transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] ${checked ? 'bg-[var(--accent)]' : 'bg-slate-400/40'}`}><motion.span animate={{ x: checked ? 22 : 3 }} transition={{ type: 'spring', stiffness: 500, damping: 32 }} className="absolute left-0 top-1 h-5 w-5 rounded-full bg-white shadow"/></button>; }
function ThemeOption({ option, selected, onClick }) { const Icon = option.icon; return <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} type="button" role="radio" aria-checked={selected} onClick={onClick} className={`relative flex items-center gap-3 rounded-2xl border p-4 text-left transition ${selected ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]' : 'border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-secondary)]'}`}><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-surface)]"><Icon className="h-5 w-5"/></span><span className="text-sm font-semibold">{option.label}</span>{selected && <Check className="absolute right-3 top-3 h-4 w-4"/>}</motion.button>; }
function PrimaryButton({ busy, disabled, icon: Icon, label, busyLabel }) { return <motion.button whileHover={!busy && !disabled ? { y: -2 } : {}} whileTap={!busy && !disabled ? { scale: 0.98 } : {}} type="submit" disabled={busy || disabled} className="inline-flex min-w-44 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50">{busy ? <Loader2 className="h-4 w-4 animate-spin"/> : <Icon className="h-4 w-4"/>}{busy ? busyLabel : label}</motion.button>; }
function PlaceholderCard({ icon, title, description, detail, delay }) { return <Card icon={icon} title={title} description={description} delay={delay}><div className="flex flex-col gap-4 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-muted)] p-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-[var(--text-secondary)]">{detail}</p><button type="button" disabled className="w-fit rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--text-muted)] opacity-60">Coming Soon</button></div></Card>; }
