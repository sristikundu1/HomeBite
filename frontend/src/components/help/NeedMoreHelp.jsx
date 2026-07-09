import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { supportOptions } from './helpData';

export default function NeedMoreHelp() {
  return (
    <section>
      <div className="mb-14 text-center">
        <span className="rounded-full bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-500">
          Need More Help
        </span>
        <h2 className="mt-6 text-4xl font-bold text-[var(--text-primary)]">
          Choose the fastest path forward
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
          Whether you are ordering dinner, building a chef profile, or exploring HomeBite, we will point you to the right place.
        </p>
      </div>

      <div className="grid gap-7 md:grid-cols-3">
        {supportOptions.map((option, index) => {
          const Icon = option.icon;

          return (
            <motion.a
              key={option.id}
              href={option.href}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="group rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] p-7 shadow-lg transition-all duration-300 hover:border-orange-400 hover:shadow-2xl"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg">
                <Icon size={28} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-[var(--text-primary)] transition group-hover:text-orange-500">
                {option.title}
              </h3>
              <p className="mt-3 leading-7 text-[var(--text-secondary)]">{option.description}</p>
              <span className="mt-8 inline-flex items-center gap-2 font-semibold text-orange-500 transition-all duration-300 group-hover:gap-3">
                Continue
                <ArrowRight size={18} />
              </span>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
