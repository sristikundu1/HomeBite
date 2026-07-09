import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Sarah Johnson',
    rating: 5,
    quote: 'Amazing homemade meals with incredible taste and quality.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    name: 'Michael Brown',
    rating: 5,
    quote: 'Feels like eating food made at home every day.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    name: 'Emily Davis',
    rating: 5,
    quote: 'Fresh ingredients and trusted local cooks. Highly recommended.',
    image: 'https://randomuser.me/api/portraits/women/65.jpg'
  },
  {
    name: 'David Wilson',
    rating: 5,
    quote: 'Delivery was fast and the meals tasted incredible.',
    image: 'https://randomuser.me/api/portraits/men/54.jpg'
  },
  {
    name: 'Sophia Miller',
    rating: 5,
    quote: 'A wonderful way to enjoy local homemade food.',
    image: 'https://randomuser.me/api/portraits/women/28.jpg'
  }
];

function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-[var(--bg-muted)] py-[80px] md:py-[140px]" id="testimonials">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">
            Real reviews from our community
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Thousands of people are discovering authentic homemade meals from trusted local chefs.
          </h2>
          <p className="mt-4 text-base text-[var(--text-secondary)] sm:text-lg">
            Hear how HomeBite is making every dinner feel personal, warm, and memorable.
          </p>
        </motion.div>

        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={3}
          spaceBetween={30}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="pb-14"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={testimonial.name}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -8, scale: 1.03, boxShadow: '0 25px 70px rgba(15, 23, 42, 0.18)' }}
                className="rounded-[28px] border border-[var(--border)] bg-[var(--bg-surface)]/85 p-7 shadow-[var(--shadow-soft)] backdrop-blur-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-[60px] w-[60px] rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">{testimonial.name}</h3>
                    <div className="mt-1 flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                        <Star key={starIndex} size={16} className="fill-orange-400 text-orange-400" />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-base leading-8 text-[var(--text-secondary)]">“{testimonial.quote}”</p>

                <div className="mt-6 flex justify-end">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Star size={18} />
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default Testimonials;
