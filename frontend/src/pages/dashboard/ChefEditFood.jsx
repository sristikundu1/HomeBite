import { motion } from 'framer-motion';
import { ChefHat, ImagePlus, Loader2, Save, Sparkles, UtensilsCrossed } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { getFood, updateFood } from '../../services/foodsApi';
import { CATEGORY_NAMES } from '../../data/categoryCatalog';

const categories = CATEGORY_NAMES;
const spiceLevels = ['Mild', 'Medium', 'Hot', 'Extra Hot'];
const inputClass = 'mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]';

function commaSeparatedList(value) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function Field({ label, name, error, required = true, children }) {
  return (
    <label className="block text-sm font-semibold text-[var(--text-secondary)]" htmlFor={name}>
      {label}{required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
      {children}
      {error && <span id={`${name}-error`} role="alert" className="mt-2 block text-xs font-medium text-red-500">{error.message}</span>}
    </label>
  );
}

function NumberField({ label, name, suffix, register, error, min, step = '1', required = true }) {
  return (
    <Field label={label} name={name} error={error} required={required}>
      <div className="relative">
        <input id={name} type="number" min={min} step={step} placeholder="0" aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} className={`${inputClass} pr-16`} {...register(name, { required: required ? `${label} is required.` : false, min: { value: min, message: `${label} must be at least ${min}.` } })} />
        <span className="pointer-events-none absolute bottom-3.5 right-4 text-xs font-semibold text-[var(--text-muted)]">{suffix}</span>
      </div>
    </Field>
  );
}

export default function ChefEditFood() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [imageFailed, setImageFailed] = useState(false);
  const [originalFood, setOriginalFood] = useState(null);
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm();
  const imageUrl = watch('foodImage');

  useEffect(() => {
    let active = true;
    async function loadFood() {
      try {
        const response = await getFood(id);
        const food = response.data.data;
        if (!active) return;
        setOriginalFood(food);
        reset({
          foodImage: food.thumbnail || '', foodName: food.title || '', shortDescription: food.shortDescription || '',
          description: food.description || '', category: food.category || '', cuisine: food.cuisine || '',
          ingredients: (food.ingredients || []).join(', '), preparationTime: food.preparationTime ?? '',
          servingSize: food.servingSize ?? '', calories: food.calories ?? '', spiceLevel: food.spiceLevel || '',
          price: food.price ?? '', discountPrice: food.discountPrice ?? '', availableQuantity: food.availableQuantity ?? '',
          tags: (food.tags || []).join(', ')
        });
      } catch (error) {
        if (active) setLoadError(error.response?.data?.message || 'Failed to load this food.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadFood();
    return () => { active = false; };
  }, [id, reset]);

  async function onSubmit(values) {
    const payload = {
      chefId: originalFood.chefId?.$oid || originalFood.chefId,
      chefName: originalFood.chefName,
      chefEmail: originalFood.chefEmail,
      chefPhoto: originalFood.chefPhoto || '',
      title: values.foodName.trim(),
      slug: originalFood.slug,
      shortDescription: values.shortDescription.trim(),
      description: values.description.trim(),
      category: values.category,
      cuisine: values.cuisine.trim(),
      ingredients: commaSeparatedList(values.ingredients),
      price: Number(values.price),
      discountPrice: values.discountPrice === '' ? null : Number(values.discountPrice),
      thumbnail: values.foodImage.trim(),
      gallery: originalFood.gallery || [],
      preparationTime: Number(values.preparationTime),
      servingSize: Number(values.servingSize),
      calories: Number(values.calories),
      spiceLevel: values.spiceLevel.toLowerCase(),
      tags: commaSeparatedList(values.tags),
      availableQuantity: Number(values.availableQuantity)
    };

    try {
      await updateFood(id, payload);
      toast.success('Food updated successfully.');
      navigate('/dashboard/chef/manage-foods', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.errors?.[0] || error.response?.data?.message || 'Failed to update food.');
    }
  }

  if (loading) return <EditFoodSkeleton />;
  if (loadError || !originalFood) return <div className="mx-auto max-w-2xl rounded-3xl border border-red-500/20 bg-red-500/5 p-10 text-center"><h1 className="text-xl font-semibold text-[var(--text-primary)]">Food unavailable</h1><p className="mt-3 text-sm text-[var(--text-secondary)]">{loadError}</p><button type="button" onClick={() => navigate('/dashboard/chef/manage-foods')} className="mt-6 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white">Back to Manage Foods</button></div>;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <DashboardHeader title="Edit Food" description="Refine your listing while keeping your menu details accurate and inviting." />
      <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)]">
        <div className="border-b border-[var(--border)] bg-gradient-to-r from-orange-500/10 via-rose-500/5 to-transparent px-6 py-6 sm:px-8"><div className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/20"><ChefHat className="h-6 w-6" /></span><div><h2 className="text-xl font-semibold text-[var(--text-primary)]">Food details</h2><p className="mt-1 text-sm text-[var(--text-secondary)]">Update the fields below and save your changes.</p></div></div></div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-8 p-5 sm:p-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-8">
            <section aria-labelledby="edit-basic-heading" className="space-y-5">
              <div className="flex items-center gap-3"><UtensilsCrossed className="h-5 w-5 text-[var(--accent)]" /><h3 id="edit-basic-heading" className="text-lg font-semibold text-[var(--text-primary)]">Basic details</h3></div>
              <Field label="Food Image URL" name="foodImage" error={errors.foodImage}><input id="foodImage" type="url" aria-invalid={Boolean(errors.foodImage)} aria-describedby={errors.foodImage ? 'foodImage-error' : undefined} className={inputClass} {...register('foodImage', { required: 'Food image URL is required.', pattern: { value: /^https?:\/\/.+/i, message: 'Enter a valid HTTP or HTTPS image URL.' }, onChange: () => setImageFailed(false) })} /></Field>
              <div className="grid gap-5 md:grid-cols-2"><Field label="Food Name" name="foodName" error={errors.foodName}><input id="foodName" className={inputClass} aria-invalid={Boolean(errors.foodName)} {...register('foodName', { required: 'Food name is required.', minLength: { value: 3, message: 'Use at least 3 characters.' } })} /></Field><Field label="Cuisine" name="cuisine" error={errors.cuisine}><input id="cuisine" className={inputClass} aria-invalid={Boolean(errors.cuisine)} {...register('cuisine', { required: 'Cuisine is required.' })} /></Field></div>
              <Field label="Short Description" name="shortDescription" error={errors.shortDescription}><input id="shortDescription" maxLength={160} className={inputClass} aria-invalid={Boolean(errors.shortDescription)} {...register('shortDescription', { required: 'Short description is required.', maxLength: { value: 160, message: 'Keep the summary within 160 characters.' } })} /></Field>
              <Field label="Description" name="description" error={errors.description}><textarea id="description" rows={5} className={`${inputClass} resize-y`} aria-invalid={Boolean(errors.description)} {...register('description', { required: 'Description is required.', minLength: { value: 20, message: 'Use at least 20 characters.' } })} /></Field>
              <div className="grid gap-5 md:grid-cols-2"><Field label="Category" name="category" error={errors.category}><select id="category" className={inputClass} {...register('category', { required: 'Category is required.' })}><option value="">Select a category</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field><Field label="Spice Level" name="spiceLevel" error={errors.spiceLevel}><select id="spiceLevel" className={inputClass} {...register('spiceLevel', { required: 'Spice level is required.' })}><option value="">Select a spice level</option>{spiceLevels.map((item) => <option key={item} value={item.toLowerCase()}>{item}</option>)}</select></Field></div>
            </section>
            <section aria-labelledby="edit-recipe-heading" className="space-y-5 border-t border-[var(--border)] pt-8">
              <div className="flex items-center gap-3"><Sparkles className="h-5 w-5 text-[var(--accent)]" /><h3 id="edit-recipe-heading" className="text-lg font-semibold text-[var(--text-primary)]">Recipe and nutrition</h3></div>
              <Field label="Ingredients" name="ingredients" error={errors.ingredients}><textarea id="ingredients" rows={3} className={`${inputClass} resize-y`} {...register('ingredients', { required: 'At least one ingredient is required.', validate: (value) => commaSeparatedList(value).length > 0 || 'At least one ingredient is required.' })} /><span className="mt-2 block text-xs font-normal text-[var(--text-muted)]">Separate ingredients with commas.</span></Field>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><NumberField label="Preparation Time" name="preparationTime" suffix="min" register={register} error={errors.preparationTime} min={1} /><NumberField label="Serving Size" name="servingSize" suffix="people" register={register} error={errors.servingSize} min={1} /><NumberField label="Calories" name="calories" suffix="kcal" register={register} error={errors.calories} min={0} /><NumberField label="Available Quantity" name="availableQuantity" suffix="items" register={register} error={errors.availableQuantity} min={0} /></div>
              <div className="grid gap-5 md:grid-cols-2"><NumberField label="Price" name="price" suffix="BDT" register={register} error={errors.price} min={0} step="0.01" /><NumberField label="Discount Price" name="discountPrice" suffix="BDT" register={register} error={errors.discountPrice} min={0} step="0.01" required={false} /></div>
              <Field label="Tags" name="tags" error={errors.tags}><input id="tags" className={inputClass} {...register('tags', { required: 'At least one tag is required.', validate: (value) => commaSeparatedList(value).length > 0 || 'At least one tag is required.' })} /><span className="mt-2 block text-xs font-normal text-[var(--text-muted)]">Separate tags with commas.</span></Field>
            </section>
            <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-6 sm:flex-row sm:justify-end"><button type="button" onClick={() => navigate('/dashboard/chef/manage-foods')} disabled={isSubmitting} className="rounded-full border border-[var(--border)] px-6 py-3.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] disabled:opacity-50">Cancel</button><motion.button whileHover={!isSubmitting ? { y: -2 } : {}} type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{isSubmitting ? 'Saving changes...' : 'Save changes'}</motion.button></div>
          </div>
          <aside className="xl:sticky xl:top-28 xl:self-start" aria-label="Food image preview"><div className="overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-page)] p-4"><div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--bg-muted)]">{imageUrl && !imageFailed ? <motion.img key={imageUrl} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={imageUrl} onError={() => setImageFailed(true)} alt="Food preview" className="h-full w-full object-cover" /> : <div className="flex h-full flex-col items-center justify-center px-6 text-center"><ImagePlus className="h-8 w-8 text-[var(--accent)]" /><p className="mt-4 text-sm font-semibold text-[var(--text-primary)]">Image preview unavailable</p></div>}</div><div className="px-1 pb-1 pt-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Live preview</p><p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{watch('foodName') || 'Your food name'}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-secondary)]">{watch('shortDescription') || 'Your description appears here.'}</p></div></div></aside>
        </form>
      </motion.div>
    </div>
  );
}

function EditFoodSkeleton() {
  return <div className="mx-auto max-w-7xl space-y-8" role="status" aria-label="Loading food"><div className="h-24 animate-pulse rounded-3xl bg-[var(--bg-muted)]" /><div className="grid gap-6 rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-8 lg:grid-cols-2">{Array.from({ length: 10 }, (_, index) => <div key={index} className="h-16 animate-pulse rounded-2xl bg-[var(--bg-muted)]" />)}</div></div>;
}
