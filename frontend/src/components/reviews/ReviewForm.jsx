import { motion } from 'framer-motion';
import { Camera, Loader2, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../providers/AuthProvider';
import { getOrderReview, submitReview } from '../../services/reviewsApi';
import ReviewCard from './ReviewCard';

function documentId(value) {
  return value?.$oid || value || '';
}

export default function ReviewForm({ order }) {
  const { user, dbUser } = useAuth();
  const [existingReview, setExistingReview] = useState(null);
  const [checking, setChecking] = useState(true);
  const orderId = documentId(order._id);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { rating: 0, comment: '' }
  });
  const rating = Number(watch('rating'));

  useEffect(() => {
    let active = true;
    getOrderReview(orderId)
      .then((response) => {
        if (active) setExistingReview(response.data.data || null);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => { active = false; };
  }, [orderId]);

  async function onSubmit(values) {
    try {
      const response = await submitReview({
        orderId,
        userEmail: dbUser?.email || user?.email,
        rating: Number(values.rating),
        comment: values.comment.trim(),
        photos: []
      });
      setExistingReview(response.data.data);
      toast.success('Review submitted successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review.');
    }
  }

  if (checking) return <div className="h-64 animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" />;

  return (
    <motion.section id="review" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="scroll-mt-28 rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Delivered order</p>
      <h2 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">{existingReview ? 'Your Review' : 'Rate Your Order'}</h2>

      {existingReview ? <div className="mt-6"><ReviewCard review={existingReview} /></div> : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6" noValidate>
          <div>
            <p className="text-sm font-semibold text-[var(--text-secondary)]">Rating <span className="text-red-500">*</span></p>
            <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Review rating">
              {Array.from({ length: 5 }, (_, index) => {
                const value = index + 1;
                return <motion.button key={value} type="button" role="radio" aria-checked={rating === value} aria-label={`${value} stars`} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }} onClick={() => setValue('rating', value, { shouldValidate: true })}><Star className={`h-8 w-8 transition ${value <= rating ? 'fill-amber-400 text-amber-400' : 'text-[var(--text-muted)]'}`} /></motion.button>;
              })}
            </div>
            <input type="hidden" {...register('rating', { validate: (value) => Number(value) >= 1 || 'Please select a rating.' })} />
            {errors.rating && <p className="mt-2 text-xs text-red-500">{errors.rating.message}</p>}
          </div>

          <label className="block text-sm font-semibold text-[var(--text-secondary)]">Comment <span className="text-red-500">*</span><textarea rows={5} placeholder="Tell us about your food and delivery experience..." className="mt-2 w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]" {...register('comment', { required: 'Comment is required.', minLength: { value: 10, message: 'Please write at least 10 characters.' } })} />{errors.comment && <span className="mt-2 block text-xs text-red-500">{errors.comment.message}</span>}</label>

          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-muted)] p-5 text-center"><Camera className="mx-auto h-7 w-7 text-[var(--accent)]" /><p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">Photos are optional</p><p className="mt-1 text-xs text-[var(--text-muted)]">Photo upload will be available in a future update.</p></div>

          <motion.button type="submit" disabled={isSubmitting} whileHover={!isSubmitting ? { y: -2 } : {}} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}{isSubmitting ? 'Submitting...' : 'Submit Review'}</motion.button>
        </form>
      )}
    </motion.section>
  );
}
