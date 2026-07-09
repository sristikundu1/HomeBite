import { motion } from 'framer-motion';
import { Clock, Star, User } from 'lucide-react';

const meals = [
  {
    title: 'Maple-Glazed Salmon Bowl',
    price: '$18',
    rating: '4.9',
    delivery: '25 mins',
    chef: 'Chef Ana',
    chefImage: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=80',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Hearty Lentil Stew',
    price: '$14',
    rating: '4.8',
    delivery: '20 mins',
    chef: 'Chef Miguel',
    chefImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Sweet Vanilla Pancake Stack',
    price: '$12',
    rating: '5.0',
    delivery: '15 mins',
    chef: 'Chef Noor',
    chefImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80'
  }
];

function PopularMeals() {
  return (
    <section className="relative overflow-hidden bg-[var(--bg-page)] py-24" id="popular-meals">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mb-12 max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">
            Premium meals ready to order
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Discover chef-crafted dishes delivered from local kitchens.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-[var(--text-secondary)] sm:text-lg">
            Explore a curated selection of premium home-cooked meals designed for comfort, flavor, and fast delivery.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {meals.map((meal) => (
            <motion.article
              key={meal.title}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="group overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)] transition duration-300 hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={meal.image}
                  alt={meal.title}
                  className="h-[320px] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,23,42,0.72)] via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="inline-flex rounded-full bg-[var(--bg-page)]/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--text-secondary)] backdrop-blur-md">
                    {meal.delivery} delivery
                  </span>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)]">{meal.title}</h3>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">Savory flavors and fresh ingredients in every bite.</p>
                  </div>
                  <span className="rounded-full bg-[var(--accent)]/10 px-3 py-2 text-sm font-semibold text-[var(--accent)]">
                    {meal.price}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-2">
                    <Star size={16} className="text-[var(--accent)]" />
                    {meal.rating}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock size={16} className="text-[var(--icon)]" />
                    {meal.delivery}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-3xl bg-cover bg-center"
                      style={{ backgroundImage: `url(${meal.chefImage})` }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{meal.chef}</p>
                      <p className="text-sm text-[var(--text-secondary)]">Local home chef</p>
                    </div>
                  </div>
                  <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-sm font-semibold text-[var(--button-text)] shadow-lg shadow-orange-500/20 transition duration-300 hover:brightness-110">
                    Order now
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularMeals;
