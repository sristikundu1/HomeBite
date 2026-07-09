import { useState } from 'react';
import { motion } from 'framer-motion';

function getInitials(user) {
  const name = user?.displayName?.trim();
  const email = user?.email?.trim();
  const source = name || email || 'Guest User';
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

export default function UserAvatar({ user, className = '', interactive = false }) {
  const [imageError, setImageError] = useState(false);
  const showImage = user?.photoURL && !imageError;
  const initials = getInitials(user);
  const Component = interactive ? motion.span : 'span';

  return (
    <Component
      whileHover={interactive ? { scale: 1.05 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      className={`relative inline-flex shrink-0 items-center justify-center overflow-visible rounded-full border border-[var(--border)] bg-[var(--bg-muted)] text-xs font-semibold text-[var(--text-primary)] shadow-sm ${className}`}
    >
      {showImage ? (
        <img
          src={user.photoURL}
          alt={user?.displayName || 'User avatar'}
          onError={() => setImageError(true)}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[var(--bg-surface)] bg-emerald-500" />
    </Component>
  );
}
