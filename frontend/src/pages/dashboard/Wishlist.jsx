import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChefHat, Heart, ImageOff, Search, ShoppingBag, SlidersHorizontal, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import useCart from '../../hooks/useCart';
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
  const { addToCart } = useCart();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [movingId, setMovingId] = useState('');
  const skipNextFetch = useRef(false);
  const wishlistKey = wishlistIds.join('|');

  const categories = useMemo(
    () => [...new Set(foods.map((food) => food.category).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [foods]
  );

  const visibleFoods = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = foods.filter((food) => {
      const matchesSearch = !query || [food.title, food.chefName, food.category, food.cuisine]
        .some((value) => String(value || '').toLowerCase().includes(query));
      return matchesSearch && (category === 'all' || food.category === category);
    });

    return [...filtered].sort((a, b) => {
      const priceA = Number(a.discountPrice ?? a.price ?? 0);
      const priceB = Number(b.discountPrice ?? b.price ?? 0);
      if (sort === 'price-low') return priceA - priceB;
      if (sort === 'price-high') return priceB - priceA;
      if (sort === 'name') return String(a.title || '').localeCompare(String(b.title || ''));
      return wishlistIds.indexOf(foodId(b)) - wishlistIds.indexOf(foodId(a));
    });
  }, [category, foods, search, sort, wishlistIds]);

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

  async function moveToCart(food) {
    const id = foodId(food);
    if (!id || movingId) return;

    setMovingId(id);
    const addedItem = await addToCart(food, 1);
    if (addedItem) removeFood(food);
    setMovingId('');
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-8">
      <DashboardHeader title="My Wishlist" description="Keep your favorite homemade dishes close and revisit them whenever you are ready." />

      {loading ? (
        <WishlistSkeleton />
      ) : foods.length ? (
        <>
          <WishlistControls search={search} onSearch={setSearch} category={category} onCategory={setCategory} categories={categories} sort={sort} onSort={setSort} />
          {visibleFoods.length ? (
            <motion.section layout className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" aria-label="Wishlisted foods">
              <AnimatePresence mode="popLayout">
                {visibleFoods.map((food, index) => (
                  <WishlistCard key={foodId(food)} food={food} index={index} onRemove={removeFood} onMoveToCart={moveToCart} moving={movingId === foodId(food)} moveDisabled={Boolean(movingId)} />
                ))}
              </AnimatePresence>
            </motion.section>
          ) : (
            <NoResults onReset={() => { setSearch(''); setCategory('all'); setSort('newest'); }} />
          )}
        </>
      ) : (
        <EmptyWishlist />
      )}
    </div>
  );
}

function WishlistControls({ search, onSearch, category, onCategory, categories, sort, onSort }) {
  const fieldClass = 'h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15';

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_220px_220px]" aria-label="Wishlist filters">
      <label className="relative">
        <span className="sr-only">Search wishlist</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden="true" />
        <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search foods, chefs, or cuisines" className={`${fieldClass} pl-11 pr-4`} />
      </label>
      <label className="relative">
        <span className="sr-only">Filter by category</span>
        <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden="true" />
        <select value={category} onChange={(event) => onCategory(event.target.value)} className={`${fieldClass} pl-11 pr-4`}>
          <option value="all">All categories</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label>
        <span className="sr-only">Sort wishlist</span>
        <select value={sort} onChange={(event) => onSort(event.target.value)} className={`${fieldClass} px-4`}>
          <option value="newest">Recently saved</option>
          <option value="name">Name: A to Z</option>
          <option value="price-low">Price: Low to high</option>
          <option value="price-high">Price: High to low</option>
        </select>
      </label>
    </motion.section>
  );
}

function WishlistCard({ food, index, onRemove, onMoveToCart, moving, moveDisabled }) {
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
          <motion.button type="button" onClick={() => onMoveToCart(food)} disabled={!food.isAvailable || moveDisabled} whileTap={{ scale: 0.97 }} className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-page)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-45">
            <ShoppingBag className={`h-4 w-4 ${moving ? 'animate-bounce' : ''}`} aria-hidden="true" /> {moving ? 'Moving...' : 'Move to Cart'}
          </motion.button>
          
        </div>
      </div>
    </motion.article>
  );
}

function NoResults({ onReset }) {
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[360px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--bg-surface)] px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500"><Search className="h-7 w-7" aria-hidden="true" /></span>
      <h2 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">No wishlist items found</h2>
      <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">Try another search term or clear the selected category.</p>
      <button type="button" onClick={onReset} className="mt-6 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">Clear filters</button>
    </motion.section>
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
