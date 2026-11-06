import React from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
 
// 👉 Apna WhatsApp number yahan daalo (country code ke saath, + ya spaces ke bina)
const WHATSAPP_NUMBER = "91XXXXXXXXXX";
 
const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24" fill="#fff" aria-hidden="true">
    <path d="M16.003 3C8.83 3 3 8.83 3 16c0 2.29.6 4.52 1.74 6.49L3 29l6.7-1.72A12.94 12.94 0 0 0 16.003 29C23.17 29 29 23.17 29 16S23.17 3 16.003 3zm0 23.7c-1.95 0-3.86-.52-5.53-1.51l-.4-.23-3.98 1.02 1.06-3.88-.26-.4A10.68 10.68 0 0 1 5.3 16c0-5.87 4.78-10.7 10.7-10.7S26.7 10.13 26.7 16s-4.83 10.7-10.7 10.7zm5.87-8.02c-.32-.16-1.9-.94-2.2-1.05-.3-.1-.51-.16-.73.16-.21.32-.83 1.05-1.02 1.26-.19.22-.37.24-.7.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.54.1-.21.05-.4-.03-.56-.08-.16-.73-1.76-1-2.4-.26-.63-.53-.54-.73-.55h-.62c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.68s1.15 3.1 1.31 3.32c.16.21 2.26 3.45 5.47 4.84.76.33 1.36.53 1.82.68.77.24 1.46.21 2.01.13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37z" />
  </svg>
);
 
const formatStatus = (s) =>
  s ? s.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase()) : "";
 
const ProductDetails = () => {
  const { sku, id } = useParams();
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [zoom, setZoom] = React.useState({ active: false, x: 50, y: 50 });
 
  const fetchProductDetails = async () => {
    try {
      const response = await api.get(
        `/api/products/p1/${sku}/${id}`
      );
 
      const data = response.data;
 
      setProduct(data.product);
 
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    setActiveIndex(0);
    fetchProductDetails();
  }, [sku, id]);
 
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ active: true, x, y });
  };
 
  const handleMouseLeave = () => setZoom((z) => ({ ...z, active: false }));
 
  if (loading) {
    return (
      <>
        <style>{css}</style>
        <div className="pd-page">
          <div className="pd-wrap">
            <div className="pd-skeleton pd-skel-img" />
            <div className="pd-info">
              <div className="pd-skeleton" style={{ height: 18, width: "30%" }} />
              <div className="pd-skeleton" style={{ height: 38, width: "80%", marginTop: 16 }} />
              <div className="pd-skeleton" style={{ height: 90, marginTop: 24 }} />
              <div className="pd-skeleton" style={{ height: 56, marginTop: 24 }} />
            </div>
          </div>
        </div>
      </>
    );
  }
 
  if (!product) {
    return (
      <>
        <style>{css}</style>
        <div className="pd-page">
          <div className="pd-empty">
            <h2>Product not found</h2>
            <p>Yeh product available nahi hai ya hata diya gaya hai.</p>
          </div>
        </div>
      </>
    );
  }
 
  const images = product.images || [];
  const current = images[activeIndex] || images[0];
 
  const message =
    `Hello! I'm interested in *${product.name}* (SKU: ${product.sku}).\n` +
    `Please share the price, material, weight, sizing and availability.\n` +
    `${typeof window !== "undefined" ? window.location.href : ""}`;
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
 
  const specs = [
    { label: "Metal", value: product.metal },
    { label: "Stone", value: product.stone },
    { label: "Weight", value: product.weight ? `${product.weight} g` : null },
    {
      label: "Sizes",
      value: product.availableSizes?.length ? product.availableSizes.join(", ") : null,
    },
    { label: "SKU", value: product.sku, plain: true },
    { label: "Availability", value: formatStatus(product.stockStatus), plain: true },
  ];
 
  return (
    <>
      <style>{css}</style>
      <div className="pd-page">
        <div className="pd-wrap">
          {/* ---------- Gallery ---------- */}
          <div className="pd-gallery">
            <div
              className="pd-main"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {current && (
                <img
                  src={current.url}
                  alt={current.alt || product.name}
                  className="pd-main-img"
                  draggable={false}
                  style={{
                    transformOrigin: `${zoom.x}% ${zoom.y}%`,
                    transform: zoom.active ? "scale(2.2)" : "scale(1)",
                  }}
                />
              )}
              <span className="pd-zoom-hint">Hover to zoom</span>
              {product.isFeatured && <span className="pd-ribbon">Featured</span>}
            </div>
 
            {images.length > 1 && (
              <div className="pd-thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`pd-thumb ${i === activeIndex ? "active" : ""}`}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={img.url} alt={img.alt || `${product.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
 
          {/* ---------- Info ---------- */}
          <div className="pd-info">
            <div className="pd-crumb">
              {product.tags?.slice(0, 2).map((t) => (
                <span key={t} className="pd-chip">{t.replace(/-/g, " ")}</span>
              ))}
            </div>
 
            <h1 className="pd-title">{product.name}</h1>
            <p className="pd-sku">Item code · {product.sku}</p>
 
            <div className="pd-divider" />
 
            <p className="pd-desc">{product.description}</p>
 
            <h3 className="pd-sub">Product details</h3>
            <div className="pd-specs">
              {specs
                .filter((s) => s.value)
                .map((s) => (
                  <div className="pd-spec" key={s.label}>
                    <span className="pd-spec-label">{s.label}</span>
                    <span className="pd-spec-value">{s.value}</span>
                  </div>
                ))}
            </div>
 
            {/* WhatsApp CTA instead of price */}
            <div className="pd-cta-box">
              <p className="pd-cta-text">Message us for price & availability</p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-wa-btn"
              >
                <WhatsAppIcon />
                Get Price on WhatsApp
              </a>
              <ul className="pd-trust">
                <li>✦ Quick reply</li>
                <li>✦ Custom sizing</li>
                <li>✦ Genuine quality</li>
              </ul>
            </div>
 
            {product.tags?.length > 0 && (
              <div className="pd-tags">
                {product.tags.map((t) => (
                  <span key={t} className="pd-tag">#{t.replace(/\s+/g, "")}</span>
                ))}
              </div>
            )}
          </div>
        </div>
 
        {/* Floating button for mobile */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="pd-wa-float"
          aria-label="Chat on WhatsApp"
        >
          <WhatsAppIcon />
        </a>
      </div>
    </>
  );
};
 
const css = `
.pd-page{
  --gold:#b8893a; --ink:#1f1b16; --muted:#7b7368; --line:#ece4d8; --bg:#fbf8f3;
  --wa:#25D366; --wa-dark:#1ebe5b;
  background:var(--bg); min-height:100vh; padding:40px 20px 80px; color:var(--ink);
  font-family:"Inter","Segoe UI",system-ui,sans-serif;
}
.pd-wrap{
  max-width:1180px; margin:0 auto; display:grid; grid-template-columns:1.05fr 1fr; gap:56px; align-items:start;
}
/* Gallery */
.pd-gallery{position:sticky; top:24px}
.pd-main{
  position:relative; aspect-ratio:1/1; background:#fff; border:1px solid var(--line); border-radius:22px;
  overflow:hidden; cursor:zoom-in; box-shadow:0 20px 50px -25px rgba(90,60,10,.25);
}
.pd-main-img{
  width:100%; height:100%; object-fit:cover; display:block; transition:transform .25s ease-out; user-select:none;
}
.pd-zoom-hint{
  position:absolute; left:14px; bottom:14px; background:rgba(31,27,22,.7); color:#fff; font-size:12px;
  padding:6px 12px; border-radius:999px; backdrop-filter:blur(4px); pointer-events:none; letter-spacing:.3px;
}
.pd-ribbon{
  position:absolute; top:16px; left:16px; background:var(--gold); color:#fff; font-size:12px; font-weight:600;
  padding:6px 14px; border-radius:999px; letter-spacing:.5px; text-transform:uppercase;
}
.pd-thumbs{display:flex; gap:12px; margin-top:16px; flex-wrap:wrap}
.pd-thumb{
  width:78px; height:78px; border-radius:14px; overflow:hidden; padding:0; background:#fff; cursor:pointer;
  border:2px solid transparent; outline:1px solid var(--line); transition:all .2s;
}
.pd-thumb img{width:100%; height:100%; object-fit:cover; display:block}
.pd-thumb:hover{transform:translateY(-2px)}
.pd-thumb.active{border-color:var(--gold); outline-color:transparent}
/* Info */
.pd-crumb{display:flex; gap:8px; flex-wrap:wrap; margin-bottom:14px}
.pd-chip{
  font-size:12px; text-transform:uppercase; letter-spacing:1.2px; color:var(--gold); background:#f5ead6;
  padding:5px 12px; border-radius:999px; font-weight:600;
}
.pd-title{
  font-family:"Playfair Display",Georgia,serif; font-size:clamp(30px,4vw,44px); line-height:1.15; margin:0; font-weight:600;
}
.pd-sku{color:var(--muted); font-size:14px; margin:10px 0 0; letter-spacing:.4px}
.pd-divider{height:1px; background:linear-gradient(90deg,var(--gold),transparent); margin:24px 0; opacity:.5}
.pd-desc{font-size:16px; line-height:1.75; color:#4a443b; margin:0 0 28px}
.pd-sub{font-size:13px; text-transform:uppercase; letter-spacing:1.6px; color:var(--muted); margin:0 0 14px; font-weight:600}
.pd-specs{display:grid; grid-template-columns:1fr 1fr; gap:12px}
.pd-spec{
  background:#fff; border:1px solid var(--line); border-radius:14px; padding:14px 16px; display:flex; flex-direction:column; gap:4px;
}
.pd-spec-label{font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:1px}
.pd-spec-value{font-size:15px; font-weight:600}
.pd-spec-value.muted{color:#a79f93; font-weight:500; font-style:italic}
/* CTA */
.pd-cta-box{
  margin-top:30px; background:#fff; border:1px solid var(--line); border-radius:20px; padding:24px;
  box-shadow:0 14px 34px -22px rgba(37,211,102,.55);
}
.pd-cta-text{margin:0 0 14px; color:var(--muted); font-size:14px; text-align:center}
.pd-wa-btn{
  display:flex; align-items:center; justify-content:center; gap:12px; background:var(--wa); color:#fff; text-decoration:none;
  font-weight:700; font-size:17px; padding:17px 24px; border-radius:14px; transition:all .2s;
  box-shadow:0 10px 24px -10px rgba(37,211,102,.8);
}
.pd-wa-btn:hover{background:var(--wa-dark); transform:translateY(-2px); box-shadow:0 16px 30px -12px rgba(37,211,102,.9)}
.pd-wa-btn:active{transform:translateY(0)}
.pd-trust{list-style:none; padding:0; margin:16px 0 0; display:flex; justify-content:center; gap:18px; flex-wrap:wrap; font-size:12.5px; color:var(--muted)}
.pd-tags{display:flex; gap:8px; flex-wrap:wrap; margin-top:22px}
.pd-tag{font-size:12.5px; color:var(--muted); background:#f1ebe0; padding:5px 11px; border-radius:8px}
.pd-wa-float{
  display:none; position:fixed; right:18px; bottom:18px; width:58px; height:58px; border-radius:50%; background:var(--wa);
  align-items:center; justify-content:center; box-shadow:0 10px 24px rgba(0,0,0,.25); z-index:50;
}
/* Loading / empty */
.pd-skeleton{background:linear-gradient(90deg,#efe8db 25%,#f7f2e9 50%,#efe8db 75%); background-size:200% 100%; animation:pd-sh 1.4s infinite; border-radius:12px}
.pd-skel-img{aspect-ratio:1/1; border-radius:22px}
@keyframes pd-sh{to{background-position:-200% 0}}
.pd-empty{text-align:center; padding:120px 20px}
/* Responsive */
@media (max-width:900px){
  .pd-wrap{grid-template-columns:1fr; gap:28px}
  .pd-gallery{position:static}
  .pd-main{cursor:default}
  .pd-zoom-hint{display:none}
  .pd-wa-float{display:flex}
}
@media (max-width:480px){
  .pd-page{padding:20px 14px 90px}
  .pd-specs{grid-template-columns:1fr}
  .pd-thumb{width:64px; height:64px}
}
`;
 
export default ProductDetails;
 