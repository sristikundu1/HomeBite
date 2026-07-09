import DashboardHeader from '../../components/dashboard/DashboardHeader';
import EmptyState from '../../components/dashboard/EmptyState';

export default function NotFound() {
  return (
    <div className="space-y-8">
      <DashboardHeader title="Dashboard Page" description="This dashboard destination is reserved for a future feature." />
      <EmptyState title="Coming Soon" description="This section is part of the dashboard foundation and will be implemented later." />
    </div>
  );
}
