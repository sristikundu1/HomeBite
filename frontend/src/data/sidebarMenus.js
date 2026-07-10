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
    { label: 'Overview', path: '/dashboard', icon: Home },
    { label: 'My Orders', path: placeholderPath, icon: Package },
    { label: 'Track Orders', path: placeholderPath, icon: Truck },
    { label: 'Wishlist', path: '/dashboard/wishlist', icon: Heart },
    { label: 'Messages', path: placeholderPath, icon: MessageCircle },
    { label: 'Notifications', path: placeholderPath, icon: Bell },
    { label: 'My Reviews', path: placeholderPath, icon: Star },
    { label: 'Profile', path: '/dashboard/profile', icon: User },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings }
  ],
  chef: [
    { label: 'Overview', path: '/dashboard', icon: Home },
    { label: 'Manage Foods', path: '/dashboard/chef/manage-foods', icon: Utensils },
    { label: 'Add Food', path: '/dashboard/chef/add-food', icon: ChefHat },
    { label: 'Orders', path: placeholderPath, icon: ReceiptText },
    { label: 'Availability', path: placeholderPath, icon: ClipboardCheck },
    { label: 'Revenue', path: placeholderPath, icon: WalletCards },
    { label: 'Reviews', path: placeholderPath, icon: Star },
    { label: 'Messages', path: placeholderPath, icon: MessageCircle },
    { label: 'Profile', path: '/dashboard/profile', icon: User },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings }
  ],
  admin: [
    { label: 'Overview', path: '/dashboard', icon: Home },
    { label: 'Analytics', path: placeholderPath, icon: BarChart3 },
    { label: 'Manage Users', path: placeholderPath, icon: Users },
    { label: 'Chef Verification', path: '/dashboard/admin/chef-verification', icon: SearchCheck },
    { label: 'Manage Foods', path: placeholderPath, icon: Utensils },
    { label: 'Manage Orders', path: placeholderPath, icon: ReceiptText },
    { label: 'Reports', path: placeholderPath, icon: LineChart },
    { label: 'Coupons', path: placeholderPath, icon: TicketPercent },
    { label: 'Gift Cards', path: placeholderPath, icon: Gift },
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
