import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CalendarClock, CheckCircle2, Clock3, FileText, Loader2, MessageSquareText, XCircle } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';
import { getChefApplications } from '../services/chefApplicationsApi';

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock3,
    badgeClass: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-500',
    cardClass: 'border-yellow-500/20 bg-yellow-500/10',
    message: 'Your application is in review. We will notify you when an admin makes a decision.'
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle2,
    badgeClass: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500',
    cardClass: 'border-emerald-500/20 bg-emerald-500/10',
    message: 'Congratulations. Your chef application has been approved.'
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    badgeClass: 'border-red-500/20 bg-red-500/10 text-red-500',
    cardClass: 'border-red-500/20 bg-red-500/10',
    message: 'Your application was not approved. Review the admin notes for more details.'
  }
};

function formatDate(date) {
  if (!date) return 'Not available';

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(date));
}

export default function ApplicationStatus() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadApplication() {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const response = await getChefApplications();

        if (isMounted) {
          setApplications(response.data.applications || []);
        }
      } catch {
        if (isMounted) {
          setError('Unable to load your application status right now.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadApplication();

    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  const application = useMemo(() => {
    return applications
      .filter((item) => item.email === user?.email)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0];
  }, [applications, user?.email]);

  const status = application?.status || 'none';
  const config = statusConfig[status];
  const StatusIcon = config?.icon || FileText;

  return (
    <main className="relative overflow-x-hidden bg-[var(--bg-page)] px-4 pb-20 pt-[120px] text-[var(--text-primary)] sm:px-6 lg:px-8 lg:pb-[120px] lg:pt-[150px]">
      <section className="mx-auto max-w-[1100px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] shadow-lg shadow-black/5">
            <FileText size={15} />
            Application Status
          </span>
          <h1 className="mt-7 text-5xl font-semibold leading-tight tracking-normal text-[var(--text-primary)] sm:text-6xl">
            Chef Application Status
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--text-secondary)]">
            Track your chef application review progress and admin feedback.
          </p>
        </motion.div>

        {loading && (
          <div className="mt-14 flex min-h-[320px] items-center justify-center rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)]">
            <Loader2 className="h-10 w-10 animate-spin text-[var(--accent)]" />
          </div>
        )}

        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-14 rounded-[2rem] border border-red-500/20 bg-red-500/10 p-8 text-center"
          >
            <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
            <p className="mt-4 text-sm font-semibold text-red-500">{error}</p>
          </motion.div>
        )}

        {!loading && !error && !application && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="mt-14 rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-8 text-center shadow-[var(--shadow-elevated)] sm:p-12"
          >
            <FileText className="mx-auto h-12 w-12 text-[var(--accent)]" />
            <h2 className="mt-5 text-3xl font-semibold text-[var(--text-primary)]">No application found</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
              You have not submitted a chef application yet. Once you apply, your status will appear here.
            </p>
          </motion.div>
        )}

        {!loading && !error && application && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className={`mt-14 rounded-[2rem] border p-6 shadow-[var(--shadow-elevated)] sm:p-8 ${config.cardClass}`}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] ${config.badgeClass}`}>
                  <StatusIcon size={15} />
                  {config.label}
                </span>
                <h2 className="mt-6 text-3xl font-semibold text-[var(--text-primary)]">Application Status</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">{config.message}</p>
              </div>
            </div>

            {status === 'pending' && (
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {['Submitted', 'In Review', 'Decision'].map((item, index) => (
                  <div key={item} className="rounded-2xl border border-yellow-500/20 bg-[var(--bg-surface)] p-5">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${index < 2 ? 'bg-yellow-500 text-white' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {index + 1}
                      </span>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5">
                <CalendarClock className="h-6 w-6 text-[var(--accent)]" />
                <p className="mt-4 text-sm text-[var(--text-secondary)]">Submission Date</p>
                <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{formatDate(application.submittedAt)}</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5">
                <Clock3 className="h-6 w-6 text-[var(--accent)]" />
                <p className="mt-4 text-sm text-[var(--text-secondary)]">Review Date</p>
                <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{formatDate(application.reviewedAt)}</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5">
                <MessageSquareText className="h-6 w-6 text-[var(--accent)]" />
                <p className="mt-4 text-sm text-[var(--text-secondary)]">Admin Notes</p>
                <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                  {application.rejectionReason || 'No admin notes yet.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </section>
    </main>
  );
}
