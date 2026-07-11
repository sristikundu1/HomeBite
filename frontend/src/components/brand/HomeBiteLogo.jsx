import { useId } from 'react';

export default function HomeBiteLogo({ showWordmark = true, className = '', iconClassName = 'h-12 w-12', wordmarkClassName = 'text-lg' }) {
  const gradientId = useId().replaceAll(':', '');

  return (
    <span className={`inline-flex items-center gap-3 ${className}`} aria-label="HomeBite">
      <svg viewBox="0 0 64 64" role="img" aria-hidden="true" className={`shrink-0 drop-shadow-[0_8px_18px_rgba(249,115,22,0.22)] ${iconClassName}`}>
        <defs>
          <linearGradient id={gradientId} x1="10" y1="8" x2="55" y2="58" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fb923c" />
            <stop offset="0.55" stopColor="#f97316" />
            <stop offset="1" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <path d="M7.5 29.2 28.1 10.5a5.8 5.8 0 0 1 7.8 0l20.6 18.7c3.7 3.4 1.3 9.5-3.7 9.5h-1.5v13.1a6.2 6.2 0 0 1-6.2 6.2H18.9a6.2 6.2 0 0 1-6.2-6.2V38.7h-1.5c-5 0-7.4-6.1-3.7-9.5Z" fill={`url(#${gradientId})`} />
        <path d="M25 27.5v8.1M29.7 27.5v8.1M34.4 27.5v8.1M39 27.5v8.1M25 35.6c0 4.3 3.1 7.2 7 7.2s7-2.9 7-7.2M32 42.8v10" fill="none" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M45.5 16.6c3.5-3 8.6-.5 8.6 3.8 0 4.4-4.9 7.3-8.6 10.4-3.7-3.1-8.6-6-8.6-10.4 0-4.3 5.1-6.8 8.6-3.8Z" fill="#fff" fillOpacity=".94" />
      </svg>
      {showWordmark && <span className={`font-semibold tracking-[-0.035em] text-[var(--text-primary)] ${wordmarkClassName}`}>Home<span className="text-[var(--accent)]">Bite</span></span>}
    </span>
  );
}
