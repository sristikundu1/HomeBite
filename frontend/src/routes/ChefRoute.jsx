import { Navigate } from 'react-router-dom';
import useRole from '../hooks/useRole';

function RoleLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)]">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
    </div>
  );
}

export default function ChefRoute({ children }) {
  const { role, loading } = useRole();

  if (loading) {
    return <RoleLoading />;
  }

  if (role !== 'chef') {
    return <Navigate to="/" replace />;
  }

  return children;
}
