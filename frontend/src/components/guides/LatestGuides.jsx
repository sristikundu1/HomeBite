import GuideCard from './GuideCard';
import { latestGuides } from './guidesData';

export default function LatestGuides() {
  return (
    <section className="bg-[var(--bg-page)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Latest Guides</span>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-5xl">
            Fresh from the HomeBite kitchen.
          </h2>
        </div>
        <div className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {latestGuides.map((guide, index) => (
            <GuideCard key={guide.id} guide={guide} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
