import { motion } from 'framer-motion';
import { Rocket, Target } from 'lucide-react';

const cards = [
  {
    icon: Target,
    title: 'Mission',
    text: 'Our mission is to empower local home chefs while helping people enjoy authentic, healthy, homemade food.'
  },
  {
    icon: Rocket,
    title: 'Vision',
    text: "Our vision is to build the world's largest trusted community for homemade meals."
  }
];

export default function MissionVision() {
  return (
    <section className="bg-[var(--bg-muted)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Purpose</span>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-5xl">
            A marketplace with a human center.
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)]/90 p-8 shadow-[var(--shadow-soft)] backdrop-blur-xl transition duration-300 hover:shadow-[var(--shadow-elevated)] sm:p-10"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--bg-muted)] text-[var(--accent)] shadow-lg shadow-black/5">
                  <Icon size={30} />
                </div>
                <h3 className="mt-8 text-2xl font-semibold tracking-normal text-[var(--text-primary)]">{card.title}</h3>
                <p className="mt-4 text-base leading-8 text-[var(--text-secondary)] sm:text-lg">{card.text}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
