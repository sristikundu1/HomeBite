import { BookOpen, CakeSlice, ChefHat, Flame, Leaf, Utensils } from 'lucide-react';

export const guideCategories = [
  {
    id: 1,
    title: 'Weeknight Cooking',
    description: 'Fast, balanced meals for busy evenings.',
    icon: Flame,
    count: '18 guides'
  },
  {
    id: 2,
    title: 'Chef Techniques',
    description: 'Knife skills, sauces, prep, and plating basics.',
    icon: ChefHat,
    count: '22 guides'
  },
  {
    id: 3,
    title: 'Healthy Homemade',
    description: 'Fresh meals with smart ingredients and real flavor.',
    icon: Leaf,
    count: '16 guides'
  },
  {
    id: 4,
    title: 'Family Favorites',
    description: 'Comfort dishes designed for sharing.',
    icon: Utensils,
    count: '24 guides'
  },
  {
    id: 5,
    title: 'Baking & Sweets',
    description: 'Desserts, pastries, and cozy weekend bakes.',
    icon: CakeSlice,
    count: '12 guides'
  },
  {
    id: 6,
    title: 'Chef Business',
    description: 'Tips for home chefs growing a trusted kitchen.',
    icon: BookOpen,
    count: '9 guides'
  }
];

export const featuredGuide = {
  title: 'How to build a weekly homemade meal rhythm',
  category: 'Featured Guide',
  author: 'Maya Chowdhury',
  readTime: '8 min read',
  description:
    'A thoughtful framework for planning, prepping, storing, and serving fresh meals all week without losing the joy of cooking.',
  image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1600&q=85'
};

export const latestGuides = [
  {
    id: 1,
    title: 'Five sauces that make simple meals feel special',
    category: 'Chef Techniques',
    author: 'Nadia Karim',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 2,
    title: 'How to keep homemade delivery meals fresh',
    category: 'Home Chef Tips',
    author: 'Arman Hossain',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 3,
    title: 'A beginner guide to batch cooking rice bowls',
    category: 'Weeknight Cooking',
    author: 'Elena Park',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 4,
    title: 'Spice layering for deeper homemade flavor',
    category: 'Chef Techniques',
    author: 'Priya Kapoor',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 5,
    title: 'Building a family dinner menu everyone likes',
    category: 'Family Favorites',
    author: 'Amina Rahman',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 6,
    title: 'The home chef checklist for a polished listing',
    category: 'Chef Business',
    author: 'Marco Silva',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=85'
  }
];

export const popularRecipes = [
  {
    id: 1,
    title: 'Golden chicken biryani with cucumber raita',
    category: 'Popular Recipe',
    author: 'Amina Rahman',
    readTime: '45 min cook',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 2,
    title: 'Lemon herb salmon with market vegetables',
    category: 'Healthy Homemade',
    author: 'Maya Chowdhury',
    readTime: '30 min cook',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 3,
    title: 'Silky tomato soup with grilled cheese bites',
    category: 'Family Favorites',
    author: 'Elena Park',
    readTime: '35 min cook',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=85'
  }
];

export const cookingTips = [
  'Salt in layers, not only at the end.',
  'Let proteins rest before slicing.',
  'Prep aromatics before heating the pan.',
  'Use acid to brighten rich dishes.',
  'Store sauces separately for fresher delivery meals.',
  'Taste at every stage and adjust gradually.'
];
