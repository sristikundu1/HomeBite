export default function Divider({ text = 'or continue with' }) {
  return (
    <div className="relative my-6 flex items-center text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]">
      <span className="h-px flex-1 bg-[var(--border)]" />
      <span className="mx-4">{text}</span>
      <span className="h-px flex-1 bg-[var(--border)]" />
    </div>
  );
}
