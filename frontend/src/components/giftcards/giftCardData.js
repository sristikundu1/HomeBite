import { BadgeDollarSign, ChefHat, Clock, Gift, Heart, Mail } from 'lucide-react';

export const amountOptions = [25, 50, 75, 100, 150, 200];

export const giftOptions = [
  {
    id: 1,
    title: 'Dinner for Two',
    amount: '$50',
    description: 'Perfect for a cozy homemade meal from a trusted local chef.',
    icon: Heart
  },
  {
    id: 2,
    title: 'Family Table',
    amount: '$100',
    description: 'A thoughtful gift for families who love fresh comfort food.',
    icon: ChefHat
  },
  {
    id: 3,
    title: 'Food Explorer',
    amount: '$150',
    description: 'For someone who wants to discover several chefs and cuisines.',
    icon: Gift
  }
];

export const steps = [
  {
    id: 1,
    title: 'Choose an amount',
    description: 'Pick a preset value or customize a gift for any appetite.',
    icon: BadgeDollarSign
  },
  {
    id: 2,
    title: 'Write a message',
    description: 'Add a personal note for the recipient.',
    icon: Mail
  },
  {
    id: 3,
    title: 'Send instantly',
    description: 'Deliver by email and let them choose their favorite meal.',
    icon: Clock
  }
];

export const faqs = [
  {
    question: 'Can gift cards be used for any HomeBite meal?',
    answer: 'Yes. Gift cards can be applied to eligible meals and chef offerings available in the recipient account.'
  },
  {
    question: 'Do gift cards expire?',
    answer: 'HomeBite gift cards are designed to stay flexible. Expiration rules can be shown at checkout when payment is implemented.'
  },
  {
    question: 'Can I schedule delivery of a gift card?',
    answer: 'This page currently provides the purchase UI only. Scheduled delivery can be added when payment and email fulfillment are connected.'
  },
  {
    question: 'Can I buy gift cards for a team?',
    answer: 'Yes. For larger community or workplace gifts, contact HomeBite support for bulk options.'
  }
];
