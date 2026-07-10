import { AnimatePresence, motion } from 'framer-motion';
import { ChefHat, ExternalLink, MessageSquareText, Pencil, Search, Star, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { useAuth } from '../../providers/AuthProvider';
import { deleteReview, getCustomerReviews, updateReview } from '../../services/reviewsApi';

const documentId = (value) => value?.$oid || value || '';
const chefList = (review) => Array.isArray(review.chef) ? review.chef : [review.chef].filter(Boolean);

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-BD', { dateStyle: 'medium' }).format(new Date(value));
}

export default function CustomerReviews() {
  const { user, dbUser } = useAuth();
  const email = (dbUser?.email || user?.email || '').trim().toLowerCase();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [rating, setRating] = useState('all');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    let active = true;
    if (!email) return () => { active = false; };
    setLoading(true);
    getCustomerReviews(email)
      .then((response) => { if (active) setReviews(response.data.data || []); })
      .catch((error) => { if (active) toast.error(error.response?.data?.message || 'Unable to load your reviews.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [email]);

  const visibleReviews = useMemo(() => {
    const query = search.trim().toLowerCase();
    return reviews.filter((review) => {
      const matchesRating = rating === 'all' || Number(review.rating) === Number(rating);
      const text = [review.comment, ...(review.foods || []).map((food) => food.name), ...chefList(review).flatMap((chef) => [chef?.name, chef?.email])].filter(Boolean).join(' ').toLowerCase();
      return matchesRating && (!query || text.includes(query));
    });
  }, [rating, reviews, search]);

  async function saveReview(values) {
    const id = documentId(editing._id);
    const response = await updateReview(id, { ...values, userEmail: email });
    const updated = response.data.data;
    setReviews((current) => current.map((review) => documentId(review._id) === id ? { ...review, ...updated } : review));
    setEditing(null);
    toast.success('Review updated successfully.');
  }

  async function confirmDelete() {
    const id = documentId(deleting?._id);
    if (!id) return;
    try {
      await deleteReview(id, email);
      setReviews((current) => current.filter((review) => documentId(review._id) !== id));
      setDeleting(null);
      toast.success('Review deleted successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete this review.');
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-8">
      <DashboardHeader title="My Reviews" description="View and manage the feedback you have shared about delivered meals." />

      {!loading && reviews.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_220px]">
          <label className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3"><Search className="h-4 w-4 text-[var(--text-muted)]" /><span className="sr-only">Search reviews</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search food, chef, or comment" className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none" /></label>
          <label><span className="sr-only">Filter by rating</span><select value={rating} onChange={(event) => setRating(event.target.value)} className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"><option value="all">All ratings</option>{[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} stars</option>)}</select></label>
        </motion.section>
      )}

      {loading ? <ReviewsSkeleton /> : visibleReviews.length ? (
        <motion.section layout className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Your reviews">
          <AnimatePresence mode="popLayout">{visibleReviews.map((review, index) => <CustomerReviewCard key={documentId(review._id)} review={review} index={index} onEdit={() => setEditing(review)} onDelete={() => setDeleting(review)} />)}</AnimatePresence>
        </motion.section>
      ) : <EmptyReviews filtered={reviews.length > 0} onReset={() => { setSearch(''); setRating('all'); }} />}

      <AnimatePresence>{editing && <EditReviewModal review={editing} onClose={() => setEditing(null)} onSave={saveReview} />}</AnimatePresence>
      <AnimatePresence>{deleting && <DeleteModal review={deleting} onClose={() => setDeleting(null)} onConfirm={confirmDelete} />}</AnimatePresence>
    </div>
  );
}

function CustomerReviewCard({ review, index, onEdit, onDelete }) {
  const food = review.foods?.[0];
  const chefs = chefList(review);
  return (
    <motion.article layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ delay: index * 0.04 }} whileHover={{ y: -4 }} className="flex flex-col overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-lg shadow-black/5">
      <div className="flex gap-4 border-b border-[var(--border)] p-5">
        {food?.image ? <img src={food.image} alt={food.name || 'Reviewed food'} className="h-16 w-16 shrink-0 rounded-2xl object-cover" /> : <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><MessageSquareText className="h-6 w-6" /></span>}
        <div className="min-w-0 flex-1"><h2 className="truncate text-lg font-semibold text-[var(--text-primary)]">{food?.name || 'HomeBite meal'}</h2><p className="mt-1 flex items-center gap-1.5 truncate text-xs text-[var(--text-muted)]"><ChefHat className="h-3.5 w-3.5" />{chefs.map((chef) => chef?.name).filter(Boolean).join(', ') || 'HomeBite Chef'}</p><p className="mt-2 text-xs text-[var(--text-muted)]">{formatDate(review.date)}</p></div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex" aria-label={`${review.rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((value) => <Star key={value} className={`h-5 w-5 ${value <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-[var(--text-muted)]'}`} />)}</div>
        <p className="mt-4 flex-1 text-sm leading-7 text-[var(--text-secondary)]">{review.comment}</p>
        <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
          <button type="button" onClick={onEdit} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3.5 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:text-[var(--accent)]"><Pencil className="h-3.5 w-3.5" /> Edit Review</button>
          <button type="button" onClick={onDelete} className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 px-3.5 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
          {food?.foodId && <Link to={`/foods/${documentId(food.foodId)}`} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3.5 py-2 text-xs font-semibold text-[var(--accent)]"><ExternalLink className="h-3.5 w-3.5" /> View Food</Link>}
        </div>
      </div>
    </motion.article>
  );
}

function EditReviewModal({ review, onClose, onSave }) {
  const [rating, setRating] = useState(Number(review.rating));
  const [comment, setComment] = useState(review.comment || '');
  const [saving, setSaving] = useState(false);
  const valid = rating >= 1 && comment.trim().length >= 10;
  async function submit(event) { event.preventDefault(); if (!valid || saving) return; setSaving(true); try { await onSave({ rating, comment: comment.trim() }); } catch (error) { toast.error(error.response?.data?.message || 'Unable to update this review.'); setSaving(false); } }
  return <ModalShell title="Edit Review" onClose={onClose}><form onSubmit={submit} className="space-y-5"><div><p className="text-sm font-semibold text-[var(--text-secondary)]">Rating</p><div className="mt-3 flex gap-2" role="radiogroup" aria-label="Review rating">{[1, 2, 3, 4, 5].map((value) => <motion.button type="button" role="radio" aria-checked={rating === value} aria-label={`${value} stars`} key={value} whileTap={{ scale: 0.9 }} onClick={() => setRating(value)}><Star className={`h-8 w-8 ${value <= rating ? 'fill-amber-400 text-amber-400' : 'text-[var(--text-muted)]'}`} /></motion.button>)}</div></div><label className="block text-sm font-semibold text-[var(--text-secondary)]">Comment<textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={5} maxLength={1000} className="mt-2 w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" /></label><div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text-secondary)]">Cancel</button><button type="submit" disabled={!valid || saving} className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-45">{saving ? 'Saving...' : 'Save Changes'}</button></div></form></ModalShell>;
}

function DeleteModal({ review, onClose, onConfirm }) {
  const [busy, setBusy] = useState(false);
  return <ModalShell title="Delete Review" onClose={onClose}><p className="text-sm leading-7 text-[var(--text-secondary)]">Delete your review for <strong className="text-[var(--text-primary)]">{review.foods?.[0]?.name || 'this meal'}</strong>? This action cannot be undone.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text-secondary)]">Cancel</button><button type="button" disabled={busy} onClick={async () => { setBusy(true); await onConfirm(); setBusy(false); }} className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Deleting...' : 'Delete Review'}</button></div></ModalShell>;
}

function ModalShell({ title, onClose, children }) {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="review-modal-title" onMouseDown={onClose}><motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }} onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-2xl sm:p-7"><div className="mb-6 flex items-center justify-between"><h2 id="review-modal-title" className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2><button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)]"><X className="h-4 w-4" /></button></div>{children}</motion.div></motion.div>;
}

function ReviewsSkeleton() { return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading your reviews">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-80 animate-pulse rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)]"><div className="h-24 border-b border-[var(--border)] bg-[var(--bg-muted)]" /></div>)}</div>; }
function EmptyReviews({ filtered, onReset }) { return <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[440px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--bg-surface)] px-6 text-center"><span className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-amber-500/10 text-amber-500"><Star className="h-9 w-9" /></span><h2 className="mt-6 text-2xl font-semibold text-[var(--text-primary)]">{filtered ? 'No matching reviews' : 'No reviews written yet'}</h2><p className="mt-3 max-w-md text-sm leading-7 text-[var(--text-secondary)]">{filtered ? 'Try changing your search or rating filter.' : 'After a delivered order, you can share your experience from the order details page.'}</p>{filtered && <button type="button" onClick={onReset} className="mt-6 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)]">Clear filters</button>}</motion.section>; }
