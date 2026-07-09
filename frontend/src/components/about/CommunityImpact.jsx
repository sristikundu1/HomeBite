import { motion } from 'framer-motion';
import { Building2, HandHeart, Leaf, Sprout, Users } from 'lucide-react';

const impactImage =
  'https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=1500&q=85';

const timeline = [
  {
    icon: Users,
    title: 'Local families',
    text: 'Busy households get dependable access to fresh meals made nearby.'
  },
  {
    icon: HandHeart,
    title: 'Women entrepreneurs',
    text: 'HomeBite helps talented cooks build income from skills already rooted in care and hospitality.'
  },
  {
    icon: Building2,
    title: 'Small businesses',
    text: 'Local suppliers, couriers, and kitchens benefit from stronger neighborhood food demand.'
  },
  {
    icon: Leaf,
    title: 'Food sustainability',
    text: 'Smaller batch cooking encourages thoughtful portions, seasonal sourcing, and less waste.'
  },
  {
    icon: Sprout,
    title: 'Local economy',
    text: 'More meal spending stays inside the community and supports independent food makers.'
  }
];

export default function CommunityImpact() {
  return (
    <section className="bg-[var(--bg-muted)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="group overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-elevated)]"
        >
          <img
            src={impactImage}
            alt="Community table with homemade food"
            className="h-[360px] w-full object-cover transition duration-700 group-hover:scale-105 sm:h-[560px]"
          />
        </motion.div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Community Impact</span>
            <h2 className="mt-5 text-4xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-5xl">
              Every order moves more than food.
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
              HomeBite helps cooks, customers, and neighborhoods grow through everyday meals that keep opportunity close to home.
            </p>
          </motion.div>

          <div className="mt-10 space-y-5">
            {timeline.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.55, delay: index * 0.08, ease: 'easeOut' }}
                  className="relative grid grid-cols-[3.5rem_1fr] gap-4"
                >
                  {index !== timeline.length - 1 && (
                    <span className="absolute left-7 top-14 h-[calc(100%+1.25rem)] w-px bg-[var(--border)]" />
                  )}
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--accent)] shadow-[var(--shadow-soft)]">
                    <Icon size={24} />
                  </div>
                  <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-soft)]">
                    <h3 className="text-lg font-semibold tracking-normal text-[var(--text-primary)]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
