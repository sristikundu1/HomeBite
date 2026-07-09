import {
  BadgeDollarSign,
  BookOpen,
  ChefHat,
  CreditCard,
  LifeBuoy,
  LockKeyhole,
  PackageCheck,
  Settings,
  ShoppingBag,
  Truck,
  UserRound
} from 'lucide-react';

export const popularSearches = [
  'Track my order',
  'Refund request',
  'Become a Home Chef',
  'Payment methods',
  'Gift Cards',
  'Account settings',
  'Cancel my order',
  'Delivery time'
];

export const recentSearches = ['Order tracking', 'Wallet refund', 'Profile settings'];

export const helpCategories = [
  {
    id: 1,
    title: 'Getting Started',
    articles: 18,
    icon: BookOpen,
    color: 'from-orange-500 to-rose-500',
    description: 'Learn how HomeBite works, create an account, and place your first homemade meal order.'
  },
  {
    id: 2,
    title: 'Orders',
    articles: 32,
    icon: ShoppingBag,
    color: 'from-emerald-500 to-teal-500',
    description: 'Manage orders, track preparation, update delivery details, and understand cancellation windows.'
  },
  {
    id: 3,
    title: 'Payments',
    articles: 15,
    icon: CreditCard,
    color: 'from-sky-500 to-indigo-500',
    description: 'Find help with payment methods, receipts, refunds, wallet credit, and secure checkout.'
  },
  {
    id: 4,
    title: 'Delivery',
    articles: 24,
    icon: Truck,
    color: 'from-amber-500 to-orange-500',
    description: 'Understand delivery windows, pickup options, live updates, and what to do if a meal is delayed.'
  },
  {
    id: 5,
    title: 'Home Chefs',
    articles: 14,
    icon: ChefHat,
    color: 'from-fuchsia-500 to-rose-500',
    description: 'Apply to become a chef, manage listings, set availability, and keep your kitchen profile polished.'
  },
  {
    id: 6,
    title: 'Account',
    articles: 11,
    icon: UserRound,
    color: 'from-slate-600 to-slate-900',
    description: 'Update your profile, password, notification preferences, saved addresses, and account security.'
  }
];

export const popularArticles = [
  {
    id: 1,
    title: 'How to place your first HomeBite order',
    category: 'Orders',
    description: 'A simple walkthrough for browsing local chefs, choosing a dish, checking out, and tracking your meal.',
    readTime: '4 min read',
    icon: PackageCheck
  },
  {
    id: 2,
    title: 'Understanding refunds and wallet credit',
    category: 'Payments',
    description: 'Learn how refund timing works, when wallet credit applies, and how payment providers process returns.',
    readTime: '5 min read',
    icon: BadgeDollarSign
  },
  {
    id: 3,
    title: 'Becoming a verified Home Chef',
    category: 'Home Chefs',
    description: 'Everything you need to know about applying, verification, menu setup, and accepting your first order.',
    readTime: '6 min read',
    icon: ChefHat
  },
  {
    id: 4,
    title: 'Keeping your account secure',
    category: 'Account',
    description: 'Best practices for password resets, email updates, and protecting your personal order information.',
    readTime: '3 min read',
    icon: LockKeyhole
  },
  {
    id: 5,
    title: 'How delivery windows are estimated',
    category: 'Delivery',
    description: 'See how chef preparation time, distance, and courier availability shape your delivery estimate.',
    readTime: '4 min read',
    icon: Truck
  },
  {
    id: 6,
    title: 'Managing notification preferences',
    category: 'Account',
    description: 'Customize alerts for orders, chef updates, promotions, and community announcements.',
    readTime: '2 min read',
    icon: Settings
  }
];

export const searchableArticles = [
  { id: 1, title: 'How to place your first order', category: 'Orders' },
  { id: 2, title: 'How refunds work', category: 'Payments' },
  { id: 3, title: 'How to become a Home Chef', category: 'Home Chefs' },
  { id: 4, title: 'Track your delivery', category: 'Delivery' },
  { id: 5, title: 'Reset your password', category: 'Account' },
  { id: 6, title: 'Update payment method', category: 'Payments' }
];

export const faqData = [
  {
    id: 1,
    question: 'How do I place my first order?',
    answer:
      'Browse meals, choose a chef, select your preferred delivery time, complete payment, and track your order in real time.'
  },
  {
    id: 2,
    question: 'Can I cancel my order?',
    answer:
      'Yes. Orders can be cancelled before the chef starts preparing the meal. Refund eligibility depends on the cancellation time.'
  },
  {
    id: 3,
    question: 'How long do refunds take?',
    answer: 'Refunds are usually processed within 3 to 7 business days depending on your payment provider.'
  },
  {
    id: 4,
    question: 'How can I become a Home Chef?',
    answer:
      'Go to the Become a Chef page, submit your application, complete verification, and start listing your homemade meals.'
  },
  {
    id: 5,
    question: 'How can I contact support?',
    answer: 'Visit our Contact page, send us an email, or submit a support ticket directly from the Help Center.'
  },
  {
    id: 6,
    question: 'Is my payment secure?',
    answer: 'Yes. All payments are encrypted and processed securely using trusted payment providers.'
  }
];

export const supportOptions = [
  {
    id: 1,
    title: 'Contact Support',
    description: 'Get help from the HomeBite team for account, order, or payment questions.',
    icon: LifeBuoy,
    href: '/contact'
  },
  {
    id: 2,
    title: 'Read Cooking Guides',
    description: 'Explore practical guides for customers and home chefs building better food experiences.',
    icon: BookOpen,
    href: '/cooking-guides'
  },
  {
    id: 3,
    title: 'Become a Home Chef',
    description: 'Start your chef application and learn how to share your homemade meals locally.',
    icon: ChefHat,
    href: '/cook'
  }
];
