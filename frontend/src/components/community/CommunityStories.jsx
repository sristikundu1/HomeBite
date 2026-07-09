import { motion } from 'framer-motion';
import { stories } from './communityData';

export default function CommunityStories() {
  return (
    <section className="bg-[var(--bg-page)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Community Stories</span>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-5xl">
            Real meals. Real connections.
          </h2>
        </div>
        <div className="mt-12 grid gap-7 lg:grid-cols-2">
          {stories.map((story, index) => (
            <motion.article
              key={story.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.58, delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="grid overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-elevated)] md:grid-cols-[0.85fr_1.15fr]"
            >
              <img src={story.image} alt={story.title} className="h-72 w-full object-cover md:h-full" />
              <div className="p-7">
                <h3 className="text-2xl font-semibold tracking-normal text-[var(--text-primary)]">{story.title}</h3>
                <p className="mt-5 text-lg leading-8 text-[var(--text-secondary)]">"{story.quote}"</p>
                <p className="mt-6 text-sm font-semibold text-[var(--accent)]">{story.author}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
