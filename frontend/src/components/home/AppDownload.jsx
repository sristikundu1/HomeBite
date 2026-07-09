import { motion } from 'framer-motion';
import { Apple, Play } from 'lucide-react';

function AppDownload() {
  return (
    <section className="relative overflow-hidden bg-[var(--bg-page)] py-24" id="app-download">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 rounded-[40px] border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-[var(--shadow-soft)] lg:grid-cols-[1.05fr_0.95fr] lg:p-14">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">
              Download the app
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">
              Order homemade meals anytime, anywhere.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[var(--text-secondary)]">
              Discover local favorites, track your order, and enjoy comfort food from your favorite home cooks right from your phone.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button className="inline-flex items-center justify-center gap-3 rounded-full border border-[var(--border)] bg-[var(--bg-muted)] px-6 py-4 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
                <Apple size={20} />
                App Store
              </button>
              <button className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-4 text-sm font-semibold text-[var(--button-text)] shadow-lg shadow-orange-500/20 transition hover:brightness-110">
                <Play size={20} />
                Google Play
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.6, ease: 'easeOut', repeat: Infinity, repeatType: 'mirror' }}
            className="flex justify-center"
          >
            <div className="relative mx-auto w-full max-w-[320px] rounded-[44px] border border-[var(--border)] bg-[var(--bg-page)] p-3 shadow-[0_35px_90px_rgba(15,23,42,0.35)]">
              <div className="rounded-[36px] border border-[var(--border)] bg-[var(--bg-surface)] p-3">
                <div className="mx-auto mb-3 flex h-6 w-24 items-center justify-center rounded-full bg-[var(--bg-muted)]">
                  <div className="h-1.5 w-16 rounded-full bg-[var(--border)]" />
                </div>
                <div className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--bg-page)]">
                  <div className="flex h-[560px] flex-col bg-[var(--bg-page)]">
                    <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-surface)] px-4 py-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--text-secondary)]">HomeBite</p>
                        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Welcome back</h3>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                        <span className="text-sm font-semibold">HB</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4 bg-[linear-gradient(135deg,rgba(249,115,22,0.12),rgba(236,72,153,0.08))] p-4">
                      <div className="rounded-[24px] border border-[var(--border)] bg-[var(--bg-surface)]/90 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">Today’s pick</p>
                            <h4 className="mt-2 text-base font-semibold text-[var(--text-primary)]">Homestyle pasta bowl</h4>
                          </div>
                          <div className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-semibold text-[var(--accent)]">$14</div>
                        </div>
                        <img
                          src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80"
                          alt="Homestyle pasta bowl"
                          className="mt-4 h-28 w-full rounded-[20px] object-cover"
                        />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[22px] border border-[var(--border)] bg-[var(--bg-surface)]/90 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--text-secondary)]">Fast delivery</p>
                          <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">25 mins</p>
                        </div>
                        <div className="rounded-[22px] border border-[var(--border)] bg-[var(--bg-surface)]/90 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--text-secondary)]">Chef rating</p>
                          <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">4.9 ★</p>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-[var(--border)] bg-[var(--bg-surface)]/90 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-primary)]">Chef Lina</p>
                            <p className="text-sm text-[var(--text-secondary)]">Trusted local cook</p>
                          </div>
                          <button className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2 text-sm font-semibold text-[var(--button-text)]">
                            Order
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AppDownload;
