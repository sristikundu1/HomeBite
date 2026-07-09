import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';

const chefs = [
  {
    name: 'Chef Lina Ortiz',
    cuisine: 'Homestyle Italian',
    rating: '4.9',
    sold: '320+ meals',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Chef Marcus Bell',
    cuisine: 'Modern Comfort',
    rating: '4.8',
    sold: '280+ meals',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Chef Aisha Khan',
    cuisine: 'Spiced Street Food',
    rating: '5.0',
    sold: '410+ meals',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80'
  }
];

function FeaturedChefs() {
  return (
    <section className="relative overflow-hidden bg-[var(--bg-muted)] py-24" id="featured-chefs">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-12 max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">
            Discover cooks shaping local food culture
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Meet the local chefs bringing homemade flavor to every neighborhood.
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {chefs.map((chef, index) => (
            <motion.article
              key={chef.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: 'easeOut' }}
              whileHover={{ y: -10, scale: 1.01 }}
              className="group overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)] transition duration-300 hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={chef.image}
                  alt={chef.name}
                  className="h-[340px] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,23,42,0.7)] via-transparent to-transparent" />
              </div>

              <div className="space-y-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)]">{chef.name}</h3>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">{chef.cuisine}</p>
                  </div>
                  <button className="rounded-full border border-[var(--border)] bg-[var(--bg-muted)] p-2 text-[var(--icon)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
                    <Heart size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-2">
                    <Star size={16} className="text-[var(--accent)]" />
                    {chef.rating}
                  </span>
                  <span>{chef.sold}</span>
                </div>

                <button className="w-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-sm font-semibold text-[var(--button-text)] shadow-lg shadow-orange-500/20 transition duration-300 hover:brightness-110">
                  Follow chef
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedChefs;
