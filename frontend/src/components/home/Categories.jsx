import { motion } from 'framer-motion';

const categories = [
  {
    title: 'Traditional Meals',
    description: 'Classic home recipes cherished by families.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Healthy Food',
    description: 'Wholesome plates made from fresh ingredients.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Desserts',
    description: 'Sweet treats crafted with care and flavor.',
    image: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Street Food',
    description: 'Bold, flavorful bites inspired by local streets.',
    image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Vegetarian',
    description: 'Vibrant plant-based meals full of freshness.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Family Meals',
    description: 'Generous, shareable dishes for every gathering.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80'
  }
];

function Categories() {
  return (
    <section className="relative overflow-hidden bg-[var(--bg-muted)] py-[140px]" id="categories">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">
            Choose cuisine to match your mood
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Discover local flavors with every category.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-[var(--text-secondary)] sm:text-lg">
            Explore premium category cards that showcase a curated selection of home-cooked meals for every craving.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <motion.div
              key={category.title}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="group overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="relative h-72 overflow-hidden sm:h-80">
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 dark:bg-black/45 transition-all duration-300" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-left">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">
                    {category.title}
                  </p>
                  <p className="mt-3 max-w-xs text-sm text-[var(--text-secondary)]">
                    {category.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
