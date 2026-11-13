import React from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";
import { Auth } from "../context/AuthContext";

const WHATSAPP_NUMBER = "918171547808";
const PAGE_SIZE = 12;
const PRELOAD_PX = 150; // sentinel ke paas aane par next page load shuru

const formatPrice = (value, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

const buildWhatsAppLink = (product) => {
  const text = `Hi! I'm interested in the ${
    product.name || "jewellery product"
  } (SKU: ${product.sku || "N/A"}). Could you share the price, material, weight, sizing and availability?`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

// SKU ka aakhri number: "PK-59" -> 59 (backend jaisa hi logic)
const skuNumber = (sku) => {
  const match = String(sku || "").match(/(\d+)\s*$/);
  return match ? parseInt(match[1], 10) : 0;
};

// Sirf search results ke liye (normal list me server ka order hi chalta hai)
const compareSku = (a, b) =>
  skuNumber(a?.sku) - skuNumber(b?.sku) ||
  String(a?.sku || "").localeCompare(String(b?.sku || ""), "en", {
    numeric: true,
  });

const normalize = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

// Products response
const getProductsFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.products)) return data.data.products;
  if (Array.isArray(data?.result)) return data.result;

  return [];
};

// Categories response
const getCategoriesFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.categories)) return data.categories;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.categories)) return data.data.categories;

  return [];
};

// Find category by slug
const findCategoryBySlug = (categories, slug) => {
  for (const category of categories || []) {
    if (category?.slug === slug) return category;

    const childMatch = findCategoryBySlug(category?.children, slug);

    if (childMatch) return childMatch;
  }

  return null;
};

// Pagination response
const getPaginationData = (data, products) => {
  const pagination = data?.pagination || data?.meta || data;

  return {
    totalProducts:
      pagination?.totalProducts ?? pagination?.total ?? products.length,

    currentPage: pagination?.currentPage ?? pagination?.page ?? 1,

    hasMore:
      typeof pagination?.hasMore === "boolean"
        ? pagination.hasMore
        : products.length === PAGE_SIZE,
  };
};

// Product images
const getProductImages = (product) => {
  if (Array.isArray(product?.images)) {
    return product.images
      .map((image) => (typeof image === "string" ? { url: image } : image))
      .filter((image) => image?.url);
  }

  if (product?.image) {
    return [{ url: product.image }];
  }

  if (product?.imageUrl) {
    return [{ url: product.imageUrl }];
  }

  return [];
};

// WhatsApp icon
const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.52 3.48A11.87 11.87 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.88 11.88 0 0 0 5.76 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.44ZM12.07 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.88 9.88 0 0 1-1.52-5.27c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.13 1.03 7 2.9a9.84 9.84 0 0 1 2.9 7c0 5.46-4.45 9.9-9.91 9.9Zm5.44-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
  </svg>
);

// Search icon
const SearchIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    aria-hidden="true"
    {...props}
  >
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" strokeLinecap="round" />
  </svg>
);

// Wishlist icon
const HeartIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.7 4.5 6.4 4.5c2 0 3.5 1.1 4.3 2.4.4.6.8.6 1.2 0 .8-1.3 2.3-2.4 4.3-2.4 3.7 0 5.5 3.9 4 7.3C19.5 16.4 12 21 12 21Z" />
  </svg>
);

// PK Jewellery theme
const THEME = {
  "--pk-bg": "#FBF6EE",
  "--pk-card": "#FFFFFF",
  "--pk-line": "#EADBC3",
  "--pk-ink": "#3B1A1A",
  "--pk-maroon": "#6B0F1A",
  "--pk-maroon-dark": "#520B14",
  "--pk-gold": "#B07A1E",
};

// Inline styles (Tailwind version par depend nahi karte)
const IMAGE_RATIO = { aspectRatio: "4 / 5" };
const TWO_LINES = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

// Skeleton card (loading placeholder)
const SkeletonCard = () => (
  <div
    aria-hidden="true"
    className="flex flex-col overflow-hidden rounded-2xl border border-[var(--pk-line)] bg-[var(--pk-card)]"
  >
    <div className="p-2">
      <div
        style={IMAGE_RATIO}
        className="rounded-xl bg-[#F3EADB] motion-safe:animate-pulse"
      />
    </div>
    <div className="space-y-2.5 px-4 pb-4 pt-2">
      <div className="h-4 w-3/4 rounded bg-[#F3EADB] motion-safe:animate-pulse" />
      <div className="h-4 w-1/3 rounded bg-[#F3EADB] motion-safe:animate-pulse" />
      <div className="mt-4 h-10 rounded-xl bg-[#F3EADB] motion-safe:animate-pulse" />
    </div>
  </div>
);

//Product card
const ProductCard = React.memo(({ product, wishlist, setWishlist }) => {
  const { setWishOpen } = React.useContext(Auth);
  const [imgFailed, setImgFailed] = React.useState(false);

  /////////////------------------------------------------------------------------------------------

  const [hoverFailed, setHoverFailed] = React.useState(false);
  const [imgLoaded, setImgLoaded] = React.useState(false);

  const images = getProductImages(product);

  const image = images.find((img) => img.isPrimary) || images[0];

  const hoverImage = images.find((img) => img !== image);

  const showHover = Boolean(hoverImage) && !hoverFailed;

  const price = product.price ?? product.sellingPrice;

  const hasPrice = typeof price === "number" && Number.isFinite(price);

  const soldOut =
    product.stockStatus === "out-of-stock" ||
    product.stockStatus === "out_of_stock" ||
    product.stock === 0;

  const productUrl = `/product/${product.sku}/${product._id}`;

  const displayName = product.name || product.title || "PK Jewellery";
  const isWishlisted = wishlist.some(
  (item) => item._id === product._id
);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--pk-line)] bg-[var(--pk-card)] shadow-[0_1px_2px_rgba(59,26,26,0.05)] motion-safe:transition-all motion-safe:duration-300 hover:-translate-y-1 hover:border-[var(--pk-gold)]/50 hover:shadow-[0_20px_40px_-18px_rgba(107,15,26,0.35)]">
      {/* Image frame */}
      <div className="p-2">
        <Link
          to={productUrl}
          style={IMAGE_RATIO}
          className={`relative block overflow-hidden rounded-xl bg-[#F3EADB] ${
            image && !imgFailed && !imgLoaded ? "motion-safe:animate-pulse" : ""
          }`}
        >
          {image && !imgFailed ? (
            <>
              <img
                src={image.url}
                alt={image.alt || displayName}
                loading="lazy"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgFailed(true)}
                className={`absolute inset-0 h-full w-full select-none object-cover [-webkit-user-drag:none] motion-safe:transition-all motion-safe:duration-500 ${
                  !imgLoaded
                    ? "opacity-0"
                    : showHover
                      ? "opacity-100 group-hover:opacity-0"
                      : "opacity-100 motion-safe:duration-700 group-hover:scale-105"
                }`}
              />

              {showHover && (
                <img
                  src={hoverImage.url}
                  alt={hoverImage.alt || `${displayName} alternate view`}
                  loading="lazy"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  onError={() => setHoverFailed(true)}
                  className="absolute inset-0 h-full w-full select-none object-cover opacity-0 [-webkit-user-drag:none] motion-safe:transition-opacity motion-safe:duration-500 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center font-['Fraunces'] text-lg italic text-[var(--pk-ink)]/50">
              Photo coming soon
            </div>
          )}

          {/* Wishlist button */}
          <button
            type="button"
            aria-label="Add to wishlist"

            className={`absolute left-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur motion-safe:transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pk-gold)] ${
  isWishlisted
    ? "bg-[var(--pk-maroon)] text-white"
    : "bg-white/90 text-[var(--pk-maroon)] hover:bg-[var(--pk-maroon)] hover:text-white"
}`}
            
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setWishlist((prev) => {
                const alreadyExists = prev.some(
                  (item) => item._id === product._id,
                );

                if (alreadyExists) {
                  const updatedWishlist = prev.filter(
                    (item) => item._id !== product._id
                  );
                  localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
                  return updatedWishlist;
                }

                const updatedWishlist = [...prev, product];

                const setItem = localStorage.setItem(
                  "wishlist",
                  JSON.stringify(updatedWishlist),
                );
                return updatedWishlist;
              });
              setWishOpen(true);
            }}
            
          >
            <HeartIcon className="h-5 w-5" />
          </button>

          {/* SKU chip */}
          {product.sku && (
            <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium tracking-wide text-[var(--pk-ink)]/80 shadow-sm backdrop-blur">
              {product.sku}
            </span>
          )}

          {soldOut && (
            <span className="absolute right-2.5 top-2.5 rounded-full bg-[var(--pk-ink)] px-3 py-1 text-xs font-medium text-white">
              Sold out
            </span>
          )}
        </Link>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
        <Link to={productUrl}>
          <h3
            style={TWO_LINES}
            className="min-h-[2.75rem] font-['Fraunces'] text-base font-medium leading-snug text-[var(--pk-ink)] sm:text-lg"
          >
            {displayName}
          </h3>
        </Link>

        <p className="mt-1.5 text-base font-semibold text-[var(--pk-gold)]">
          {hasPrice
            ? formatPrice(price, product.currency || "INR")
            : "Price on request"}
        </p>

        <div className="mt-4 border-t border-dashed border-[var(--pk-line)] pt-4">
          <a
            href={buildWhatsAppLink({ ...product, name: displayName })}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={soldOut}
            onClick={(event) => {
              if (soldOut) event.preventDefault();
            }}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm motion-safe:transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] ${
              soldOut
                ? "pointer-events-none bg-[var(--pk-ink)]/10 text-[var(--pk-ink)]/40 shadow-none"
                : "bg-[#25D366] text-white hover:bg-[#1EBE5A] active:bg-[#18A94F]"
            }`}
          >
            <WhatsAppIcon className="h-5 w-5" />
            Ask on WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
});

// Main category page
const CategoryPages = () => {
  const { wishlist, setWishlist } = React.useContext(Auth);
  const { slug } = useParams();

  const [products, setProducts] = React.useState([]);
  const [category, setCategory] = React.useState(null);
//------------------------------------------whihlist
  const [query, setQuery] = React.useState("");

  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);

  const [error, setError] = React.useState("");
  const [loadMoreError, setLoadMoreError] = React.useState("");

  const [totalProducts, setTotalProducts] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(false);

  const pageRef = React.useRef(1);
  const sentinelRef = React.useRef(null);
  const fetchingRef = React.useRef(false);
  const loadAbortRef = React.useRef(null);
  const loadNextPageRef = React.useRef(null);

  const isFiltering = query.trim() !== "";

  // Initial API fetch
  React.useEffect(() => {
    const controller = new AbortController();

    // purani "load more" request band karo
    loadAbortRef.current?.abort();

    setProducts([]);
    setCategory(null);
    setQuery("");

    setLoading(true);
    setLoadingMore(false);

    setError("");
    setLoadMoreError("");

    setTotalProducts(0);
    setHasMore(false);

    pageRef.current = 1;
    fetchingRef.current = false;

    const fetchData = async () => {
      try {
        const productsRequest = api.get(
          `/api/products/p1/${slug}?page=1&limit=${PAGE_SIZE}`,
          { signal: controller.signal },
        );

        const categoriesRequest = api
          .get("/api/categories/", { signal: controller.signal })
          .catch((err) => {
            if (err.code !== "ERR_CANCELED") {
              console.warn("Categories API error:", err.message);
            }

            return null;
          });

        const [productsResponse, categoriesResponse] = await Promise.all([
          productsRequest,
          categoriesRequest,
        ]);

        if (controller.signal.aborted) return;

        const productsData = productsResponse.data;

        const firstProducts = getProductsFromResponse(productsData).filter(
          (product) => product?.isActive !== false,
        );

        const pagination = getPaginationData(productsData, firstProducts);

        setProducts(firstProducts);
        setTotalProducts(pagination.totalProducts);
        setHasMore(pagination.hasMore);

        pageRef.current = pagination.currentPage || 1;

        if (categoriesResponse?.data) {
          const categories = getCategoriesFromResponse(categoriesResponse.data);

          setCategory(findCategoryBySlug(categories, slug));
        }
      } catch (err) {
        if (err.code === "ERR_CANCELED") return;

        console.error("Error fetching category products:", err);

        setError("We couldn't load the products. Please try again later.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      fetchData();
    } else {
      setError("Category slug URL mein nahi mila.");
      setLoading(false);
    }

    return () => {
      controller.abort();
      loadAbortRef.current?.abort();
    };
  }, [slug]);

  // Fetch next page (ek time par sirf ek request)
  const loadNextPage = React.useCallback(async () => {
    if (fetchingRef.current || !hasMore || loading || !slug) {
      return;
    }

    fetchingRef.current = true;

    const controller = new AbortController();
    loadAbortRef.current = controller;

    setLoadingMore(true);
    setLoadMoreError("");

    const nextPage = pageRef.current + 1;

    try {
      const response = await api.get(
        `/api/products/p1/${slug}?page=${nextPage}&limit=${PAGE_SIZE}`,
        { signal: controller.signal },
      );

      if (controller.signal.aborted) return;

      const data = response.data;

      const nextProducts = getProductsFromResponse(data).filter(
        (product) => product?.isActive !== false,
      );

      const pagination = getPaginationData(data, nextProducts);

      setProducts((previousProducts) => {
        const existingIds = new Set(
          previousProducts.map(
            (product) => product._id || product.sku || product.slug,
          ),
        );

        const uniqueProducts = nextProducts.filter((product) => {
          const id = product._id || product.sku || product.slug;

          return !existingIds.has(id);
        });

        // Server ka order as-it-is, neeche append (koi re-sort nahi)
        return [...previousProducts, ...uniqueProducts];
      });

      pageRef.current = nextPage;

      setTotalProducts(pagination.totalProducts);
      setHasMore(pagination.hasMore);
    } catch (err) {
      if (err.code === "ERR_CANCELED") return;

      console.error("Load more products error:", err);

      setLoadMoreError("More products load nahi ho paaye. Dobara try karein.");
    } finally {
      if (!controller.signal.aborted) {
        fetchingRef.current = false;
        setLoadingMore(false);
      }
    }
  }, [slug, loading, hasMore]);

  // Latest function hamesha ref me (observer ko dobara banana nahi padta)
  React.useEffect(() => {
    loadNextPageRef.current = loadNextPage;
  }, [loadNextPage]);

  const canObserve =
    !loading && hasMore && !loadMoreError && !isFiltering && !error;

  // Ek hi observer: user scroll karke sentinel ke paas aaye tab load
  React.useEffect(() => {
    const target = sentinelRef.current;

    if (!canObserve || !target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextPageRef.current?.();
        }
      },
      { rootMargin: `0px 0px ${PRELOAD_PX}px 0px`, threshold: 0 },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [canObserve]);

  // Active products
  const active = React.useMemo(
    () => products.filter((product) => product?.isActive !== false),
    [products],
  );

  // Normal list: server order. Search: SKU number order.
  const filtered = React.useMemo(() => {
    const q = normalize(query);

    if (!q) return active;

    return active
      .filter((product) => {
        const sku = product.sku || "";
        const name = product.name || product.title || "";

        return normalize(sku).includes(q) || normalize(name).includes(q);
      })
      .sort(compareSku);
  }, [active, query]);

  const loadedCount = active.length;

  const progress = totalProducts
    ? Math.min(100, Math.round((loadedCount / totalProducts) * 100))
    : 0;

  const categoryTitle =
    category?.name ||
    category?.title ||
    slug?.replace(/-/g, " ") ||
    "Jewellery";

  return (
    <section
      style={THEME}
      className="min-h-screen bg-[var(--pk-bg)] text-[var(--pk-ink)]"
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&display=swap');`}
      </style>

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 lg:pt-16">
        {/* Header */}
        <header className="border-b border-[var(--pk-line)] pb-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h1 className="font-['Fraunces'] text-4xl font-medium capitalize leading-[1.1] text-[var(--pk-maroon)] sm:text-5xl">
                {categoryTitle}
              </h1>

              <p className="mt-3 leading-relaxed text-[var(--pk-ink)]/70">
                {totalProducts} designs from PK Jewellery. Pick a design you
                like, then tap WhatsApp to ask for price and sizing.
              </p>
            </div>

            {/* Search */}
            <label className="relative block w-full md:w-80">
              <span className="sr-only">Search products</span>

              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--pk-gold)]" />

              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setLoadMoreError("");
                }}
                placeholder="Search SKU or product name"
                className="w-full rounded-full border border-[var(--pk-line)] bg-white py-3 pl-12 pr-5 text-sm text-[var(--pk-ink)] placeholder:text-[var(--pk-ink)]/40 focus:border-[var(--pk-gold)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pk-gold)]/30"
              />
            </label>
          </div>
        </header>

        {loading ? (
          // Pehli baar loading: skeleton grid
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="py-24 text-center">
            <p className="text-lg text-[var(--pk-maroon)]">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-[var(--pk-maroon)] px-6 py-2.5 text-sm font-medium text-white"
            >
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-['Fraunces'] text-2xl italic text-[var(--pk-ink)]/70">
              {isFiltering
                ? "No matching products found."
                : "No products found in this category."}
            </p>

            {isFiltering && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-6 rounded-lg border border-[var(--pk-maroon)] px-6 py-2.5 text-sm font-medium text-[var(--pk-maroon)] hover:bg-[var(--pk-maroon)] hover:text-white"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Product grid */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:gap-6 xl:grid-cols-4">
              {filtered.map((product, index) => (
                <ProductCard
                  key={product._id || product.sku || product.slug || index}
                  product={product}
                  wishlist={wishlist}
                  setWishlist={setWishlist}
                />
              ))}

              {/* Load more: skeleton cards grid ke andar */}
              {loadingMore &&
                !isFiltering &&
                Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={`sk-${i}`} />
                ))}
            </div>

            {/* Infinite scroll trigger */}
            {!isFiltering && hasMore && (
              <div ref={sentinelRef} className="h-px w-full" />
            )}

            {/* Bottom status: center me, neeche */}
            <div className="mt-14 flex flex-col items-center gap-3 text-center">
              {isFiltering ? (
                <>
                  <p className="text-sm text-[var(--pk-ink)]/70">
                    <span className="font-semibold text-[var(--pk-ink)]">
                      {filtered.length}
                    </span>{" "}
                    found in {loadedCount} loaded designs
                  </p>

                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="text-sm font-medium text-[var(--pk-maroon)] underline underline-offset-4 hover:text-[var(--pk-maroon-dark)]"
                  >
                    Clear search
                  </button>

                  <p className="text-xs text-[var(--pk-ink)]/50">
                    Search is performed on the products currently loaded.
                  </p>
                </>
              ) : (
                <>
                  <p
                    className="text-sm text-[var(--pk-ink)]/70"
                    aria-live="polite"
                  >
                    Showing{" "}
                    <span className="font-semibold text-[var(--pk-ink)]">
                      {loadedCount}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-[var(--pk-ink)]">
                      {totalProducts}
                    </span>{" "}
                    designs
                  </p>

                  <div
                    className="h-1 w-44 overflow-hidden rounded-full bg-[var(--pk-line)]"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                  >
                    <div
                      className="h-full rounded-full bg-[var(--pk-gold)] motion-safe:transition-[width] motion-safe:duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {loadingMore && (
                    <div className="mt-1 flex items-center gap-2 text-sm text-[var(--pk-ink)]/60">
                      <span className="h-4 w-4 rounded-full border-2 border-[var(--pk-line)] border-t-[var(--pk-gold)] motion-safe:animate-spin" />
                      Loading more designs
                    </div>
                  )}

                  {loadMoreError && (
                    <div className="mt-1">
                      <p className="text-sm text-[var(--pk-maroon)]">
                        {loadMoreError}
                      </p>

                      <button
                        type="button"
                        onClick={loadNextPage}
                        disabled={loadingMore}
                        className="mt-3 rounded-lg bg-[var(--pk-maroon)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--pk-maroon-dark)] disabled:opacity-50"
                      >
                        Try again
                      </button>
                    </div>
                  )}

                  {!hasMore && !loadingMore && products.length > 0 && (
                    <p className="mt-1 text-sm text-[var(--pk-ink)]/50">
                      You have viewed all {totalProducts} designs.
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CategoryPages;
