import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Award, BadgeCheck, CalendarDays, ChefHat, Clock3, CookingPot, ExternalLink, Heart, Leaf, MapPin, MessageCircle, ShoppingBag, Sparkles, Star, Timer, UserRound, Users, UtensilsCrossed } from 'lucide-react';
import CountUp from 'react-countup';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ChefDiscoveryCard from '../components/chefs/ChefDiscoveryCard';
import useCart from '../hooks/useCart';
import useWishlist from '../hooks/useWishlist';
import { useAuth } from '../providers/AuthProvider';
import { getChef } from '../services/chefsApi';
import { createConversation } from '../services/chatApi';

const id = (value) => value?.$oid || value || '';
const money = (value) => new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(Number(value || 0));
const date = (value) => value ? new Intl.DateTimeFormat('en-BD', { dateStyle: 'medium' }).format(new Date(value)) : 'Not available';
const FALLBACK_COVER = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=2000&q=85';

export default function ChefDetails() {
  const { id: chefId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, dbUser } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [contacting, setContacting] = useState(false);
  const { data, isLoading, isError } = useQuery({ queryKey: ['chef', chefId], queryFn: async () => (await getChef(chefId)).data.data });

  if (isLoading) return <DetailsSkeleton />;
  if (isError || !data?.chef) return <main className="flex min-h-[75vh] items-center justify-center bg-[var(--bg-page)] px-4 pt-28"><div className="text-center"><ChefHat className="mx-auto h-16 w-16 text-[var(--accent)]" /><h1 className="mt-5 text-3xl font-semibold text-[var(--text-primary)]">Chef not found</h1><Link to="/chefs" className="mt-6 inline-flex rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-white">Browse Chefs</Link></div></main>;

  const { chef, foods = [], reviews = [], relatedChefs = [] } = data;

  async function contactChef() {
    if (contacting) return;
    const email = dbUser?.email || user?.email;
    if (!email) { navigate('/login', { state: { from: location } }); return; }
    if (email.toLowerCase() === chef.email) { toast.error('You cannot message yourself.'); return; }
    setContacting(true);
    try { await createConversation(email, chef.email); navigate('/dashboard/messages'); }
    catch (error) { toast.error(error.response?.data?.message || 'Unable to start this conversation.'); }
    finally { setContacting(false); }
  }

  return <main className="min-h-screen bg-[var(--bg-page)] pb-24 pt-20">
    <section className="relative min-h-[580px] overflow-hidden rounded-b-[2.5rem] bg-[var(--bg-muted)] shadow-[var(--shadow-elevated)] sm:min-h-[620px] lg:rounded-b-[4rem]">
      <img src={chef.kitchenCoverImage || FALLBACK_COVER} alt={`${chef.kitchenName} kitchen and food preparation`} fetchpriority="high" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-slate-950/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/20" />
      <motion.div aria-hidden="true" animate={{ scale: [1, 1.12, 1], opacity: [.2, .34, .2] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="absolute -left-16 top-20 h-56 w-56 rounded-full bg-[var(--accent)] blur-3xl" />
      <motion.div aria-hidden="true" animate={{ x: [0, 18, 0], y: [0, -15, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} className="absolute right-[8%] top-[15%] h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      <HeroDecorations />

      <div className="container relative flex min-h-[580px] items-end pb-10 pt-28 sm:min-h-[620px] sm:pb-14">
        <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: .1 } } }} className="w-full max-w-5xl rounded-[2rem] border border-white/20 bg-black/25 p-5 text-white shadow-2xl backdrop-blur-xl sm:p-7 lg:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center lg:gap-8">
            <motion.div variants={{ hidden: { opacity: 0, scale: .9, y: 18 }, visible: { opacity: 1, scale: 1, y: 0 } }} className="relative shrink-0">
              <div className="absolute -inset-2 rounded-[2.4rem] bg-gradient-to-br from-white/45 via-[var(--accent)]/40 to-transparent blur-sm" />
              {chef.profilePhoto ? <img src={chef.profilePhoto} alt={`Chef ${chef.chefName}`} className="relative h-32 w-32 rounded-[2rem] border-2 border-white/70 object-cover shadow-2xl sm:h-40 sm:w-40" /> : <span className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] border-2 border-white/70 bg-white/15 shadow-2xl sm:h-40 sm:w-40"><ChefHat className="h-14 w-14" /></span>}
              {chef.verificationStatus === 'approved' && <span className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-white/60 bg-blue-500 shadow-lg" aria-label="Approved verified chef"><BadgeCheck className="h-6 w-6" /></span>}
            </motion.div>

            <div className="min-w-0 flex-1">
              <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} className="flex flex-wrap items-center gap-2">
                {chef.verificationStatus === 'approved' && <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md"><BadgeCheck className="h-4 w-4 text-blue-300" />Verified HomeBite Chef</span>}
                {(chef.cuisineSpecialties || []).slice(0, 4).map((cuisine) => <span key={cuisine} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">{cuisine}</span>)}
              </motion.div>
              <motion.h1 variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }} className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{chef.chefName}</motion.h1>
              <motion.p variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }} className="mt-2 text-lg font-medium text-white/80">{chef.kitchenName}</motion.p>
              <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }} className="mt-5 grid gap-3 text-sm text-white/90 sm:grid-cols-2 lg:grid-cols-4">
                <HeroFact icon={Star} text={`${Number(chef.averageRating || 0).toFixed(1)} · ${chef.reviewCount} reviews`} highlight />
                <HeroFact icon={CookingPot} text={`${chef.totalFoods} foods published`} />
                <HeroFact icon={Award} text={`${chef.yearsOfExperience} years experience`} />
                <HeroFact icon={MapPin} text={[chef.city, chef.country].filter(Boolean).join(', ') || 'Location available'} />
              </motion.div>
              <motion.p variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="mt-4 inline-flex items-center gap-2 text-xs text-white/65"><CalendarDays className="h-4 w-4" />HomeBite member since {date(chef.joinedDate)}</motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <div className="container mt-10 space-y-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"><div className="space-y-8"><Section title="About Chef"><p className="whitespace-pre-line leading-8 text-[var(--text-secondary)]">{chef.bio || 'This chef is building their HomeBite story.'}</p><div className="mt-6 grid gap-5 sm:grid-cols-2"><Info title="Cooking Philosophy" text={chef.cookingPhilosophy || 'Authentic home cooking with thoughtful ingredients.'} /><Info title="Preparation Style" text={chef.preparationStyle || 'Traditional home cooking'} /></div>{chef.achievements?.length > 0 && <div className="mt-6"><h3 className="font-semibold text-[var(--text-primary)]">Achievements</h3><ul className="mt-3 list-inside list-disc text-[var(--text-secondary)]">{chef.achievements.map((item) => <li key={item}>{item}</li>)}</ul></div>}</Section><Section title="Kitchen Information"><div className="grid gap-4 sm:grid-cols-2"><Info title="Kitchen" text={chef.kitchenDescription || chef.kitchenName} /><Info title="Operating Hours" text={formatHours(chef.operatingHours)} /><Info title="Delivery Areas" text={chef.deliveryAreas?.join(', ') || (chef.deliveryRadius ? `Within ${chef.deliveryRadius} km` : 'Contact chef for delivery coverage')} /><Info title="Average Preparation" text={chef.averagePreparationTime || 'Varies by meal'} /></div></Section></div><aside className="h-fit rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-soft)] lg:sticky lg:top-28"><h2 className="text-xl font-semibold text-[var(--text-primary)]">Connect with this chef</h2><motion.button type="button" onClick={contactChef} disabled={contacting} whileHover={!contacting ? { y: -2 } : {}} whileTap={!contacting ? { scale: .98 } : {}} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 disabled:cursor-wait disabled:opacity-60"><MessageCircle className={`h-5 w-5 ${contacting ? 'animate-pulse' : ''}`} />{contacting ? 'Opening Chat...' : 'Message Chef'}</motion.button><p className="mt-5 flex items-center gap-2 text-sm text-[var(--text-secondary)]"><CalendarDays className="h-4 w-4 text-[var(--accent)]" />Joined {date(chef.joinedDate)}</p><SocialLinks links={chef.socialLinks} /></aside></div>

      <section><Heading eyebrow="Expertise" title="Cuisine Specialties" /><div className="mt-5 flex flex-wrap gap-3">{chef.cuisineSpecialties.map((item) => <span key={item} className="rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-2 text-sm font-semibold text-[var(--text-primary)]">{item}</span>)}</div></section>
      <section><Heading eyebrow="At a glance" title="Chef Statistics" /><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6"><Stat icon={CookingPot} label="Meals Published" value={chef.totalFoods} /><Stat icon={ShoppingBag} label="Completed Orders" value={chef.completedOrders} /><Stat icon={Users} label="Followers" value={0} suffix="+" /><Stat icon={UserRound} label="Reviews" value={chef.reviewCount} /><Stat icon={Star} label="Average Rating" value={chef.averageRating} decimals={1} /><Stat icon={Timer} label="Response Time" text="Usually prompt" /></div></section>
      <section><Heading eyebrow="From this kitchen" title="Chef Foods" /><div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{foods.map((food, index) => <FoodCard key={id(food._id)} food={food} index={index} addToCart={async () => { if (!user) return navigate('/login', { state: { from: location } }); await addToCart(food, 1); }} wishlisted={isWishlisted(id(food._id))} toggle={() => { toggleWishlist(id(food._id)); toast.success(isWishlisted(id(food._id)) ? 'Removed from wishlist.' : 'Added to wishlist.'); }} />)}</div>{!foods.length && <p className="mt-6 rounded-3xl border border-dashed border-[var(--border)] p-10 text-center text-[var(--text-muted)]">This chef has no active foods right now.</p>}</section>
      <section><Heading eyebrow="Customer stories" title="Reviews" /><div className="mt-6 grid gap-5 md:grid-cols-2">{reviews.map((review, index) => <motion.article key={id(review._id)} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * .04 }} className="rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] p-6"><div className="flex items-center justify-between"><strong className="text-[var(--text-primary)]">{review.customer?.name || 'HomeBite customer'}</strong><span className="inline-flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{review.rating}</span></div><p className="mt-4 leading-7 text-[var(--text-secondary)]">{review.comment}</p><p className="mt-3 text-xs text-[var(--text-muted)]">{date(review.date)}</p></motion.article>)}</div>{!reviews.length && <p className="mt-6 text-sm text-[var(--text-muted)]">No reviews yet.</p>}</section>
      {relatedChefs.length > 0 && <section><Heading eyebrow="Similar kitchens" title="Related Chefs" /><div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{relatedChefs.map((item, index) => <ChefDiscoveryCard key={id(item._id)} chef={item} index={index} />)}</div></section>}
      <section className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--hero-gradient)] p-8 text-center shadow-[var(--shadow-soft)] sm:p-12"><h2 className="text-3xl font-semibold text-[var(--text-primary)]">Ready for something homemade?</h2><div className="mt-7 flex flex-wrap justify-center gap-3"><motion.div whileHover={{ y: -3 }} whileTap={{ scale: .97 }}><Link to="/foods" className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/20"><UtensilsCrossed className="h-4 w-4" />Browse All Foods</Link></motion.div><motion.button type="button" onClick={contactChef} disabled={contacting} whileHover={!contacting ? { y: -3 } : {}} whileTap={!contacting ? { scale: .97 } : {}} className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-6 py-3 font-semibold text-[var(--text-primary)] shadow-sm disabled:opacity-60"><MessageCircle className="h-4 w-4 text-[var(--accent)]" />{contacting ? 'Opening Chat...' : 'Contact Chef'}</motion.button><motion.div whileHover={{ y: -3 }} whileTap={{ scale: .97 }}><Link to={`/foods?chef=${encodeURIComponent(chef.email)}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-6 py-3 font-semibold text-[var(--text-primary)] shadow-sm"><ShoppingBag className="h-4 w-4 text-[var(--accent)]" />Order Now</Link></motion.div></div></section>
    </div>
  </main>;
}

function Section({ title, children }) { return <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5 sm:p-8"><h2 className="text-2xl font-semibold text-[var(--text-primary)]">{title}</h2><div className="mt-5">{children}</div></motion.section>; }
function Info({ title, text }) { return <div><h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{text}</p></div>; }
function Heading({ eyebrow, title }) { return <div><p className="text-xs font-semibold uppercase tracking-[.25em] text-[var(--accent)]">{eyebrow}</p><h2 className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">{title}</h2></div>; }
function HeroFact({ icon: Icon, text, highlight }) { return <span className="inline-flex min-w-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-2.5 backdrop-blur-sm"><Icon className={`h-4 w-4 shrink-0 ${highlight ? 'fill-amber-400 text-amber-400' : 'text-orange-200'}`} /><span className="truncate">{text}</span></span>; }
function HeroDecorations() { const items = [{ Icon: ChefHat, className: 'left-[5%] top-[24%]', duration: 7 }, { Icon: UtensilsCrossed, className: 'right-[8%] top-[30%]', duration: 8.5 }, { Icon: Leaf, className: 'right-[20%] bottom-[18%]', duration: 9.5 }, { Icon: Sparkles, className: 'left-[24%] top-[17%]', duration: 6.5 }]; return <div className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block" aria-hidden="true">{items.map(({ Icon, className, duration }, index) => <motion.span key={index} animate={{ y: [0, -14, 0], rotate: [-3, 4, -3], opacity: [.3, .55, .3] }} transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay: index * .6 }} className={`absolute flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white/70 shadow-xl backdrop-blur-md ${className}`}><Icon className="h-5 w-5" /></motion.span>)}</div>; }
function Stat({ icon: Icon, label, value, decimals = 0, suffix = '', text }) { return <motion.div whileHover={{ y: -6, scale: 1.015 }} transition={{ duration: .25 }} className="group rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-soft)]"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"><Icon className="h-5 w-5" /></span><p className="mt-5 text-2xl font-bold text-[var(--text-primary)]">{text || <CountUp end={Number(value || 0)} decimals={decimals} suffix={suffix} duration={1.3} />}</p><p className="mt-2 text-xs font-medium text-[var(--text-muted)]">{label}</p></motion.div>; }
function FoodCard({ food, index, addToCart, wishlisted, toggle }) { return <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * .04 }} whileHover={{ y: -5 }} className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)]"><div className="relative"><img src={food.thumbnail} alt={food.title} loading="lazy" className="aspect-[4/3] w-full object-cover" /><button onClick={toggle} aria-label={`${wishlisted ? 'Remove from' : 'Add to'} wishlist`} className="absolute right-3 top-3 rounded-full bg-black/45 p-2 text-white"><Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} /></button></div><div className="p-5"><p className="text-xs font-semibold text-[var(--accent)]">{food.category}</p><h3 className="mt-2 font-semibold text-[var(--text-primary)]">{food.title}</h3><div className="mt-3 flex items-center justify-between text-xs text-[var(--text-secondary)]"><span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5" />{Number(food.rating || 0).toFixed(1)}</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{food.preparationTime} min</span></div><p className="mt-4 text-lg font-bold text-[var(--text-primary)]">{money(food.discountPrice ?? food.price)}</p><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={addToCart} disabled={!food.isAvailable} className="inline-flex items-center justify-center gap-1 rounded-full bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"><ShoppingBag className="h-3.5 w-3.5" />Add</button><Link to={`/foods/${id(food._id)}`} className="rounded-full border border-[var(--border)] px-3 py-2 text-center text-xs font-semibold text-[var(--text-primary)]">Details</Link></div></div></motion.article>; }
function SocialLinks({ links = {} }) { const available = Object.entries(links).filter(([, value]) => value); if (!available.length) return null; return <div className="mt-5 border-t border-[var(--border)] pt-5"><p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Online</p><div className="mt-3 flex flex-wrap gap-2">{available.map(([name, url]) => <a key={name} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-muted)] px-3 py-2 text-xs font-semibold capitalize text-[var(--text-primary)]">{name}<ExternalLink className="h-3 w-3" /></a>)}</div></div>; }
function formatHours(value) { if (!value) return 'Contact chef for current hours'; if (typeof value === 'string') return value; return value.openingTime && value.closingTime ? `${value.openingTime} – ${value.closingTime}` : 'Contact chef for current hours'; }
function DetailsSkeleton() { return <main className="min-h-screen bg-[var(--bg-page)] pt-20" role="status"><div className="h-[430px] animate-pulse bg-[var(--bg-muted)]" /><div className="container mt-10 grid gap-6 lg:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <div key={i} className="h-64 animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" />)}</div></main>; }
