import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';
import { getSidebarMenu } from '../../data/sidebarMenus';
import SidebarItem from './SidebarItem';

export default function Sidebar({ role = 'customer', chefStatus = 'none', collapsed = false, onItemClick, mobile = false }) {
  const menuItems = getSidebarMenu(role, chefStatus);

  return (
    <motion.aside
      animate={{ width: mobile ? '100%' : collapsed ? 92 : 288 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={`${mobile ? 'flex h-full w-full flex-col' : 'hidden h-screen lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:flex-col'} border-r border-[var(--border)] bg-[var(--bg-surface)] px-4 py-5 shadow-xl shadow-black/5`}
      aria-label="Dashboard sidebar"
    >
      <div className={`flex items-center gap-3 px-2 ${collapsed ? 'justify-center' : ''}`}>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-lg shadow-orange-400/20">
          <ChefHat size={22} />
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-base font-semibold text-[var(--text-primary)]">HomeBite</p>
            <p className="text-xs text-[var(--text-secondary)]">Dashboard</p>
          </div>
        )}
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {menuItems.map((item) => (
          <SidebarItem key={item.label} item={item} collapsed={collapsed} onClick={onItemClick} />
        ))}
      </nav>
    </motion.aside>
  );
}
