import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
 
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
 
/**
 * Hero Slider (React + Tailwind + Swiper)
 *  - Mobile  (< 768px): square image
 *  - Desktop (>= 768px): wide banner
 *  - Har 3 second me auto change, pagination neeche golden diamond shape me
 *
 * Images ko `public/banners/` me rakho. Naya banner add karna ho to
 * neeche `SLIDES` me ek aur { mobile, desktop } object daal do.
 *
 * Install:  npm i swiper
 */
 
const SLIDES = [
  {
    mobile: "/banner1mobile.jpg",
    desktop: "/banner1.jpg",
    alt: "PK exquisite gold rings collection",
    href: "/category/ladies-rings-1-100", // optional: click par kahan jaye (hata sakte ho)
  },
  {
    mobile: "/banner2mobile.jpg",
    desktop: "/banner2.jpg",
    alt: "PK exquisite gold rings collection",
    href: "/category/ladies-rings-101-200", // optional: click par kahan jaye (hata sakte ho)
  },

  // { mobile: "/banners/pendant-square.jpg", desktop: "/banners/pendant-wide.jpg", alt: "Pendants", href: "/pendant" },
];
 
export default function HeroSlider({ slides = SLIDES, delay = 2000 }) {
  const multiple = slides.length > 1;
 
  return (
    <section aria-label="Featured collections" className="w-full bg-white">
      {/* Pagination ke diamond bullets (golden) */}
      <style>{`
        .pk-swiper{ padding-bottom: 2.4rem; }
        .pk-swiper .swiper-pagination{ bottom: .55rem; }
        .pk-swiper .swiper-pagination-bullet{
          width: 11px; height: 11px; margin: 0 7px !important; opacity: 1;
          border-radius: 0; background: #e3d3ad;
          clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
          transition: transform .3s ease, background .3s ease;
        }
        .pk-swiper .swiper-pagination-bullet:hover{ background: #d2a94f; }
        .pk-swiper .swiper-pagination-bullet-active{
          background: linear-gradient(135deg, #ffe08a 0%, #c98a10 55%, #8a5200 100%);
          transform: scale(1.55);
        }
        @media (min-width: 768px){
          .pk-swiper{ padding-bottom: 2.8rem; }
          .pk-swiper .swiper-pagination{ bottom: .8rem; }
          .pk-swiper .swiper-pagination-bullet{ width: 13px; height: 13px; margin: 0 8px !important; }
        }
      `}</style>
 
      <Swiper
        className="pk-swiper"
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        speed={800}
        loop={multiple}
        autoplay={
          multiple
            ? { delay, disableOnInteraction: false, pauseOnMouseEnter: true }
            : false
        }
        pagination={multiple ? { clickable: true } : false}
        grabCursor={multiple}
      >
        {slides.map((s, i) => {
          const img = (
            <picture>
              {/* desktop / tablet */}
              <source media="(min-width: 768px)" srcSet={s.desktop} />
              {/* mobile */}
              <img
                src={s.mobile}
                alt={s.alt || ""}
                loading={i === 0 ? "eager" : "lazy"}
                draggable="false"
                className="block aspect-square w-full select-none object-cover md:aspect-[8/3]"
              />
            </picture>
          );
 
          return (
            <SwiperSlide key={i}>
              {s.href ? (
                <Link to={s.href} className="block">
                  {img}
                </Link>
              ) : (
                img
              )}
            </SwiperSlide>
            
          );
        })}
      </Swiper>
    </section>
  );
}
