import CookingTips from '../components/guides/CookingTips';
import FeaturedGuide from '../components/guides/FeaturedGuide';
import GuideCategories from '../components/guides/GuideCategories';
import GuidesHero from '../components/guides/GuidesHero';
import GuidesNewsletter from '../components/guides/GuidesNewsletter';
import LatestGuides from '../components/guides/LatestGuides';
import PopularRecipes from '../components/guides/PopularRecipes';

export default function CookingGuides() {
  return (
    <main className="relative overflow-x-hidden bg-[var(--bg-page)]">
      <GuidesHero />
      <FeaturedGuide />
      <GuideCategories />
      <LatestGuides />
      <PopularRecipes />
      <CookingTips />
      <GuidesNewsletter />
    </main>
  );
}
