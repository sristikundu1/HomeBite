import { motion } from 'framer-motion';
import { BadgeCheck, ChefHat, MapPin, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const id = (value) => value?.$oid || value || '';
const fallbackCovers = [
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=82',
  'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=82',
  'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=82'
];

export default function ChefDiscoveryCard({ chef, index = 0 }) {
  return (
    <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.045 }} whileHover={{ y: -7 }} className="group overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)]">
      <div className="relative h-44 overflow-hidden bg-[var(--bg-muted)]">
        <img src={chef.kitchenCoverImage || fallbackCovers[index % fallbackCovers.length]} alt={`${chef.kitchenName} kitchen and food`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <motion.span aria-hidden="true" animate={{ scale: [1, 1.12, 1], opacity: [.16, .28, .16] }} transition={{ duration: 7 + index * .4, repeat: Infinity, ease: 'easeInOut' }} className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white blur-3xl" />
        {chef.profilePhoto ? <img src={chef.profilePhoto} alt={chef.chefName} loading="lazy" className="absolute bottom-4 left-5 h-20 w-20 rounded-2xl border-4 border-white/80 object-cover shadow-xl" /> : <span className="absolute bottom-4 left-5 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white/80 bg-[var(--bg-surface)] text-[var(--accent)]"><ChefHat className="h-9 w-9" /></span>}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3"><div><h2 className="flex items-center gap-2 text-xl font-semibold text-[var(--text-primary)]">{chef.kitchenName}<BadgeCheck className="h-5 w-5 text-blue-500" /></h2><p className="mt-1 text-sm text-[var(--text-secondary)]">{chef.chefName}</p></div><span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--text-primary)]"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{Number(chef.averageRating || 0).toFixed(1)}</span></div>
        <div className="mt-4 flex flex-wrap gap-2">{(chef.cuisineSpecialties || []).slice(0, 3).map((item) => <span key={item} className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent)]">{item}</span>)}</div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-[var(--text-secondary)]"><span>{chef.yearsOfExperience} years experience</span><span className="inline-flex items-center gap-1"><ShoppingBag className="h-3.5 w-3.5" />{chef.completedOrders} orders</span><span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{[chef.city, chef.country].filter(Boolean).join(', ') || 'Location available'}</span><span>{chef.availability?.acceptingOrders && !chef.availability?.vacationMode ? 'Accepting orders' : 'Currently unavailable'}</span></div>
        <Link to={`/chefs/${id(chef._id)}`} className="mt-6 block rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-orange-500/20">View Profile</Link>
      </div>
    </motion.article>
  );
}
