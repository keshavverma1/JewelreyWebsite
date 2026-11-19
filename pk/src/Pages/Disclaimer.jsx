import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const LOGO = "http://localhost:5173/pk-logo.png";
const GOLD = "#d4a64a";
const MAROON = "rgb(90, 2, 9)";

const SECTIONS = [
  {
    title: "Product Images & Designs",
    paras: [
      "The jewellery images shown on the website may be actual photographs or digital images that represent a design. The colour, size, texture, finish and other features of the actual product may differ from the images.",
    ],
  },
  {
    title: "Product Information",
    paras: [
      "We try to keep the product information on the website accurate and up to date. However, it is advisable to confirm the final features and availability of any product by contacting PK Jewels directly.",
    ],
  },
  {
    title: "Price & Availability",
    paras: [
      "At present, product prices are not displayed on the website. Customers can send an Enquiry for the price, availability and other information. The final price will be confirmed by PK Jewels.",
    ],
  },
  {
    title: "Enquiry & Purchase",
    paras: [
      "Sending an Enquiry on the website will not be treated as a purchase of a product or confirmation of an order. At present, the website does not offer direct online ordering or payment.",
    ],
  },
  {
    title: "External Websites & Links",
    paras: [
      "PK Jewels will not be responsible for the content, services or privacy policies of any external links or third-party websites that may be provided on our website in the future.",
    ],
  },
  {
    title: "Technical Issues",
    paras: [
      "We try to keep the website running smoothly. However, the services of the website may be temporarily affected by technical problems, server issues or internet connectivity.",
    ],
  },
  {
    title: "Copyright & Design Rights",
    paras: [
      "Copying, distributing or using the logos, images, designs and other content on the website commercially without permission is prohibited.",
    ],
  },
  {
    title: "Changes to this Disclaimer",
    paras: [
      "PK Jewels reserves the right to change or update this Disclaimer as required. Any changes will be published on this page.",
    ],
  },
];

export default function Disclaimer() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#fbf6ea]">
      {/* Hero / header */}
      <header
        className="relative overflow-hidden px-5 pb-14 pt-8 text-center"
        style={{ backgroundColor: MAROON }}
      >
        {/* Watermark logo */}
        <img
          src={LOGO}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-10 w-72 select-none"
          style={{
            filter: "invert(1) hue-rotate(180deg)",
            mixBlendMode: "screen",
            opacity: 0.08,
          }}
        />

        <div className="relative mx-auto max-w-3xl">
          <div className="mb-8 flex items-center justify-between">
            <Link
              to="/"
              className="rounded-full border border-white/25 px-4 py-1.5 text-sm text-white/85 transition hover:bg-white/10"
            >
              ← Back to site
            </Link>
          </div>

          <Link
            to="/"
            aria-label="PK Jewels home"
            className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white p-2.5"
            style={{
              boxShadow: `0 0 0 3px ${GOLD}, 0 0 28px rgba(212,166,74,0.5)`,
            }}
          >
            <img src={LOGO} alt="PK Jewels" className="h-full w-full object-contain" />
          </Link>

          <h1 className="text-3xl font-semibold tracking-wide text-white sm:text-4xl">
            Disclaimer
          </h1>
          <p className="mt-1 text-sm text-white/70">PK Jewels</p>

          <div
            className="mx-auto mt-6 h-px w-48"
            style={{
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            }}
          />
          <p className="mt-4 text-sm" style={{ color: GOLD }}>
            Last updated: November 2026
          </p>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto -mt-6 max-w-6xl px-4 pb-16 lg:grid lg:grid-cols-[250px_1fr] lg:gap-8">
        {/* Index (desktop) */}
        <nav
          aria-label="Sections"
          className="sticky top-6 mt-10 hidden h-fit rounded-2xl border border-[#e8d9b5] bg-white p-4 lg:block"
        >
          <p className="mb-2 text-sm font-semibold" style={{ color: MAROON }}>
            Contents
          </p>
          <ol className="space-y-1.5 text-[13px] leading-snug">
            {SECTIONS.map((s, i) => (
              <li key={s.title}>
                <a
                  href={`#sec-${i + 1}`}
                  className="flex gap-2 rounded-md px-1.5 py-1 text-[#5b4a42] transition hover:bg-[#fbf1dc] hover:text-[#8a1c1c]"
                >
                  <span className="shrink-0 text-[#b5892f]">{i + 1}.</span>
                  <span>{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-6 lg:mt-10">
          <div className="rounded-2xl border border-[#e8d9b5] bg-white p-5 sm:p-8">
            <p className="text-[15px] leading-7 text-[#3d2f2a]">
              All the information, images and designs available on the PK Jewels website
              are presented to introduce customers to the various jewellery options and
              to provide information.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            {SECTIONS.map((s, i) => (
              <section
                key={s.title}
                id={`sec-${i + 1}`}
                className="scroll-mt-6 rounded-2xl border border-[#e8d9b5] bg-white p-5 sm:p-8"
                style={{ borderLeft: `4px solid ${GOLD}` }}
              >
                <h2 className="mb-3 text-lg font-semibold" style={{ color: MAROON }}>
                  {i + 1}. {s.title}
                </h2>
                {s.paras.map((p) => (
                  <p key={p} className="mb-3 text-[15px] leading-7 text-[#3d2f2a] last:mb-0">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {/* Important notice */}
          <div
            className="mt-5 rounded-2xl border-2 bg-[#fff8e6] p-5 sm:p-8"
            style={{ borderColor: GOLD }}
            role="note"
          >
            <h2 className="mb-2 text-lg font-semibold" style={{ color: MAROON }}>
              Important Notice
            </h2>
            <p className="text-[15px] leading-7 text-[#3d2f2a]">
              The information and designs on the PK Jewels website are for the convenience
              and reference of customers. Before making any purchase, please confirm the
              actual product details, price and availability.
            </p>
          </div>

          {/* Closing footer */}
          <div
            className="mt-6 rounded-2xl px-6 py-7 text-center"
            style={{ backgroundColor: MAROON }}
          >
            <p className="text-[15px] leading-7 text-white">
              PK Jewels – a collection of your favourite jewellery designs.
            </p>
            <Link
              to="/"
              className="mt-4 inline-block rounded-full px-6 py-2 text-sm font-semibold text-[#5a0209] transition hover:brightness-110"
              style={{ background: `linear-gradient(135deg, #f0cf85, ${GOLD})` }}
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
