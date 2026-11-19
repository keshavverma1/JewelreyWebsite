import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const LOGO = "http://localhost:5173/pk-logo.png";
const GOLD = "#d4a64a";
const MAROON = "rgb(90, 2, 9)";

const SECTIONS = [
  {
    title: "Use of the Website",
    paras: [
      "PK Jewels is an online platform where customers can browse jewellery designs and collections, create an account, save favourite designs to their Wishlist, and send an Enquiry for product information.",
    ],
  },
  {
    title: "User Accounts & Security",
    paras: [
      "Customers can create an account and log in on the website. It is necessary to provide accurate and valid information during registration. The customer is responsible for keeping their account and login password confidential. Please notify us if you become aware of any unauthorised activity on your account.",
    ],
  },
  {
    title: "Product Information & Images",
    paras: [
      "The website may contain actual photographs of jewellery as well as digital images that represent a design. These are meant to give customers an idea of the design, look and form of the product.",
      "The colour, size, texture and finish shown in the images may differ slightly from the actual product. To confirm the exact features and availability of a product, customers can contact PK Jewels through an Enquiry.",
    ],
  },
  {
    title: "Wishlist",
    paras: [
      "Customers can save jewellery they like to their Wishlist to view it later. Adding a product to the Wishlist does not mean that the product has been purchased or reserved for the customer.",
    ],
  },
  {
    title: "Shopping Cart",
    paras: [
      "The Cart feature is provided on the website with the aim of enabling online shopping in the future. Adding a product to the Cart will not be treated as confirmation of an order or as a purchase.",
    ],
  },
  {
    title: "Product Pricing & Enquiry",
    paras: [
      "At present, product prices are not displayed on the website. Customers can send an Enquiry for the price, availability, design, customisation or any other information about a piece of jewellery. The final price and availability of a product will be shared directly by PK Jewels.",
    ],
  },
  {
    title: "Orders & Payments",
    paras: [
      "At present, the website does not offer direct online ordering or payment. Customers who wish to buy jewellery can contact PK Jewels through the Enquiry or Contact option available on the website.",
    ],
  },
  {
    title: "Privacy & Personal Information",
    paras: [
      "We respect our customers' privacy. Personal information received during registration, login and Enquiry will be handled in accordance with our Privacy Policy. Appropriate technical and security measures will be taken to protect customer information.",
    ],
  },
  {
    title: "Copyright & Intellectual Property",
    paras: [
      "All logos, images, jewellery designs, graphics, text and other content on the website are the property of PK Jewels or are available for authorised use. Copying, distributing, reusing or using them commercially without prior permission is not allowed.",
    ],
  },
  {
    title: "Prohibited Activities",
    paras: ["Customers are not permitted to do any of the following:"],
    list: [
      "Use the website for any unlawful purpose.",
      "Attempt to gain unauthorised access to other customers' accounts.",
      "Misuse the website's images, designs or content.",
      "Harm the security or functioning of the website.",
      "Send an Enquiry with false, misleading or fake information.",
      "Misuse the services of the website.",
    ],
  },
  {
    title: "Website Availability & Changes",
    paras: [
      "PK Jewels reserves the right to change, update, temporarily suspend or discontinue the features, services or functioning of the website as required.",
    ],
  },
  {
    title: "Limitation of Liability",
    paras: [
      "We try to provide accurate information and better services on the website. However, we do not guarantee that the website will always be available without interruption or that every piece of information will be completely free of errors.",
    ],
  },
  {
    title: "Changes to the Terms & Conditions",
    paras: [
      "PK Jewels may change these Terms & Conditions as required. Any changes will be published on this page. Customers are advised to review this page from time to time.",
    ],
  },
  {
    title: "Contact Us",
    paras: [
      "For any questions or help related to the website, the jewellery or these Terms & Conditions, customers can contact PK Jewels through the Contact Us section of the website.",
    ],
  },
];

export default function TermsAndConditionsEn() {
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
            Terms &amp; Conditions
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
              Welcome to the PK Jewels website. Please read these Terms &amp; Conditions
              carefully before using the website. By using our website, you agree to the
              terms and conditions set out below.
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

                {s.list && (
                  <ul className="mt-2 space-y-2">
                    {s.list.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-[15px] leading-7 text-[#3d2f2a]"
                      >
                        <span
                          className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: GOLD }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Thank-you footer */}
          <div
            className="mt-6 rounded-2xl px-6 py-7 text-center"
            style={{ backgroundColor: MAROON }}
          >
            <p className="text-[15px] leading-7 text-white">
              Thank you for visiting PK Jewels and exploring our jewellery designs.
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
