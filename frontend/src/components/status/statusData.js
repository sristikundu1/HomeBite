import {
  BadgeCheck,
  CalendarClock,
  CreditCard,
  Database,
  Globe2,
  KeyRound,
  MessageCircle,
  Search,
  Server
} from 'lucide-react';

export const statusStyles = {
  Operational: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  Maintenance: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  'Partial Outage': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  'Major Outage': 'bg-red-500/10 text-red-500 border-red-500/20'
};

export const services = [
  {
    name: 'Website',
    status: 'Operational',
    lastChecked: '2 min ago',
    icon: Globe2
  },
  {
    name: 'API',
    status: 'Operational',
    lastChecked: '1 min ago',
    icon: Server
  },
  {
    name: 'Authentication',
    status: 'Operational',
    lastChecked: '3 min ago',
    icon: KeyRound
  },
  {
    name: 'Payments',
    status: 'Maintenance',
    lastChecked: '5 min ago',
    icon: CreditCard
  },
  {
    name: 'Database',
    status: 'Operational',
    lastChecked: '1 min ago',
    icon: Database
  },
  {
    name: 'Chat',
    status: 'Partial Outage',
    lastChecked: '4 min ago',
    icon: MessageCircle
  },
  {
    name: 'Search',
    status: 'Operational',
    lastChecked: '2 min ago',
    icon: Search
  }
];

export const incidents = [
  {
    date: 'July 8, 2026',
    issue: 'Chat delivery delay',
    resolution: 'Message queue workers were scaled and delayed messages were replayed.',
    duration: '24 minutes'
  },
  {
    date: 'July 3, 2026',
    issue: 'Payment confirmation latency',
    resolution: 'Webhook retries were restored after provider-side instability.',
    duration: '18 minutes'
  },
  {
    date: 'June 29, 2026',
    issue: 'Search indexing lag',
    resolution: 'Index refresh workers were restarted and monitoring thresholds were adjusted.',
    duration: '31 minutes'
  }
];

export const maintenance = [
  {
    title: 'Payment gateway upgrade',
    date: 'July 12, 2026',
    window: '02:00 AM - 03:00 AM UTC',
    impact: 'Payments may briefly show delayed confirmations.',
    icon: CalendarClock
  },
  {
    title: 'Search infrastructure tuning',
    date: 'July 18, 2026',
    window: '01:00 AM - 02:30 AM UTC',
    impact: 'Search results may refresh slower during the window.',
    icon: BadgeCheck
  }
];
