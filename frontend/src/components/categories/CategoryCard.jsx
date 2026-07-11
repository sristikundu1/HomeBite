import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  const destination = `/foods?category=${encodeURIComponent(category.name)}`;
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-elevated)]"
    >
      <Link to={destination} aria-label={`Browse ${category.name}, ${category.count} foods`} className="block rounded-[32px] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]">
        <div className="relative h-72 overflow-hidden sm:h-80">
          <img src={category.image} alt={`${category.name} category`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20 transition-all duration-300 dark:bg-black/45 dark:bg-none" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-200 dark:text-[var(--accent)]">{category.name}</p>
            <p className="mt-2 text-xs font-semibold text-white/85">{category.count} {category.count === 1 ? 'food' : 'foods'}</p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/90 dark:text-[var(--text-secondary)]">{category.description}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
