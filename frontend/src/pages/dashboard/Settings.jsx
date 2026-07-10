import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Bell, Check, Globe2, KeyRound, Languages, Laptop, Loader2, LockKeyhole, LogOut, MessageCircle, Moon, Save, ShieldOff, Sparkles, Star, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { useAuth } from '../../providers/AuthProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { deactivateCustomerAccount, updateCustomerNotificationPreferences } from '../../services/usersApi';
import { getFirebaseErrorMessage } from '../../utils/firebaseErrorMessage';

const inputClass = 'mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]';
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const defaultPreferences = { orderNotifications: true, newReviewNotifications: true, messages: true, promotions: false, systemUpdates: true };
const preferenceOptions = [
  { key: 'orderNotifications', label: 'Order Updates', description: 'Status changes and important activity for your orders.', icon: Bell },
  { key: 'newReviewNotifications', label: 'Review Reminders', description: 'Reminders to review completed meal orders.', icon: Star },
  { key: 'messages', label: 'Messages', description: 'New messages from chefs and HomeBite support.', icon: MessageCircle },
  { key: 'promotions', label: 'Promotions', description: 'Meal offers and HomeBite promotions.', icon: Sparkles },
  { key: 'systemUpdates', label: 'System Updates', description: 'Account, security, and platform announcements.', icon: Laptop }
];

export default function Settings() {
  const navigate = useNavigate();
  const { user, dbUser, changePassword, refreshDbUser, logout } = useAuth();
  const { themePreference, setTheme } = useTheme();
  const email = (dbUser?.email || user?.email || '').trim().toLowerCase();
  const providerIds = user?.providerData?.map((provider) => provider.providerId) || [];
  const usesPassword = providerIds.includes('password');
  const usesGoogle = providerIds.includes('google.com');
  const [language, setLanguage] = useState('en');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const passwordForm = useForm({ defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' }, mode: 'onBlur' });
  const preferenceForm = useForm({ defaultValues: defaultPreferences });
  const preferences = preferenceForm.watch();

  useEffect(() => {
    preferenceForm.reset({ ...defaultPreferences, ...(dbUser?.notificationPreferences || {}) });
  }, [dbUser?.notificationPreferences, preferenceForm.reset]);

  async function submitPassword(values) {
    try {
      await changePassword(values.currentPassword, values.newPassword);
      passwordForm.reset();
      toast.success('Password updated successfully.');
    } catch (error) { toast.error(getFirebaseErrorMessage(error)); }
  }

  async function submitPreferences(values) {
    try {
      await updateCustomerNotificationPreferences(email, values);
      await refreshDbUser().catch(() => {});
      preferenceForm.reset(values);
      toast.success('Notification preferences saved.');
    } catch (error) { toast.error(error.response?.data?.message || 'Unable to save notification preferences.'); }
  }

  async function confirmDelete() {
    if (deactivating) return;
    setDeactivating(true);
    setDeleteError('');
    try {
      await deactivateCustomerAccount(email);
      toast.success('Your account has been deactivated.');
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to deactivate your account.';
      setDeleteError(message);
      toast.error(message);
    } finally { setDeactivating(false); }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <DashboardHeader title="Customer Settings" description="Manage security, notifications, appearance, language, and your account." />

      {usesPassword ? (
        <SettingsCard icon={KeyRound} title="Change Password" description="Choose a strong password you do not use elsewhere." delay={0.03}>
          <form onSubmit={passwordForm.handleSubmit(submitPassword)} noValidate className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2"><PasswordField label="Current Password" name="currentPassword" register={passwordForm.register} error={passwordForm.formState.errors.currentPassword} rules={{ required: 'Current password is required.' }} /></div><PasswordField label="New Password" name="newPassword" register={passwordForm.register} error={passwordForm.formState.errors.newPassword} rules={{ required: 'New password is required.', pattern: { value: passwordPattern, message: 'Use 8+ characters with uppercase, lowercase, number, and special character.' } }} /><PasswordField label="Confirm Password" name="confirmPassword" register={passwordForm.register} error={passwordForm.formState.errors.confirmPassword} rules={{ required: 'Confirm your new password.', validate: (value) => value === passwordForm.getValues('newPassword') || 'Passwords do not match.' }} /></div>
            <PasswordRequirements />
            <div className="flex justify-end"><PrimaryButton type="submit" busy={passwordForm.formState.isSubmitting} icon={LockKeyhole} label="Update Password" busyLabel="Updating..." /></div>
          </form>
        </SettingsCard>
      ) : usesGoogle ? (
        <SettingsCard icon={KeyRound} title="Change Password" description="Password management depends on your sign-in provider." delay={0.03}><div className="flex items-center gap-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500"><Globe2 className="h-5 w-5" /></span><div><p className="text-sm font-semibold text-[var(--text-primary)]">This account uses Google Sign-In.</p><p className="mt-1 text-xs text-[var(--text-muted)]">Manage your password through your Google account.</p></div></div></SettingsCard>
      ) : null}

      <SettingsCard icon={Bell} title="Notification Preferences" description="Choose which HomeBite updates you want to receive." delay={0.06}>
        <form onSubmit={preferenceForm.handleSubmit(submitPreferences)} className="space-y-4">{preferenceOptions.map((option) => <PreferenceRow key={option.key} option={option} checked={Boolean(preferences[option.key])} onChange={(checked) => preferenceForm.setValue(option.key, checked, { shouldDirty: true })} />)}<div className="flex justify-end pt-2"><PrimaryButton type="submit" busy={preferenceForm.formState.isSubmitting} icon={Save} label="Save Preferences" busyLabel="Saving..." disabled={!preferenceForm.formState.isDirty} /></div></form>
      </SettingsCard>

      <SettingsCard icon={Sun} title="Theme" description="Choose how HomeBite looks across this browser." delay={0.09}><fieldset><legend className="sr-only">Theme preference</legend><div className="grid gap-3 sm:grid-cols-3">{[{ value: 'light', label: 'Light', icon: Sun }, { value: 'dark', label: 'Dark', icon: Moon }, { value: 'system', label: 'System', icon: Laptop }].map((option) => <ThemeOption key={option.value} option={option} selected={themePreference === option.value} onClick={() => setTheme(option.value)} />)}</div></fieldset></SettingsCard>

      <SettingsCard icon={Languages} title="Language" description="Language selection is a placeholder; translations are not enabled yet." delay={0.12}><label htmlFor="customer-language" className="block max-w-md text-sm font-semibold text-[var(--text-secondary)]">Display Language<select id="customer-language" value={language} onChange={(event) => setLanguage(event.target.value)} className={inputClass}><option value="en">English</option><option value="bn">বাংলা</option><option value="it">Italiano</option></select><span className="mt-2 block text-xs font-normal text-[var(--text-muted)]">Your selection is not saved yet.</span></label></SettingsCard>

      <SettingsCard icon={ShieldOff} title="Delete Account" description="Deactivate your customer account without deleting your history." delay={0.15} danger><div className="flex flex-col gap-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-[var(--text-primary)]">Deactivate customer account</p><p className="mt-2 max-w-2xl text-xs leading-6 text-[var(--text-muted)]">Orders, payments, reviews, messages, notifications, and saved history remain stored. You must complete active orders first.</p></div><button type="button" onClick={() => { setDeleteError(''); setConfirmOpen(true); }} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500/20"><ShieldOff className="h-4 w-4" /> Delete Account</button></div></SettingsCard>

      <SettingsCard icon={LogOut} title="Logout All Devices" description="End active HomeBite sessions on every device." delay={0.18}><div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-[var(--text-primary)]">Remote session management</p><p className="mt-1 text-xs text-[var(--text-muted)]">This security feature is not available yet.</p></div><button type="button" disabled className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--text-muted)] opacity-60">Coming Soon</button></div></SettingsCard>

      <AnimatePresence>{confirmOpen && <DeleteAccountModal busy={deactivating} error={deleteError} onClose={() => !deactivating && setConfirmOpen(false)} onConfirm={confirmDelete} />}</AnimatePresence>
    </div>
  );
}

function SettingsCard({ icon: Icon, title, description, children, delay, danger = false }) { return <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className={`rounded-[2rem] border bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5 sm:p-6 ${danger ? 'border-red-500/20' : 'border-[var(--border)]'}`}><div className="mb-6 flex items-center gap-4"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${danger ? 'bg-red-500/10 text-red-500' : 'bg-[var(--accent-soft)] text-[var(--accent)]'}`}><Icon className="h-5 w-5" /></span><div><h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2><p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{description}</p></div></div>{children}</motion.section>; }
function PasswordField({ label, name, register, error, rules }) { return <label htmlFor={name} className="block text-sm font-semibold text-[var(--text-secondary)]">{label}<input id={name} type="password" autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'} aria-invalid={Boolean(error)} className={inputClass} {...register(name, rules)} />{error && <span role="alert" className="mt-2 block text-xs font-medium text-red-500">{error.message}</span>}</label>; }
function PasswordRequirements() { return <div className="rounded-2xl bg-[var(--bg-muted)] p-4"><p className="text-xs font-semibold text-[var(--text-primary)]">Password requirements</p><div className="mt-3 grid gap-2 text-xs text-[var(--text-muted)] sm:grid-cols-2">{['At least 8 characters', 'One uppercase letter', 'One lowercase letter', 'One number', 'One special character'].map((item) => <span key={item} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-500" />{item}</span>)}</div></div>; }
function PreferenceRow({ option, checked, onChange }) { const Icon = option.icon; return <div className="flex items-center justify-between gap-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-4"><div className="flex min-w-0 items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--accent)]"><Icon className="h-4 w-4" /></span><div><p className="text-sm font-semibold text-[var(--text-primary)]">{option.label}</p><p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{option.description}</p></div></div><Switch checked={checked} onChange={onChange} label={option.label} /></div>; }
function Switch({ checked, onChange, label }) { return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-7 w-12 shrink-0 rounded-full transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] ${checked ? 'bg-[var(--accent)]' : 'bg-slate-400/40'}`}><motion.span animate={{ x: checked ? 22 : 3 }} transition={{ type: 'spring', stiffness: 500, damping: 32 }} className="absolute left-0 top-1 h-5 w-5 rounded-full bg-white shadow" /></button>; }
function ThemeOption({ option, selected, onClick }) { const Icon = option.icon; return <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} type="button" role="radio" aria-checked={selected} onClick={onClick} className={`relative flex items-center gap-3 rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] ${selected ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]' : 'border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-secondary)]'}`}><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-surface)]"><Icon className="h-5 w-5" /></span><span className="text-sm font-semibold">{option.label}</span>{selected && <Check className="absolute right-3 top-3 h-4 w-4" />}</motion.button>; }
function PrimaryButton({ type, busy, icon: Icon, label, busyLabel, disabled }) { return <motion.button whileHover={!busy && !disabled ? { y: -2 } : {}} whileTap={!busy && !disabled ? { scale: 0.98 } : {}} type={type} disabled={busy || disabled} className="inline-flex min-w-44 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}{busy ? busyLabel : label}</motion.button>; }
function DeleteAccountModal({ busy, error, onClose, onConfirm }) { useEffect(() => { const close = (event) => event.key === 'Escape' && !busy && onClose(); window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, [busy, onClose]); return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="delete-account-title" onMouseDown={onClose}><motion.div initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }} onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-[2rem] border border-red-500/20 bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-elevated)] sm:p-7"><div className="flex items-start justify-between gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500"><AlertTriangle className="h-6 w-6" /></span><button type="button" onClick={onClose} disabled={busy} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] disabled:opacity-40" aria-label="Close confirmation"><X className="h-4 w-4" /></button></div><h2 id="delete-account-title" className="mt-5 text-2xl font-semibold text-[var(--text-primary)]">Delete your account?</h2><p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">We will check for active orders first. If none exist, your customer account becomes inactive and you will be logged out. Your historical data will not be deleted.</p>{error && <div role="alert" className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm font-medium text-red-500">{error}</div>}<div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} disabled={busy} className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--text-secondary)] disabled:opacity-40">Cancel</button><button type="button" onClick={onConfirm} disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 disabled:opacity-50">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldOff className="h-4 w-4" />}{busy ? 'Checking Active Orders...' : 'Deactivate Account'}</button></div></motion.div></motion.div>; }
