import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ChefHat,
  Clock3,
  Flame,
  Heart,
  ImageOff,
  Mail,
  Plus,
  ShoppingBag,
  Star,
  Users,
  UtensilsCrossed
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getFood, getFoods } from '../services/foodsApi';

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

export default function FoodDetails() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [allFoods, setAllFoods] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function loadDetails() {
      setLoading(true);
      setError('');
      try {
        const [foodResponse, foodsResponse] = await Promise.all([getFood(id), getFoods()]);
        if (!active) return;
        const selectedFood = foodResponse.data.data;
        setFood(selectedFood);
        setAllFoods(foodsResponse.data.data || []);
        setSelectedImage(selectedFood.thumbnail || selectedFood.gallery?.[0] || '');
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || 'Food details could not be loaded.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDetails();
    return () => { active = false; };
  }, [id]);

  const relatedFoods = useMemo(() => {
    if (!food) return [];
    return allFoods
      .filter((item) => foodId(item) !== foodId(food) && (item.category === food.category || item.cuisine === food.cuisine))
      .slice(0, 4);
  }, [allFoods, food]);

  if (loading) return <DetailsSkeleton />;

  if (error || !food) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[var(--bg-page)] px-4 pt-28">
        <div className="max-w-lg rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-10 text-center shadow-[var(--shadow-soft)]">
          <ImageOff className="mx-auto h-12 w-12 text-[var(--accent)]" aria-hidden="true" />
          <h1 className="mt-5 text-3xl font-semibold text-[var(--text-primary)]">Food unavailable</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{error}</p>
          <Link to="/foods" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white"><ArrowLeft className="h-4 w-4" />Back to Foods</Link>
        </div>
      </main>
    );
  }

  const images = [...new Set([food.thumbnail, ...(food.gallery || [])].filter(Boolean))];
  const discounted = food.discountPrice !== null && food.discountPrice !== undefined;

  return (
    <main className="min-h-screen bg-[var(--bg-page)] pb-24 pt-28 sm:pt-32">
      <div className="container">
        <Link to="/foods" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:text-[var(--accent)]"><ArrowLeft className="h-4 w-4" />Back to Foods</Link>

        <div className="mt-7 grid gap-10 xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)] xl:items-start">
          <ImageGallery images={images} selectedImage={selectedImage} onSelect={setSelectedImage} title={food.title} />

          <motion.section initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }} aria-labelledby="food-title" className="xl:sticky xl:top-28">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[var(--accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{food.category}</span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)]">{food.cuisine}</span>
            </div>
            <h1 id="food-title" className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl">{food.title}</h1>
            <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">{food.shortDescription}</p>

            <div className="mt-6 flex flex-wrap items-center gap-5 border-y border-[var(--border)] py-5 text-sm">
              <span className="inline-flex items-center gap-2 font-semibold text-[var(--text-primary)]"><Star className="h-5 w-5 fill-amber-400 text-amber-400" />{Number(food.rating || 0).toFixed(1)} <span className="font-normal text-[var(--text-muted)]">({food.reviewCount || 0} reviews)</span></span>
              <span className="inline-flex items-center gap-2 text-[var(--text-secondary)]"><ShoppingBag className="h-5 w-5 text-[var(--accent)]" />{food.orderCount || 0} orders</span>
            </div>

            <div className="mt-6 flex flex-wrap items-end gap-3">
              <span className="text-3xl font-bold text-[var(--text-primary)]">{formatPrice(discounted ? food.discountPrice : food.price)}</span>
              {discounted && <span className="pb-1 text-lg text-[var(--text-muted)] line-through">{formatPrice(food.price)}</span>}
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <InfoTile icon={Clock3} label="Preparation" value={`${food.preparationTime} min`} />
              <InfoTile icon={Users} label="Serves" value={`${food.servingSize} people`} />
              <InfoTile icon={Flame} label="Calories" value={`${food.calories} kcal`} />
              <InfoTile icon={UtensilsCrossed} label="Spice level" value={food.spiceLevel} capitalize />
            </div>

            <div className={`mt-6 flex items-center gap-3 rounded-2xl border p-4 ${food.isAvailable ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
              <span className={`h-3 w-3 rounded-full ${food.isAvailable ? 'bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]' : 'bg-red-500 shadow-[0_0_0_6px_rgba(239,68,68,0.12)]'}`} />
              <div><p className={`text-sm font-semibold ${food.isAvailable ? 'text-emerald-500' : 'text-red-500'}`}>{food.isAvailable ? 'Available to order' : 'Currently unavailable'}</p><p className="mt-0.5 text-xs text-[var(--text-muted)]">{food.isAvailable ? `${food.availableQuantity} portions currently available` : 'Check back again soon'}</p></div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button type="button" disabled={!food.isAvailable} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"><ShoppingBag className="h-5 w-5" />Add to Cart</button>
              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-7 py-4 text-sm font-semibold text-[var(--text-primary)] transition hover:border-rose-500/30 hover:bg-rose-500/5 hover:text-rose-500"><Heart className="h-5 w-5" />Wishlist</button>
            </div>
          </motion.section>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            <ContentCard title="Description"><p className="whitespace-pre-line text-base leading-8 text-[var(--text-secondary)]">{food.description}</p></ContentCard>
            <ContentCard title="Ingredients">
              <ul className="grid gap-3 sm:grid-cols-2">
                {(food.ingredients || []).map((ingredient) => <li key={ingredient} className="flex items-center gap-3 rounded-2xl bg-[var(--bg-muted)] px-4 py-3 text-sm font-medium text-[var(--text-primary)]"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]"><Plus className="h-3.5 w-3.5" /></span>{ingredient}</li>)}
              </ul>
            </ContentCard>
            {!!food.tags?.length && <ContentCard title="Tags"><div className="flex flex-wrap gap-2">{food.tags.map((tag) => <span key={tag} className="rounded-full border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)]">#{tag}</span>)}</div></ContentCard>}
          </div>
          <ChefCard food={food} />
        </div>

        <RelatedFoods foods={relatedFoods} />
      </div>
    </main>
  );
}

function ImageGallery({ images, selectedImage, onSelect, title }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [selectedImage]);

  return (
    <motion.section initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }} aria-label="Food image gallery">
      <div className="aspect-[4/3] overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-muted)] shadow-[var(--shadow-soft)]">
        {selectedImage && !failed ? <motion.img key={selectedImage} initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} src={selectedImage} onError={() => setFailed(true)} alt={title} className="h-full w-full object-cover" /> : <div className="flex h-full flex-col items-center justify-center text-[var(--text-muted)]"><ImageOff className="h-12 w-12" /><p className="mt-3 text-sm">Image unavailable</p></div>}
      </div>
      {images.length > 1 && <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">{images.map((image, index) => <button key={image} type="button" onClick={() => onSelect(image)} aria-label={`View food image ${index + 1}`} aria-pressed={selectedImage === image} className={`aspect-square overflow-hidden rounded-2xl border-2 bg-[var(--bg-muted)] transition ${selectedImage === image ? 'border-[var(--accent)] shadow-lg shadow-orange-500/15' : 'border-transparent opacity-70 hover:opacity-100'}`}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}</div>}
    </motion.section>
  );
}

function InfoTile({ icon: Icon, label, value, capitalize }) {
  return <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4"><Icon className="h-5 w-5 text-[var(--accent)]" /><p className="mt-3 text-xs text-[var(--text-muted)]">{label}</p><p className={`mt-1 text-sm font-semibold text-[var(--text-primary)] ${capitalize ? 'capitalize' : ''}`}>{value}</p></div>;
}

function ContentCard({ title, children }) {
  return <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5 sm:p-8"><h2 className="text-2xl font-semibold text-[var(--text-primary)]">{title}</h2><div className="mt-5">{children}</div></motion.section>;
}

function ChefCard({ food }) {
  return <motion.aside initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="h-fit rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5 lg:sticky lg:top-28"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Meet your chef</p><div className="mt-5 flex items-center gap-4">{food.chefPhoto ? <img src={food.chefPhoto} alt={food.chefName} className="h-16 w-16 rounded-2xl border border-[var(--border)] object-cover" /> : <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><ChefHat className="h-8 w-8" /></span>}<div><h2 className="text-xl font-semibold text-[var(--text-primary)]">{food.chefName}</h2><p className="mt-1 text-sm text-[var(--text-muted)]">HomeBite Chef</p></div></div><div className="mt-6 border-t border-[var(--border)] pt-5"><p className="flex items-center gap-2 break-all text-sm text-[var(--text-secondary)]"><Mail className="h-4 w-4 shrink-0 text-[var(--accent)]" />{food.chefEmail}</p></div></motion.aside>;
}

function RelatedFoods({ foods }) {
  if (!foods.length) return null;
  return <section className="mt-20"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">You may also like</p><h2 className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">Related Foods</h2><div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{foods.map((food, index) => <motion.article key={foodId(food)} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)]"><img src={food.thumbnail} alt={food.title} className="aspect-[4/3] w-full object-cover" /><div className="p-5"><p className="text-xs font-semibold text-[var(--accent)]">{food.category}</p><h3 className="mt-2 line-clamp-1 font-semibold text-[var(--text-primary)]">{food.title}</h3><div className="mt-4 flex items-center justify-between"><span className="font-bold text-[var(--text-primary)]">{formatPrice(food.discountPrice ?? food.price)}</span><Link to={`/foods/${foodId(food)}`} className="rounded-full bg-[var(--accent-soft)] px-3 py-2 text-xs font-semibold text-[var(--accent)]">View</Link></div></div></motion.article>)}</div></section>;
}

function DetailsSkeleton() {
  return <main className="min-h-screen bg-[var(--bg-page)] pb-24 pt-32" role="status" aria-label="Loading food details"><div className="container"><div className="h-5 w-32 animate-pulse rounded bg-[var(--bg-muted)]" /><div className="mt-8 grid gap-10 xl:grid-cols-2"><div className="aspect-[4/3] animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /><div className="space-y-5"><div className="h-8 w-28 animate-pulse rounded-full bg-[var(--bg-muted)]" /><div className="h-14 w-4/5 animate-pulse rounded bg-[var(--bg-muted)]" /><div className="h-5 w-full animate-pulse rounded bg-[var(--bg-muted)]" /><div className="h-5 w-2/3 animate-pulse rounded bg-[var(--bg-muted)]" /><div className="grid grid-cols-4 gap-3">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-28 animate-pulse rounded-2xl bg-[var(--bg-muted)]" />)}</div><div className="h-14 animate-pulse rounded-full bg-[var(--bg-muted)]" /></div></div></div></main>;
}
