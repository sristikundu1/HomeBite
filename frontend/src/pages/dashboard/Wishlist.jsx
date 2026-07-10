import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChefHat, Heart, ImageOff, ShoppingBag, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import useWishlist from '../../hooks/useWishlist';
import { getFood } from '../../services/foodsApi';

function foodId(food) {
  return food?._id?.$oid || food?._id;
}

function formatPrice(value) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 2
  }).format(value || 0);
}

export default function Wishlist() {
  const { wishlistIds, removeFromWishlist } = useWishlist();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const skipNextFetch = useRef(false);
  const wishlistKey = wishlistIds.join('|');

  useEffect(() => {
    let active = true;

    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return () => { active = false; };
    }

    async function loadWishlistFoods() {
      if (!wishlistIds.length) {
        setFoods([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const results = await Promise.allSettled(wishlistIds.map((id) => getFood(id)));
      if (!active) return;

      const availableFoods = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value.data.data)
        .filter(Boolean);

      setFoods(availableFoods);
      setLoading(false);
    }

    loadWishlistFoods();
    return () => { active = false; };
    // wishlistKey represents the persisted ID list without depending on array identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishlistKey]);

  function removeFood(food) {
    const id = foodId(food);
    skipNextFetch.current = true;
    setFoods((current) => current.filter((item) => foodId(item) !== id));
    removeFromWishlist(id);
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-8">
      <DashboardHeader title="My Wishlist" description="Keep your favorite homemade dishes close and revisit them whenever you are ready." />

      {loading ? (
        <WishlistSkeleton />
      ) : foods.length ? (
        <motion.section layout className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" aria-label="Wishlisted foods">
          <AnimatePresence mode="popLayout">
            {foods.map((food, index) => (
              <WishlistCard key={foodId(food)} food={food} index={index} onRemove={removeFood} />
            ))}
          </AnimatePresence>
        </motion.section>
      ) : (
        <EmptyWishlist />
      )}
    </div>
  );
}

function WishlistCard({ food, index, onRemove }) {
  const [imageFailed, setImageFailed] = useState(false);
  const discounted = food.discountPrice !== null && food.discountPrice !== undefined;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      whileHover={{ y: -5 }}
      className="group overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-lg shadow-black/5 transition-shadow hover:shadow-[var(--shadow-soft)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-muted)]">
        {food.thumbnail && !imageFailed ? (
          <img src={food.thumbnail} alt={food.title} onError={() => setImageFailed(true)} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--text-muted)]"><ImageOff className="h-9 w-9" aria-hidden="true" /></div>
        )}
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-xl ${food.isAvailable ? 'bg-emerald-500/90 text-white' : 'bg-slate-900/75 text-slate-200'}`}>
          {food.isAvailable ? 'Available' : 'Unavailable'}
        </span>
        <motion.button
          type="button"
          onClick={() => onRemove(food)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.86 }}
          aria-label={`Remove ${food.title} from wishlist`}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-xl transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-white/80"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </motion.button>
      </div>

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{food.category}</p>
        <h2 className="mt-2 line-clamp-1 text-lg font-semibold text-[var(--text-primary)]">{food.title}</h2>
        <p className="mt-2 flex items-center gap-2 text-sm text-[var(--text-secondary)]"><ChefHat className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />{food.chefName}</p>

        <div className="mt-5 flex items-end gap-2 border-t border-[var(--border)] pt-4">
          <span className="text-xl font-bold text-[var(--text-primary)]">{formatPrice(discounted ? food.discountPrice : food.price)}</span>
          {discounted && <span className="pb-0.5 text-xs text-[var(--text-muted)] line-through">{formatPrice(food.price)}</span>}
        </div>

        <div className="mt-5 grid gap-2">
          <Link to={`/foods/${foodId(food)}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/15 transition hover:shadow-orange-500/25 focus:outline-none focus:ring-2 focus:ring-orange-500/40">
            View Details <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button type="button" disabled={!food.isAvailable} className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-page)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-45">
            <ShoppingBag className="h-4 w-4" aria-hidden="true" /> Add To Cart
          </button>
          <button type="button" onClick={() => onRemove(food)} className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500/20">
            <Trash2 className="h-4 w-4" aria-hidden="true" /> Remove
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function WishlistSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" role="status" aria-label="Loading wishlist">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)]">
          <div className="aspect-[4/3] animate-pulse bg-[var(--bg-muted)]" />
          <div className="space-y-4 p-5"><div className="h-3 w-20 animate-pulse rounded bg-[var(--bg-muted)]" /><div className="h-6 w-3/4 animate-pulse rounded bg-[var(--bg-muted)]" /><div className="h-4 w-1/2 animate-pulse rounded bg-[var(--bg-muted)]" /><div className="h-12 animate-pulse rounded-full bg-[var(--bg-muted)]" /><div className="h-12 animate-pulse rounded-full bg-[var(--bg-muted)]" /></div>
        </div>
      ))}
    </div>
  );
}

function EmptyWishlist() {
  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[480px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--bg-surface)] px-6 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-rose-500/10 text-rose-500"><Heart className="h-10 w-10" aria-hidden="true" /></span>
      <h2 className="mt-6 text-2xl font-semibold text-[var(--text-primary)]">Your wishlist is waiting</h2>
      <p className="mt-3 max-w-md text-sm leading-7 text-[var(--text-secondary)]">Save foods you love and they will appear here for easy access.</p>
      <Link to="/foods" className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20">Explore Foods <ArrowRight className="h-4 w-4" /></Link>
    </motion.section>
  );
}
