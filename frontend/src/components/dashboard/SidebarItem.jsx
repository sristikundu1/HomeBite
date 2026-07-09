import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

export default function SidebarItem({ item, collapsed = false, onClick }) {
  const Icon = item.icon;

  return (
    <motion.div whileHover={{ x: collapsed ? 0 : 3 }} transition={{ duration: 0.2 }}>
      <NavLink
        to={item.path}
        end={item.path === '/dashboard'}
        onClick={onClick}
        className={({ isActive }) =>
          `flex min-h-[46px] items-center gap-3 rounded-2xl px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] ${
            isActive
              ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/20'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]'
          } ${collapsed ? 'justify-center px-3' : ''}`
        }
        aria-label={item.label}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </NavLink>
    </motion.div>
  );
}
