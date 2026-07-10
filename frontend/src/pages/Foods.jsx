import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Heart,
  ImageOff,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  UtensilsCrossed,
  X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { getFoods } from '../services/foodsApi';
import useWishlist from '../hooks/useWishlist';

const PAGE_SIZE = 8;
const priceRanges = [
  { label: 'Any price', value: 'all', min: 0, max: Infinity },
  { label: 'Under ৳300', value: 'under-300', min: 0, max: 300 },
  { label: '৳300 – ৳600', value: '300-600', min: 300, max: 600 },
  { label: '৳600 – ৳1,000', value: '600-1000', min: 600, max: 1000 },
  { label: 'Above ৳1,000', value: 'above-1000', min: 1000, max: Infinity }
];

function foodId(food) {
  return food?._id?.$oid || food?._id;
}

function currentPrice(food) {
  return food.discountPrice ?? food.price ?? 0;
}

function formatPrice(value) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 2
  }).format(value || 0);
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

export default function Foods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [cuisine, setCuisine] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const { toggleWishlist, isWishlisted } = useWishlist();

  useEffect(() => {
    let active = true;

    async function loadFoods() {
      try {
        const response = await getFoods();
        if (active) setFoods(response.data.data || []);
      } catch (error) {
        if (active) toast.error(error.response?.data?.message || 'Failed to load foods.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadFoods();
    return () => { active = false; };
  }, []);

  const categories = useMemo(() => [...new Set(foods.map((food) => food.category).filter(Boolean))].sort(), [foods]);
  const cuisines = useMemo(() => [...new Set(foods.map((food) => food.cuisine).filter(Boolean))].sort(), [foods]);

  const filteredFoods = useMemo(() => {
    const query = normalize(searchTerm);
    const selectedRange = priceRanges.find((range) => range.value === priceRange) || priceRanges[0];

    const matches = foods.filter((food) => {
      const searchMatch = !query || [food.title, food.chefName, food.category, food.cuisine, ...(food.tags || [])].some((value) => normalize(value).includes(query));
      const categoryMatch = category === 'all' || food.category === category;
      const cuisineMatch = cuisine === 'all' || food.cuisine === cuisine;
      const price = currentPrice(food);
      const priceMatch = price >= selectedRange.min && price <= selectedRange.max;
      return searchMatch && categoryMatch && cuisineMatch && priceMatch;
    });

    return [...matches].sort((a, b) => {
      if (sortBy === 'price-low') return currentPrice(a) - currentPrice(b);
      if (sortBy === 'price-high') return currentPrice(b) - currentPrice(a);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'popular') return (b.orderCount || 0) - (a.orderCount || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [foods, searchTerm, category, cuisine, priceRange, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, category, cuisine, priceRange, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredFoods.length / PAGE_SIZE));
  const visibleFoods = filteredFoods.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const filtersActive = Boolean(searchTerm || category !== 'all' || cuisine !== 'all' || priceRange !== 'all');

  function resetFilters() {
    setSearchTerm('');
    setCategory('all');
    setCuisine('all');
    setPriceRange('all');
    setSortBy('newest');
  }

  function handleWishlist(food) {
    const id = foodId(food);
    const wasWishlisted = isWishlisted(id);
    toggleWishlist(id);
    toast.success(wasWishlisted ? 'Removed from wishlist.' : 'Added to wishlist.');
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] pb-24 pt-28 sm:pt-32">
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_30%),radial-gradient(circle_at_85%_30%,rgba(236,72,153,0.10),transparent_28%)]" />
        <div className="container relative py-16 sm:py-20 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-panel)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)] backdrop-blur-xl">
              <ChefHat className="h-4 w-4" aria-hidden="true" /> Home-cooked with care
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">Discover food that feels like home.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg">Explore fresh dishes from talented local chefs, thoughtfully prepared and ready for your table.</p>
          </motion.div>
        </div>
      </section>

      <main className="container py-10 sm:py-14">
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} aria-label="Food filters" className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-[var(--shadow-soft)] sm:p-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden="true" />
            <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search foods, chefs, cuisines, or tags..." aria-label="Search foods" className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] py-4 pl-12 pr-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto]">
            <FilterSelect label="Category" value={category} onChange={setCategory} options={categories} />
            <FilterSelect label="Cuisine" value={cuisine} onChange={setCuisine} options={cuisines} />
            <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Price range<select value={priceRange} onChange={(event) => setPriceRange(event.target.value)} className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-sm normal-case tracking-normal text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]">{priceRanges.map((range) => <option key={range.value} value={range.value}>{range.label}</option>)}</select></label>
            <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Sort by<select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-sm normal-case tracking-normal text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"><option value="newest">Newest first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Highest rated</option><option value="popular">Most ordered</option></select></label>
            <button type="button" onClick={resetFilters} disabled={!filtersActive && sortBy === 'newest'} className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-40"><X className="h-4 w-4" />Reset</button>
          </div>
        </motion.section>

        <div className="mb-6 mt-10 flex items-end justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Fresh picks</p><h2 className="mt-2 text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">Food near you</h2></div>
          {!loading && <p className="text-sm text-[var(--text-muted)]">{filteredFoods.length} {filteredFoods.length === 1 ? 'dish' : 'dishes'}</p>}
        </div>

        {loading ? <FoodSkeletons /> : visibleFoods.length ? (
          <>
            <motion.div layout className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {visibleFoods.map((food, index) => <FoodCard key={foodId(food)} food={food} wished={isWishlisted(foodId(food))} onWishlist={handleWishlist} index={index} />)}
              </AnimatePresence>
            </motion.div>
            <Pagination currentPage={currentPage} totalPages={totalPages} count={filteredFoods.length} visibleCount={visibleFoods.length} onChange={setCurrentPage} />
          </>
        ) : <EmptyState filtered={filtersActive} onReset={resetFilters} />}
      </main>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-sm normal-case tracking-normal text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"><option value="all">All {label.toLowerCase()}s</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function FoodCard({ food, wished, onWishlist, index }) {
  const [imageFailed, setImageFailed] = useState(false);
  const discounted = food.discountPrice !== null && food.discountPrice !== undefined;

  return (
    <motion.article layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ delay: index * 0.04 }} whileHover={{ y: -6 }} className="group overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-lg shadow-black/5 transition-shadow hover:shadow-[var(--shadow-soft)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-muted)]">
        {food.thumbnail && !imageFailed ? <img src={food.thumbnail} alt={food.title} onError={() => setImageFailed(true)} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-[var(--text-muted)]"><ImageOff className="h-9 w-9" /></div>}
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-xl ${food.isAvailable ? 'bg-emerald-500/90 text-white' : 'bg-slate-900/75 text-slate-200'}`}>{food.isAvailable ? 'Available' : 'Unavailable'}</span>
        <motion.button
          type="button"
          onClick={() => onWishlist(food)}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.86 }}
          animate={{ scale: wished ? [1, 1.18, 1] : 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          aria-label={`${wished ? 'Remove' : 'Add'} ${food.title} ${wished ? 'from' : 'to'} wishlist`}
          aria-pressed={wished}
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 backdrop-blur-xl transition-colors focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-transparent ${wished ? 'bg-rose-500 text-white' : 'bg-black/35 text-white hover:bg-white hover:text-rose-500'}`}
        >
          <motion.span
            key={wished ? 'saved' : 'unsaved'}
            initial={{ scale: 0.65, rotate: wished ? -18 : 0 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 520, damping: 24 }}
            aria-hidden="true"
          >
            <Heart className={`h-5 w-5 transition-[fill] duration-200 ${wished ? 'fill-current' : 'fill-transparent'}`} />
          </motion.span>
        </motion.button>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 text-xs"><span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 font-semibold text-[var(--accent)]">{food.category}</span><span className="inline-flex items-center gap-1 font-semibold text-[var(--text-secondary)]"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{Number(food.rating || 0).toFixed(1)}</span></div>
        <h3 className="mt-4 line-clamp-1 text-lg font-semibold text-[var(--text-primary)]">{food.title}</h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-[var(--text-secondary)]"><ChefHat className="h-4 w-4 text-[var(--accent)]" />{food.chefName}</p>
        <div className="mt-5 flex items-end justify-between border-t border-[var(--border)] pt-4"><div><p className="text-lg font-bold text-[var(--text-primary)]">{formatPrice(currentPrice(food))}</p>{discounted && <p className="text-xs text-[var(--text-muted)] line-through">{formatPrice(food.price)}</p>}</div><p className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]"><ShoppingBag className="h-4 w-4" />{food.orderCount || 0} orders</p></div>
        <Link to={`/foods/${foodId(food)}`} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/15 transition hover:shadow-orange-500/25 focus:outline-none focus:ring-2 focus:ring-orange-500/40">View Details<ArrowRight className="h-4 w-4" /></Link>
      </div>
    </motion.article>
  );
}

function FoodSkeletons() {
  return <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4" role="status" aria-label="Loading foods">{Array.from({ length: 8 }, (_, index) => <div key={index} className="overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)]"><div className="aspect-[4/3] animate-pulse bg-[var(--bg-muted)]" /><div className="space-y-4 p-5"><div className="h-5 w-20 animate-pulse rounded-full bg-[var(--bg-muted)]" /><div className="h-6 w-3/4 animate-pulse rounded bg-[var(--bg-muted)]" /><div className="h-4 w-1/2 animate-pulse rounded bg-[var(--bg-muted)]" /><div className="h-12 animate-pulse rounded-full bg-[var(--bg-muted)]" /></div></div>)}</div>;
}

function EmptyState({ filtered, onReset }) {
  return <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--bg-surface)] px-6 text-center"><span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--accent-soft)] text-[var(--accent)]">{filtered ? <SlidersHorizontal className="h-8 w-8" /> : <UtensilsCrossed className="h-8 w-8" />}</span><h2 className="mt-5 text-2xl font-semibold text-[var(--text-primary)]">{filtered ? 'No matching foods' : 'No foods available yet'}</h2><p className="mt-3 max-w-md text-sm leading-7 text-[var(--text-secondary)]">{filtered ? 'Try changing your search or filters to discover more dishes.' : 'Fresh dishes from local chefs will appear here soon.'}</p>{filtered && <button type="button" onClick={onReset} className="mt-6 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white">Clear filters</button>}</motion.div>;
}

function Pagination({ currentPage, totalPages, count, visibleCount, onChange }) {
  const first = count ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const last = count ? first + visibleCount - 1 : 0;
  return <nav aria-label="Food pagination" className="mt-10 flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-[var(--text-secondary)]">Showing {first}–{last} of {count}</p><div className="flex items-center gap-2"><button type="button" onClick={() => onChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} aria-label="Previous page" className="rounded-full border border-[var(--border)] p-2.5 text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] disabled:opacity-35"><ChevronLeft className="h-4 w-4" /></button><span className="px-3 text-sm font-semibold text-[var(--text-primary)]">{currentPage} / {totalPages}</span><button type="button" onClick={() => onChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} aria-label="Next page" className="rounded-full border border-[var(--border)] p-2.5 text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] disabled:opacity-35"><ChevronRight className="h-4 w-4" /></button></div></nav>;
}
