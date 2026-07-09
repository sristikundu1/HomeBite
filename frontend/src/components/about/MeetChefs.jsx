import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

const chefs = [
  {
    name: 'Amina Rahman',
    cuisine: 'Bengali comfort food',
    experience: '12 years',
    rating: '4.9',
    bio: 'Known for slow-cooked curries, fragrant rice, and family recipes passed through three generations.',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'Marco Silva',
    cuisine: 'Mediterranean plates',
    experience: '9 years',
    rating: '4.8',
    bio: 'Brings bright herbs, handmade sauces, and fresh market produce to every neighborhood table.',
    image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'Priya Kapoor',
    cuisine: 'Vegetarian feasts',
    experience: '10 years',
    rating: '5.0',
    bio: 'Creates nourishing vegetarian menus with layered spices, seasonal vegetables, and generous portions.',
    image: 'https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?auto=format&fit=crop&w=900&q=85'
  }
];

export default function MeetChefs() {
  return (
    <section className="bg-[var(--bg-page)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Meet Our Home Chefs</span>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-5xl">
            The people behind the plates.
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-7 lg:grid-cols-3">
          {chefs.map((chef, index) => (
            <motion.article
              key={chef.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.58, delay: index * 0.08, ease: 'easeOut' }}
              whileHover={{ y: -8 }}
              className="group overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)] transition duration-300 hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="overflow-hidden">
                <img
                  src={chef.image}
                  alt={chef.name}
                  className="h-[360px] w-full object-cover transition duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-normal text-[var(--text-primary)]">{chef.name}</h3>
                    <p className="mt-1 text-sm font-medium text-[var(--accent)]">{chef.cuisine}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-muted)] px-3 py-2 text-sm font-semibold text-[var(--text-primary)]">
                    <Star size={15} className="fill-[var(--accent)] text-[var(--accent)]" />
                    {chef.rating}
                  </span>
                </div>
                <p className="mt-4 text-sm font-medium text-[var(--text-muted)]">{chef.experience} experience</p>
                <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">{chef.bio}</p>
                <motion.a
                  whileHover={{ x: 3 }}
                  href="/explore"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
                >
                  View Profile
                  <ArrowRight size={17} />
                </motion.a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
