import { Bell, ChefHat, MessageCircle, Package, ShieldCheck, Star, Users } from 'lucide-react';
import { useCallback } from 'react';
import Notifications from './Notifications';

const adminFilters = [
  { key: 'all', label: 'All Notifications', icon: Bell },
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'chef-applications', label: 'Chef Applications', icon: ChefHat },
  { key: 'messages', label: 'Messages', icon: MessageCircle },
  { key: 'reviews', label: 'Reviews', icon: Star },
  { key: 'system', label: 'System', icon: ShieldCheck }
];

export default function AdminNotifications() {
  const categoryResolver = useCallback((notification) => {
    const type = String(notification?.type || '').trim().toLowerCase();
    const content = `${notification?.title || ''} ${notification?.message || ''}`.toLowerCase();

    if (type.includes('chef-application') || type.includes('chef_application') || /chef\s+application|become\s+a\s+chef/.test(content)) return 'chef-applications';
    if (type.includes('order') || /\b(order|ordered|delivery|delivered)\b/.test(content)) return 'orders';
    if (type.includes('message') || type.includes('chat') || /\b(message|messaged|chat|inbox)\b/.test(content)) return 'messages';
    if (type.includes('review') || type.includes('rating') || /\b(review|reviewed|rating|rated|stars?)\b/.test(content)) return 'reviews';
    if (type.includes('user') || type.includes('account') || /\b(user|customer|registered|registration|account)\b/.test(content)) return 'users';
    return 'system';
  }, []);

  return (
    <Notifications
      title="Admin Notifications"
      description="Review order, user, application, message, review, and platform updates."
      filterOptions={adminFilters}
      categoryResolver={categoryResolver}
    />
  );
}
