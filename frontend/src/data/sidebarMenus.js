import {
  BarChart3,
  Bell,
  ChefHat,
  ClipboardCheck,
  Gift,
  Heart,
  Home,
  LineChart,
  MessageCircle,
  Package,
  ReceiptText,
  SearchCheck,
  Settings,
  ShoppingCart,
  Star,
  TicketPercent,
  Truck,
  User,
  Users,
  Utensils,
  WalletCards
} from 'lucide-react';

const placeholderPath = '/dashboard';
const becomeChefItem = { label: 'Become a Chef', path: '/cook', icon: ChefHat };
const applicationStatusItem = { label: 'Application Status', path: '/application-status', icon: ClipboardCheck };
const applyAgainItem = { label: 'Apply Again', path: '/cook', icon: ChefHat };

export const sidebarMenus = {
  customer: [
    { label: 'Overview', path: '/dashboard/customer', icon: Home },
    { label: 'My Orders', path: '/dashboard/orders', icon: Package },
    { label: 'My Cart', path: '/dashboard/cart', icon: ShoppingCart },
    { label: 'Track Orders', path: placeholderPath, icon: Truck },
    { label: 'Wishlist', path: '/dashboard/wishlist', icon: Heart },
    { label: 'Messages', path: '/dashboard/messages', icon: MessageCircle },
    { label: 'Notifications', path: '/dashboard/notifications', icon: Bell },
    { label: 'My Reviews', path: '/dashboard/reviews', icon: Star },
    { label: 'Profile', path: '/dashboard/profile', icon: User },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings }
  ],
  chef: [
    { label: 'Overview', path: '/dashboard/chef', icon: Home },
    { label: 'Manage Foods', path: '/dashboard/chef/manage-foods', icon: Utensils },
    { label: 'Add Food', path: '/dashboard/chef/add-food', icon: ChefHat },
    { label: 'Orders', path: '/dashboard/chef/orders', icon: ReceiptText },
    { label: 'Availability', path: '/dashboard/chef/availability', icon: ClipboardCheck },
    { label: 'Revenue', path: '/dashboard/chef/revenue', icon: WalletCards },
    { label: 'Reviews', path: '/dashboard/chef/reviews', icon: Star },
    { label: 'Messages', path: '/dashboard/chef/messages', icon: MessageCircle },
    { label: 'Notifications', path: '/dashboard/notifications', icon: Bell },
    { label: 'Profile', path: '/dashboard/chef/profile', icon: User },
    { label: 'Settings', path: '/dashboard/chef/settings', icon: Settings }
  ],
  admin: [
    { label: 'Overview', path: '/dashboard/admin', icon: Home },
    { label: 'Analytics', path: placeholderPath, icon: BarChart3 },
    { label: 'Manage Users', path: '/dashboard/admin/users', icon: Users },
    { label: 'Chef Verification', path: '/dashboard/admin/chef-verification', icon: SearchCheck },
    { label: 'Manage Foods', path: '/dashboard/admin/foods', icon: Utensils },
    { label: 'Manage Orders', path: placeholderPath, icon: ReceiptText },
    { label: 'Messages', path: '/dashboard/messages', icon: MessageCircle },
    { label: 'Notifications', path: '/dashboard/notifications', icon: Bell },
    { label: 'Reports', path: placeholderPath, icon: LineChart },
    { label: 'Coupons', path: placeholderPath, icon: TicketPercent },
    { label: 'Gift Cards', path: placeholderPath, icon: Gift },
    { label: 'Profile', path: '/dashboard/admin/profile', icon: User },
    { label: 'Platform Settings', path: '/dashboard/admin/platform-settings', icon: Settings },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings }
  ]
};

export function getSidebarMenu(role = 'customer', chefStatus = 'none') {
  if (role !== 'customer') {
    return sidebarMenus[role] || sidebarMenus.customer;
  }

  const chefApplicationItems = {
    pending: [applicationStatusItem],
    rejected: [applicationStatusItem, applyAgainItem],
    approved: []
  };

  const dynamicItems = chefApplicationItems[chefStatus] || [becomeChefItem];
  const profileIndex = sidebarMenus.customer.findIndex((item) => item.label === 'Profile');

  if (profileIndex === -1) {
    return [...sidebarMenus.customer, ...dynamicItems];
  }

  return [
    ...sidebarMenus.customer.slice(0, profileIndex),
    ...dynamicItems,
    ...sidebarMenus.customer.slice(profileIndex)
  ];
}
