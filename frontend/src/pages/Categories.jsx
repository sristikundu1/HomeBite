import { motion } from 'framer-motion';
import CategoryCard from '../components/categories/CategoryCard';
import { CategoryError, CategorySkeletons } from '../components/home/Categories';
import useFoodCategories from '../hooks/useFoodCategories';

export default function CategoriesPage() {
  const { data: categories = [], isLoading, isError, refetch, isFetching } = useFoodCategories();
  return <main className="min-h-screen bg-[var(--bg-page)] pb-24 pt-28 sm:pt-32"><section className="border-b border-[var(--border)]"><div className="container py-16 sm:py-20"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">Explore every craving</p><h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">All Food Categories</h1><p className="mt-4 text-base leading-8 text-[var(--text-secondary)] sm:text-lg">Browse every HomeBite category and discover meals prepared by local chefs.</p></motion.div></div></section><section className="container py-12 sm:py-16">{isLoading ? <CategorySkeletons count={11}/> : isError ? <CategoryError onRetry={refetch} busy={isFetching}/> : <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }} className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">{categories.map((category) => <CategoryCard key={category.name} category={category}/>)}</motion.div>}</section></main>;
}
