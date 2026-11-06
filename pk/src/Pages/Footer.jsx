
import logo from "/pk-logo.png";
import qr from "/pk-qr.png";
import { Link } from "react-router-dom";

const PHONE_DISPLAY = "+91 9897547808";
const PHONE_TEL = "+919897547808";
const WHATSAPP = "https://wa.me/919897547808";

// All Main Categories
const mainCategories = [
  { label: "All Jewellery", slug: "all-jewellery" },
  { label: "Mens Ring", slug: "mens-ring" },
  { label: "Ladies Ring", slug: "ladies-ring" },
  { label: "Boys Earring", slug: "boys-earring" },
  { label: "Pendant", slug: "pendant" },
  { label: "Wedding", slug: "wedding" },
];

// Ladies Ring Subcategories
const ladiesRingCategories = [
  { label: "Ladies Rings 1-100", slug: "ladies-rings-1-100" },
  { label: "Ladies Rings 101-200", slug: "ladies-rings-101-200" },
  { label: "Ladies Rings 201-300", slug: "ladies-rings-201-300" },
  { label: "Ladies Rings 301-400", slug: "ladies-rings-301-400" },
  { label: "Ladies Rings 401-500", slug: "ladies-rings-401-500" },
  { label: "Ladies Rings 501-600", slug: "ladies-rings-501-600" },
  { label: "Ladies Rings 601-700", slug: "ladies-rings-601-700" },
  { label: "Ladies Rings 701-800", slug: "ladies-rings-701-800" },
  { label: "Ladies Rings 801-900", slug: "ladies-rings-801-900" },
  { label: "Ladies Rings 4 x 4 Collage", slug: "ladies-rings-4x4-collage" },
];

const legalLinks = [
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Notice", href: "#" },
  { label: "Disclaimer", href: "#" },
];

const icon = {
  whatsapp: (
    <>
      <path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.6z" />
      <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17" cy="7" r=".6" />
    </>
  ),
  facebook: (
    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />
  ),
  youtube: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="M10 9.5v5l4.5-2.5z" />
    </>
  ),
};

function IconLink({ href, label, name }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full border border-[#c8923a]/35 text-[#f3e6d3] transition-colors hover:bg-[#c8923a] hover:text-[#2e0508] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8923a]"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-[19px] fill-none stroke-current stroke-[1.6]"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {icon[name]}
      </svg>
    </a>
  );
}

// Reusable Category Link Component
function LinkList({ title, links }) {
  return (
    <section>
      <h3 className="mb-4 font-[Cormorant_Garamond,Georgia,serif] text-2xl font-semibold text-[#f3e6d3]">
        {title}
      </h3>

      <ul className="grid gap-2.5">
        {links.map((item) => (
          <li key={item.slug}>
            <Link
              to={`/category/${item.slug}`}
              className="text-[14px] text-[#f3e6d3] transition-colors hover:text-[#c8923a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8923a]"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Footer({ notchColor = "#ffffff" }) {
  return (
    <footer className="relative bg-[#2e0508] px-6 pb-6 pt-16 font-[Jost,Arial,sans-serif] text-[#f3e6d3] md:px-12 md:pt-[72px]">

      {/* Top Notch */}
      <div
        aria-hidden="true"
        style={{ backgroundColor: notchColor }}
        className="absolute -top-px left-1/2 h-[26px] w-[120px] -translate-x-1/2 [clip-path:polygon(0_0,100%_0,50%_100%)]"
      />

      {/* Main Footer */}
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_0.85fr_1.2fr_1fr]">

        {/* Logo + QR */}
        <section>
          <img
            src={logo}
            alt="PK Jewellery"
            className="h-auto w-[120px]"
          />

          <h3 className="mt-6 font-[Cormorant_Garamond,Georgia,serif] text-2xl font-semibold">
            Scan to connect
          </h3>

          <img
            src={qr}
            alt="PK Jewellery QR code"
            className="my-3 size-[168px] rounded-lg bg-white p-1.5"
          />

          <p className="max-w-[200px] text-sm text-[#c9b3a6]">
            Open your phone camera and point it at the code.
          </p>
        </section>

        {/* Main Categories */}
        <LinkList
          title="Categories"
          links={mainCategories}
        />

        {/* Ladies Ring Collections */}
        <LinkList
          title="Ladies Ring Collections"
          links={ladiesRingCategories}
        />

        {/* Contact */}
        <section>
          <h3 className="mb-4 font-[Cormorant_Garamond,Georgia,serif] text-2xl font-semibold">
            Contact Us
          </h3>

          <a
            href={`tel:${PHONE_TEL}`}
            className="mb-5 inline-block text-lg font-medium transition-colors hover:text-[#c8923a]"
          >
            {PHONE_DISPLAY}
          </a>

          <div className="mb-4 w-36 border-t border-[#c8923a]/35" />

          <h3 className="mb-4 font-[Cormorant_Garamond,Georgia,serif] text-2xl font-semibold">
            Chat With Us
          </h3>

          <div className="flex gap-3.5">
            <IconLink
              href={WHATSAPP}
              label="WhatsApp"
              name="whatsapp"
            />

            <IconLink
              href="mailto:"
              label="Email"
              name="mail"
            />

            <IconLink
              href={`tel:${PHONE_TEL}`}
              label="Call"
              name="phone"
            />
          </div>
        </section>
      </div>

      {/* Social */}
      <div className="mx-auto mt-11 flex max-w-[1200px] flex-wrap items-center gap-5 border-t border-[#c8923a]/35 pt-5">
        <h3 className="font-[Cormorant_Garamond,Georgia,serif] text-2xl font-semibold">
          Social
        </h3>

        <div className="flex gap-3.5">
          <IconLink href="#" label="Instagram" name="instagram" />
          <IconLink href="#" label="Facebook" name="facebook" />
          <IconLink href="#" label="YouTube" name="youtube" />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mx-auto mt-5 flex max-w-[1200px] flex-wrap justify-between gap-4 border-t border-[#c8923a]/35 pt-5 text-[13px] text-[#c9b3a6]">

        <span>
          © 2026 PK Jewellery. All Rights Reserved.
        </span>

        <nav className="flex flex-wrap gap-4">
          {legalLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-[#c8923a]"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

    </footer>
  );
}
