import { motion } from 'framer-motion';
import { incidents } from './statusData';

export default function IncidentHistory() {
  return (
    <section className="bg-[var(--bg-muted)] py-20 sm:py-24">
      <div className="mx-auto max-w-[1100px] px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mb-12 max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Recent Incident History</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-4xl">
            Recent issues and resolutions.
          </h2>
        </motion.div>

        <div className="relative space-y-6 before:absolute before:left-4 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-[var(--border)] sm:before:left-6">
          {incidents.map((incident, index) => (
            <motion.article
              key={`${incident.date}-${incident.issue}`}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: 'easeOut' }}
              className="relative pl-12 sm:pl-16"
            >
              <span className="absolute left-0 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-surface)] sm:h-12 sm:w-12">
                <span className="h-3 w-3 rounded-full bg-[var(--accent)]" />
              </span>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5">
                <p className="text-sm font-semibold text-[var(--accent)]">{incident.date}</p>
                <h3 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">{incident.issue}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{incident.resolution}</p>
                <p className="mt-4 text-sm font-medium text-[var(--text-primary)]">Duration: {incident.duration}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
