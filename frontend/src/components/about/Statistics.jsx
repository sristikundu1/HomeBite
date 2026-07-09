import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChefHat, MapPin, ShoppingBag, Star } from 'lucide-react';

const stats = [
  { icon: ShoppingBag, value: 10000, suffix: '+', label: 'Meals Served' },
  { icon: ChefHat, value: 500, suffix: '+', label: 'Home Chefs' },
  { icon: MapPin, value: 25, suffix: '+', label: 'Cities' },
  { icon: Star, value: 4.9, suffix: '', label: 'Average Rating', decimals: 1 }
];

function CountNumber({ value, suffix = '', decimals = 0, start }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!start) return;

    let frame;
    const duration = 1400;
    const startedAt = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(value * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, value]);

  const formatted = current.toLocaleString(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  });

  return (
    <>
      {formatted}
      {suffix}
    </>
  );
}

export default function Statistics() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="bg-[var(--bg-page)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Momentum</span>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-5xl">
            Growing through trusted meals.
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.article
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.06, ease: 'easeOut' }}
                whileHover={{ y: -7, scale: 1.01 }}
                className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-7 shadow-[var(--shadow-soft)] transition duration-300 hover:shadow-[var(--shadow-elevated)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[var(--bg-muted)] text-[var(--accent)]">
                  <Icon size={26} />
                </div>
                <div className="mt-8 text-4xl font-semibold tracking-normal text-[var(--text-primary)]">
                  <CountNumber value={stat.value} suffix={stat.suffix} decimals={stat.decimals} start={inView} />
                </div>
                <p className="mt-2 text-base font-medium text-[var(--text-secondary)]">{stat.label}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
