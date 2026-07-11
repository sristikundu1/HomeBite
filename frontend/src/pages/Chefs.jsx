import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChefHat, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import ChefDiscoveryCard from '../components/chefs/ChefDiscoveryCard';
import { getChefs } from '../services/chefsApi';

const initialFilters = { search: '', cuisine: '', experience: '', rating: '', location: '', availability: '', sort: 'highest-rated' };

export default function Chefs() {
  const [draft, setDraft] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const params = useMemo(() => ({ ...filters, page, limit: 9 }), [filters, page]);
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['chefs', params], queryFn: async () => (await getChefs(params)).data.data });
  const chefs = data?.chefs || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

  function submit(event) { event.preventDefault(); setPage(1); setFilters({ ...draft, search: draft.search.trim(), location: draft.location.trim() }); }

  return <main className="min-h-screen bg-[var(--bg-page)] pb-24 pt-28">
    <section className="border-b border-[var(--border)] bg-[var(--hero-gradient)] py-16"><div className="container text-center"><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}><p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">HomeBite chef community</p><h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-6xl">Discover Local Home Chefs</h1><p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--text-secondary)]">Meet verified cooks, explore their kitchens, and discover authentic homemade meals near you.</p></motion.div></div></section>
    <div className="container mt-10">
      <form onSubmit={submit} className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-soft)]"><div className="mb-4 flex items-center gap-2 font-semibold text-[var(--text-primary)]"><SlidersHorizontal className="h-5 w-5 text-[var(--accent)]" />Find your chef</div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><Field icon={Search}><input value={draft.search} onChange={(e) => setDraft({ ...draft, search: e.target.value })} placeholder="Search chefs or kitchens" aria-label="Search chefs" /></Field><Field><input value={draft.cuisine} onChange={(e) => setDraft({ ...draft, cuisine: e.target.value })} placeholder="Cuisine" aria-label="Cuisine" /></Field><Field><input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} placeholder="Location" aria-label="Location" /></Field><Select value={draft.experience} onChange={(value) => setDraft({ ...draft, experience: value })} label="Experience"><option value="">Any experience</option><option value="2">2+ years</option><option value="5">5+ years</option><option value="10">10+ years</option></Select><Select value={draft.rating} onChange={(value) => setDraft({ ...draft, rating: value })} label="Rating"><option value="">Any rating</option><option value="4">4+ stars</option><option value="4.5">4.5+ stars</option></Select><Select value={draft.availability} onChange={(value) => setDraft({ ...draft, availability: value })} label="Availability"><option value="">Any availability</option><option value="available">Accepting orders</option></Select><Select value={draft.sort} onChange={(value) => setDraft({ ...draft, sort: value })} label="Sort chefs"><option value="highest-rated">Highest Rated</option><option value="most-orders">Most Orders</option><option value="newest">Newest</option><option value="alphabetical">Alphabetical</option></Select><button className="rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white">Search Chefs</button></div></form>
      <div className="mt-8 flex items-center justify-between"><p className="text-sm text-[var(--text-secondary)]">{pagination.total} approved chefs</p></div>
      {isLoading ? <Skeletons /> : isError ? <Empty title="Unable to load chefs" text="Please try loading the chef directory again." action={<button onClick={() => refetch()} className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white">Retry</button>} /> : chefs.length ? <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{chefs.map((chef, index) => <ChefDiscoveryCard key={chef._id?.$oid || chef._id} chef={chef} index={index} />)}</div> : <Empty title="No chefs match these filters" text="Try a different cuisine, location, or rating." />}
      {pagination.totalPages > 1 && <div className="mt-10 flex items-center justify-center gap-4"><PageButton disabled={page === 1} onClick={() => setPage((p) => p - 1)} label="Previous"><ChevronLeft /></PageButton><span className="text-sm text-[var(--text-secondary)]">Page {page} of {pagination.totalPages}</span><PageButton disabled={page === pagination.totalPages} onClick={() => setPage((p) => p + 1)} label="Next"><ChevronRight /></PageButton></div>}
    </div>
  </main>;
}

function Field({ icon: Icon, children }) { return <label className="flex h-12 items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] px-4">{Icon && <Icon className="h-4 w-4 text-[var(--text-muted)]" />}<span className="sr-only">Filter</span>{children}</label>; }
function Select({ value, onChange, label, children }) { return <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className="h-12 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 text-sm text-[var(--text-primary)] outline-none">{children}</select>; }
function PageButton({ disabled, onClick, label, children }) { return <button disabled={disabled} onClick={onClick} aria-label={`${label} page`} className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-primary)] disabled:opacity-35">{children}</button>; }
function Skeletons() { return <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3" role="status">{Array.from({ length: 6 }, (_, i) => <div key={i} className="h-[500px] animate-pulse rounded-[2rem] bg-[var(--bg-muted)]" />)}</div>; }
function Empty({ title, text, action }) { return <div className="mt-8 flex min-h-96 flex-col items-center justify-center rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--bg-surface)] p-8 text-center"><ChefHat className="h-14 w-14 text-[var(--accent)]" /><h2 className="mt-5 text-2xl font-semibold text-[var(--text-primary)]">{title}</h2><p className="mt-2 text-sm text-[var(--text-secondary)]">{text}</p>{action && <div className="mt-5">{action}</div>}</div>; }
