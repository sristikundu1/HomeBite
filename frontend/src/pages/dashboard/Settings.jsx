import DashboardHeader from '../../components/dashboard/DashboardHeader';
import EmptyState from '../../components/dashboard/EmptyState';

export default function Settings() {
  return (
    <div className="space-y-8">
      <DashboardHeader title="Settings" description="Control dashboard preferences, account options, and future notification settings." />
      <EmptyState title="Settings Coming Soon" description="Settings controls will be added when the dashboard features are implemented." />
    </div>
  );
}
