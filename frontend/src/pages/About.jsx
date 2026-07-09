import AboutHero from '../components/about/AboutHero';
import OurStory from '../components/about/OurStory';
import MissionVision from '../components/about/MissionVision';
import Statistics from '../components/about/Statistics';
import WhyHomeBite from '../components/about/WhyHomeBite';
import MeetChefs from '../components/about/MeetChefs';
import CommunityImpact from '../components/about/CommunityImpact';
import FAQ from '../components/about/FAQ';
import CTASection from '../components/about/CTASection';

export default function About() {
  return (
    <main className="relative overflow-x-hidden bg-[var(--bg-page)]">
      <AboutHero />
      <OurStory />
      <MissionVision />
      <Statistics />
      <WhyHomeBite />
      <MeetChefs />
      <CommunityImpact />
      <FAQ />
      <CTASection />
    </main>
  );
}
