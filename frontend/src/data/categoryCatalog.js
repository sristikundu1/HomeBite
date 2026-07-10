import breakfast from '../assets/categories/breakfast.jpg';
import lunch from '../assets/categories/lunch.jpg';
import dinner from '../assets/categories/dinner.jpg';
import traditionalMeals from '../assets/categories/traditional-meals.jpg';
import healthyMeals from '../assets/categories/healthy-meals.jpg';
import streetFood from '../assets/categories/street-food.jpg';
import vegetarian from '../assets/categories/vegetarian.jpg';
import familyMeals from '../assets/categories/family-meals.jpg';
import desserts from '../assets/categories/desserts.jpg';
import snacks from '../assets/categories/snacks.jpg';
import beverages from '../assets/categories/beverages.jpg';

export const CATEGORY_CATALOG = [
  { name: 'Breakfast', description: 'Fresh morning favorites to start the day well.', image: breakfast },
  { name: 'Lunch', description: 'Balanced midday plates prepared by local chefs.', image: lunch },
  { name: 'Dinner', description: 'Comforting evening dishes for a satisfying finish.', image: dinner },
  { name: 'Traditional Meals', description: 'Classic home recipes cherished by families.', image: traditionalMeals },
  { name: 'Healthy Meals', description: 'Wholesome plates made from fresh ingredients.', image: healthyMeals },
  { name: 'Street Food', description: 'Bold, flavorful bites inspired by local streets.', image: streetFood },
  { name: 'Vegetarian', description: 'Vibrant plant-based meals full of freshness.', image: vegetarian },
  { name: 'Family Meals', description: 'Generous, shareable dishes for every gathering.', image: familyMeals },
  { name: 'Desserts', description: 'Sweet treats crafted with care and flavor.', image: desserts },
  { name: 'Snacks', description: 'Tasty bites and finger foods for every craving.', image: snacks },
  { name: 'Beverages', description: 'Refreshing juices, smoothies, coffee, and tea.', image: beverages }
];

export const CATEGORY_NAMES = CATEGORY_CATALOG.map((category) => category.name);
export const categoryDetails = (name) => CATEGORY_CATALOG.find((category) => category.name === name);
