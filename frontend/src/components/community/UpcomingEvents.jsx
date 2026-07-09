import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';
import { events } from './communityData';

export default function UpcomingEvents() {
  return (
    <section className="bg-[var(--bg-muted)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Upcoming Events</span>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-5xl">
            Come cook, taste, and connect.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {events.map((event, index) => {
            const Icon = event.icon;

            return (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                whileHover={{ y: -7 }}
                className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-7 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-elevated)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[var(--bg-muted)] text-[var(--accent)]">
                  <Icon size={25} />
                </div>
                <p className="mt-7 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">{event.date}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-normal text-[var(--text-primary)]">{event.title}</h3>
                <div className="mt-5 space-y-3 text-sm text-[var(--text-secondary)]">
                  <p className="inline-flex items-center gap-2">
                    <Clock size={16} />
                    {event.time}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={16} />
                    {event.location}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
