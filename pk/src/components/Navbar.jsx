import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { RiJewelryFill } from "react-icons/ri";
import api from "../api/api";
/**
 * PK Navbar (React + Tailwind + react-router-dom) — fully responsive
 *
 * Logo ko `public/pk-logo.png` me rakho.
 * Tailwind v3.2+ chahiye (group/item ke liye).
 * Navbar <BrowserRouter> ke ANDAR render hona chahiye.
 *
 * <Navbar />
 * <Navbar cartCount={3} announcement="Festive collection is live" onSearch={(q) => navigate(`/search?q=${q}`)} />
 */
 
const LOGO = "/pk-logo.png";
 
// Vite: VITE_API_URL | CRA me ise process.env.REACT_APP_API_URL se badal do

 
/* ---------- Category icons ---------- */
const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.6",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};
 
// Mens Ring
export const MensRingIcon = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <rect x="7" y="3" width="10" height="6.6" rx="2" />
    <path d="M10.2 6.3h3.6" />
    <path d="M7.6 9.6A8.2 6.8 0 1 0 16.4 9.6" />
    <ellipse cx="12" cy="15.6" rx="5.2" ry="3.7" />
  </svg>
);
 
// Ladies Ring: diamond solitaire
export const LadiesRingIcon = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <path d="M9 3h6l2.6 3.6L12 10.4 6.4 6.6z" />
    <path d="M6.4 6.6h11.2M9 3l1.5 3.6L12 10.4M15 3l-1.5 3.6L12 10.4" />
    <circle cx="12" cy="16.2" r="5.8" />
  </svg>
);
 
// Boys Earring: stud + hanging diamond drop
export const BoysEarringIcon = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <path d="M12 2.5v3" />
    <circle cx="12" cy="9.2" r="3.7" />
    <circle cx="12" cy="9.2" r="1.3" />
    <path d="M12 12.9v1.8" />
    <path d="M12 14.6l2.8 3L12 21.5 9.2 17.6z" />
  </svg>
);
 
// Pendant: chain + diamond-cut drop
export const PendantIcon = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <path d="M3.5 3c.8 4.6 4.3 7 8.5 7s7.7-2.4 8.5-7" />
    <circle cx="12" cy="11.2" r="1.1" />
    <path d="M12 12.3l4.2 3.4L12 21.6 7.8 15.7z" />
    <path d="M7.8 15.7h8.4" />
  </svg>
);
 
// Wedding: two interlocked rings + sparkle
export const WeddingIcon = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <circle cx="8.8" cy="14.6" r="5.2" />
    <circle cx="15.2" cy="14.6" r="5.2" />
    <path d="M15.2 2.8l1.7 1.9-1.7 2.4-1.7-2.4z" />
  </svg>
);
 
// Icon alag se, slug ke hisaab se (categories me icon nahi hota)
const CATEGORY_ICONS = {
  "all-jewellery": <RiJewelryFill />,
  "mens-ring": <MensRingIcon />,
  "ladies-ring": <LadiesRingIcon />,
  "boys-earring": <BoysEarringIcon />,
  pendant: <PendantIcon />,
  wedding: <WeddingIcon />,
};
 
// categories array -> navbar links (isActive + showInNavbar + sortOrder)
// href: /category/:slug
const toLinks = (list = []) =>
  [...list]
    .filter((c) => c.isActive && c.showInNavbar)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => ({
      id: c._id ?? c.id ?? c.slug,
      label: c.name,
      href: `/category/${c.slug}`,
      logo: CATEGORY_ICONS[c.slug],
      children: toLinks(c.children),
    }));
 
const PLACEHOLDERS = [
  "Search for gold rings",
  "Search for mens ring",
  "Search for ladies ring",
  "Search for pendant",
  "Search for wedding collection",
];
 
/* ---------- Icons (inline SVG, koi extra package nahi chahiye) ---------- */
const Svg = ({ children, className = "h-6 w-6", ...p }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...p}
  >
    {children}
  </svg>
);
 
const MenuIcon = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);
const CloseIcon = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);
const SearchIcon = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Svg>
);
const CameraIcon = (p) => (
  <Svg {...p}>
    <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7H8l1.2-2h5.6L16 7h2.5A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z" />
    <circle cx="12" cy="13" r="3.2" />
  </Svg>
);
const MicIcon = (p) => (
  <Svg {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" />
  </Svg>
);
const StoreIcon = (p) => (
  <Svg {...p}>
    <path d="M4 10V5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5V10M4 10h16M4 10v9.5h16V10" />
    <path d="M9.5 19.5V14h5v5.5" />
  </Svg>
);
const HeartIcon = (p) => (
  <Svg {...p}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />
  </Svg>
);
const UserIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </Svg>
);
const BagIcon = (p) => (
  <Svg {...p}>
    <path d="M5 8h14l-1 12H6z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </Svg>
);
const ChevronIcon = (p) => (
  <Svg {...p}>
    <path d="M9 6l6 6-6 6" />
  </Svg>
);
 
/* ---------- Small reusable bits ---------- */
const IconBtn = ({ label, href, children, badge }) => {
  const cls =
    "relative grid h-10 w-10 place-items-center rounded-full text-[#8a1c1c] transition hover:bg-[#fbf1dc] hover:text-[#8a5200] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8760a]";
  const inner = (
    <>
      {children}
      {badge !== undefined && (
        <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#7a0a10] px-1 text-[11px] font-semibold leading-none text-white">
          {badge}
        </span>
      )}
    </>
  );
  return href ? (
    <Link to={href} aria-label={label} title={label} className={cls}>
      {inner}
    </Link>
  ) : (
    <button type="button" aria-label={label} title={label} className={cls}>
      {inner}
    </button>
  );
};
 
function SearchBar({ query, setQuery, submit, placeholder, onImage, onVoice, className = "" }) {
  return (
    <form
      onSubmit={submit}
      role="search"
      className={`flex h-11 w-full items-center gap-2 rounded-full border border-[#e4d8c0] bg-white px-4 shadow-sm transition focus-within:border-[#b8760a] focus-within:shadow-md sm:h-12 ${className}`}
    >
      <SearchIcon className="h-5 w-5 shrink-0 text-[#8a5200]" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search jewellery"
        className="min-w-0 flex-1 bg-transparent text-[15px] text-neutral-800 outline-none placeholder:text-neutral-400 [&::-webkit-search-cancel-button]:hidden"
      />
      <button
        type="submit"
        aria-label="Search by image"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#8a1c1c] hover:bg-[#fbf1dc]"
      >
        <CameraIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onVoice}
        aria-label="Search by voice"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#8a1c1c] hover:bg-[#fbf1dc]"
      >
        <MicIcon className="h-5 w-5" />
      </button>
    </form>
  );
}
 
/* ---------- Main component ---------- */
function Navbar({
  links: linksProp, // optional: khud links pass karna ho to (API fetch skip hota hai)
  cartCount = 0,
  announcement = "Festive collection is now live",
  onSearch,
  onImageSearch,
  onVoiceSearch,
  activePath, // optional: override; default me current URL use hota hai
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
 
  const [open, setOpen] = useState(false);
  const [showBar, setShowBar] = useState(Boolean(announcement));
  const [query, setQuery] = useState("");
  const [phIndex, setPhIndex] = useState(0);
  const [expanded, setExpanded] = useState(null); // mobile me subcategory open/close
  const [categories, setCategories] = useState([]);
 
  // categories fetch (sirf jab links prop na diya ho)
  useEffect(() => {
    if (linksProp) return;
    const controller = new AbortController();
 
    (async () => {
      try {
        const res = await api.get("/api/categories/", { signal: controller.signal });
        if (res.status === 200 && res.data?.success) {
          setCategories(res.data.categories ?? []);
        }
      } catch (err) {
        if (err.code !== "ERR_CANCELED") {
          console.warn("Navbar categories fetch failed:", err.message);
        }
      }
    })();
 
    return () => controller.abort();
  }, [linksProp]);
 
  // categories change hone par links recompute
  const links = useMemo(() => linksProp ?? toLinks(categories), [linksProp, categories]);
 
  // placeholder rotate
  useEffect(() => {
    const t = setInterval(() => setPhIndex((i) => (i + 1) % PLACEHOLDERS.length), 2600);
    return () => clearInterval(t);
  }, []);
 
  // drawer open ho to page scroll band + Esc se close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
 
  // route change par drawer band
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
 
  // desktop size par aate hi drawer band
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const h = () => mq.matches && setOpen(false);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
 
  const submit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    if (onSearch) onSearch(q);
    else navigate(`/search?q=${encodeURIComponent(q)}`);
  };
 

const searchProps = {
  query,
  setQuery,
  submit,
  placeholder: PLACEHOLDERS[phIndex],
  onImage: onImageSearch,
  onVoice: onVoiceSearch,
};

  const isActive = (href) => (activePath ?? pathname) === href;
 
  return (
    <>
      {/* ===== Announcement bar ===== */}
      {showBar && (
        <div className="relative bg-gradient-to-r from-[#4a0006] via-[#7a0a10] to-[#4a0006] text-[#fbe9c2]">
          <p className="mx-auto max-w-7xl px-10 py-2.5 text-center text-[13px] font-medium tracking-wide sm:text-[15px]">
            ✦ {announcement} ✦
          </p>
          <button
            type="button"
            onClick={() => setShowBar(false)}
            aria-label="Close announcement"
            className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full border border-[#fbe9c2]/40 hover:bg-white/10 sm:right-4"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      )}
 
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-50 border-b border-[#efe6d2] bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          {/* Row 1 */}
          <div className="flex items-center justify-between gap-3 py-2 lg:gap-8 lg:py-3">
            {/* left: hamburger + logo */}
            <div className="flex items-center gap-1 sm:gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                className="grid h-10 w-10 place-items-center rounded-full text-[#8a1c1c] hover:bg-[#fbf1dc] lg:hidden"
              >
                <MenuIcon />
              </button>
              <Link to="/" aria-label="PK home" className="shrink-0">
                <img
                  src={LOGO}
                  alt="PK Jewellery"
                  className="h-11 w-auto sm:h-12 lg:h-[3.75rem]"
                />
              </Link>
            </div>
 
            {/* centre: search (desktop) */}
            <div className="hidden max-w-2xl flex-1 lg:block">
              <SearchBar {...searchProps} />
            </div>
 
            {/* right: icons */}
            <div className="flex items-center gap-0.5 sm:gap-1.5">
              <IconBtn label="Store locator" href="/stores">
                <StoreIcon />
              </IconBtn>
              <IconBtn label="Wishlist" href="/wishlist">
                <HeartIcon />
              </IconBtn>
              <span className="hidden lg:block">
                <IconBtn label="Account" href="/account">
                  <UserIcon />
                </IconBtn>
              </span>
              <IconBtn label="Cart" href="/cart" badge={cartCount}>
                <BagIcon />
              </IconBtn>
            </div>
          </div>
 
          {/* Row 2: search (mobile / tablet) */}
          <div className="pb-3 lg:hidden">
            <SearchBar {...searchProps} />
          </div>
 
          {/* Row 3: category links (desktop) */}
          <nav aria-label="Categories" className="hidden border-t border-[#f3ecdc] lg:block">
            <ul className="flex min-h-[3.25rem] items-center justify-start gap-x-8 py-3 xl:gap-x-14">
              {links.map((l) => (
                <li key={l.id} className="group/item relative">
                  <Link
                    to={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={`group relative inline-flex items-center py-1 after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:bg-[#b8760a] after:transition-all after:duration-300 hover:after:w-full ${
                      isActive(l.href)
                        ? "text-[#8a5200] after:w-full"
                        : "text-neutral-700 hover:text-[#8a5200] after:w-0"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {l.logo && (
                        <span className="grid h-[18px] w-[18px] shrink-0 place-items-center text-[#b8760a] transition-transform duration-200 group-hover:scale-110 xl:h-5 xl:w-5 [&>img]:h-full [&>img]:w-full [&>img]:object-contain [&>svg]:h-full [&>svg]:w-full">
                          {l.logo}
                        </span>
                      )}
                      <span className="whitespace-nowrap text-[15px] font-medium tracking-[0.01em] xl:text-[16.5px]">
                        {l.label}
                      </span>
                    </span>
                  </Link>
 
                  {/* subcategories dropdown */}
                  {l.children.length > 0 && (
                    <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition duration-200 group-focus-within/item:visible group-focus-within/item:opacity-100 group-hover/item:visible group-hover/item:opacity-100">
                      <ul className="w-64 rounded-lg border border-[#efe6d2] bg-white py-2 shadow-xl">
                        {l.children.map((c) => (
                          <li key={c.id}>
                            <Link
                              to={c.href}
                              className="block whitespace-nowrap px-4 py-2 text-[14.5px] text-neutral-700 transition hover:bg-[#fbf1dc] hover:text-[#8a5200]"
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
 
      {/* ===== Mobile drawer ===== */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${open ? "visible" : "invisible pointer-events-none"}`}
        aria-hidden={!open}
      >
        {/* overlay */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* panel */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`absolute inset-y-0 left-0 flex w-[84%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-[#efe6d2] px-4 py-3">
            <Link to="/" onClick={() => setOpen(false)}>
              <img src={LOGO} alt="PK Jewellery" className="h-12 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid h-10 w-10 place-items-center rounded-full text-[#8a1c1c] hover:bg-[#fbf1dc]"
            >
              <CloseIcon />
            </button>
          </div>
 
          <nav aria-label="Mobile categories" className="flex-1 overflow-y-auto px-2 py-2">
            <ul>
              {links.map((l) => (
                <li key={l.id}>
                  <div className="flex items-center">
                    <Link
                      to={l.href}
                      onClick={() => setOpen(false)}
                      className={`flex flex-1 items-center gap-3 rounded-lg px-3 py-3.5 text-[17px] transition hover:bg-[#fbf1dc] ${
                        isActive(l.href) ? "font-semibold text-[#8a5200]" : "text-neutral-800"
                      }`}
                    >
                      {l.logo && (
                        <span className="grid h-5 w-5 shrink-0 place-items-center text-[#b8760a] [&>svg]:h-full [&>svg]:w-full">
                          {l.logo}
                        </span>
                      )}
                      {l.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (l.children.length > 0) {
                          setExpanded(expanded === l.id ? null : l.id);
                        } else {
                          setOpen(false);
                          navigate(l.href);
                        }
                      }}
                      aria-label={l.children.length > 0 ? `Toggle ${l.label}` : `Go to ${l.label}`}
                      aria-expanded={l.children.length > 0 ? expanded === l.id : undefined}
                      className="grid h-10 w-10 place-items-center rounded-full hover:bg-[#fbf1dc]"
                    >
                      <ChevronIcon
                        className={`h-5 w-5 text-[#b8760a] transition-transform ${
                          expanded === l.id ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  </div>
 
                  {l.children.length > 0 && expanded === l.id && (
                    <ul className="mb-1 ml-6 border-l border-[#efe6d2] pl-2">
                      {l.children.map((c) => (
                        <li key={c.id}>
                          <Link
                            to={c.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-lg px-3 py-2.5 text-[15px] text-neutral-700 hover:bg-[#fbf1dc]"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
 
          <div className="grid grid-cols-3 gap-2 border-t border-[#efe6d2] p-3 text-[13px] text-[#8a1c1c]">
            {[
              { label: "Account", href: "/account", Icon: UserIcon },
              { label: "Wishlist", href: "/wishlist", Icon: HeartIcon },
              { label: "Stores", href: "/stores", Icon: StoreIcon },
            ].map(({ label, href, Icon }) => (
              <Link
                key={label}
                to={href}
                onClick={() => setOpen(false)}
                className="flex flex-col items-center gap-1 rounded-lg py-2.5 hover:bg-[#fbf1dc]"
              >
                <Icon className="h-6 w-6" />
                {label}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
 
export default Navbar;