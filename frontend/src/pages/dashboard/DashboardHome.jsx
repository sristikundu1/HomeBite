import { Navigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';

const overviewRoutes = {
  admin: '/dashboard/admin',
  chef: '/dashboard/chef',
  customer: '/dashboard/customer'
};

export default function DashboardHome() {
  const { dbUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Opening dashboard">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
      </div>
    );
  }

  return <Navigate to={overviewRoutes[dbUser?.role] || '/'} replace />;
}
