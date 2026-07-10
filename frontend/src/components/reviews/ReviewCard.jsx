import { motion } from 'framer-motion';
import { Star, UserRound } from 'lucide-react';

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-BD', { dateStyle: 'medium' }).format(new Date(value));
}

export default function ReviewCard({ review, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-3xl border border-[var(--border)] bg-[var(--bg-muted)] p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {review.customer?.photo ? (
            <img src={review.customer.photo} alt={review.customer.name || 'Customer'} className="h-11 w-11 rounded-full object-cover" />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]"><UserRound className="h-5 w-5" /></span>
          )}
          <div><h3 className="text-sm font-semibold text-[var(--text-primary)]">{review.customer?.name || 'HomeBite Customer'}</h3><p className="mt-1 text-xs text-[var(--text-muted)]">{formatDate(review.date)}</p></div>
        </div>
        <div className="flex" aria-label={`${review.rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-4 w-4 ${index < review.rating ? 'fill-amber-400 text-amber-400' : 'text-[var(--text-muted)]'}`} aria-hidden="true" />)}
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{review.comment}</p>
      {!!review.photos?.length && <div className="mt-4 grid grid-cols-3 gap-2">{review.photos.map((photo) => <img key={photo} src={photo} alt="Customer review" className="aspect-square rounded-xl object-cover" />)}</div>}
    </motion.article>
  );
}

