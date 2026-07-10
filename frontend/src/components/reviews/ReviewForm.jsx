import { motion } from 'framer-motion';
import { Camera, ImagePlus, Loader2, RefreshCw, Star, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../providers/AuthProvider';
import { getOrderReview, submitReview } from '../../services/reviewsApi';
import { removeUploadedReviewPhotos, uploadReviewPhotos } from '../../services/reviewPhotoStorage';
import ReviewCard from './ReviewCard';

function documentId(value) {
  return value?.$oid || value || '';
}

export default function ReviewForm({ order }) {
  const { user, dbUser } = useAuth();
  const [existingReview, setExistingReview] = useState(null);
  const [checking, setChecking] = useState(true);
  const [checkError, setCheckError] = useState('');
  const [checkVersion, setCheckVersion] = useState(0);
  const [photos, setPhotos] = useState([]);
  const photosRef = useRef([]);
  const orderId = documentId(order._id);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { rating: 0, comment: '' }
  });
  const rating = Number(watch('rating'));

  useEffect(() => {
    let active = true;
    setChecking(true);
    setCheckError('');
    getOrderReview(orderId)
      .then((response) => {
        if (active) setExistingReview(response.data.data || null);
      })
      .catch((error) => {
        if (active) setCheckError(error.response?.data?.message || 'Unable to check your existing review.');
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => { active = false; };
  }, [checkVersion, orderId]);

  useEffect(() => { photosRef.current = photos; }, [photos]);
  useEffect(() => () => photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.preview)), []);

  function selectPhotos(event) {
    const selected = Array.from(event.target.files || []);
    event.target.value = '';
    const remaining = 3 - photos.length;
    if (!remaining) return toast.error('You can upload up to 3 photos.');
    const valid = [];
    for (const file of selected.slice(0, remaining)) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error(`${file.name} is not a supported image.`);
      } else if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} must be smaller than 5 MB.`);
      } else {
        valid.push({ file, preview: URL.createObjectURL(file) });
      }
    }
    if (selected.length > remaining) toast.error('Only the first available photos were added.');
    setPhotos((current) => [...current, ...valid]);
  }

  function removePhoto(index) {
    setPhotos((current) => {
      URL.revokeObjectURL(current[index].preview);
      return current.filter((_, photoIndex) => photoIndex !== index);
    });
  }

  async function onSubmit(values) {
    let uploadedPhotos = [];
    try {
      const existingResponse = await getOrderReview(orderId);
      if (existingResponse.data.data) {
        setExistingReview(existingResponse.data.data);
        toast.error('This order has already been reviewed.');
        return;
      }

      if (photos.length) {
        uploadedPhotos = await uploadReviewPhotos(photos.map((photo) => photo.file), user.uid, orderId);
      }
      const response = await submitReview({
        orderId,
        userEmail: dbUser?.email || user?.email,
        rating: Number(values.rating),
        comment: values.comment.trim(),
        photos: uploadedPhotos.map((photo) => photo.url)
      });
      setExistingReview(response.data.data);
      photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
      setPhotos([]);
      toast.success('Review submitted successfully.');
    } catch (error) {
      if (uploadedPhotos.length) await removeUploadedReviewPhotos(uploadedPhotos);
      if (error.response?.status === 409) {
        const existingResponse = await getOrderReview(orderId).catch(() => null);
        if (existingResponse?.data?.data) setExistingReview(existingResponse.data.data);
      }
      const storageMessage = error.code?.startsWith('storage/') ? 'Photo upload failed. Check the image and try again.' : null;
      toast.error(storageMessage || error.response?.data?.message || 'Failed to submit review.');
    }
  }

  if (checking) return <div className="h-64 animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" />;

  if (checkError) return <motion.section id="review" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="scroll-mt-28 rounded-[2rem] border border-red-500/20 bg-[var(--bg-surface)] p-6 text-center shadow-[var(--shadow-soft)] sm:p-8"><p className="text-sm font-semibold text-red-500">{checkError}</p><p className="mt-2 text-xs text-[var(--text-muted)]">We did not show a new review form because your existing review status could not be confirmed.</p><button type="button" onClick={() => setCheckVersion((current) => current + 1)} className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)]"><RefreshCw className="h-4 w-4" /> Try Again</button></motion.section>;

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

          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-muted)] p-5 text-center">
            <Camera className="mx-auto h-7 w-7 text-[var(--accent)]" />
            <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">Photos are optional</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Upload up to 3 JPG, PNG, or WebP images. Maximum 5 MB each.</p>
            {photos.length > 0 && <div className="mt-4 grid grid-cols-3 gap-3">{photos.map((photo, index) => <div key={photo.preview} className="group relative aspect-square overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-surface)]"><img src={photo.preview} alt={`Review upload preview ${index + 1}`} className="h-full w-full object-cover" /><button type="button" onClick={() => removePhoto(index)} className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-red-500" aria-label={`Remove photo ${index + 1}`}><X className="h-3.5 w-3.5" /></button></div>)}</div>}
            <label className={`mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] ${photos.length >= 3 ? 'pointer-events-none opacity-45' : ''}`}><ImagePlus className="h-4 w-4" />{photos.length ? 'Add More Photos' : 'Choose Photos'}<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={selectPhotos} disabled={photos.length >= 3 || isSubmitting} className="sr-only" /></label>
          </div>

          <motion.button type="submit" disabled={isSubmitting} whileHover={!isSubmitting ? { y: -2 } : {}} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}{isSubmitting ? 'Submitting...' : 'Submit Review'}</motion.button>
        </form>
      )}
    </motion.section>
  );
}
