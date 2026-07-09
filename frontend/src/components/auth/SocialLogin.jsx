import { motion } from 'framer-motion';
import { GitBranch, Globe2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const socialProviders = [
  {
    label: 'Google',
    icon: Globe2,
    style:
      'border border-[var(--border)] bg-white text-slate-900 shadow-sm hover:shadow-slate-400/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:shadow-black/20'
  },
  {
    label: 'GitHub',
    icon: GitBranch,
    style:
      'border border-transparent bg-slate-950 text-white shadow-lg shadow-slate-900/20 hover:shadow-slate-900/25 dark:bg-slate-800 dark:hover:shadow-black/25'
  }
];

export default function SocialLogin() {
  const handleProviderClick = (provider) => {
    toast(`Continue with ${provider} is not implemented yet.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="grid gap-3"
    >
      {socialProviders.map((provider) => {
        const Icon = provider.icon;

        return (
          <motion.button
            key={provider.label}
            type="button"
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleProviderClick(provider.label)}
            className={`${provider.style} inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl px-4 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 hover:shadow-lg`}
          >
            <motion.span whileHover={{ scale: 1.08, rotate: -3 }} className="inline-flex">
              <Icon className="h-6 w-6" />
            </motion.span>
            Continue with {provider.label}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
