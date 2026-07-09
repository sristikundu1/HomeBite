import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import {
  BriefcaseBusiness,
  ChefHat,
  Image,
  Loader2,
  MapPin,
  Phone,
  Send,
  Sparkles,
  User,
  Utensils
} from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';
import { submitChefApplication } from '../services/chefApplicationsApi';

const chefApplicationSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  phone: z.string().min(6, 'Phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  experience: z.string().min(1, 'Years of experience is required'),
  specialties: z.string().min(2, 'Cuisine specialties are required'),
  bio: z.string().min(20, 'Bio must be at least 20 characters'),
  profileImage: z.string().url('Enter a valid image URL').optional().or(z.literal(''))
});

const fieldClass =
  'w-full rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] py-4 pl-12 pr-4 text-sm text-[var(--text-primary)] outline-none transition duration-300 placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:bg-[var(--bg-surface)] focus:ring-2 focus:ring-[var(--accent-soft)] focus:shadow-[0_0_0_4px_var(--accent-soft)]';

function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-[var(--accent)]">
      {message}
    </motion.p>
  );
}

export default function BecomeChef() {
  const { user, dbUser } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(chefApplicationSchema),
    defaultValues: {
      name: dbUser?.name || user?.displayName || '',
      phone: '',
      address: '',
      city: '',
      experience: '',
      specialties: '',
      bio: '',
      profileImage: dbUser?.photo || user?.photoURL || ''
    }
  });

  const onSubmit = async (data) => {
    if (!user?.email) {
      toast.error('Please login before applying to become a chef.');
      return;
    }

    try {
      await submitChefApplication({
        name: data.name,
        email: user.email,
        firebaseUid: user.uid,
        phone: data.phone,
        address: data.address,
        city: data.city,
        location: `${data.address}, ${data.city}`,
        experience: data.experience,
        specialties: data.specialties
          .split(',')
          .map((specialty) => specialty.trim())
          .filter(Boolean),
        bio: data.bio,
        documents: data.profileImage ? [data.profileImage] : []
      });

      toast.success('Chef application submitted successfully.');
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit chef application.');
    }
  };

  return (
    <main className="relative overflow-x-hidden bg-[var(--bg-page)] text-[var(--text-primary)]">
      <section className="relative overflow-hidden px-4 pb-20 pt-[120px] sm:px-6 lg:px-8 lg:pb-[120px] lg:pt-[150px]">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] shadow-lg shadow-black/5">
              <ChefHat size={15} />
              Become a Chef
            </span>
            <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-tight tracking-normal text-[var(--text-primary)] sm:text-6xl lg:text-[72px]">
              Share your kitchen with the HomeBite community.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
              Tell us about your cooking experience, specialties, and story. Our team will review your application before chef tools are enabled.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {['Local meals', 'Flexible hours', 'Chef tools'].map((item) => (
                <div key={item} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-lg shadow-black/5">
                  <Sparkles className="h-5 w-5 text-[var(--accent)]" />
                  <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: 'easeOut', delay: 0.08 }}
            className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)]/95 p-6 shadow-[var(--shadow-elevated)] backdrop-blur-xl sm:p-8 lg:p-10"
          >
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Application</span>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-4xl">
                Chef details
              </h2>
            </div>

            <div className="mt-8 grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-3">
                  <label htmlFor="chef-name" className="text-sm font-medium text-[var(--text-secondary)]">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon)]" />
                    <input id="chef-name" type="text" placeholder="Your full name" {...register('name')} className={fieldClass} />
                  </div>
                  <ErrorMessage message={errors.name?.message} />
                </div>

                <div className="space-y-3">
                  <label htmlFor="chef-phone" className="text-sm font-medium text-[var(--text-secondary)]">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon)]" />
                    <input id="chef-phone" type="tel" placeholder="Phone number" {...register('phone')} className={fieldClass} />
                  </div>
                  <ErrorMessage message={errors.phone?.message} />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-[1.4fr_0.6fr]">
                <div className="space-y-3">
                  <label htmlFor="chef-address" className="text-sm font-medium text-[var(--text-secondary)]">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon)]" />
                    <input id="chef-address" type="text" placeholder="Street address" {...register('address')} className={fieldClass} />
                  </div>
                  <ErrorMessage message={errors.address?.message} />
                </div>

                <div className="space-y-3">
                  <label htmlFor="chef-city" className="text-sm font-medium text-[var(--text-secondary)]">
                    City
                  </label>
                  <input
                    id="chef-city"
                    type="text"
                    placeholder="City"
                    {...register('city')}
                    className="w-full rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-4 text-sm text-[var(--text-primary)] outline-none transition duration-300 placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] focus:shadow-[0_0_0_4px_var(--accent-soft)]"
                  />
                  <ErrorMessage message={errors.city?.message} />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-3">
                  <label htmlFor="chef-experience" className="text-sm font-medium text-[var(--text-secondary)]">
                    Years of Experience
                  </label>
                  <div className="relative">
                    <BriefcaseBusiness className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon)]" />
                    <input id="chef-experience" type="number" min="0" placeholder="3" {...register('experience')} className={fieldClass} />
                  </div>
                  <ErrorMessage message={errors.experience?.message} />
                </div>

                <div className="space-y-3">
                  <label htmlFor="chef-specialties" className="text-sm font-medium text-[var(--text-secondary)]">
                    Cuisine Specialties
                  </label>
                  <div className="relative">
                    <Utensils className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon)]" />
                    <input id="chef-specialties" type="text" placeholder="Bangla, Italian, Desserts" {...register('specialties')} className={fieldClass} />
                  </div>
                  <ErrorMessage message={errors.specialties?.message} />
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="chef-profile-image" className="text-sm font-medium text-[var(--text-secondary)]">
                  Profile Image URL
                </label>
                <div className="relative">
                  <Image className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon)]" />
                  <input id="chef-profile-image" type="url" placeholder="https://example.com/profile.jpg" {...register('profileImage')} className={fieldClass} />
                </div>
                <ErrorMessage message={errors.profileImage?.message} />
              </div>

              <div className="space-y-3">
                <label htmlFor="chef-bio" className="text-sm font-medium text-[var(--text-secondary)]">
                  Bio
                </label>
                <textarea
                  id="chef-bio"
                  rows={6}
                  placeholder="Tell us about your cooking style, signature dishes, and kitchen story..."
                  {...register('bio')}
                  className="w-full resize-none rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-4 text-sm text-[var(--text-primary)] outline-none transition duration-300 placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] focus:shadow-[0_0_0_4px_var(--accent-soft)]"
                />
                <ErrorMessage message={errors.bio?.message} />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send size={18} />}
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </motion.button>
          </motion.form>
        </div>
      </section>
    </main>
  );
}
