import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, ChevronRight, Eye, Loader2, Pencil, RefreshCw, Search, ShieldCheck, ShieldOff, Trash2, UserRound, Users, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { activateManagedUser, getManagedUsers, softDeleteManagedUser, suspendManagedUser, updateManagedUserRole } from '../../services/adminApi';

const PAGE_SIZE = 10;
const documentId = (value) => value?.$oid || value || '';
const normalize = (value) => String(value || '').trim().toLowerCase();
const dateTime = (value) => value ? new Intl.DateTimeFormat('en-BD', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'Not available';
const filters = [
  { key: 'all', label: 'All' },
  { key: 'customer', label: 'Customer' },
  { key: 'chef', label: 'Chef' },
  { key: 'admin', label: 'Admin' },
  { key: 'suspended', label: 'Suspended' },
  { key: 'active', label: 'Active' }
];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [viewing, setViewing] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [mutatingId, setMutatingId] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    getManagedUsers()
      .then((response) => { if (active) setUsers(response.data.data || []); })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || 'Unable to load users.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reloadKey]);

  const visibleUsers = useMemo(() => {
    const query = normalize(search);
    return users.filter((account) => {
      const matchesFilter = filter === 'all' || (['customer', 'chef', 'admin'].includes(filter) ? normalize(account.role) === filter : normalize(account.status) === filter);
      const text = [account.name, account.email, account.role, account.status, account.chefStatus].filter(Boolean).join(' ').toLowerCase();
      return matchesFilter && (!query || text.includes(query));
    });
  }, [filter, search, users]);
  const totalPages = Math.max(1, Math.ceil(visibleUsers.length / PAGE_SIZE));
  const paginatedUsers = visibleUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [filter, search]);
  useEffect(() => setPage((current) => Math.min(current, totalPages)), [totalPages]);

  function replaceUser(updated) {
    const id = documentId(updated._id);
    setUsers((current) => current.map((account) => documentId(account._id) === id ? updated : account));
  }

  async function saveRole(role) {
    const id = documentId(editingRole?._id);
    if (!id || mutatingId) return;
    setMutatingId(id);
    try {
      const response = await updateManagedUserRole(id, role);
      replaceUser(response.data.data);
      setEditingRole(null);
      toast.success('User role updated successfully.');
    } catch (requestError) { toast.error(requestError.response?.data?.message || 'Unable to update role.'); }
    finally { setMutatingId(''); }
  }

  async function confirmAction() {
    const id = documentId(confirmation?.user?._id);
    if (!id || mutatingId) return;
    setMutatingId(id);
    try {
      if (confirmation.type === 'delete') {
        await softDeleteManagedUser(id);
        setUsers((current) => current.filter((account) => documentId(account._id) !== id));
        toast.success('User soft deleted successfully.');
      } else {
        const response = confirmation.type === 'activate' ? await activateManagedUser(id) : await suspendManagedUser(id);
        replaceUser(response.data.data);
        toast.success(confirmation.type === 'activate' ? 'User activated successfully.' : 'User suspended successfully.');
      }
      setConfirmation(null);
    } catch (requestError) { toast.error(requestError.response?.data?.message || 'Unable to update this user.'); }
    finally { setMutatingId(''); }
  }

  return <div className="mx-auto max-w-[1600px] space-y-8">
    <DashboardHeader title="Manage Users" description="Review customer, chef, and administrator accounts and control platform access." />
    <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-lg shadow-black/5">
      <div className="grid gap-4 lg:grid-cols-[minmax(260px,1fr)_auto] lg:items-center"><label className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3"><Search className="h-4 w-4 text-[var(--text-muted)]"/><span className="sr-only">Search users</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, role, or status" className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none"/></label><div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="User filters">{filters.map((item) => <button key={item.key} type="button" role="tab" aria-selected={filter === item.key} onClick={() => setFilter(item.key)} className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-semibold transition ${filter === item.key ? 'bg-[var(--accent)] text-white shadow-lg shadow-orange-500/15' : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--accent)]'}`}>{item.label}</button>)}</div></div>
      <div className="mt-4 flex items-center justify-between gap-4 border-t border-[var(--border)] pt-4"><p className="text-xs text-[var(--text-muted)]">Showing {paginatedUsers.length} of {visibleUsers.length} matching users</p>{error && <button type="button" onClick={() => setReloadKey((value) => value + 1)} className="inline-flex items-center gap-2 text-xs font-semibold text-red-500"><RefreshCw className="h-3.5 w-3.5"/>Retry</button>}</div>
    </motion.section>

    {loading ? <UsersSkeleton/> : error ? <ErrorState message={error} onRetry={() => setReloadKey((value) => value + 1)}/> : paginatedUsers.length ? <><DesktopTable users={paginatedUsers} onView={setViewing} onRole={setEditingRole} onConfirm={setConfirmation} mutatingId={mutatingId}/><MobileCards users={paginatedUsers} onView={setViewing} onRole={setEditingRole} onConfirm={setConfirmation} mutatingId={mutatingId}/></> : <EmptyState filtered={users.length > 0} onReset={() => { setSearch(''); setFilter('all'); }}/>} 

    {!loading && !error && visibleUsers.length > PAGE_SIZE && <Pagination page={page} totalPages={totalPages} onPage={setPage}/>} 
    <AnimatePresence>{viewing && <UserDetailsModal user={viewing} onClose={() => setViewing(null)}/>}</AnimatePresence>
    <AnimatePresence>{editingRole && <RoleModal user={editingRole} busy={mutatingId === documentId(editingRole._id)} onClose={() => !mutatingId && setEditingRole(null)} onSave={saveRole}/>}</AnimatePresence>
    <AnimatePresence>{confirmation && <ConfirmationModal confirmation={confirmation} busy={mutatingId === documentId(confirmation.user._id)} onClose={() => !mutatingId && setConfirmation(null)} onConfirm={confirmAction}/>}</AnimatePresence>
  </div>;
}

function DesktopTable({ users, onView, onRole, onConfirm, mutatingId }) { return <div className="hidden overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-lg shadow-black/5 xl:block"><div className="overflow-x-auto"><table className="w-full min-w-[1320px] text-left"><thead className="border-b border-[var(--border)] bg-[var(--bg-muted)] text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]"><tr>{['User','Email','Role','Status','Registration Date','Last Login','Chef Status','Actions'].map((label) => <th key={label} className="px-5 py-4">{label}</th>)}</tr></thead><tbody>{users.map((account, index) => <UserRow key={documentId(account._id)} account={account} index={index} onView={onView} onRole={onRole} onConfirm={onConfirm} busy={mutatingId === documentId(account._id)}/>)}</tbody></table></div></div>; }
function UserRow({ account, index, onView, onRole, onConfirm, busy }) { return <motion.tr initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.035 }} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-muted)]/60"><td className="px-5 py-4"><UserIdentity user={account}/></td><td className="max-w-[220px] truncate px-5 py-4 text-xs text-[var(--text-secondary)]">{account.email}</td><td className="px-5 py-4"><RoleBadge role={account.role}/></td><td className="px-5 py-4"><StatusBadge status={account.status}/></td><td className="px-5 py-4 text-xs text-[var(--text-muted)]">{dateTime(account.createdAt)}</td><td className="px-5 py-4 text-xs text-[var(--text-muted)]">{dateTime(account.lastLogin)}</td><td className="px-5 py-4 text-xs capitalize text-[var(--text-secondary)]">{account.chefStatus || 'none'}</td><td className="px-5 py-4"><ActionButtons user={account} onView={onView} onRole={onRole} onConfirm={onConfirm} busy={busy}/></td></motion.tr>; }
function MobileCards({ users, onView, onRole, onConfirm, mutatingId }) { return <div className="grid gap-4 sm:grid-cols-2 xl:hidden">{users.map((account, index) => <motion.article key={documentId(account._id)} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5"><UserIdentity user={account}/><div className="mt-5 grid grid-cols-2 gap-3 text-xs"><MobileField label="Role"><RoleBadge role={account.role}/></MobileField><MobileField label="Status"><StatusBadge status={account.status}/></MobileField><MobileField label="Registered" value={dateTime(account.createdAt)}/><MobileField label="Last Login" value={dateTime(account.lastLogin)}/><MobileField label="Chef Status" value={account.chefStatus || 'none'} capitalize/><MobileField label="Email" value={account.email}/></div><div className="mt-5 border-t border-[var(--border)] pt-4"><ActionButtons user={account} onView={onView} onRole={onRole} onConfirm={onConfirm} busy={mutatingId === documentId(account._id)}/></div></motion.article>)}</div>; }
function UserIdentity({ user }) { return <div className="flex min-w-0 items-center gap-3">{user.photo ? <img src={user.photo} alt="" className="h-11 w-11 shrink-0 rounded-2xl object-cover"/> : <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><UserRound className="h-5 w-5"/></span>}<div className="min-w-0"><p className="truncate text-sm font-semibold text-[var(--text-primary)]">{user.name || 'Unnamed User'}</p><p className="mt-1 truncate text-[10px] text-[var(--text-muted)]">ID: {documentId(user._id).slice(-8).toUpperCase()}</p></div></div>; }
function ActionButtons({ user, onView, onRole, onConfirm, busy }) { const active = normalize(user.status) === 'active'; return <div className="flex flex-wrap gap-2"><ActionButton label="View" icon={Eye} onClick={() => onView(user)} disabled={busy}/><ActionButton label="Edit Role" icon={Pencil} onClick={() => onRole(user)} disabled={busy}/>{active ? <ActionButton label="Suspend" icon={ShieldOff} danger onClick={() => onConfirm({ type: 'suspend', user })} disabled={busy}/> : <ActionButton label="Activate" icon={CheckCircle2} success onClick={() => onConfirm({ type: 'activate', user })} disabled={busy}/>}<ActionButton label="Soft Delete" icon={Trash2} danger onClick={() => onConfirm({ type: 'delete', user })} disabled={busy}/></div>; }
function ActionButton({ label, icon: Icon, onClick, disabled, danger, success }) { return <button type="button" onClick={onClick} disabled={disabled} className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[10px] font-semibold transition disabled:opacity-40 ${danger ? 'border-red-500/20 text-red-500 hover:bg-red-500/10' : success ? 'border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10' : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)]'}`}><Icon className="h-3.5 w-3.5"/>{label}</button>; }
function RoleBadge({ role }) { const value = normalize(role) || 'customer'; const tone = { admin: 'bg-violet-500/10 text-violet-500', chef: 'bg-orange-500/10 text-orange-500', customer: 'bg-blue-500/10 text-blue-500' }[value]; return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${tone}`}>{value}</span>; }
function StatusBadge({ status }) { const value = normalize(status) || 'active'; const active = value === 'active'; return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}><span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-amber-500'}`}/>{value}</span>; }
function MobileField({ label, value, children, capitalize }) { return <div className="min-w-0 rounded-xl bg-[var(--bg-muted)] p-3"><p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{label}</p>{children || <p className={`mt-2 truncate text-xs text-[var(--text-secondary)] ${capitalize ? 'capitalize' : ''}`}>{value}</p>}</div>; }
function Pagination({ page, totalPages, onPage }) { return <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3"><p className="text-xs text-[var(--text-muted)]">Page {page} of {totalPages}</p><div className="flex gap-2"><PageButton label="Previous page" disabled={page === 1} onClick={() => onPage(page - 1)}><ChevronLeft className="h-4 w-4"/></PageButton><PageButton label="Next page" disabled={page === totalPages} onClick={() => onPage(page + 1)}><ChevronRight className="h-4 w-4"/></PageButton></div></div>; }
function PageButton({ label, disabled, onClick, children }) { return <button type="button" aria-label={label} disabled={disabled} onClick={onClick} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] disabled:opacity-35">{children}</button>; }
function ModalShell({ title, onClose, children, danger }) { return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="admin-user-modal-title" onMouseDown={onClose}><motion.div initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }} onMouseDown={(event) => event.stopPropagation()} className={`max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-elevated)] sm:p-7 ${danger ? 'border-red-500/20' : 'border-[var(--border)]'}`}><div className="mb-6 flex items-center justify-between gap-4"><h2 id="admin-user-modal-title" className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2><button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)]" aria-label="Close modal"><X className="h-4 w-4"/></button></div>{children}</motion.div></motion.div>; }
function UserDetailsModal({ user, onClose }) { return <ModalShell title="User Details" onClose={onClose}><div className="flex justify-center"><UserIdentity user={user}/></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><Detail label="Email" value={user.email}/><Detail label="Role" value={user.role}/><Detail label="Status" value={user.status}/><Detail label="Chef Status" value={user.chefStatus || 'none'}/><Detail label="Registration Date" value={dateTime(user.createdAt)}/><Detail label="Last Login" value={dateTime(user.lastLogin)}/></div></ModalShell>; }
function Detail({ label, value }) { return <div className="rounded-2xl bg-[var(--bg-muted)] p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{label}</p><p className="mt-2 break-words text-sm capitalize text-[var(--text-primary)]">{value || 'Not available'}</p></div>; }
function RoleModal({ user, busy, onClose, onSave }) { const [role, setRole] = useState(normalize(user.role) || 'customer'); return <ModalShell title="Edit User Role" onClose={onClose}><p className="text-sm text-[var(--text-secondary)]">Choose a new role for <strong className="text-[var(--text-primary)]">{user.name || user.email}</strong>.</p><fieldset className="mt-5 grid gap-3"><legend className="sr-only">User role</legend>{['customer','chef','admin'].map((value) => <button key={value} type="button" role="radio" aria-checked={role === value} onClick={() => setRole(value)} className={`flex items-center justify-between rounded-2xl border p-4 text-left capitalize ${role === value ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]' : 'border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-secondary)]'}`}><span className="font-semibold">{value}</span>{role === value && <CheckCircle2 className="h-5 w-5"/>}</button>)}</fieldset><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={busy} className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text-secondary)]">Cancel</button><button type="button" onClick={() => onSave(role)} disabled={busy || role === normalize(user.role)} className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-45">{busy ? <Loader2 className="h-4 w-4 animate-spin"/> : <ShieldCheck className="h-4 w-4"/>}{busy ? 'Saving...' : 'Save Role'}</button></div></ModalShell>; }
function ConfirmationModal({ confirmation, busy, onClose, onConfirm }) { const config = { suspend: { title: 'Suspend User?', text: 'This user will lose active platform access until an administrator activates the account.', button: 'Suspend User' }, activate: { title: 'Activate User?', text: 'This user account will return to active platform status.', button: 'Activate User' }, delete: { title: 'Soft Delete User?', text: 'The account will be marked deleted and removed from this list. Historical data will remain in MongoDB.', button: 'Soft Delete' } }[confirmation.type]; return <ModalShell title={config.title} onClose={onClose} danger={confirmation.type !== 'activate'}><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500"><ShieldOff className="h-7 w-7"/></div><p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">{config.text}</p><p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">{confirmation.user.name || confirmation.user.email}</p><div className="mt-7 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={busy} className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text-secondary)]">Cancel</button><button type="button" onClick={onConfirm} disabled={busy} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 ${confirmation.type === 'activate' ? 'bg-emerald-500' : 'bg-red-500'}`}>{busy && <Loader2 className="h-4 w-4 animate-spin"/>}{busy ? 'Updating...' : config.button}</button></div></ModalShell>; }
function UsersSkeleton() { return <div className="space-y-3" role="status" aria-label="Loading users">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-20 animate-pulse rounded-2xl bg-[var(--bg-muted)]"/>)}</div>; }
function ErrorState({ message, onRetry }) { return <div className="rounded-[2rem] border border-red-500/20 bg-red-500/5 px-6 py-16 text-center"><p className="text-sm font-semibold text-red-500">{message}</p><button type="button" onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-full border border-red-500/20 px-5 py-2.5 text-sm font-semibold text-red-500"><RefreshCw className="h-4 w-4"/>Try Again</button></div>; }
function EmptyState({ filtered, onReset }) { return <div className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--bg-surface)] px-6 py-20 text-center"><Users className="mx-auto h-10 w-10 text-[var(--accent)]"/><h2 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">{filtered ? 'No matching users' : 'No users found'}</h2><p className="mt-2 text-sm text-[var(--text-muted)]">{filtered ? 'Try changing your search or filter.' : 'Registered users will appear here.'}</p>{filtered && <button type="button" onClick={onReset} className="mt-5 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)]">Clear Filters</button>}</div>; }
