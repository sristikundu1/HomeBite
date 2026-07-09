import { useState } from 'react';
import { motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import MobileSidebar from '../components/dashboard/MobileSidebar';
import Topbar from '../components/dashboard/Topbar';
import CustomCursor from '../components/common/CustomCursor';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import useRole from '../hooks/useRole';
import { useAuth } from '../providers/AuthProvider';

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { role, loading } = useRole();
  const { dbUser } = useAuth();
  const location = useLocation();
  const chefStatus = dbUser?.chefStatus || 'none';
  const activeRole = role === 'admin' ? 'admin' : chefStatus === 'approved' ? 'chef' : role || 'customer';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <CustomCursor />
      <Sidebar role={activeRole} chefStatus={chefStatus} collapsed={sidebarCollapsed} />
      <MobileSidebar isOpen={mobileSidebarOpen} role={activeRole} chefStatus={chefStatus} onClose={() => setMobileSidebarOpen(false)} />

      <motion.div
        animate={{ '--sidebar-width': sidebarCollapsed ? '92px' : '288px' }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="min-h-screen lg:pl-[var(--sidebar-width)]"
      >
        <Topbar
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((current) => !current)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="px-4 py-8 sm:px-6 lg:px-8"
        >
          <Outlet />
        </motion.main>
      </motion.div>
      <ScrollToTopButton />
    </div>
  );
}
