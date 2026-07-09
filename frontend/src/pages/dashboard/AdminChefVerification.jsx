import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Search,
  ShieldCheck,
  X,
  XCircle
} from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import DashboardCard from '../../components/dashboard/DashboardCard';
import ViewApplicationModal from '../../components/dashboard/ViewApplicationModal';
import { useAuth } from '../../providers/AuthProvider';
import {
  approveChefApplication,
  getChefApplications,
  rejectChefApplication
} from '../../services/chefApplicationsApi';

const pageSize = 8;

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

function getApplicationId(application) {
  return application?._id || application?.id;
}

function getApplicantPhoto(application) {
  return application?.photo || application?.profileImage || application?.documents?.[0] || '';
}

function getCity(application) {
  if (application?.city) return application.city;
  if (!application?.location) return 'Not available';

  const parts = application.location.split(',').map((part) => part.trim()).filter(Boolean);
  return parts[parts.length - 1] || application.location;
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

function StatusBadge({ status }) {
  const normalizedStatus = status || 'pending';

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusClasses[normalizedStatus] || statusClasses.pending}`}>
      {normalizedStatus}
    </span>
  );
}

function Modal({ title, children, onClose }) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chef-verification-modal-title"
        onMouseDown={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-elevated)]"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-4">
            <h2 id="chef-verification-modal-title" className="text-xl font-semibold text-[var(--text-primary)]">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AdminChefVerification() {
  const { user, dbUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadApplications() {
      try {
        const response = await getChefApplications();

        if (isMounted) {
          setApplications(response.data.applications || []);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error.response?.data?.message || 'Failed to load chef applications.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadApplications();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const filteredApplications = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
      const matchesSearch =
        !query ||
        [application.name, application.email, application.experience, getCity(application)]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [applications, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / pageSize));
  const visibleApplications = filteredApplications.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const reviewer = dbUser?.email || user?.email || 'admin';

  async function handleDecision() {
    if (!confirmation?.application) return;

    const applicationId = getApplicationId(confirmation.application);

    if (!applicationId) {
      toast.error('Application id is missing.');
      return;
    }

    if (confirmation.type === 'reject' && !rejectionReason.trim()) {
      toast.error('Please add a rejection reason.');
      return;
    }

    setActionLoading(true);

    try {
      if (confirmation.type === 'approve') {
        await approveChefApplication(applicationId, { reviewedBy: reviewer });
        toast.success('Chef application approved.');
      } else {
        await rejectChefApplication(applicationId, {
          reviewedBy: reviewer,
          rejectionReason: rejectionReason.trim()
        });
        toast.success('Chef application rejected.');
      }

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          getApplicationId(application) === applicationId
            ? {
                ...application,
                status: confirmation.type === 'approve' ? 'approved' : 'rejected',
                reviewedAt: new Date().toISOString(),
                reviewedBy: reviewer,
                rejectionReason: confirmation.type === 'approve' ? '' : rejectionReason.trim()
              }
            : application
        )
      );
      setConfirmation(null);
      setRejectionReason('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update application.');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <DashboardHeader title="Chef Verification" description="Review chef applications and approve qualified applicants." />

      <DashboardCard>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon)]" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search applicants..."
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] py-3 pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
              aria-label="Search chef applications"
            />
          </div>

          <label className="flex items-center gap-3 text-sm font-semibold text-[var(--text-secondary)]">
            Status
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
              aria-label="Filter applications by status"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
        </div>
      </DashboardCard>

      <DashboardCard className="overflow-hidden p-0">
        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-[var(--accent)]" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full text-left">
                <thead className="border-b border-[var(--border)] bg-[var(--bg-muted)] text-xs uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Applicant</th>
                    <th className="px-6 py-4 font-semibold">Photo</th>
                    <th className="px-6 py-4 font-semibold">Experience</th>
                    <th className="px-6 py-4 font-semibold">City</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Submitted Date</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {visibleApplications.map((application) => {
                    const applicationId = getApplicationId(application);
                    const photo = getApplicantPhoto(application);

                    return (
                      <tr key={applicationId} className="transition hover:bg-[var(--bg-muted)]">
                        <td className="px-6 py-5">
                          <p className="font-semibold text-[var(--text-primary)]">{application.name || 'Guest User'}</p>
                          <p className="mt-1 text-sm text-[var(--text-secondary)]">{application.email || 'No email'}</p>
                        </td>
                        <td className="px-6 py-5">
                          {photo ? (
                            <img
                              src={photo}
                              alt={`${application.name || 'Applicant'} profile`}
                              className="h-12 w-12 rounded-full border border-[var(--border)] object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-page)] text-sm font-bold text-[var(--accent)]">
                              {getInitials(application.name)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-[var(--text-primary)]">{application.experience || 'Not available'}</td>
                        <td className="px-6 py-5 text-sm text-[var(--text-secondary)]">{getCity(application)}</td>
                        <td className="px-6 py-5">
                          <StatusBadge status={application.status} />
                        </td>
                        <td className="px-6 py-5 text-sm text-[var(--text-secondary)]">{formatDate(application.submittedAt)}</td>
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedApplication(application)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] transition hover:bg-[var(--bg-page)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
                              aria-label={`View ${application.name || 'application'}`}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmation({ type: 'approve', application })}
                              disabled={application.status === 'approved'}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/20 text-emerald-500 transition hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                              aria-label={`Approve ${application.name || 'application'}`}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmation({ type: 'reject', application })}
                              disabled={application.status === 'rejected'}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-500/20 text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                              aria-label={`Reject ${application.name || 'application'}`}
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {!visibleApplications.length && (
              <div className="px-6 py-16 text-center">
                <ShieldCheck className="mx-auto h-10 w-10 text-[var(--accent)]" />
                <p className="mt-4 text-sm font-semibold text-[var(--text-primary)]">No applications found</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Try changing the search or status filter.</p>
              </div>
            )}

            <div className="flex flex-col gap-4 border-t border-[var(--border)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--text-secondary)]">
                Showing {visibleApplications.length ? (currentPage - 1) * pageSize + 1 : 0}-
                {Math.min(currentPage * pageSize, filteredApplications.length)} of {filteredApplications.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>
                <span className="px-3 text-sm font-semibold text-[var(--text-primary)]">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </DashboardCard>

      {selectedApplication && (
        <ViewApplicationModal application={selectedApplication} onClose={() => setSelectedApplication(null)} />
      )}

      {confirmation && (
        <Modal
          title={confirmation.type === 'approve' ? 'Approve Application' : 'Reject Application'}
          onClose={() => {
            if (!actionLoading) {
              setConfirmation(null);
              setRejectionReason('');
            }
          }}
        >
          <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">
            Are you sure you want to {confirmation.type} the application from{' '}
            <span className="font-semibold text-[var(--text-primary)]">{confirmation.application.name || 'this applicant'}</span>?
          </p>

          {confirmation.type === 'reject' && (
            <label className="mt-5 block text-sm font-semibold text-[var(--text-secondary)]">
              Rejection reason
              <textarea
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
                rows={4}
                className="mt-3 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                placeholder="Add a short admin note..."
              />
            </label>
          )}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setConfirmation(null);
                setRejectionReason('');
              }}
              disabled={actionLoading}
              className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDecision}
              disabled={actionLoading}
              className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                confirmation.type === 'approve' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {confirmation.type === 'approve' ? 'Approve' : 'Reject'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
