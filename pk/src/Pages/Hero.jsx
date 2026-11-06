import { useState, useContext } from "react";
import { IoDiamondOutline } from "react-icons/io5";
import { RiJewelryFill } from "react-icons/ri";
import { FaIndianRupeeSign, FaPenNib } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import {
  FiMessageSquare,
  FiAward,
  FiCheckCircle,
  FiShield,
  FiGift,
  FiSearch,
  FiChevronDown,
} from "react-icons/fi";
import HeroSlider from "../components/Swiper";
import CategoryGrid from "../SmallComponents/Categorygrid.jsx";
import { Auth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

/* ---------- Config ---------- */
const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // country code ke saath, bina +

const waLink = (p) => {
  const msg = `Hello PK Jewellery, I'm interested in "${p.name}" (SKU: ${p.sku}). Please share the price, material, weight, sizing and availability.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};

const waGeneral = (msg) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

/* ---------- Data ---------- */
const FEATURES = [
  {
    title: "Exclusive Ring Designs",
    text: "Discover traditional and modern rings for every occasion.",
    icon: IoDiamondOutline
  },
  {
    title: "Transparent Pricing",
    text: "Enquire about prices and find your perfect design.",
    icon: FaIndianRupeeSign
  },
  {
    title: "Custom-Made Jewellery",
    text: "Get jewellery crafted to match your style.",
    icon: FaPenNib
  },
  {
    title: "Personalised Assistance",
    text: "Get expert guidance for designs and enquiries.",
    icon: FiMessageSquare
  },
];

const REVIEWS = [
  { name: "Neha S.", city: "Delhi", text: "The ring looks beautiful, and the finishing is really nice." },
  { name: "Rohit K.", city: "Noida", text: "Loved the design. It looks elegant and feels special." },
  { name: "Pooja M.", city: "Saharanpur", text: "Beautiful pendant with a simple and classy design." },
];

const TRUST = [
  { title: "Handpicked Designs", text: "Every piece is selected with care.", icon: FiAward },
  { title: "Easy WhatsApp Enquiry", text: "Quick replies, no long forms.", icon: FaWhatsapp },
  { title: "Custom Orders", text: "Made to match your vision.", icon: FiGift },
  { title: "Quality Finish", text: "Neat finishing on every piece.", icon: FiShield },
];

const STEPS = [
  { title: "Browse Designs", text: "Explore our collections and pick the designs you love.", icon: FiSearch },
  { title: "Enquire on WhatsApp", text: "Tap the button on any product to get price, weight and availability.", icon: FaWhatsapp },
  { title: "Confirm Your Order", text: "Finalise your design, size and details with our team.", icon: FiCheckCircle },
];

const FAQS = [
  { q: "How do I get the price of a design?", a: "Tap 'Enquire on WhatsApp' on any product. Our team will share the price, material, weight and availability right away." },
  { q: "Can I get a custom-made ring?", a: "Yes. Share your idea or a reference photo on WhatsApp and we will help you create a piece that matches your style and budget." },
  { q: "Do you help with ring sizing?", a: "Absolutely. Message us and we will guide you to find the right size before you order." },
];

/* ---------- Sections ---------- */
function SectionHead({ title, sub, action }) {
  return (
    <div className="mb-8 flex flex-col items-center gap-2 text-center sm:mb-10">
      <h2 className="font-[Fraunces,serif] text-2xl font-normal text-gray-900 [font-optical-sizing:auto] sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {sub && <p className="max-w-xl font-[Fraunces,serif] text-[15px] font-light text-gray-600 sm:text-base">{sub}</p>}
      {action}
    </div>
  );
}

function TrustStrip() {
  return (
    <section className="border-y border-[#efe6d2] bg-[#fdf8ee]">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
        {TRUST.map((t) => {
          const Icon = t.icon;
          return (
            <li key={t.title} className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-[#8a5200] shadow-sm">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[14px] font-medium text-gray-900">{t.title}</p>
                <p className="text-[12.5px] leading-5 text-gray-500">{t.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}



function ProductCard({ p }) {
  const navigate = useNavigate();

  const primary = p.images?.find((i) => i.isPrimary) || p.images?.[0];
  const secondary = p.images?.find((i) => i.url !== primary?.url);

  const href = `/product/${encodeURIComponent(p.sku)}/${p._id}`;

  return (
    <article
      onClick={() => navigate(href)}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          navigate(href);
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`View ${p.name}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#efe6d2] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b8760a]"
    >
      <div className="relative block aspect-square overflow-hidden bg-gradient-to-br from-[#fbf1dc] to-[#f1dfb8]">
        {primary ? (
          <>
            <img
              src={primary.url}
              alt={primary.alt || p.name}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${
                secondary
                  ? "group-hover:opacity-0"
                  : "group-hover:scale-105"
              }`}
            />

            {secondary && (
              <img
                src={secondary.url}
                alt={secondary.alt || p.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <span className="grid h-full w-full place-items-center text-[#b8760a]/60">
            <RiJewelryFill className="h-16 w-16" />
          </span>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-[#7a0a10] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#fbe9c2]">
          Bestseller
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-5 pt-4 text-center">
        <h3 className="font-[Fraunces,serif] text-[16px] font-normal text-gray-900 transition group-hover:text-[#8a5200] sm:text-lg">
          {p.name}
        </h3>

        <p className="mt-1 text-[12px] uppercase tracking-widest text-gray-400">
          {p.sku}
        </p>

        <a
          href={waLink(p)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#7a0a10] px-5 py-2.5 text-[14px] font-medium text-[#fbe9c2] transition hover:bg-[#4a0006] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8760a] focus-visible:ring-offset-2"
        >
          <FaWhatsapp className="h-4 w-4" />
          Enquire on WhatsApp
        </a>
      </div>
    </article>
  );
}

function Bestsellers({ products }) {
  if (!products?.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <SectionHead title="Bestsellers" sub="Our most loved designs, chosen by our customers." />
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
        {products.map((p) => <ProductCard key={p._id} p={p} />)}
      </div>
      <div className="mt-10 text-center">
        <Link
          to="/category/all-jewellery"
          className="inline-block rounded-full border border-[#7a0a10] px-8 py-3 text-[15px] font-medium text-[#7a0a10] transition hover:bg-[#7a0a10] hover:text-[#fbe9c2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8760a] focus-visible:ring-offset-2"
        >
          View all jewellery
        </Link>
      </div>
    </section>
  );
}

function WeddingBanner() {
  return (
    <section className="bg-gradient-to-br from-[#4a0006] via-[#7a0a10] to-[#4a0006]">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-2 lg:px-8">
        <div className="text-center md:text-left">
          <h2 className="font-[Fraunces,serif] text-3xl font-normal text-[#fbe9c2] [font-optical-sizing:auto] sm:text-4xl lg:text-5xl">
            Made for Your Forever
          </h2>
          <p className="mx-auto mt-4 max-w-md font-[Fraunces,serif] text-base font-light text-[#fbe9c2]/80 md:mx-0">
            Celebrate love, commitment, and timeless traditions with exquisite wedding jewellery by PK Jewellery.
          </p>
          <Link
            to="/category/wedding"
            className="mt-7 inline-block rounded-full bg-[#fbe9c2] px-8 py-3 text-[15px] font-semibold text-[#4a0006] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#4a0006]"
          >
            Shop wedding collection
          </Link>
        </div>
        <div className="mx-auto grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-2xl border border-[#fbe9c2]/30 bg-white/5 text-[#fbe9c2]/70">
          <img
            src="https://buket-pk-website.s3.us-east-1.amazonaws.com/home/Opulent+Indian+Wedding+Gold+Rings.jpg"
            alt="Wedding gold rings"
            className="h-full w-full object-cover"
            draggable="false"
          />
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <SectionHead
        title="How It Works"
        sub="From browsing to your final order in three simple steps."
      />
      <ol className="grid gap-8 md:grid-cols-3">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <li
              key={s.title}
              className="relative rounded-2xl border border-[#efe6d2] bg-white px-6 pb-8 pt-10 text-center transition hover:shadow-lg"
            >
              <span className="absolute -top-4 left-1/2 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full bg-[#7a0a10] text-sm font-semibold text-[#fbe9c2]">
                {i + 1}
              </span>
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#fbf1dc] text-[#8a5200]">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-[Fraunces,serif] text-lg text-gray-900">{s.title}</h3>
              <p className="mx-auto mt-1 max-w-[18rem] text-[14px] leading-6 text-gray-600">{s.text}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <SectionHead title="More Than Just Jewellery" />
      <ul className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <li key={f.title} className="flex flex-col items-center text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[#fbf1dc] text-[#8a5200]">
                <Icon size={27} strokeWidth={1.6} />
              </span>
              <h3 className="mt-4 font-[Fraunces,serif] text-lg text-gray-900">{f.title}</h3>
              <p className="mt-1 max-w-[16rem] text-[14px] leading-6 text-gray-600">{f.text}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function CustomBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fbf1dc] via-[#f6e6c3] to-[#f1dfb8] px-6 py-12 text-center sm:px-12 sm:py-16">
        <FaPenNib className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 rotate-12 text-[#b8760a]/10" />
        <h2 className="font-[Fraunces,serif] text-2xl font-normal text-gray-900 [font-optical-sizing:auto] sm:text-3xl lg:text-4xl">
          Have a Design in Mind?
        </h2>
        <p className="mx-auto mt-3 max-w-xl font-[Fraunces,serif] text-[15px] font-light text-gray-700 sm:text-base">
          Share a sketch or reference photo and we will craft a ring made just for you.
        </p>
        <a
          href={waGeneral("Hello PK Jewellery, I would like to get a custom jewellery made. Please guide me.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#7a0a10] px-8 py-3 text-[15px] font-medium text-[#fbe9c2] transition hover:bg-[#4a0006] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8760a] focus-visible:ring-offset-2"
        >
          <FaWhatsapp className="h-5 w-5" />
          Start a Custom Order
        </a>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="bg-[#fdf8ee]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <SectionHead title="Words of Appreciation" />
        <div className="grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="rounded-xl border border-[#efe6d2] bg-white p-6">
              <div className="flex gap-0.5 text-[#b8760a]" role="img" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.8l2.8 6 6.5.7-4.9 4.4 1.4 6.4L12 17l-5.8 3.3 1.4-6.4L2.7 9.5l6.5-.7z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mt-4 font-[Fraunces,serif] text-[16px] font-light leading-relaxed text-gray-800">
                {r.text}
              </blockquote>
              <figcaption className="mt-5 text-sm text-gray-500">
                <span className="font-medium text-gray-900">{r.name}</span>, {r.city}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <SectionHead title="Frequently Asked Questions" />
      <div className="divide-y divide-[#efe6d2] rounded-2xl border border-[#efe6d2] bg-white">
        {FAQS.map((f) => (
          <details key={f.q} className="group px-5 py-4 sm:px-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-[Fraunces,serif] text-[16px] text-gray-900 [&::-webkit-details-marker]:hidden">
              {f.q}
              <FiChevronDown className="h-5 w-5 shrink-0 text-[#8a5200] transition duration-300 group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-[14.5px] leading-7 text-gray-600">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: yaha apni API call lagao
    setDone(true);
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20">
      <SectionHead
        title="Be the First to Discover Our New Designs"
        sub="Subscribe with your email to receive updates on our latest collections, exclusive offers, and newest arrivals straight to your inbox."
      />
      {done ? (
        <p role="status" className="font-[Fraunces,serif] text-lg text-[#7a0a10]">
          Thank You for Subscribing!
        </p>
      ) : (
        <form
          onSubmit={submit}
          className="mx-auto flex w-full max-w-md flex-col gap-3 sm:max-w-lg sm:flex-row sm:gap-2"
        >
          <label htmlFor="pk-news-email" className="sr-only">Email address</label>
          <input
            id="pk-news-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            autoComplete="email"
            className="h-12 w-full rounded-full border border-[#e4d8c0] bg-white px-5 text-center text-base outline-none transition placeholder:text-gray-400 focus:border-[#b8760a] focus:shadow-md sm:min-w-0 sm:flex-1 sm:text-left"
          />
          <button
            type="submit"
            className="h-12 w-full rounded-full bg-[#7a0a10] px-7 text-[15px] font-medium text-[#fbe9c2] transition hover:bg-[#4a0006] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8760a] focus-visible:ring-offset-2 sm:w-auto sm:shrink-0"
          >
            Subscribe
          </button>
        </form>
      )}
    </section>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={waGeneral("Hello PK Jewellery, I would like to know more about your collection.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
    >
      <FaWhatsapp className="h-7 w-7" />
    </a>
  );
}

/* ---------- Page ---------- */
const Home = () => {
  const { productsHome } = useContext(Auth);

  return (
    <main className="w-full overflow-x-hidden">
      <HeroSlider />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl pb-2 pt-10 text-center sm:pt-14 lg:pt-16">
          <h1 className="font-[Fraunces,serif] text-3xl font-normal text-gray-900 [font-optical-sizing:auto] sm:text-4xl lg:text-5xl">
            PK Collections
          </h1>
          <p className="mt-3 font-[Fraunces,serif] text-base font-extralight text-gray-700 [font-optical-sizing:auto] sm:text-lg">
            Discover our latest collection of exquisite jewelry.
          </p>
        </header>
        <CategoryGrid />
      </div>

      <TrustStrip />
      <Bestsellers products={productsHome} />
       <HowItWorks />
      <WeddingBanner />
     
      <Features />
      <CustomBanner />
      <Reviews />
      <FAQ />
      <Newsletter />
      <FloatingWhatsApp />
    </main>
  );
};

export default Home;
