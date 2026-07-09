import { motion } from 'framer-motion';
import { BadgeDollarSign, ChefHat, HeartHandshake, Leaf, ShieldCheck, Truck } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    text: 'Meals are built around seasonal ingredients, thoughtful prep, and kitchens that cook close to the order time.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80'
  },
  {
    icon: ShieldCheck,
    title: 'Trusted Home Chefs',
    text: 'Chef profiles, ratings, and community feedback help every customer order from people they can trust.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=700&q=80'
  },
  {
    icon: HeartHandshake,
    title: 'Healthy Meals',
    text: 'Choose real homemade dishes with clear ingredients and the warmth of food prepared with care.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80'
  },
  {
    icon: BadgeDollarSign,
    title: 'Affordable Pricing',
    text: 'Transparent pricing helps customers eat well while chefs earn more from the craft they already love.',
    image: 'https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?auto=format&fit=crop&w=700&q=80'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    text: 'Local ordering keeps routes shorter, meals warmer, and schedules easier for both cooks and customers.',
    image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=700&q=80'
  },
  {
    icon: ChefHat,
    title: 'Community Driven',
    text: 'Every purchase supports neighborhood talent, family recipes, and a stronger local food culture.',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=700&q=80'
  }
];

export default function WhyHomeBite() {
  return (
    <section className="bg-[var(--bg-muted)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Why HomeBite</span>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-5xl">
            Designed for meals that feel better from first tap to first bite.
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.05, ease: 'easeOut' }}
                whileHover={{ y: -8 }}
                className="group overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)] transition duration-300 hover:shadow-[var(--shadow-elevated)]"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/92 text-orange-600 shadow-lg">
                    <Icon size={26} />
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="text-2xl font-semibold tracking-normal text-[var(--text-primary)]">{feature.title}</h3>
                  <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">{feature.text}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
