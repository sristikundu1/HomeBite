import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Sidebar from './Sidebar';

export default function MobileSidebar({ isOpen, role, chefStatus, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm lg:hidden"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="h-full w-[min(320px,calc(100vw-2rem))] bg-[var(--bg-surface)] shadow-2xl shadow-black/30"
          >
            <div className="flex justify-end p-4">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--icon)] transition hover:bg-[var(--bg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
                aria-label="Close dashboard menu"
              >
                <X size={20} />
              </button>
            </div>
            <div className="-mt-4 h-[calc(100%-56px)]">
              <Sidebar role={role} chefStatus={chefStatus} collapsed={false} onItemClick={onClose} mobile />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
