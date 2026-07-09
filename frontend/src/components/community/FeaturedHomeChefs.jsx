import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import { featuredChefs } from './communityData';

export default function FeaturedHomeChefs() {
  return (
    <section className="bg-[var(--bg-muted)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Featured Home Chefs</span>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-5xl">
            The people making neighborhoods delicious.
          </h2>
        </div>
        <div className="mt-12 grid gap-7 lg:grid-cols-3">
          {featuredChefs.map((chef, index) => (
            <motion.article
              key={chef.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.58, delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="group overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="overflow-hidden">
                <img src={chef.image} alt={chef.name} className="h-[340px] w-full object-cover transition duration-700 group-hover:scale-110" />
              </div>
              <div className="p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-normal text-[var(--text-primary)]">{chef.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-[var(--accent)]">{chef.cuisine}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-muted)] px-3 py-2 text-sm font-semibold text-[var(--text-primary)]">
                    <Star size={15} className="fill-[var(--accent)] text-[var(--accent)]" />
                    {chef.rating}
                  </span>
                </div>
                <p className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <MapPin size={16} />
                  {chef.location}
                </p>
                <p className="mt-4 leading-7 text-[var(--text-secondary)]">{chef.story}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
