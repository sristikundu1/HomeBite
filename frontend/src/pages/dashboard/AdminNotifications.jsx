import { Bell, ChefHat, Package, ShieldCheck, Users } from 'lucide-react';
import { useCallback } from 'react';
import Notifications from './Notifications';

const adminFilters = [
  { key: 'all', label: 'All Notifications', icon: Bell },
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'chef-applications', label: 'Chef Applications', icon: ChefHat },
  { key: 'system', label: 'System', icon: ShieldCheck }
];

export default function AdminNotifications() {
  const categoryResolver = useCallback((notification) => {
    const type = String(notification?.type || '').trim().toLowerCase();
    const content = `${notification?.title || ''} ${notification?.message || ''}`.toLowerCase();

    if (type.includes('chef-application') || type.includes('chef_application') || /chef\s+application|become\s+a\s+chef/.test(content)) return 'chef-applications';
    if (type.includes('order') || /\b(order|ordered|delivery|delivered)\b/.test(content)) return 'orders';
    if (type.includes('user') || type.includes('account') || /\b(user|customer|registered|registration|account)\b/.test(content)) return 'users';
    return 'system';
  }, []);

  return (
    <Notifications
      title="Admin Notifications"
      description="Review order, user, chef application, and platform-wide administrative updates."
      filterOptions={adminFilters}
      categoryResolver={categoryResolver}
    />
  );
}
