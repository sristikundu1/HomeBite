import { motion } from 'framer-motion';
import { MessageSquareText, RefreshCw, Search, Star, UsersRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import ReviewCard from '../../components/reviews/ReviewCard';
import { useAuth } from '../../providers/AuthProvider';
import { getChefReviews } from '../../services/reviewsApi';

const ratingFilters = ['all', 5, 4, 3, 2, 1];

function Stars({ rating, size = 'h-5 w-5' }) {
  return <div className="flex" aria-label={`${rating.toFixed(1)} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`${size} ${index < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-[var(--text-muted)]'}`} aria-hidden="true" />)}</div>;
}

export default function ChefReviews() {
  const { user, dbUser } = useAuth();
  const email = (dbUser?.email || user?.email || '').trim().toLowerCase();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    if (!email) return undefined;
    setLoading(true);
    setError('');
    getChefReviews(email)
      .then((response) => { if (active) setReviews(response.data.data || []); })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || 'Unable to load customer reviews.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [email, reloadKey]);

  const averageRating = useMemo(() => reviews.length ? reviews.reduce((total, review) => total + Number(review.rating || 0), 0) / reviews.length : 0, [reviews]);

  const visibleReviews = useMemo(() => {
    const query = search.trim().toLowerCase();
    return reviews.filter((review) => {
      const matchesRating = ratingFilter === 'all' || Number(review.rating) === Number(ratingFilter);
      const searchable = [review.customer?.name, review.customer?.email, review.comment].filter(Boolean).join(' ').toLowerCase();
      return matchesRating && (!query || searchable.includes(query));
    });
  }, [ratingFilter, reviews, search]);

  if (loading) return <ReviewsSkeleton />;

  return (
    <div className="mx-auto max-w-[1400px] space-y-8">
      <DashboardHeader title="Reviews" description="See what customers are saying about their meals and your service." />

      {error && <div role="alert" className="flex flex-col gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-red-500">{error}</p><button type="button" onClick={() => setReloadKey((value) => value + 1)} className="inline-flex items-center gap-2 self-start rounded-full border border-red-500/20 px-4 py-2 text-sm font-semibold text-red-500"><RefreshCw className="h-4 w-4" /> Retry</button></div>}

      <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr_0.65fr]">
        <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 to-rose-500 p-6 text-white shadow-xl shadow-orange-500/20 sm:p-7"><div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" /><div className="relative"><p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">Overall Rating</p><div className="mt-5 flex flex-wrap items-end gap-4"><span className="text-6xl font-bold leading-none text-white">{averageRating.toFixed(1)}</span><div><Stars rating={averageRating} /><p className="mt-2 text-xs text-white/75">Based on {reviews.length} customer {reviews.length === 1 ? 'review' : 'reviews'}</p></div></div></div></motion.article>
        <MetricCard icon={Star} label="Average Rating" value={averageRating.toFixed(1)} suffix="/ 5" delay={0.05} tone="text-amber-500 bg-amber-500/10" />
        <MetricCard icon={UsersRound} label="Review Count" value={reviews.length} suffix={reviews.length === 1 ? 'review' : 'reviews'} delay={0.1} tone="text-blue-500 bg-blue-500/10" />
      </section>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-lg shadow-black/5 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex w-full items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3 lg:max-w-md"><Search className="h-4 w-4 text-[var(--text-muted)]" /><span className="sr-only">Search customer reviews</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer or review" className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none" /></label>
          <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filter by rating">{ratingFilters.map((rating) => <button key={rating} type="button" onClick={() => setRatingFilter(rating)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition ${ratingFilter === rating ? 'bg-[var(--accent)] text-white shadow-lg shadow-orange-500/15' : 'border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--accent)]'}`}>{rating === 'all' ? 'All Ratings' : <>{rating}<Star className="h-3 w-3 fill-current" /></>}</button>)}</div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between gap-4"><div><h2 className="text-xl font-semibold text-[var(--text-primary)]">Customer Reviews</h2><p className="mt-1 text-xs text-[var(--text-muted)]">Showing {visibleReviews.length} of {reviews.length}</p></div></div>
        {visibleReviews.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visibleReviews.map((review, index) => <ReviewCard key={review._id?.$oid || review._id} review={review} index={index} />)}</div> : <EmptyReviews filtered={Boolean(search || ratingFilter !== 'all')} />}
      </section>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, suffix, delay, tone }) { return <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} whileHover={{ y: -4 }} className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}><Icon className="h-5 w-5" /></span><p className="mt-6 text-4xl font-bold text-[var(--text-primary)]">{value}</p><p className="mt-1 text-xs text-[var(--text-muted)]">{suffix}</p><p className="mt-4 text-sm font-semibold text-[var(--text-secondary)]">{label}</p></motion.article>; }
function EmptyReviews({ filtered }) { return <div className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--bg-surface)] px-6 py-20 text-center"><MessageSquareText className="mx-auto h-10 w-10 text-[var(--text-muted)]" /><h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">{filtered ? 'No matching reviews' : 'No reviews yet'}</h3><p className="mt-2 text-sm text-[var(--text-muted)]">{filtered ? 'Try a different search or rating filter.' : 'Customer reviews will appear here after delivered orders.'}</p></div>; }
function ReviewsSkeleton() { return <div className="mx-auto max-w-[1400px] space-y-8" role="status" aria-label="Loading chef reviews"><div className="space-y-3"><div className="h-4 w-24 animate-pulse rounded bg-[var(--bg-muted)]" /><div className="h-10 w-52 animate-pulse rounded bg-[var(--bg-muted)]" /></div><div className="grid gap-4 lg:grid-cols-3"><div className="h-48 animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /><div className="h-48 animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /><div className="h-48 animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /></div><div className="h-28 animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-56 animate-pulse rounded-3xl bg-[var(--bg-muted)]" />)}</div></div>; }
