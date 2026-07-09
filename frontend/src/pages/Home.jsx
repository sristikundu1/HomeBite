import HeroSlider from '../components/home/HeroSlider';
import Categories from '../components/home/Categories';
import PopularMeals from '../components/home/PopularMeals';
import FeaturedChefs from '../components/home/FeaturedChefs';
import HowItWorks from '../components/home/HowItWorks';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';
import AppDownload from '../components/home/AppDownload';
import Newsletter from '../components/home/Newsletter';
import CTA from '../components/home/CTA';

function Home() {
  return (
    <main className="relative overflow-x-hidden">
      <HeroSlider />
      <Categories />
      <PopularMeals />
      <FeaturedChefs />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <AppDownload />
      <Newsletter />
      <CTA />
    </main>
  );
}

export default Home;
