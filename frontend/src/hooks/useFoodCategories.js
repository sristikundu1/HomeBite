import { useQuery } from '@tanstack/react-query';
import { CATEGORY_CATALOG } from '../data/categoryCatalog';
import { getFoodCategories } from '../services/foodsApi';

export default function useFoodCategories() {
  return useQuery({
    queryKey: ['food-categories'],
    queryFn: async () => {
      const response = await getFoodCategories();
      const counts = new Map((response.data.data || []).map((category) => [category.name, category.count]));
      return CATEGORY_CATALOG.map((category) => ({ ...category, count: counts.get(category.name) || 0 }));
    }
  });
}
