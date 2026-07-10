import { AnimatePresence, motion } from 'framer-motion';
import {
  Archive,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  ImageOff,
  Loader2,
  Pencil,
  Search,
  Trash2,
  UtensilsCrossed,
  X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { useAuth } from '../../providers/AuthProvider';
import { deleteFood, getChefFoods, toggleFoodArchive, toggleFoodAvailability } from '../../services/foodsApi';

const PAGE_SIZE = 6;

function foodId(food) {
  return food?._id?.$oid || food?._id;
}

function formatPrice(value) {
  return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 2 }).format(value || 0);
}

function formatDate(value) {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-BD', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

function StatusBadge({ status }) {
  const styles = {
    active: 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20',
    archived: 'bg-amber-500/10 text-amber-500 ring-amber-500/20',
    deleted: 'bg-red-500/10 text-red-500 ring-red-500/20'
  };

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${styles[status] || styles.archived}`}>{status}</span>;
}

function FoodImage({ food, className }) {
  const [failed, setFailed] = useState(false);

  if (!food.thumbnail || failed) {
    return (
      <div className={`flex items-center justify-center bg-[var(--bg-muted)] text-[var(--text-muted)] ${className}`}>
        <ImageOff className="h-5 w-5" aria-hidden="true" />
      </div>
    );
  }

  return <img src={food.thumbnail} alt={`${food.title} thumbnail`} onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}

export default function ChefManageFoods() {
  const { user, dbUser } = useAuth();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFood, setSelectedFood] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const email = dbUser?.email || user?.email;

  useEffect(() => {
    let active = true;

    async function loadFoods() {
      if (!email) {
        setLoading(false);
        return;
      }

      try {
        const response = await getChefFoods(email);
        if (active) setFoods(response.data.data || []);
      } catch (error) {
        if (active) toast.error(error.response?.data?.message || 'Failed to load your foods.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadFoods();
    return () => { active = false; };
  }, [email]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const filteredFoods = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return foods.filter((food) => {
      if (food.status === 'deleted') return false;
      const matchesStatus = statusFilter === 'all' || food.status === statusFilter;
      const matchesSearch = !query || [food.title, food.category, food.cuisine].filter(Boolean).some((value) => value.toLowerCase().includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [foods, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredFoods.length / PAGE_SIZE));
  const visibleFoods = filteredFoods.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  function replaceFood(updatedFood) {
    setFoods((current) => current.map((food) => (foodId(food) === foodId(updatedFood) ? updatedFood : food)));
    setSelectedFood((current) => (current && foodId(current) === foodId(updatedFood) ? updatedFood : current));
  }

  async function runAction(type, food) {
    const id = foodId(food);
    if (!id || pendingAction) return;
    setPendingAction(`${type}:${id}`);

    try {
      if (type === 'availability') {
        const optimisticFood = { ...food, isAvailable: !food.isAvailable };
        replaceFood(optimisticFood);

        try {
          const response = await toggleFoodAvailability(id);
          replaceFood(response.data.data);
          toast.success(`Food marked ${response.data.data.isAvailable ? 'available' : 'unavailable'}.`);
        } catch (error) {
          replaceFood(food);
          throw error;
        }
      } else if (type === 'archive') {
        const optimisticFood = { ...food, status: 'archived', updatedAt: new Date().toISOString() };
        replaceFood(optimisticFood);

        try {
          const response = await toggleFoodArchive(id);
          replaceFood(response.data.data);
          toast.success('Food archived successfully.');
        } catch (error) {
          replaceFood(food);
          throw error;
        }
      } else if (type === 'delete') {
        setFoods((current) => current.filter((item) => foodId(item) !== id));
        setSelectedFood((current) => (current && foodId(current) === id ? null : current));

        try {
          await deleteFood(id);
          toast.success('Food deleted successfully.');
        } catch (error) {
          setFoods((current) => [food, ...current].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
          throw error;
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${type} food.`);
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-8">
      <DashboardHeader title="Manage Foods" description="Review your listings, control availability, and keep your menu current." />

      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)]">
        <div className="flex flex-col gap-4 border-b border-[var(--border)] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden="true" />
            <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search by title, category, or cuisine..." aria-label="Search foods" className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] py-3.5 pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]" />
          </div>

          <label className="flex items-center gap-3 text-sm font-semibold text-[var(--text-secondary)]">
            Status
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="min-w-36 rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]">
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>

        {loading ? <LoadingState /> : visibleFoods.length ? (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1180px] text-left">
                <thead className="border-b border-[var(--border)] bg-[var(--bg-muted)] text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  <tr>{['Image', 'Title', 'Category', 'Price', 'Quantity', 'Availability', 'Status', 'Created Date', 'Actions'].map((heading) => <th key={heading} className="px-5 py-4 font-semibold">{heading}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <AnimatePresence initial={false}>
                    {visibleFoods.map((food) => (
                      <motion.tr key={foodId(food)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="transition hover:bg-[var(--bg-muted)]">
                        <td className="px-5 py-4"><FoodImage food={food} className="h-14 w-16 rounded-xl" /></td>
                        <td className="max-w-56 px-5 py-4"><p className="truncate font-semibold text-[var(--text-primary)]">{food.title}</p><p className="mt-1 truncate text-xs text-[var(--text-muted)]">{food.cuisine}</p></td>
                        <td className="px-5 py-4 text-sm text-[var(--text-secondary)]">{food.category}</td>
                        <td className="px-5 py-4"><Price food={food} /></td>
                        <td className="px-5 py-4 text-sm font-semibold text-[var(--text-primary)]">{food.availableQuantity}</td>
                        <td className="px-5 py-4"><AvailabilitySwitch food={food} pendingAction={pendingAction} onToggle={runAction} /></td>
                        <td className="px-5 py-4"><StatusBadge status={food.status} /></td>
                        <td className="px-5 py-4 text-sm text-[var(--text-secondary)]">{formatDate(food.createdAt)}</td>
                        <td className="px-5 py-4"><Actions food={food} pendingAction={pendingAction} onView={setSelectedFood} onArchive={setArchiveTarget} onDelete={setDeleteTarget} onAction={runAction} /></td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:hidden">
              {visibleFoods.map((food) => <FoodCard key={foodId(food)} food={food} pendingAction={pendingAction} onView={setSelectedFood} onArchive={setArchiveTarget} onDelete={setDeleteTarget} onAction={runAction} />)}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} count={filteredFoods.length} visibleCount={visibleFoods.length} onChange={setCurrentPage} />
          </>
        ) : <EmptyState hasFilters={Boolean(searchTerm || statusFilter !== 'all')} />}
      </motion.section>

      <AnimatePresence>{selectedFood && <FoodModal food={selectedFood} onClose={() => setSelectedFood(null)} />}</AnimatePresence>
      <AnimatePresence>
        {archiveTarget && (
          <ArchiveConfirmation
            food={archiveTarget}
            loading={pendingAction === `archive:${foodId(archiveTarget)}`}
            onCancel={() => setArchiveTarget(null)}
            onConfirm={async () => {
              await runAction('archive', archiveTarget);
              setArchiveTarget(null);
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmation
            food={deleteTarget}
            loading={pendingAction === `delete:${foodId(deleteTarget)}`}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={async () => {
              await runAction('delete', deleteTarget);
              setDeleteTarget(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Price({ food }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[var(--text-primary)]">{formatPrice(food.discountPrice ?? food.price)}</p>
      {food.discountPrice !== null && food.discountPrice !== undefined && <p className="text-xs text-[var(--text-muted)] line-through">{formatPrice(food.price)}</p>}
    </div>
  );
}

function Availability({ food }) {
  return <span className={`inline-flex items-center gap-2 text-xs font-semibold ${food.isAvailable ? 'text-emerald-500' : 'text-red-500'}`}><span className={`h-2 w-2 rounded-full ${food.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} />{food.isAvailable ? 'Available' : 'Unavailable'}</span>;
}

function AvailabilitySwitch({ food, pendingAction, onToggle }) {
  const id = foodId(food);
  const updating = pendingAction === `availability:${id}`;
  const disabled = updating || food.status === 'deleted';

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={food.isAvailable}
        aria-label={`${food.isAvailable ? 'Mark' : 'Make'} ${food.title} ${food.isAvailable ? 'unavailable' : 'available'}`}
        onClick={() => onToggle('availability', food)}
        disabled={disabled}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] focus:ring-offset-2 focus:ring-offset-[var(--bg-surface)] disabled:cursor-not-allowed disabled:opacity-45 ${
          food.isAvailable
            ? 'border-emerald-500/40 bg-emerald-500 shadow-[0_8px_24px_rgba(16,185,129,0.22)]'
            : 'border-[var(--border)] bg-[var(--bg-muted)]'
        }`}
      >
        <motion.span
          animate={{ x: food.isAvailable ? 22 : 3 }}
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md"
        >
          {updating && <Loader2 className="h-3 w-3 animate-spin text-slate-500" aria-hidden="true" />}
        </motion.span>
      </button>
      <span className={`text-xs font-semibold ${food.isAvailable ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`} aria-live="polite">
        {food.isAvailable ? 'Available' : 'Unavailable'}
      </span>
    </div>
  );
}

function Actions({ food, pendingAction, onView, onArchive, onDelete, onAction }) {
  const id = foodId(food);
  const busy = pendingAction?.endsWith(`:${id}`);
  const deleted = food.status === 'deleted';
  const buttons = [
    { label: 'View', icon: Eye, action: () => onView(food) },
    { label: 'Archive', icon: Archive, action: () => onArchive(food), disabled: food.status !== 'active' },
    { label: 'Delete', icon: Trash2, action: () => onDelete(food), disabled: deleted, danger: true }
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Link to={`/dashboard/chef/edit-food/${id}`} title="Edit" aria-label={`Edit ${food.title}`} className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] transition hover:bg-[var(--bg-page)] hover:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] ${busy ? 'pointer-events-none opacity-35' : ''}`}>
        <Pencil className="h-4 w-4" />
      </Link>
      {buttons.map(({ label, icon: Icon, action, disabled, danger }) => (
        <button key={label} type="button" onClick={action} disabled={busy || disabled} title={label} aria-label={`${label} ${food.title}`} className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-35 ${danger ? 'text-red-500 hover:bg-red-500/10' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-page)] hover:text-[var(--accent)]'}`}>
          {busy && label !== 'View' && label !== 'Edit' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
        </button>
      ))}
    </div>
  );
}

function FoodCard({ food, pendingAction, onView, onArchive, onDelete, onAction }) {
  return (
    <motion.article layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-page)]">
      <FoodImage food={food} className="aspect-[16/9] w-full" />
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate font-semibold text-[var(--text-primary)]">{food.title}</h3><p className="mt-1 text-xs text-[var(--text-muted)]">{food.category} · {food.cuisine}</p></div><StatusBadge status={food.status} /></div>
        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-[var(--bg-muted)] p-4 text-sm"><div><p className="text-xs text-[var(--text-muted)]">Price</p><Price food={food} /></div><div><p className="text-xs text-[var(--text-muted)]">Quantity</p><p className="font-semibold text-[var(--text-primary)]">{food.availableQuantity}</p></div><div className="col-span-2"><p className="mb-2 text-xs text-[var(--text-muted)]">Availability</p><AvailabilitySwitch food={food} pendingAction={pendingAction} onToggle={onAction} /></div><div><p className="text-xs text-[var(--text-muted)]">Created</p><p className="font-medium text-[var(--text-primary)]">{formatDate(food.createdAt)}</p></div></div>
        <Actions food={food} pendingAction={pendingAction} onView={onView} onArchive={onArchive} onDelete={onDelete} onAction={onAction} />
      </div>
    </motion.article>
  );
}

function Pagination({ currentPage, totalPages, count, visibleCount, onChange }) {
  const first = count ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const last = count ? first + visibleCount - 1 : 0;
  return <div className="flex flex-col gap-4 border-t border-[var(--border)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-[var(--text-secondary)]">Showing {first}–{last} of {count}</p><div className="flex items-center gap-2"><button type="button" onClick={() => onChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} aria-label="Previous page" className="rounded-full border border-[var(--border)] p-2.5 text-[var(--text-secondary)] disabled:opacity-35"><ChevronLeft className="h-4 w-4" /></button><span className="px-3 text-sm font-semibold text-[var(--text-primary)]">{currentPage} / {totalPages}</span><button type="button" onClick={() => onChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} aria-label="Next page" className="rounded-full border border-[var(--border)] p-2.5 text-[var(--text-secondary)] disabled:opacity-35"><ChevronRight className="h-4 w-4" /></button></div></div>;
}

function LoadingState() {
  return <div className="space-y-3 p-5 sm:p-6" aria-label="Loading foods" role="status">{Array.from({ length: 6 }, (_, index) => <div key={index} className="grid animate-pulse grid-cols-[64px_1fr_100px] items-center gap-4 rounded-2xl border border-[var(--border)] p-4 sm:grid-cols-[64px_1fr_120px_120px]"><div className="h-14 rounded-xl bg-[var(--bg-muted)]" /><div className="space-y-2"><div className="h-4 w-2/3 rounded bg-[var(--bg-muted)]" /><div className="h-3 w-1/3 rounded bg-[var(--bg-muted)]" /></div><div className="h-7 rounded-full bg-[var(--bg-muted)]" /><div className="hidden h-7 rounded-full bg-[var(--bg-muted)] sm:block" /></div>)}</div>;
}

function EmptyState({ hasFilters }) {
  return <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center"><span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--accent-soft)] text-[var(--accent)]"><UtensilsCrossed className="h-8 w-8" /></span><h2 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">{hasFilters ? 'No matching foods' : 'No foods yet'}</h2><p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">{hasFilters ? 'Try changing your search or status filter.' : 'Your food listings will appear here after you add them.'}</p></div>;
}

function FoodModal({ food, onClose }) {
  useEffect(() => {
    function handleKey(event) { if (event.key === 'Escape') onClose(); }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="food-modal-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-2xl"><div className="relative"><FoodImage food={food} className="aspect-[16/7] w-full rounded-t-[2rem]" /><button type="button" onClick={onClose} aria-label="Close food details" className="absolute right-4 top-4 rounded-full bg-black/60 p-2.5 text-white backdrop-blur"><X className="h-5 w-5" /></button></div><div className="p-6 sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{food.category} · {food.cuisine}</p><h2 id="food-modal-title" className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">{food.title}</h2></div><StatusBadge status={food.status} /></div><p className="mt-5 leading-7 text-[var(--text-secondary)]">{food.description}</p><div className="mt-6 grid gap-3 sm:grid-cols-3"><Detail label="Price"><Price food={food} /></Detail><Detail label="Quantity" value={food.availableQuantity} /><Detail label="Availability"><Availability food={food} /></Detail><Detail label="Preparation" value={`${food.preparationTime} min`} /><Detail label="Serving" value={`${food.servingSize} people`} /><Detail label="Calories" value={`${food.calories} kcal`} /></div><div className="mt-6 flex items-center gap-2 text-sm text-[var(--text-muted)]"><CalendarDays className="h-4 w-4" />Created {formatDate(food.createdAt)}</div></div></motion.div></motion.div>;
}

function ArchiveConfirmation({ food, loading, onCancel, onConfirm }) {
  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape' && !loading) onCancel();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [loading, onCancel]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="archive-confirmation-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onCancel();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 18 }}
        className="w-full max-w-md rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-2xl sm:p-8"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
          <Archive className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 id="archive-confirmation-title" className="mt-5 text-2xl font-semibold text-[var(--text-primary)]">Archive this food?</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--text-primary)]">{food.title}</span> will be removed from public food listings. The document will remain safely stored.
        </p>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} disabled={loading} className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] disabled:cursor-not-allowed disabled:opacity-50">Cancel</button>
          <button type="button" onClick={onConfirm} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Archive className="h-4 w-4" aria-hidden="true" />}
            {loading ? 'Archiving...' : 'Archive food'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DeleteConfirmation({ food, loading, onCancel, onConfirm }) {
  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape' && !loading) onCancel();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [loading, onCancel]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirmation-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onCancel();
      }}
    >
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 18 }} className="w-full max-w-md rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-2xl sm:p-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500"><Trash2 className="h-7 w-7" aria-hidden="true" /></span>
        <h2 id="delete-confirmation-title" className="mt-5 text-2xl font-semibold text-[var(--text-primary)]">Delete this food?</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--text-primary)]">{food.title}</span> will disappear from listings and search results. Its database document will be retained as deleted.
        </p>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} disabled={loading} className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] disabled:cursor-not-allowed disabled:opacity-50">Cancel</button>
          <button type="button" onClick={onConfirm} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
            {loading ? 'Deleting...' : 'Delete food'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Detail({ label, value, children }) {
  return <div className="rounded-2xl bg-[var(--bg-muted)] p-4"><p className="text-xs text-[var(--text-muted)]">{label}</p>{children || <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{value}</p>}</div>;
}
