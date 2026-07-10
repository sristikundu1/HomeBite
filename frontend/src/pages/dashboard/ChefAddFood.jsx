import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ChefHat, ImagePlus, Loader2, Sparkles, UtensilsCrossed } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { useAuth } from '../../providers/AuthProvider';
import { createFood } from '../../services/foodsApi';
import { CATEGORY_NAMES } from '../../data/categoryCatalog';

const categories = CATEGORY_NAMES;
const spiceLevels = ['None','Mild', 'Medium', 'Hot', 'Extra Hot'];

const inputClass =
  'mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]';

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function commaSeparatedList(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function Field({ label, name, error, required = true, children }) {
  const errorId = `${name}-error`;

  return (
    <label className="block text-sm font-semibold text-[var(--text-secondary)]" htmlFor={name}>
      {label}
      {required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
      {children}
      {error && (
        <span id={errorId} role="alert" className="mt-2 block text-xs font-medium text-red-500">
          {error.message}
        </span>
      )}
    </label>
  );
}

export default function ChefAddFood() {
  const { user, dbUser } = useAuth();
  const [imageFailed, setImageFailed] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      foodImage: '',
      foodName: '',
      shortDescription: '',
      description: '',
      category: '',
      cuisine: '',
      ingredients: '',
      preparationTime: '',
      servingSize: '',
      calories: '',
      spiceLevel: '',
      price: '',
      discountPrice: '',
      availableQuantity: '',
      tags: ''
    }
  });

  const imageUrl = watch('foodImage');

  async function onSubmit(values) {
    const chefId = dbUser?._id;
    const chefEmail = dbUser?.email || user?.email;

    if (!chefId || !chefEmail) {
      toast.error('Your chef profile is unavailable. Please refresh and try again.');
      return;
    }

    const payload = {
      chefId,
      chefName: dbUser?.name || user?.displayName || 'HomeBite Chef',
      chefEmail,
      chefPhoto: dbUser?.photo || user?.photoURL || '',
      title: values.foodName.trim(),
      slug: slugify(values.foodName),
      shortDescription: values.shortDescription.trim(),
      description: values.description.trim(),
      category: values.category,
      cuisine: values.cuisine.trim(),
      ingredients: commaSeparatedList(values.ingredients),
      price: Number(values.price),
      discountPrice: values.discountPrice === '' ? null : Number(values.discountPrice),
      thumbnail: values.foodImage.trim(),
      gallery: [],
      preparationTime: Number(values.preparationTime),
      servingSize: Number(values.servingSize),
      calories: Number(values.calories),
      spiceLevel: values.spiceLevel.toLowerCase(),
      tags: commaSeparatedList(values.tags),
      availableQuantity: Number(values.availableQuantity)
    };

    try {
      await createFood(payload);
      toast.success('Food added successfully.');
      reset();
      setImageFailed(false);
    } catch (error) {
      const apiErrors = error.response?.data?.errors;
      toast.error(apiErrors?.[0] || error.response?.data?.message || 'Failed to add food. Please try again.');
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <DashboardHeader title="Add Food" description="Create a polished listing for your next homemade favorite." />

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)]"
      >
        <div className="border-b border-[var(--border)] bg-gradient-to-r from-orange-500/10 via-rose-500/5 to-transparent px-6 py-6 sm:px-8">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/20">
              <ChefHat className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">Food details</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Fields marked with an asterisk are required.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-8 p-5 sm:p-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-8">
            <section aria-labelledby="basic-details-heading" className="space-y-5">
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
                <h3 id="basic-details-heading" className="text-lg font-semibold text-[var(--text-primary)]">Basic details</h3>
              </div>

              <Field label="Food Image URL" name="foodImage" error={errors.foodImage}>
                <input
                  id="foodImage"
                  type="url"
                  placeholder="https://example.com/food.jpg"
                  aria-invalid={Boolean(errors.foodImage)}
                  aria-describedby={errors.foodImage ? 'foodImage-error' : undefined}
                  className={inputClass}
                  {...register('foodImage', {
                    required: 'Food image URL is required.',
                    pattern: { value: /^https?:\/\/.+/i, message: 'Enter a valid HTTP or HTTPS image URL.' },
                    onChange: () => setImageFailed(false)
                  })}
                />
              </Field>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Food Name" name="foodName" error={errors.foodName}>
                  <input id="foodName" type="text" placeholder="Smoky chicken biryani" aria-invalid={Boolean(errors.foodName)} aria-describedby={errors.foodName ? 'foodName-error' : undefined} className={inputClass} {...register('foodName', { required: 'Food name is required.', minLength: { value: 3, message: 'Use at least 3 characters.' } })} />
                </Field>
                <Field label="Cuisine" name="cuisine" error={errors.cuisine}>
                  <input id="cuisine" type="text" placeholder="Bangladeshi" aria-invalid={Boolean(errors.cuisine)} aria-describedby={errors.cuisine ? 'cuisine-error' : undefined} className={inputClass} {...register('cuisine', { required: 'Cuisine is required.' })} />
                </Field>
              </div>

              <Field label="Short Description" name="shortDescription" error={errors.shortDescription}>
                <input id="shortDescription" type="text" maxLength={160} placeholder="A short, inviting summary for food cards" aria-invalid={Boolean(errors.shortDescription)} aria-describedby={errors.shortDescription ? 'shortDescription-error' : 'shortDescription-hint'} className={inputClass} {...register('shortDescription', { required: 'Short description is required.', maxLength: { value: 160, message: 'Keep the summary within 160 characters.' } })} />
                <span id="shortDescription-hint" className="mt-2 block text-xs font-normal text-[var(--text-muted)]">Maximum 160 characters.</span>
              </Field>

              <Field label="Description" name="description" error={errors.description}>
                <textarea id="description" rows={5} placeholder="Describe the flavor, texture, and what makes this dish special..." aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? 'description-error' : undefined} className={`${inputClass} resize-y`} {...register('description', { required: 'Description is required.', minLength: { value: 20, message: 'Use at least 20 characters.' } })} />
              </Field>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Category" name="category" error={errors.category}>
                  <select id="category" aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? 'category-error' : undefined} className={inputClass} {...register('category', { required: 'Category is required.' })}>
                    <option value="">Select a category</option>
                    {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </Field>
                <Field label="Spice Level" name="spiceLevel" error={errors.spiceLevel}>
                  <select id="spiceLevel" aria-invalid={Boolean(errors.spiceLevel)} aria-describedby={errors.spiceLevel ? 'spiceLevel-error' : undefined} className={inputClass} {...register('spiceLevel', { required: 'Spice level is required.' })}>
                    <option value="">Select a spice level</option>
                    {spiceLevels.map((level) => <option key={level} value={level}>{level}</option>)}
                  </select>
                </Field>
              </div>
            </section>

            <section aria-labelledby="recipe-details-heading" className="space-y-5 border-t border-[var(--border)] pt-8">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
                <h3 id="recipe-details-heading" className="text-lg font-semibold text-[var(--text-primary)]">Recipe and nutrition</h3>
              </div>

              <Field label="Ingredients" name="ingredients" error={errors.ingredients}>
                <textarea id="ingredients" rows={3} placeholder="Basmati rice, chicken, saffron, fried onion" aria-invalid={Boolean(errors.ingredients)} aria-describedby={errors.ingredients ? 'ingredients-error' : 'ingredients-hint'} className={`${inputClass} resize-y`} {...register('ingredients', { required: 'At least one ingredient is required.', validate: (value) => commaSeparatedList(value).length > 0 || 'At least one ingredient is required.' })} />
                <span id="ingredients-hint" className="mt-2 block text-xs font-normal text-[var(--text-muted)]">Separate ingredients with commas.</span>
              </Field>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <NumberField label="Preparation Time" name="preparationTime" suffix="min" register={register} error={errors.preparationTime} min={1} />
                <NumberField label="Serving Size" name="servingSize" suffix="people" register={register} error={errors.servingSize} min={1} />
                <NumberField label="Calories" name="calories" suffix="kcal" register={register} error={errors.calories} min={0} />
                <NumberField label="Available Quantity" name="availableQuantity" suffix="items" register={register} error={errors.availableQuantity} min={0} />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <NumberField label="Price" name="price" suffix="BDT" register={register} error={errors.price} min={0} step="0.01" />
                <NumberField label="Discount Price" name="discountPrice" suffix="BDT" register={register} error={errors.discountPrice} min={0} step="0.01" required={false} />
              </div>

              <Field label="Tags" name="tags" error={errors.tags}>
                <input id="tags" type="text" placeholder="halal, family meal, chef special" aria-invalid={Boolean(errors.tags)} aria-describedby={errors.tags ? 'tags-error' : 'tags-hint'} className={inputClass} {...register('tags', { required: 'At least one tag is required.', validate: (value) => commaSeparatedList(value).length > 0 || 'At least one tag is required.' })} />
                <span id="tags-hint" className="mt-2 block text-xs font-normal text-[var(--text-muted)]">Separate tags with commas.</span>
              </Field>
            </section>

            <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-6 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => { reset(); setImageFailed(false); }} disabled={isSubmitting} className="rounded-full border border-[var(--border)] px-6 py-3.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-50">
                Clear form
              </button>
              <motion.button whileHover={!isSubmitting ? { y: -2 } : {}} whileTap={!isSubmitting ? { scale: 0.98 } : {}} type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:ring-offset-2 focus:ring-offset-[var(--bg-surface)] disabled:cursor-not-allowed disabled:opacity-60">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ChefHat className="h-4 w-4" aria-hidden="true" />}
                {isSubmitting ? 'Adding food...' : 'Add food'}
              </motion.button>
            </div>
          </div>

          <aside className="xl:sticky xl:top-28 xl:self-start" aria-label="Food image preview">
            <div className="overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-page)] p-4">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--bg-muted)]">
                {imageUrl && !imageFailed ? (
                  <motion.img key={imageUrl} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={imageUrl} onError={() => setImageFailed(true)} alt="Food preview from the entered image URL" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                      <ImagePlus className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <p className="mt-4 text-sm font-semibold text-[var(--text-primary)]">{imageFailed ? 'Image could not be loaded' : 'Your preview appears here'}</p>
                    <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">Paste a public image URL to preview your listing.</p>
                  </div>
                )}
              </div>
              <div className="px-1 pb-1 pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Live preview</p>
                <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{watch('foodName') || 'Your food name'}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-secondary)]">{watch('shortDescription') || 'A delicious description will appear here.'}</p>
              </div>
            </div>
          </aside>
        </form>
      </motion.div>
    </div>
  );
}

function NumberField({ label, name, suffix, register, error, min, step = '1', required = true }) {
  return (
    <Field label={label} name={name} error={error} required={required}>
      <div className="relative">
        <input
          id={name}
          type="number"
          min={min}
          step={step}
          placeholder="0"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`${inputClass} pr-16`}
          {...register(name, {
            required: required ? `${label} is required.` : false,
            min: { value: min, message: `${label} must be at least ${min}.` }
          })}
        />
        <span className="pointer-events-none absolute bottom-3.5 right-4 text-xs font-semibold text-[var(--text-muted)]">{suffix}</span>
      </div>
    </Field>
  );
}
