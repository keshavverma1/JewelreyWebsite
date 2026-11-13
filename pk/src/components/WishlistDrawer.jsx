// components/WishlistDrawer.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Auth } from "../context/AuthContext";

const LOGO = "https://res.cloudinary.com/dvr0vpuuk/image/upload/v1794597242/PK_logo_fjwadp.png";
const GOLD = "#d4a64a";

// Dummy product (baad mein apne context/API se replace kar dena)
const DUMMY_WISHLIST = [
  {
    _id: "dummy-1",
    name: "Royal Kundan Necklace Set",
    slug: "royal-kundan-necklace-set",
    sku: "PK-NK-001",
    category: "Necklace Sets",
    image: LOGO, // real product image aane tak logo placeholder
  },
];

export default function WishlistDrawer({ open, onClose, items }) {
  const { wishlist, setWishlist } = React.useContext(Auth);
  const list = items ?? wishlist;

  // agar parent se items aaye to sync rakho
  useEffect(() => {
    if (items) setList(items);
  }, [items]);

  // body scroll lock + Esc se close
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const remove = (id) => setList((prev) => prev.filter((p) => p._id !== id));

  const enquiryLink = (p) =>
    `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(
      `Hi, I'm interested in ${p.name} (SKU: ${p.sku}).`,
    )}`;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer (right side) */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-[92%] max-w-[420px] flex-col overflow-hidden shadow-2xl transition-transform duration-300 ease-out sm:w-[420px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "rgb(90, 2, 9)" }}
        role="dialog"
        aria-label="Wishlist"
      >
        {/* Watermark logo (bahut light) */}
        <img
          src={LOGO}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -left-16 w-80 select-none"
          style={{
            filter: "invert(1) hue-rotate(180deg)",
            mixBlendMode: "screen",
            opacity: 0.08,
          }}
        />

        {/* Header */}
        <div className="relative flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <img
              src={"https://res.cloudinary.com/dvr0vpuuk/image/upload/v1794597242/PK_logo_fjwadp.png"}
              alt="PK Jewellery"
              className="h-10 w-10 rounded-full bg-white object-contain p-1"
            />
            <div className="leading-tight">
              <p className="text-lg font-semibold tracking-wide text-white">
                My Wishlist
              </p>
              <p
                className="text-[11px] uppercase tracking-[0.2em]"
                style={{ color: GOLD }}
              >
                {list.length} {list.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close wishlist"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-xl text-white transition hover:bg-white/10"
          >
            ×
          </button>
        </div>

        {/* Gold divider */}
        <div
          className="mx-5 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          }}
        />

        {/* Items */}
        <div className="relative flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {list.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-white/70">
              <span className="mb-3 text-5xl" style={{ color: GOLD }}>
                ♡
              </span>
              <p className="text-base text-white">Your wishlist is empty</p>
              <p className="mt-1 text-sm">
                Save the pieces you love and find them here.
              </p>
              <Link
                to="/"
                onClick={onClose}
                className="mt-5 rounded-full border px-5 py-2 text-sm transition hover:bg-white/10"
                style={{ borderColor: GOLD, color: GOLD }}
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            list.map((p) => (
              <div
                key={p._id}
                className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur-sm"
              >
                <Link
                  to={`/product/${p.sku}/${p._id}`}
                  onClick={onClose}
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white"
                >
                  <img
                    src={p.images[0].url}
                    alt={p.name}
                    className="h-full w-full object-contain p-1"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <p
                      className="text-[11px] uppercase tracking-widest"
                      style={{ color: GOLD }}
                    >
                      {p.category}
                    </p>
                    <Link
                      to={`/product/${p.sku}/${p._id}`}
                      onClick={onClose}
                      className="line-clamp-2 text-[15px] font-medium leading-snug text-white"
                    >
                      {p.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-white/50">SKU: {p.sku}</p>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <a
                      href={enquiryLink(p)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 rounded-full py-1.5 text-center text-xs font-semibold text-[#5a0209] transition hover:brightness-110"
                      style={{
                        background: `linear-gradient(135deg, #f0cf85, ${GOLD})`,
                      }}
                    >
                      Enquire on WhatsApp
                    </a>
                    <button
                      onClick={() => {
                        setWishlist((prev) => {
                          const updatedWishlist = prev.filter(
                            (item) => item._id !== p._id,
                          );

                          localStorage.setItem(
                            "wishlist",
                            JSON.stringify(updatedWishlist),
                          );

                          return updatedWishlist;
                        });
                      }}
                      aria-label={`Remove ${p.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-sm text-white/80 transition hover:bg-white/10"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {list.length > 0 && (
          <div className="relative px-5 pb-6 pt-3">
            <button
              onClick={() => {
                setWishlist([]);
                localStorage.setItem("wishlist", JSON.stringify([]));
              }}
              className="w-full rounded-full border border-white/25 py-2.5 text-sm text-white/80 transition hover:bg-white/10"
            >
              Clear Wishlist
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
