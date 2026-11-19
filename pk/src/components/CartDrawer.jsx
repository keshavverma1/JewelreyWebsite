import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Auth } from "../context/AuthContext";

const LOGO = "http://localhost:5173/pk-logo.png";
const GOLD = "#d4a64a";
const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // apna number yahan daal dena

export default function CartDrawer({ open, onClose, items }) {
  // Auth context se cart / setCart aana chahiye (wishlist jaisa hi)
  const { cart = [], setCart } = React.useContext(Auth);
  const list = items ?? cart;

  const totalQty = list.reduce((sum, p) => sum + (p.qty || 1), 0);

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

  const persist = (next) => {
    localStorage.setItem("cart", JSON.stringify(next));
    return next;
  };

  const changeQty = (id, delta) => {
    setCart((prev) =>
      persist(
        prev.map((item) =>
          item._id === id
            ? { ...item, qty: Math.max(1, (item.qty || 1) + delta) }
            : item,
        ),
      ),
    );
  };

  const removeItem = (id) => {
    setCart((prev) => persist(prev.filter((item) => item._id !== id)));
  };

  const clearCart = () => {
    setCart(persist([]));
  };

  const imageOf = (p) => p.images?.[0]?.url ?? p.image ?? LOGO;

  const enquiryAllLink = () => {
    const lines = list
      .map((p, i) => `${i + 1}. ${p.name} (SKU: ${p.sku}) x ${p.qty || 1}`)
      .join("\n");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `Hi, I'd like to enquire about these pieces:\n${lines}`,
    )}`;
  };

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
        aria-label="Shopping cart"
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
            {/* Highlighted logo: white badge + gold ring + soft glow */}
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-1.5"
              style={{
                boxShadow: `0 0 0 2px ${GOLD}, 0 0 18px rgba(212,166,74,0.45)`,
              }}
            >
              <img
                src={LOGO}
                alt="PK Jewellery"
                className="h-full w-full object-contain"
              />
            </span>
            <div className="leading-tight">
              <p className="text-lg font-semibold tracking-wide text-white">
                My Cart
              </p>
              <p
                className="text-[11px] uppercase tracking-[0.2em]"
                style={{ color: GOLD }}
              >
                {totalQty} {totalQty === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
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
                🛍
              </span>
              <p className="text-base text-white">Your cart is empty</p>
              <p className="mt-1 text-sm">
                Add the pieces you love and they will show up here.
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
                    src={imageOf(p)}
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

                  <div className="mt-2 flex items-center justify-between gap-2">
                    {/* Quantity stepper */}
                    <div className="flex items-center rounded-full border border-white/20">
                      <button
                        onClick={() => changeQty(p._id, -1)}
                        aria-label={`Decrease quantity of ${p.name}`}
                        disabled={(p.qty || 1) <= 1}
                        className="flex h-8 w-8 items-center justify-center text-lg text-white transition hover:bg-white/10 disabled:opacity-30"
                      >
                        −
                      </button>
                      <span className="min-w-[24px] text-center text-sm text-white">
                        {p.qty || 1}
                      </span>
                      <button
                        onClick={() => changeQty(p._id, 1)}
                        aria-label={`Increase quantity of ${p.name}`}
                        className="flex h-8 w-8 items-center justify-center text-lg text-white transition hover:bg-white/10"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(p._id)}
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
          <div className="relative space-y-2.5 px-5 pb-6 pt-3">
            <a
              href={enquiryAllLink()}
              target="_blank"
              rel="noreferrer"
              className="block w-full rounded-full py-2.5 text-center text-sm font-semibold text-[#5a0209] transition hover:brightness-110"
              style={{
                background: `linear-gradient(135deg, #f0cf85, ${GOLD})`,
              }}
            >
              Enquire All on WhatsApp
            </a>
            <button
              onClick={clearCart}
              className="w-full rounded-full border border-white/25 py-2.5 text-sm text-white/80 transition hover:bg-white/10"
            >
              Clear Cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
