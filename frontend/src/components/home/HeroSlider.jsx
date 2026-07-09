import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { ChevronLeft, ChevronRight, Package, Star, Truck, User } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'Authentic Home Meals',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 2,
    title: 'Healthy Homemade Food',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 3,
    title: 'Fresh Chef Creations',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 4,
    title: 'Premium Local Dishes',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 5,
    title: 'Delicious Desserts',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1600&q=80'
  }
];

function HeroSlider() {
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setCurrentSlide(0);
  }, []);

  const nextSlide = () => {
    swiperRef.current?.slideNext();
  };

  const prevSlide = () => {
    swiperRef.current?.slidePrev();
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 h-[550px] sm:h-[650px] xl:h-[750px]">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          slidesPerView={1}
          loop={true}
          effect="fade"
          speed={800}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation={false}
          pagination={{ clickable: true }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
          className="h-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="h-full">
              <div className="relative h-full w-full">
                <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/80" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[550px] max-w-[1400px] flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-18 xl:h-[750px] xl:py-0">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="space-y-10"
        >
          <div className="mx-auto inline-flex rounded-full border border-[var(--border)] bg-[var(--bg-panel)]/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--accent)] shadow-lg shadow-black/10 backdrop-blur-xl">
            Fresh meals from trusted local chefs
          </div>

          <div className="space-y-6">
            <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Discover Authentic Home-Cooked Meals Near You
            </h1>
            <p className="mx-auto max-w-2xl text-base text-slate-200 sm:text-lg md:text-xl">
              Enjoy fresh homemade meals crafted by trusted local chefs in your community.
            </p>
          </div>

          <div className="mx-auto flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.03 }}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-300/50"
            >
              Order Meals
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-panel)]/90 px-8 py-3 text-sm font-semibold text-[var(--text-primary)] transition duration-300 hover:border-[var(--accent)] hover:bg-[var(--bg-panel)] focus:outline-none focus:ring-2 focus:ring-orange-300/30"
            >
              Become a Cook
            </motion.button>
          </div>

          <div className="mx-auto w-full max-w-[850px] rounded-full border border-[var(--border)] bg-[var(--bg-panel)] p-3 shadow-[var(--shadow-soft)] backdrop-blur-2xl md:p-4 md:h-[75px]">
            <div className="flex h-full flex-col gap-3 rounded-full bg-[var(--bg-panel)]/95 p-2 md:flex-row md:items-center md:gap-3">
              <div className="flex-1 rounded-full border border-[var(--border)] bg-[var(--bg-surface)]/80 px-4 py-3 text-left text-sm text-[var(--text-primary)] shadow-inner shadow-black/10 md:px-5 md:py-4">
                <label className="mb-1 block text-[10px] uppercase tracking-[0.35em] text-[var(--text-secondary)]">Location</label>
                <input
                  type="text"
                  placeholder="City or neighborhood"
                  className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder-theme focus:outline-none"
                />
              </div>
              <div className="flex-1 rounded-full border border-[var(--border)] bg-[var(--bg-surface)]/80 px-4 py-3 text-left text-sm text-[var(--text-primary)] shadow-inner shadow-black/10 md:px-5 md:py-4">
                <label className="mb-1 block text-[10px] uppercase tracking-[0.35em] text-[var(--text-secondary)]">Search meals</label>
                <input
                  type="text"
                  placeholder="Search breakfast, curry, desserts..."
                  className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder-theme focus:outline-none"
                />
              </div>
              <button className="w-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-semibold text-[var(--button-text)] transition duration-300 hover:scale-[1.02] md:w-auto md:px-8 md:py-4">
                Search
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-panel)] text-[var(--text-primary)] shadow-lg shadow-black/25 transition duration-300 hover:scale-105 hover:bg-[var(--bg-surface)] focus:outline-none focus:ring-2 focus:ring-orange-300/40 md:left-8"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-panel)] text-[var(--text-primary)] shadow-lg shadow-black/25 transition duration-300 hover:scale-105 hover:bg-[var(--bg-surface)] focus:outline-none focus:ring-2 focus:ring-orange-300/40 md:right-8"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      <div className="pointer-events-none absolute inset-x-0 top-24 hidden md:block">
        <div className="mx-auto flex max-w-[1400px] justify-between px-4 md:px-6 lg:px-8">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="max-w-[200px] rounded-3xl border border-[var(--border)] bg-[var(--bg-panel)] p-4 text-left shadow-[var(--shadow-soft)] backdrop-blur-xl"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-100">Top Rated</div>
            <div className="mt-3 text-3xl font-semibold text-white">4.9+</div>
            <p className="mt-2 text-sm text-slate-200">Customer rating</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-slate-100">
              <Star size={14} className="text-orange-300" /> Trusted by locals
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            className="max-w-[180px] rounded-3xl border border-[var(--border)] bg-[var(--bg-panel)] p-4 text-left shadow-[var(--shadow-soft)] backdrop-blur-xl"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-100">Quick delivery</div>
            <div className="mt-3 text-3xl font-semibold text-white">30 mins</div>
            <p className="mt-2 text-sm text-slate-200">From local kitchens</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-slate-100">
              <Truck size={14} className="text-orange-300" /> Fresh every time
            </div>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-14 hidden md:block">
        <div className="mx-auto flex max-w-[1400px] justify-between px-4 md:px-6 lg:px-8">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
            className="max-w-[200px] rounded-3xl border border-[var(--border)] bg-[var(--bg-panel)] p-4 text-left shadow-[var(--shadow-soft)] backdrop-blur-xl"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-100">Chef spotlight</div>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-100">
                <User size={20} />
              </div>
              <div>
                <div className="text-lg font-semibold text-white">Chef Lina</div>
                <p className="text-sm text-slate-300">Homestyle expert</p>
              </div>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-slate-100">
              <Package size={14} className="text-orange-300" /> 320+ orders
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="max-w-[180px] rounded-3xl border border-[var(--border)] bg-[var(--bg-panel)] p-4 text-left shadow-[var(--shadow-soft)] backdrop-blur-xl"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-100">Order count</div>
            <div className="mt-3 text-3xl font-semibold text-white">1.2K+</div>
            <p className="mt-2 text-sm text-slate-200">Meals ordered this week</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-slate-100">
              <Star size={14} className="text-orange-300" /> Local favorites
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSlider;
