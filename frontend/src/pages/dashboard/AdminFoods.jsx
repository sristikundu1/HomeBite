import { AnimatePresence, motion } from 'framer-motion';
import { Archive, ChevronLeft, ChevronRight, Eye, ImageOff, Loader2, PackageOpen, RefreshCw, RotateCcw, Search, Star, Trash2, Utensils, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { getManagedFoods } from '../../services/adminApi';
import { deleteFood, toggleFoodArchive } from '../../services/foodsApi';

const PAGE_SIZE = 10;
const documentId = (value) => value?.$oid || value || '';
const normalize = (value) => String(value || '').trim().toLowerCase();
const money = (value) => new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(Number(value) || 0);
const date = (value) => value ? new Intl.DateTimeFormat('en-BD', { dateStyle: 'medium' }).format(new Date(value)) : 'Not available';

export default function AdminFoods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [mutatingId, setMutatingId] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getManagedFoods()
      .then((response) => { if (active) setFoods(response.data.data || []); })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || 'Unable to load foods.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reloadKey]);

  const categories = useMemo(() => [...new Set(foods.map((food) => food.category).filter(Boolean))].sort(), [foods]);
  const visibleFoods = useMemo(() => {
    const query = normalize(search);
    return foods.filter((food) => {
      const matchesCategory = category === 'all' || normalize(food.category) === normalize(category);
      const haystack = [food.title, food.chefName, food.chefEmail, food.category, food.cuisine, food.status].filter(Boolean).join(' ').toLowerCase();
      return matchesCategory && (!query || haystack.includes(query));
    });
  }, [category, foods, search]);
  const totalPages = Math.max(1, Math.ceil(visibleFoods.length / PAGE_SIZE));
  const paginatedFoods = visibleFoods.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [category, search]);
  useEffect(() => setPage((current) => Math.min(current, totalPages)), [totalPages]);

  async function confirmAction() {
    const food = confirmation?.food;
    const id = documentId(food?._id);
    if (!id || mutatingId) return;
    setMutatingId(id);
    try {
      if (confirmation.type === 'delete') {
        await deleteFood(id);
        setFoods((current) => current.filter((item) => documentId(item._id) !== id));
        toast.success('Food soft deleted successfully.');
      } else {
        const response = await toggleFoodArchive(id);
        const updated = response.data.data;
        setFoods((current) => current.map((item) => documentId(item._id) === id ? updated : item));
        toast.success(confirmation.type === 'restore' ? 'Food restored successfully.' : 'Food archived successfully.');
      }
      setConfirmation(null);
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'Unable to update this food.');
    } finally {
      setMutatingId('');
    }
  }

  return <div className="mx-auto max-w-[1600px] space-y-8">
    <DashboardHeader title="Manage Foods" description="Review every active and archived food listing across the platform." />

    <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-lg shadow-black/5">
      <div className="grid gap-4 md:grid-cols-[minmax(240px,1fr)_minmax(180px,260px)]">
        <label className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3">
          <Search className="h-4 w-4 text-[var(--text-muted)]"/><span className="sr-only">Search foods</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search food, chef, category, or cuisine" className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none"/>
        </label>
        <label className="rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3">
          <span className="sr-only">Filter by category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none">
            <option value="all">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4 border-t border-[var(--border)] pt-4">
        <p className="text-xs text-[var(--text-muted)]">Showing {paginatedFoods.length} of {visibleFoods.length} matching foods</p>
        {error && <button type="button" onClick={() => setReloadKey((value) => value + 1)} className="inline-flex items-center gap-2 text-xs font-semibold text-red-500"><RefreshCw className="h-3.5 w-3.5"/>Retry</button>}
      </div>
    </motion.section>

    {loading ? <FoodsSkeleton/> : error ? <ErrorState message={error} onRetry={() => setReloadKey((value) => value + 1)}/> : paginatedFoods.length ? <>
      <DesktopTable foods={paginatedFoods} onView={setViewing} onConfirm={setConfirmation} mutatingId={mutatingId}/>
      <MobileCards foods={paginatedFoods} onView={setViewing} onConfirm={setConfirmation} mutatingId={mutatingId}/>
    </> : <EmptyState filtered={foods.length > 0} onReset={() => { setSearch(''); setCategory('all'); }}/>} 

    {!loading && !error && visibleFoods.length > PAGE_SIZE && <Pagination page={page} totalPages={totalPages} onPage={setPage}/>} 
    <AnimatePresence>{viewing && <FoodDetailsModal food={viewing} onClose={() => setViewing(null)}/>}</AnimatePresence>
    <AnimatePresence>{confirmation && <ConfirmationModal confirmation={confirmation} busy={mutatingId === documentId(confirmation.food._id)} onClose={() => !mutatingId && setConfirmation(null)} onConfirm={confirmAction}/>}</AnimatePresence>
  </div>;
}

function DesktopTable({ foods, onView, onConfirm, mutatingId }) { return <div className="hidden overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-lg shadow-black/5 xl:block"><div className="overflow-x-auto"><table className="w-full min-w-[1420px] text-left"><thead className="border-b border-[var(--border)] bg-[var(--bg-muted)] text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]"><tr>{['Food','Chef','Category','Price','Availability','Orders','Rating','Status','Actions'].map((label) => <th key={label} className="px-5 py-4">{label}</th>)}</tr></thead><tbody>{foods.map((food, index) => <FoodRow key={documentId(food._id)} food={food} index={index} onView={onView} onConfirm={onConfirm} busy={mutatingId === documentId(food._id)}/>)}</tbody></table></div></div>; }
function FoodRow({ food, index, onView, onConfirm, busy }) { return <motion.tr initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.035 }} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-muted)]/60"><td className="px-5 py-4"><FoodIdentity food={food}/></td><td className="px-5 py-4"><ChefIdentity food={food}/></td><td className="px-5 py-4 text-xs capitalize text-[var(--text-secondary)]">{food.category || 'Uncategorized'}</td><td className="px-5 py-4 text-sm font-semibold text-[var(--text-primary)]">{money(food.discountPrice || food.price)}</td><td className="px-5 py-4"><AvailabilityBadge food={food}/></td><td className="px-5 py-4 text-sm text-[var(--text-secondary)]">{food.orderCount || 0}</td><td className="px-5 py-4"><Rating food={food}/></td><td className="px-5 py-4"><StatusBadge status={food.status}/></td><td className="px-5 py-4"><ActionButtons food={food} onView={onView} onConfirm={onConfirm} busy={busy}/></td></motion.tr>; }
function MobileCards({ foods, onView, onConfirm, mutatingId }) { return <div className="grid gap-4 sm:grid-cols-2 xl:hidden">{foods.map((food, index) => <motion.article key={documentId(food._id)} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-lg shadow-black/5"><FoodImage food={food} className="h-44 w-full"/><div className="p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="truncate font-semibold text-[var(--text-primary)]">{food.title || 'Untitled Food'}</h2><p className="mt-1 truncate text-xs text-[var(--text-muted)]">{food.chefName || food.chefEmail || 'Unknown chef'}</p></div><StatusBadge status={food.status}/></div><div className="mt-5 grid grid-cols-2 gap-3"><MobileField label="Category" value={food.category || 'Uncategorized'}/><MobileField label="Price" value={money(food.discountPrice || food.price)}/><MobileField label="Availability"><AvailabilityBadge food={food}/></MobileField><MobileField label="Orders" value={food.orderCount || 0}/><MobileField label="Rating"><Rating food={food}/></MobileField><MobileField label="Created" value={date(food.createdAt)}/></div><div className="mt-5 border-t border-[var(--border)] pt-4"><ActionButtons food={food} onView={onView} onConfirm={onConfirm} busy={mutatingId === documentId(food._id)}/></div></div></motion.article>)}</div>; }
function FoodImage({ food, className }) { const [failed, setFailed] = useState(false); return food.thumbnail && !failed ? <img src={food.thumbnail} alt={food.title || 'Food'} onError={() => setFailed(true)} className={`${className} object-cover`}/> : <span className={`${className} flex items-center justify-center bg-[var(--bg-muted)] text-[var(--text-muted)]`}><ImageOff className="h-6 w-6"/></span>; }
function FoodIdentity({ food }) { return <div className="flex min-w-0 items-center gap-3"><FoodImage food={food} className="h-12 w-12 shrink-0 rounded-2xl"/><div className="min-w-0"><p className="max-w-[180px] truncate text-sm font-semibold text-[var(--text-primary)]">{food.title || 'Untitled Food'}</p><p className="mt-1 text-[10px] text-[var(--text-muted)]">ID: {documentId(food._id).slice(-8).toUpperCase()}</p></div></div>; }
function ChefIdentity({ food }) { return <div className="max-w-[170px]"><p className="truncate text-xs font-semibold text-[var(--text-primary)]">{food.chefName || 'Unknown chef'}</p><p className="mt-1 truncate text-[10px] text-[var(--text-muted)]">{food.chefEmail || 'Email unavailable'}</p></div>; }
function AvailabilityBadge({ food }) { const available = Boolean(food.isAvailable) && Number(food.availableQuantity || 0) > 0; return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${available ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}><span className={`h-1.5 w-1.5 rounded-full ${available ? 'bg-emerald-500' : 'bg-slate-400'}`}/>{available ? 'Available' : 'Unavailable'}</span>; }
function StatusBadge({ status }) { const value = normalize(status) || 'active'; const tone = value === 'active' ? 'bg-emerald-500/10 text-emerald-500' : value === 'archived' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-500/10 text-slate-500'; return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${tone}`}>{value}</span>; }
function Rating({ food }) { return <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-secondary)]"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400"/>{Number(food.rating || 0).toFixed(1)} <span className="font-normal text-[var(--text-muted)]">({food.reviewCount || 0})</span></span>; }
function ActionButtons({ food, onView, onConfirm, busy }) { const archived = normalize(food.status) === 'archived'; return <div className="flex flex-wrap gap-2"><ActionButton label="View" icon={Eye} onClick={() => onView(food)} disabled={busy}/>{archived ? <ActionButton label="Restore" icon={RotateCcw} success onClick={() => onConfirm({ type: 'restore', food })} disabled={busy}/> : <ActionButton label="Archive" icon={Archive} onClick={() => onConfirm({ type: 'archive', food })} disabled={busy}/>}<ActionButton label="Soft Delete" icon={Trash2} danger onClick={() => onConfirm({ type: 'delete', food })} disabled={busy}/></div>; }
function ActionButton({ label, icon: Icon, onClick, disabled, danger, success }) { return <button type="button" onClick={onClick} disabled={disabled} className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[10px] font-semibold transition disabled:opacity-40 ${danger ? 'border-red-500/20 text-red-500 hover:bg-red-500/10' : success ? 'border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10' : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)]'}`}><Icon className="h-3.5 w-3.5"/>{label}</button>; }
function MobileField({ label, value, children }) { return <div className="min-w-0 rounded-xl bg-[var(--bg-muted)] p-3"><p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{label}</p>{children || <p className="mt-2 truncate text-xs capitalize text-[var(--text-secondary)]">{value}</p>}</div>; }
function Pagination({ page, totalPages, onPage }) { return <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3"><p className="text-xs text-[var(--text-muted)]">Page {page} of {totalPages}</p><div className="flex gap-2"><PageButton label="Previous page" disabled={page === 1} onClick={() => onPage(page - 1)}><ChevronLeft className="h-4 w-4"/></PageButton><PageButton label="Next page" disabled={page === totalPages} onClick={() => onPage(page + 1)}><ChevronRight className="h-4 w-4"/></PageButton></div></div>; }
function PageButton({ label, disabled, onClick, children }) { return <button type="button" aria-label={label} disabled={disabled} onClick={onClick} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] disabled:opacity-35">{children}</button>; }
function ModalShell({ title, onClose, children, danger }) { return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="admin-food-modal-title" onMouseDown={onClose}><motion.div initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }} onMouseDown={(event) => event.stopPropagation()} className={`max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-elevated)] sm:p-7 ${danger ? 'border-red-500/20' : 'border-[var(--border)]'}`}><div className="mb-6 flex items-center justify-between gap-4"><h2 id="admin-food-modal-title" className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2><button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)]" aria-label="Close modal"><X className="h-4 w-4"/></button></div>{children}</motion.div></motion.div>; }
function FoodDetailsModal({ food, onClose }) { return <ModalShell title="Food Details" onClose={onClose}><FoodImage food={food} className="h-52 w-full rounded-2xl"/><h3 className="mt-5 text-lg font-semibold text-[var(--text-primary)]">{food.title || 'Untitled Food'}</h3><p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{food.shortDescription || food.description || 'No description available.'}</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><Detail label="Chef" value={food.chefName || food.chefEmail}/><Detail label="Category" value={food.category}/><Detail label="Cuisine" value={food.cuisine}/><Detail label="Price" value={money(food.discountPrice || food.price)}/><Detail label="Available Quantity" value={food.availableQuantity ?? 0}/><Detail label="Orders" value={food.orderCount || 0}/><Detail label="Rating" value={`${Number(food.rating || 0).toFixed(1)} (${food.reviewCount || 0} reviews)`}/><Detail label="Created" value={date(food.createdAt)}/></div></ModalShell>; }
function Detail({ label, value }) { return <div className="rounded-2xl bg-[var(--bg-muted)] p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{label}</p><p className="mt-2 break-words text-sm capitalize text-[var(--text-primary)]">{value || 'Not available'}</p></div>; }
function ConfirmationModal({ confirmation, busy, onClose, onConfirm }) { const config = { archive: { title: 'Archive Food?', text: 'This food will no longer appear on the public Foods page.', button: 'Archive Food', icon: Archive, style: 'bg-amber-500' }, restore: { title: 'Restore Food?', text: 'This food will return to active status and become visible publicly.', button: 'Restore Food', icon: RotateCcw, style: 'bg-emerald-500' }, delete: { title: 'Soft Delete Food?', text: 'The food will be marked deleted and removed from management and public listings. The MongoDB document will remain.', button: 'Soft Delete', icon: Trash2, style: 'bg-red-500' } }[confirmation.type]; const Icon = config.icon; return <ModalShell title={config.title} onClose={onClose} danger={confirmation.type === 'delete'}><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-muted)] text-[var(--accent)]"><Icon className="h-7 w-7"/></div><p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">{config.text}</p><p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">{confirmation.food.title || 'Untitled Food'}</p><div className="mt-7 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={busy} className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text-secondary)]">Cancel</button><button type="button" onClick={onConfirm} disabled={busy} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 ${config.style}`}>{busy && <Loader2 className="h-4 w-4 animate-spin"/>}{busy ? 'Updating...' : config.button}</button></div></ModalShell>; }
function FoodsSkeleton() { return <div className="space-y-3" role="status" aria-label="Loading foods">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-20 animate-pulse rounded-2xl bg-[var(--bg-muted)]"/>)}</div>; }
function ErrorState({ message, onRetry }) { return <div className="rounded-[2rem] border border-red-500/20 bg-red-500/5 px-6 py-16 text-center"><p className="text-sm font-semibold text-red-500">{message}</p><button type="button" onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-full border border-red-500/20 px-5 py-2.5 text-sm font-semibold text-red-500"><RefreshCw className="h-4 w-4"/>Try Again</button></div>; }
function EmptyState({ filtered, onReset }) { return <div className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--bg-surface)] px-6 py-20 text-center"><PackageOpen className="mx-auto h-10 w-10 text-[var(--accent)]"/><h2 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">{filtered ? 'No matching foods' : 'No foods found'}</h2><p className="mt-2 text-sm text-[var(--text-muted)]">{filtered ? 'Try changing your search or category filter.' : 'Food listings will appear here.'}</p>{filtered && <button type="button" onClick={onReset} className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)]"><Utensils className="h-4 w-4"/>Clear Filters</button>}</div>; }
