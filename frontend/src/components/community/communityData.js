import { Calendar, ChefHat, HeartHandshake, Star, Users } from 'lucide-react';

export const communityStats = [
  { id: 1, label: 'Community Members', value: '42K+', icon: Users },
  { id: 2, label: 'Verified Home Chefs', value: '1.2K+', icon: ChefHat },
  { id: 3, label: 'Shared Meals', value: '88K+', icon: HeartHandshake },
  { id: 4, label: 'Average Rating', value: '4.9', icon: Star }
];

export const featuredChefs = [
  {
    id: 1,
    name: 'Amina Rahman',
    cuisine: 'Bengali comfort food',
    location: 'Queens, NY',
    rating: '4.9',
    story: 'Amina shares family recipes that turn weeknight dinners into neighborhood gatherings.',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 2,
    name: 'Marco Silva',
    cuisine: 'Mediterranean plates',
    location: 'Austin, TX',
    rating: '4.8',
    story: 'Marco helps new customers discover seasonal dishes made with local market produce.',
    image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 3,
    name: 'Priya Kapoor',
    cuisine: 'Vegetarian feasts',
    location: 'Seattle, WA',
    rating: '5.0',
    story: 'Priya builds nourishing menus for families who want flavor without compromise.',
    image: 'https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?auto=format&fit=crop&w=900&q=85'
  }
];

export const stories = [
  {
    id: 1,
    title: 'The Sunday table that became a small business',
    author: 'Leila Morgan',
    quote:
      'HomeBite helped my grandmother’s recipes find new homes. Every order feels like a conversation with my city.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 2,
    title: 'How neighbors found their favorite local chef',
    author: 'Daniel Kim',
    quote:
      'We started ordering once a month. Now our whole building waits for chef night.',
    image: 'https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=900&q=85'
  }
];

export const events = [
  {
    id: 1,
    title: 'Home Chef Open Kitchen',
    date: 'July 24',
    time: '6:00 PM',
    location: 'San Francisco',
    icon: Calendar
  },
  {
    id: 2,
    title: 'Neighborhood Tasting Night',
    date: 'August 3',
    time: '5:30 PM',
    location: 'Brooklyn',
    icon: Calendar
  },
  {
    id: 3,
    title: 'Meal Prep Skills Workshop',
    date: 'August 18',
    time: '11:00 AM',
    location: 'Online',
    icon: Calendar
  }
];

export const galleryPhotos = [
  {
    id: 1,
    title: 'Shared dinner night',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 2,
    title: 'Chef prep table',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 3,
    title: 'Fresh local meal',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 4,
    title: 'Community cooking class',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 5,
    title: 'Market ingredients',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 6,
    title: 'Homemade comfort bowl',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85'
  }
];
