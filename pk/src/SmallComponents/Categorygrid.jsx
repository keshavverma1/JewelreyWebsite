
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Desktop:
 * Poster -> Hover -> Video
 *
 * Mobile:
 * Poster + Play Button -> Tap -> Video
 */

const tiles = [
  {
    title: "Ladies Rings",
    href: "/category/ladies-rings-1-100",
    video:
      "https://buket-pk-website.s3.us-east-1.amazonaws.com/pk+collection/Pencil_sketching_jewellery_desig%E2%80%A6_20261027225318+(1).mp4",
    poster: "/Analysis%20output%203.png",
    align: "bottom",
  },
  {
    title: "Men's Rings",
    href: "/category/mens-rings",
    video:
      "https://buket-pk-website.s3.us-east-1.amazonaws.com/pk+collection/Hand_drawing_ring_on_paper_20261027233300.mp4",
    poster: "/Analysis%20output%201.png",
    align: "right",
  },
  {
    title: "Pendants & Lockets",
    href: "/category/pendant",
    video:
      "https://buket-pk-website.s3.us-east-1.amazonaws.com/pk+collection/3D_printer_forming_wax_pendants_1285c25f.mp4",
    poster: "/Analysis%20output%202.png",
    align: "right",
  },
];

const overlay = {
  bottom:
    "bg-[linear-gradient(to_top,rgba(24,4,7,.7),transparent_55%)]",
  right:
    "bg-[linear-gradient(to_left,rgba(24,4,7,.86),rgba(24,4,7,.55)_45%,transparent_80%)]",
};

function LocketMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="absolute left-[8%] top-1/2 size-[52%] max-h-56 -translate-y-1/2 fill-none stroke-[#e2b25c] stroke-[.6] opacity-40"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 2.5c.9 4 3.2 6 7 6.2 3.8-.2 6.1-2.2 7-6.2" />
      <path d="M12 8.7v2.6" />
      <path d="M12 22s-6.2-3.9-6.2-8.7a3.6 3.6 0 0 1 6.2-2.4 3.6 3.6 0 0 1 6.2 2.4C18.2 18.1 12 22 12 22z" />
      <path d="M12 14.5v3M10.5 16h3" />
    </svg>
  );
}

function PlayIcon({ playing }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="currentColor"
      aria-hidden="true"
    >
      {playing ? (
        <path d="M7 5h4v14H7zM15 5h4v14h-4z" />
      ) : (
        <path d="M8 5.5v13l11-6.5z" />
      )}
    </svg>
  );
}

function Tile({ tile, className = "", big = false }) {
  const { title, href, video, poster, align } = tile;

  const isBottom = align === "bottom";

  const videoRef = useRef(null);

  const [videoReady, setVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Start video
  const playVideo = async () => {
    const element = videoRef.current;

    if (!element) return;

    try {
      await element.play();
    } catch (error) {
      console.log("Video playback failed:", error);
    }
  };

  // Desktop hover
  const handlePointerEnter = (event) => {
    if (event.pointerType !== "mouse") return;

    playVideo();
  };

  // Desktop mouse leave
  const handlePointerLeave = (event) => {
    if (event.pointerType !== "mouse") return;

    resetVideo();
  };

  // Mobile play/pause
  const handleMobilePlay = () => {
    const element = videoRef.current;

    if (!element) return;

    if (element.paused) {
      playVideo();
    } else {
      resetVideo();
    }
  };

  // Video ready
  const handleVideoPlaying = () => {
    setVideoReady(true);
    setIsPlaying(true);
  };

  // Video paused
  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  // Reset video and show poster
  const resetVideo = () => {
    const element = videoRef.current;

    if (!element) return;

    element.pause();
    element.currentTime = 0;

    setVideoReady(false);
    setIsPlaying(false);
  };

  return (
    <div
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`group relative isolate block overflow-hidden rounded-lg bg-[#430609] ${className}`}
    >
      {/* Poster Image */}
      {poster ? (
        <img
          src={poster}
          alt=""
          loading="lazy"
          className="absolute inset-0 z-0 size-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_25%_45%,#8a1220,#4a0710_55%,#2e0508)]">
          <LocketMark />
        </div>
      )}

      {/* Video */}
      {video && (
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="none"
          onPlaying={handleVideoPlaying}
          onPause={handleVideoPause}
          aria-hidden="true"
          className={`absolute inset-0 z-10 size-full object-cover transition-opacity duration-500 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={video} type="video/mp4" />
        </video>
      )}

      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 z-20 pointer-events-none ${
          overlay[align] || ""
        }`}
      />

      {/* Category Link */}
      <Link
        to={href}
        className="absolute inset-0 z-30 block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8923a]"
        aria-label={`Shop ${title}`}
      >
        <div
          className={
            isBottom
              ? "absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-8 text-center sm:pb-10"
              : "absolute inset-y-0 right-0 flex w-3/5 flex-col items-center justify-center px-4 text-center"
          }
        >
          <span
            className={`font-[Cormorant_Garamond,Georgia,serif] font-semibold leading-tight text-[#fff4e0] drop-shadow-[0_2px_8px_rgba(0,0,0,.45)] ${
              big ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
            }`}
          >
            {title}
          </span>

          <span
            aria-hidden="true"
            className="mt-3 h-px w-10 bg-[#e2b25c] transition-all duration-500 group-hover:w-24"
          />
        </div>
      </Link>

      {/* Mobile Play Button */}
      <button
        type="button"
        onClick={handleMobilePlay}
        aria-label={isPlaying ? "Pause video" : "Play video"}
        className="absolute bottom-3 right-3 z-40 md:hidden flex items-center gap-2 rounded-full border border-[#e2b25c]/40 bg-[#240609]/45 px-3 py-2 text-[#fff4e0] shadow-lg backdrop-blur-md transition-all duration-300 active:scale-95"
      >
        <PlayIcon playing={isPlaying} />

        <span className="text-[10px] font-medium tracking-[1.5px] uppercase">
          {isPlaying ? "Tap to Pause" : "Tap to Play"}
        </span>
      </button>
    </div>
  );
}

export default function CategoryGrid() {
  const [left, topRight, bottomRight] = tiles;

  return (
    <section
      aria-label="Shop by category"
      className="mx-auto w-full max-w-[1100px] py-6 sm:py-8"
    >
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">

        {/* Ladies Rings */}
        <Tile
          tile={left}
          big
          className="aspect-[4/5] md:row-span-2 md:aspect-[535/635]"
        />

        {/* Men's Rings */}
        <Tile
          tile={topRight}
          className="aspect-[16/9] md:aspect-auto"
        />

        {/* Pendants & Lockets */}
        <Tile
          tile={bottomRight}
          className="aspect-[16/9] md:aspect-auto"
        />

      </div>
    </section>
  );
}
