import { Sparkles } from 'lucide-react';
import DashboardCard from './DashboardCard';

export default function EmptyState({ title = 'Coming Soon', description = 'This dashboard section is ready for future features.' }) {
  return (
    <DashboardCard className="text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-muted)] text-[var(--accent)]">
        <Sparkles size={24} />
      </span>
      <h2 className="mt-5 text-2xl font-semibold text-[var(--text-primary)]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">{description}</p>
    </DashboardCard>
  );
}
