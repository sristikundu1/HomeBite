import { motion } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';

export default function GiftCardPreview({ amount = 100, recipient = 'Someone special', message = 'Enjoy something homemade.' }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -2, y: 24 }}
      whileInView={{ opacity: 1, rotate: -1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      whileHover={{ rotate: 0, y: -8, scale: 1.01 }}
      className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 via-rose-500 to-slate-950 p-8 text-white shadow-[0_40px_120px_rgba(249,115,22,0.28)]"
    >
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-orange-200/20 blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-xl">
            <Gift size={30} />
          </div>
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]">
            HomeBite
          </span>
        </div>
        <p className="mt-12 text-sm uppercase tracking-[0.32em] text-white/70">Gift Card</p>
        <div className="mt-3 text-6xl font-semibold tracking-normal">${amount}</div>
        <div className="mt-10 rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
          <p className="text-sm text-white/70">For</p>
          <h3 className="mt-1 text-2xl font-semibold">{recipient || 'Someone special'}</h3>
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-white/78">{message || 'Enjoy something homemade.'}</p>
        </div>
        <div className="mt-7 flex items-center gap-2 text-sm text-white/78">
          <Sparkles size={16} />
          Redeem for authentic homemade meals
        </div>
      </div>
    </motion.div>
  );
}
