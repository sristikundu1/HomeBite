import { motion } from 'framer-motion';
import { CalendarDays, Check, Clock3, Coffee, Loader2, PackageCheck, Save, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { useAuth } from '../../providers/AuthProvider';
import { getUserByEmail, updateChefAvailability } from '../../services/usersApi';

const days = [
  { value: 'monday', short: 'Mon', label: 'Monday' },
  { value: 'tuesday', short: 'Tue', label: 'Tuesday' },
  { value: 'wednesday', short: 'Wed', label: 'Wednesday' },
  { value: 'thursday', short: 'Thu', label: 'Thursday' },
  { value: 'friday', short: 'Fri', label: 'Friday' },
  { value: 'saturday', short: 'Sat', label: 'Saturday' },
  { value: 'sunday', short: 'Sun', label: 'Sunday' }
];

const defaultAvailability = {
  acceptingOrders: true,
  workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  openingTime: '09:00',
  closingTime: '21:00',
  vacationMode: false,
  maximumDailyOrders: 20
};

function currentAvailabilityStatus(settings, now) {
  if (settings.vacationMode) return { label: 'On Vacation', description: 'Orders are paused until vacation mode is turned off.', tone: 'text-violet-500 bg-violet-500/10 border-violet-500/20' };
  if (!settings.acceptingOrders) return { label: 'Not Accepting Orders', description: 'Customers cannot place new orders with you.', tone: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
  const today = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  if (!settings.workingDays.includes(today)) return { label: 'Closed Today', description: 'Today is not included in your working days.', tone: 'text-slate-500 bg-slate-500/10 border-slate-500/20' };
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  if (currentTime < settings.openingTime) return { label: 'Opening Later', description: `You start accepting today at ${settings.openingTime}.`, tone: 'text-blue-500 bg-blue-500/10 border-blue-500/20' };
  if (currentTime >= settings.closingTime) return { label: 'Closed for Today', description: `Your closing time was ${settings.closingTime}.`, tone: 'text-slate-500 bg-slate-500/10 border-slate-500/20' };
  return { label: 'Open & Accepting Orders', description: `Available until ${settings.closingTime} today.`, tone: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
}

export default function ChefAvailability() {
  const { user, dbUser } = useAuth();
  const email = (dbUser?.email || user?.email || '').trim().toLowerCase();
  const [settings, setSettings] = useState(defaultAvailability);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    let active = true;
    if (!email) return undefined;
    getUserByEmail(email)
      .then((response) => {
        if (!active) return;
        const saved = response.data.user?.availability;
        setSettings(saved ? { ...defaultAvailability, ...saved } : defaultAvailability);
      })
      .catch(() => toast.error('Unable to load availability settings.'))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [email]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const status = useMemo(() => currentAvailabilityStatus(settings, now), [now, settings]);
  const invalid = !settings.workingDays.length || settings.openingTime >= settings.closingTime || settings.maximumDailyOrders < 1 || settings.maximumDailyOrders > 500;

  function toggleDay(day) {
    setSettings((current) => ({
      ...current,
      workingDays: current.workingDays.includes(day) ? current.workingDays.filter((item) => item !== day) : [...current.workingDays, day]
    }));
  }

  async function saveSettings(event) {
    event.preventDefault();
    if (invalid || saving) return;
    setSaving(true);
    try {
      const response = await updateChefAvailability(email, settings);
      setSettings((current) => ({ ...current, ...response.data.data }));
      toast.success('Availability settings saved.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save availability settings.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AvailabilitySkeleton />;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <DashboardHeader title="Availability" description="Set your kitchen schedule, daily capacity, and whether customers can currently place orders." />

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col gap-4 rounded-[2rem] border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 ${status.tone}`}>
        <div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-current/10"><ShieldCheck className="h-6 w-6" /></span><div><p className="text-xs font-bold uppercase tracking-[0.2em] opacity-75">Current Status</p><h2 className="mt-1 text-xl font-semibold text-current">{status.label}</h2><p className="mt-1 text-sm text-[var(--text-secondary)]">{status.description}</p></div></div><span className="inline-flex self-start rounded-full border border-current/20 px-3 py-1 text-xs font-bold">Live</span>
      </motion.section>

      <form onSubmit={saveSettings} className="space-y-6">
        <SettingsCard icon={PackageCheck} title="Order Availability" description="Control whether your kitchen receives new customer orders." delay={0.05}>
          <SettingRow label="Accepting Orders" description="Allow customers to place new orders from your active menu."><Switch checked={settings.acceptingOrders} onChange={(checked) => setSettings((current) => ({ ...current, acceptingOrders: checked }))} label="Accepting Orders" /></SettingRow>
          <SettingRow label="Vacation Mode" description="Temporarily pause incoming orders while you are away."><Switch checked={settings.vacationMode} onChange={(checked) => setSettings((current) => ({ ...current, vacationMode: checked }))} label="Vacation Mode" /></SettingRow>
        </SettingsCard>

        <SettingsCard icon={CalendarDays} title="Working Days" description="Choose the days your kitchen normally operates." delay={0.1}>
          <fieldset><legend className="sr-only">Select working days</legend><div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">{days.map((day) => { const selected = settings.workingDays.includes(day.value); return <button key={day.value} type="button" role="checkbox" aria-checked={selected} onClick={() => toggleDay(day.value)} className={`relative rounded-2xl border px-3 py-4 text-center transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] ${selected ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]' : 'border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:border-[var(--accent)]'}`}><span className="block text-sm font-bold">{day.short}</span><span className="mt-1 hidden text-[10px] sm:block">{day.label}</span>{selected && <Check className="absolute right-2 top-2 h-3 w-3" />}</button>; })}</div>{!settings.workingDays.length && <p role="alert" className="mt-3 text-xs font-medium text-red-500">Select at least one working day.</p>}</fieldset>
        </SettingsCard>

        <SettingsCard icon={Clock3} title="Working Hours" description="Set the opening and closing time shown for your kitchen." delay={0.15}>
          <div className="grid gap-5 sm:grid-cols-2"><TimeField label="Opening Time" value={settings.openingTime} onChange={(value) => setSettings((current) => ({ ...current, openingTime: value }))} /><TimeField label="Closing Time" value={settings.closingTime} onChange={(value) => setSettings((current) => ({ ...current, closingTime: value }))} /></div>{settings.openingTime >= settings.closingTime && <p role="alert" className="mt-3 text-xs font-medium text-red-500">Closing time must be later than opening time.</p>}
        </SettingsCard>

        <SettingsCard icon={Coffee} title="Daily Capacity" description="Limit how many orders your kitchen can responsibly complete each day." delay={0.2}>
          <label className="block max-w-sm text-sm font-semibold text-[var(--text-secondary)]">Maximum Daily Orders<input type="number" min="1" max="500" value={settings.maximumDailyOrders} onChange={(event) => setSettings((current) => ({ ...current, maximumDailyOrders: Number(event.target.value) }))} className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3.5 text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]" /><span className="mt-2 block text-xs font-normal text-[var(--text-muted)]">Between 1 and 500 orders per day.</span></label>
        </SettingsCard>

        <div className="flex justify-end"><motion.button whileHover={!invalid && !saving ? { y: -2 } : {}} whileTap={!invalid && !saving ? { scale: 0.98 } : {}} type="submit" disabled={invalid || saving} className="inline-flex min-w-44 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? 'Saving...' : 'Save Settings'}</motion.button></div>
      </form>
    </div>
  );
}

function SettingsCard({ icon: Icon, title, description, children, delay }) { return <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5 sm:p-6"><div className="mb-6 flex items-center gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon className="h-5 w-5" /></span><div><h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2><p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{description}</p></div></div><div className="space-y-4">{children}</div></motion.section>; }
function SettingRow({ label, description, children }) { return <div className="flex items-center justify-between gap-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-4"><div><p className="text-sm font-semibold text-[var(--text-primary)]">{label}</p><p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{description}</p></div>{children}</div>; }
function Switch({ checked, onChange, label }) { return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-7 w-12 shrink-0 rounded-full transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] ${checked ? 'bg-[var(--accent)]' : 'bg-slate-400/40'}`}><motion.span animate={{ x: checked ? 22 : 3 }} transition={{ type: 'spring', stiffness: 500, damping: 32 }} className="absolute left-0 top-1 h-5 w-5 rounded-full bg-white shadow" /></button>; }
function TimeField({ label, value, onChange }) { return <label className="text-sm font-semibold text-[var(--text-secondary)]">{label}<input type="time" required value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3.5 text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]" /></label>; }
function AvailabilitySkeleton() { return <div className="mx-auto max-w-5xl space-y-8" role="status" aria-label="Loading availability settings"><div className="space-y-3"><div className="h-4 w-24 animate-pulse rounded bg-[var(--bg-muted)]" /><div className="h-10 w-56 animate-pulse rounded bg-[var(--bg-muted)]" /></div><div className="h-32 animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" />{[1, 2, 3, 4].map((item) => <div key={item} className="h-48 animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" />)}</div>; }
