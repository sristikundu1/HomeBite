import DashboardHeader from '../../components/dashboard/DashboardHeader';
import EmptyState from '../../components/dashboard/EmptyState';

export default function Profile() {
  return (
    <div className="space-y-8">
      <DashboardHeader title="Profile" description="Manage your account profile and marketplace identity from this section." />
      <EmptyState title="Profile Coming Soon" description="Profile editing and account details will be connected later." />
    </div>
  );
}
