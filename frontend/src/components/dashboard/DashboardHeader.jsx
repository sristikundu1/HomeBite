export default function DashboardHeader({ title, description }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">Dashboard</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">{description}</p>
    </div>
  );
}
