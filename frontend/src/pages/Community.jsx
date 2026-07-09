import CommunityHero from '../components/community/CommunityHero';
import CommunityNewsletter from '../components/community/CommunityNewsletter';
import CommunityStats from '../components/community/CommunityStats';
import CommunityStories from '../components/community/CommunityStories';
import FeaturedHomeChefs from '../components/community/FeaturedHomeChefs';
import JoinCommunityCTA from '../components/community/JoinCommunityCTA';
import PhotoGallery from '../components/community/PhotoGallery';
import UpcomingEvents from '../components/community/UpcomingEvents';

export default function Community() {
  return (
    <main className="relative overflow-x-hidden bg-[var(--bg-page)]">
      <CommunityHero />
      <CommunityStats />
      <FeaturedHomeChefs />
      <CommunityStories />
      <UpcomingEvents />
      <PhotoGallery />
      <JoinCommunityCTA />
      <CommunityNewsletter />
    </main>
  );
}
