import GuideCard from './GuideCard';
import { popularRecipes } from './guidesData';

export default function PopularRecipes() {
  return (
    <section className="bg-[var(--bg-muted)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Popular Recipes</span>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-5xl">
            Recipes readers keep coming back to.
          </h2>
        </div>
        <div className="mt-12 grid gap-7 lg:grid-cols-3">
          {popularRecipes.map((guide, index) => (
            <GuideCard key={guide.id} guide={guide} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
