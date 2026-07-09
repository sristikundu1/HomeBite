import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const statusClasses = {
  pending: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-500',
  approved: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500',
  rejected: 'border-red-500/20 bg-red-500/10 text-red-500'
};

function formatDate(date) {
  if (!date) return 'Not available';

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(date));
}

function getProfileImage(application) {
  return application?.photo || application?.profileImage || application?.documents?.[0] || '';
}

function getInitials(name = '') {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return initials || 'HB';
}

function formatSpecialties(specialties) {
  if (Array.isArray(specialties) && specialties.length) {
    return specialties.join(', ');
  }

  return specialties || 'Not available';
}

function Detail({ label, value }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">{label}</p>
      <p className="mt-2 break-words font-semibold text-[var(--text-primary)]">{value || 'Not available'}</p>
    </div>
  );
}

export default function ViewApplicationModal({ application, onClose }) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!application) return null;

  const profileImage = getProfileImage(application);
  const status = application.status || 'pending';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-application-modal-title"
        onMouseDown={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-elevated)]"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-4">
            <h2 id="view-application-modal-title" className="text-xl font-semibold text-[var(--text-primary)]">
              Application Details
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
              aria-label="Close application details"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-5 sm:flex-row sm:items-center">
            {profileImage ? (
              <img
                src={profileImage}
                alt={`${application.name || 'Applicant'} profile`}
                className="h-24 w-24 rounded-full border border-[var(--border)] object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-2xl font-bold text-[var(--accent)]">
                {getInitials(application.name)}
              </div>
            )}

            <div className="min-w-0">
              <p className="text-2xl font-semibold text-[var(--text-primary)]">{application.name || 'Guest User'}</p>
              <p className="mt-2 break-words text-sm text-[var(--text-secondary)]">{application.email || 'No email'}</p>
              <span className={`mt-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusClasses[status] || statusClasses.pending}`}>
                {status}
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <Detail label="Name" value={application.name || 'Guest User'} />
            <Detail label="Email" value={application.email || 'No email'} />
            <Detail label="Phone" value={application.phone} />
            <Detail label="Address" value={application.address || application.location} />
            <Detail label="Experience" value={application.experience} />
            <Detail label="Submission Date" value={formatDate(application.submittedAt)} />
            <Detail label="Current Status" value={status} />
            <Detail label="Specialties" value={formatSpecialties(application.specialties)} />
          </div>

          <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">Bio</p>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[var(--text-primary)]">
              {application.bio || 'Not available'}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
