import DashboardHeader from '../../components/dashboard/DashboardHeader';
import EmptyState from '../../components/dashboard/EmptyState';

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      <DashboardHeader title="Overview" description="Your HomeBite dashboard overview will appear here as features are added." />
      <EmptyState title="Overview Coming Soon" description="Orders, activity, and role-specific insights will be connected in a future step." />
    </div>
  );
}
