import { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { getUserRoleByEmail } from '../services/usersApi';

export default function useRole() {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadRole() {
      if (authLoading) {
        return;
      }

      if (!user?.email) {
        setRole(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await getUserRoleByEmail(user.email);

        if (isMounted) {
          setRole(response.data.role);
        }
      } catch {
        if (isMounted) {
          setRole(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadRole();

    return () => {
      isMounted = false;
    };
  }, [authLoading, user?.email]);

  return { role, loading };
}
