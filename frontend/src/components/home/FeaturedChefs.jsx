import { motion } from 'framer-motion';
import { BadgeCheck, ChefHat, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getFeaturedChefs } from '../../services/chefsApi';

const documentId = (value) => value?.$oid || value || '';

function FeaturedChefs() {
  const { data: chefs = [], isLoading } = useQuery({
    queryKey: ['chefs', 'featured'],
    queryFn: async () => (await getFeaturedChefs()).data.data || []
  });

  return (
    <section className="relative overflow-hidden bg-[var(--bg-muted)] py-24" id="featured-chefs">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-12 max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">
            Discover cooks shaping local food culture
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Meet the local chefs bringing homemade flavor to every neighborhood.
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {isLoading && Array.from({ length: 3 }, (_, index) => <div key={index} className="h-[610px] animate-pulse rounded-[32px] border border-[var(--border)] bg-[var(--bg-surface)]" />)}
          {chefs.map((chef, index) => (
            <motion.article
              key={documentId(chef._id)}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: 'easeOut' }}
              whileHover={{ y: -10, scale: 1.01 }}
              className="group overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)] transition duration-300 hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="relative overflow-hidden">
                {chef.profilePhoto ? <img src={chef.profilePhoto} alt={chef.chefName} loading="lazy" className="h-[340px] w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-[340px] items-center justify-center bg-[var(--accent-soft)] text-[var(--accent)]"><ChefHat className="h-20 w-20" /></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,23,42,0.7)] via-transparent to-transparent" />
              </div>

              <div className="space-y-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="flex items-center gap-2 text-xl font-semibold text-[var(--text-primary)]">{chef.kitchenName}<BadgeCheck className="h-5 w-5 text-blue-500" aria-label="Verified chef" /></h3>
                    <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">{chef.chefName}</p>
                    <p className="mt-2 line-clamp-1 text-sm text-[var(--text-secondary)]">{chef.cuisineSpecialties?.join(' · ') || 'Home cooking'}</p>
                  </div>
                  <span className="rounded-full border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text-secondary)]">{chef.yearsOfExperience} yrs</span>
                </div>

                <p className="line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">{chef.bio || chef.kitchenDescription || 'Discover authentic meals prepared by a verified local HomeBite chef.'}</p>

                <div className="flex items-center justify-between gap-4 text-sm text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-2">
                    <Star size={16} className="text-[var(--accent)]" />
                    {Number(chef.averageRating || 0).toFixed(1)}
                  </span>
                  <span>{chef.completedOrders} completed orders</span>
                </div>

                <Link to={`/chefs/${documentId(chef._id)}`} className="block w-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-center text-sm font-semibold text-[var(--button-text)] shadow-lg shadow-orange-500/20 transition duration-300 hover:brightness-110">View Profile</Link>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="mt-10 text-center"><Link to="/chefs" className="inline-flex rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-7 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-soft)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">View All Chefs</Link></div>
      </div>
    </section>
  );
}

export default FeaturedChefs;
