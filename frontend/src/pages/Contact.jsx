import { Toaster } from 'react-hot-toast';
import BusinessHours from '../components/contact/BusinessHours';
import ContactFAQ from '../components/contact/ContactFAQ';
import ContactForm from '../components/contact/ContactForm';
import ContactHero from '../components/contact/ContactHero';
import ContactInfo from '../components/contact/ContactInfo';
import MapPlaceholder from '../components/contact/MapPlaceholder';
import SocialLinks from '../components/contact/SocialLinks';

export default function Contact() {
  return (
    <main className="relative overflow-x-hidden bg-[var(--bg-page)]">
      <ContactHero />
      <section className="bg-[var(--bg-page)] py-20 sm:py-24 lg:py-[140px]">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <ContactForm />
          <div className="grid gap-8">
            <ContactInfo />
            <BusinessHours />
          </div>
        </div>
      </section>
      <MapPlaceholder />
      <ContactFAQ />
      <SocialLinks />
      <Toaster position="top-right" />
    </main>
  );
}
