import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CategoryCard from '../categories/CategoryCard';
import useFoodCategories from '../../hooks/useFoodCategories';

function Categories() {
  const { data: categories = [], isLoading, isError, refetch, isFetching } = useFoodCategories();
  return (
    <section className="relative overflow-hidden bg-[var(--bg-muted)] py-[140px]" id="categories">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">Choose cuisine to match your mood</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">Discover local flavors with every category.</h2>
          <p className="mt-4 max-w-2xl text-base text-[var(--text-secondary)] sm:text-lg">Explore premium category cards that showcase a curated selection of home-cooked meals for every craving.</p>
        </motion.div>
        {isLoading ? <CategorySkeletons count={8}/> : isError ? <CategoryError onRetry={refetch} busy={isFetching}/> : <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.12 }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }} className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">{categories.slice(0, 8).map((category) => <CategoryCard key={category.name} category={category}/>)}</motion.div>}
        {!isLoading && !isError && <div className="mt-10 text-center"><Link to="/categories" className="inline-flex rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-7 py-3.5 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]">See All Categories</Link></div>}
      </div>
    </section>
  );
}

export function CategorySkeletons({ count }) { return <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4" role="status" aria-label="Loading categories">{Array.from({ length: count }, (_, index) => <div key={index} className="h-72 animate-pulse rounded-[32px] bg-[var(--bg-surface)] sm:h-80"/>)}</div>; }
export function CategoryError({ onRetry, busy }) { return <div className="rounded-[32px] border border-red-500/20 bg-red-500/5 px-6 py-16 text-center"><p className="text-sm font-semibold text-red-500">Categories could not be loaded.</p><button type="button" onClick={onRetry} disabled={busy} className="mt-5 rounded-full border border-red-500/20 px-6 py-3 text-sm font-semibold text-red-500 disabled:opacity-50">{busy ? 'Retrying...' : 'Retry'}</button></div>; }
export default Categories;
