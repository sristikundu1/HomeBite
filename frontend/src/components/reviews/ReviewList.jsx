import { MessageSquareText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getFoodReviews } from '../../services/reviewsApi';
import ReviewCard from './ReviewCard';

export default function ReviewList({ foodId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getFoodReviews(foodId)
      .then((response) => {
        if (active) setReviews(response.data.data || []);
      })
      .catch(() => {
        if (active) setReviews([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [foodId]);

  if (loading) {
    return <div className="grid gap-4 sm:grid-cols-2" role="status" aria-label="Loading reviews">{Array.from({ length: 2 }, (_, index) => <div key={index} className="h-44 animate-pulse rounded-3xl bg-[var(--bg-muted)]" />)}</div>;
  }

  if (!reviews.length) {
    return <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--bg-muted)] px-6 py-10 text-center"><MessageSquareText className="mx-auto h-8 w-8 text-[var(--accent)]" /><p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">No reviews yet</p><p className="mt-1 text-xs text-[var(--text-muted)]">Be the first customer to review this food.</p></div>;
  }

  return <div className="grid gap-4 sm:grid-cols-2">{reviews.map((review, index) => <ReviewCard key={review._id?.$oid || review._id} review={review} index={index} />)}</div>;
}

