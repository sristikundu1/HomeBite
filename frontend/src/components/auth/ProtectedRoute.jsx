import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';

export default function ProtectedRoute({ children }) {
  const { user, dbUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (['suspended', 'inactive', 'deleted'].includes(String(dbUser?.status || '').toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  return children;
}
