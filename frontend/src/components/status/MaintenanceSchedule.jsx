import { motion } from 'framer-motion';
import { maintenance } from './statusData';

export default function MaintenanceSchedule() {
  return (
    <section className="bg-[var(--bg-page)] py-20 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mb-10 max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Scheduled Maintenance</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-4xl">
            Planned updates with clear windows.
          </h2>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-2">
          {maintenance.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5"
              >
                <div className="flex items-start gap-5">
                  <motion.div
                    animate={{ rotate: [0, 4, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500"
                  >
                    <Icon size={22} />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)]">{item.title}</h3>
                    <p className="mt-2 text-sm font-medium text-[var(--accent)]">{item.date}</p>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">{item.window}</p>
                    <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">{item.impact}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
