import { Link, useLocation } from 'react-router-dom';

const labels = {
  dashboard: 'Dashboard',
  profile: 'Profile',
  settings: 'Settings'
};

export default function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[var(--text-secondary)]">
      <ol className="flex flex-wrap items-center gap-2">
        {segments.map((segment, index) => {
          const path = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;

          return (
            <li key={path} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {isLast ? (
                <span className="font-medium text-[var(--text-primary)]">{labels[segment] || segment}</span>
              ) : (
                <Link to={path} className="transition hover:text-[var(--accent)]">
                  {labels[segment] || segment}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
