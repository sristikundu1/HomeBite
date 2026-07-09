import { motion } from 'framer-motion';
import { services, statusStyles } from './statusData';

export default function ServiceStatus() {
  return (
    <section className="bg-[var(--bg-page)] pb-20 sm:pb-24">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mb-10 max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Service Status Grid</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-4xl">
            Availability by service.
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.article
                key={service.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.05, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.12 }}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-muted)] text-[var(--accent)]"
                  >
                    <Icon size={22} />
                  </motion.div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[service.status]}`}>
                    {service.status}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[var(--text-primary)]">{service.name}</h3>
                <p className="mt-3 text-sm text-[var(--text-secondary)]">Last checked {service.lastChecked}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
