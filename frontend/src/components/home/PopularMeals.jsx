import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BadgeCheck, ChefHat, Clock, Heart, ImageOff, MapPin, ShoppingBag, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';
import { useAuth } from '../../providers/AuthProvider';
import { getFeaturedFoods } from '../../services/foodsApi';

const foodId = (food) => food?._id?.$oid || food?._id || '';
const price = (value) => new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(Number(value || 0));

function PopularMeals() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { data: meals = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['foods', 'featured'],
    queryFn: async () => (await getFeaturedFoods()).data.data || []
  });

  function requireLogin() {
    if (user) return true;
    navigate('/login', { state: { from: location } });
    return false;
  }

  function handleWishlist(event, meal) {
    event.stopPropagation();
    if (!requireLogin()) return;
    const wished = isWishlisted(foodId(meal));
    toggleWishlist(foodId(meal));
    toast.success(wished ? 'Removed from wishlist.' : 'Added to wishlist.');
  }

  async function handleCart(event, meal) {
    event.stopPropagation();
    if (!requireLogin()) return;
    await addToCart(meal, 1);
  }

  return (
    <section className="relative overflow-hidden bg-[var(--bg-page)] py-24" id="popular-meals">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.65, ease: 'easeOut' }} className="mb-12 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">Premium meals ready to order</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">Discover chef-crafted dishes delivered from local kitchens.</h2>
          <p className="mt-4 max-w-2xl text-base text-[var(--text-secondary)] sm:text-lg">Explore a curated selection of premium home-cooked meals designed for comfort, flavor, and fast delivery.</p>
        </motion.div>

        {isLoading ? <MealSkeletons /> : isError ? <State icon={ImageOff} title="Unable to load featured meals" description="Please try loading our featured meals again." action={<button type="button" onClick={() => refetch()} className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white">Retry</button>} /> : meals.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {meals.map((meal, index) => {
              const wished = isWishlisted(foodId(meal));
              return <motion.article key={foodId(meal)} role="link" tabIndex={0} aria-label={`View ${meal.title}`} onClick={() => navigate(`/foods/${foodId(meal)}`)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') navigate(`/foods/${foodId(meal)}`); }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: 0.35, delay: index * .06, ease: 'easeOut' }} whileHover={{ y: -10 }} className="group cursor-pointer overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)] transition duration-300 hover:shadow-[var(--shadow-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                <div className="relative overflow-hidden"><img src={meal.thumbnail} alt={meal.title} loading="lazy" className="h-[320px] w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,23,42,0.72)] via-transparent to-transparent" /><span className="absolute left-5 top-5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">Available</span><button type="button" onClick={(event) => handleWishlist(event, meal)} aria-pressed={wished} aria-label={`${wished ? 'Remove' : 'Add'} ${meal.title} ${wished ? 'from' : 'to'} wishlist`} className="absolute right-5 top-5 rounded-full bg-[var(--bg-page)]/85 p-2.5 text-[var(--text-primary)] backdrop-blur-md"><Heart className={`h-4 w-4 ${wished ? 'fill-rose-500 text-rose-500' : ''}`} /></button><div className="absolute inset-x-0 bottom-0 p-6"><span className="inline-flex rounded-full bg-[var(--bg-page)]/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--text-secondary)] backdrop-blur-md">{meal.category} · {meal.cuisine}</span></div></div>
                <div className="space-y-5 p-6"><div className="flex items-start justify-between gap-4"><div><h3 className="text-xl font-semibold text-[var(--text-primary)]">{meal.title}</h3><p className="mt-2 inline-flex items-center gap-1 text-sm text-[var(--text-secondary)]">{meal.chefName}<BadgeCheck className="h-4 w-4 text-blue-500" aria-label="Verified chef" /></p></div><span className="rounded-full bg-[var(--accent)]/10 px-3 py-2 text-sm font-semibold text-[var(--accent)]">{price(meal.discountPrice ?? meal.price)}</span></div>
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--text-secondary)]"><span className="inline-flex items-center gap-2"><Star size={16} className="fill-amber-400 text-amber-400" />{Number(meal.rating || 0).toFixed(1)} ({meal.reviewCount || 0})</span><span className="inline-flex items-center gap-2"><Clock size={16} className="text-[var(--icon)]" />{meal.preparationTime} min</span>{meal.chefCity && <span className="inline-flex items-center gap-2"><MapPin size={16} />{meal.chefCity}</span>}</div>
                  <div className="flex items-center justify-between gap-4 border-t border-[var(--border)] pt-5"><div className="flex min-w-0 items-center gap-3">{meal.chefPhoto ? <img src={meal.chefPhoto} alt="" loading="lazy" className="h-12 w-12 rounded-3xl object-cover" /> : <span className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[var(--accent-soft)] text-[var(--accent)]"><ChefHat className="h-5 w-5" /></span>}<div className="min-w-0"><p className="truncate text-sm font-semibold text-[var(--text-primary)]">{meal.chefName}</p><p className="text-sm text-[var(--text-secondary)]">Verified local chef</p></div></div><div className="flex shrink-0 gap-2"><Link to={`/foods/${foodId(meal)}`} onClick={(event) => event.stopPropagation()} className="inline-flex items-center justify-center rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)]">View Details</Link><button type="button" onClick={(event) => handleCart(event, meal)} className="inline-flex items-center justify-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-3 py-2 text-xs font-semibold text-[var(--button-text)] shadow-lg shadow-orange-500/20"><ShoppingBag className="h-3.5 w-3.5" />Add</button></div></div>
                </div>
              </motion.article>;
            })}
          </div>
        ) : <State icon={ChefHat} title="No featured meals available" description="Our local chefs are preparing delicious homemade meals. Please check back soon." action={<Link to="/foods" className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white">Browse All Foods</Link>} />}
        <div className="mt-10 text-center"><Link to="/foods" className="inline-flex rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-7 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-soft)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">View All Meals</Link></div>
      </div>
    </section>
  );
}

function MealSkeletons() { return <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading featured meals">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-[590px] animate-pulse rounded-[32px] border border-[var(--border)] bg-[var(--bg-muted)]" />)}</div>; }
function State({ icon: Icon, title, description, action }) { return <div className="flex min-h-96 flex-col items-center justify-center rounded-[32px] border border-dashed border-[var(--border)] bg-[var(--bg-surface)] p-8 text-center"><span className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-[var(--accent-soft)] text-[var(--accent)]"><Icon className="h-9 w-9" /></span><h3 className="mt-6 text-2xl font-semibold text-[var(--text-primary)]">{title}</h3><p className="mt-3 max-w-md text-sm leading-7 text-[var(--text-secondary)]">{description}</p><div className="mt-6">{action}</div></div>; }

export default PopularMeals;
