import { useEffect, useState } from "react";
import logo from "/pk-logo.png"; // 👈 path apne project ke hisaab se badal lena (e.g. ../assets/pk-logo.png)
 
/**
 * PK running loader  (React + Tailwind)
 *
 * <PKLoader />                      -> page poora load hone par hide hota hai
 * <PKLoader loading={isLoading} />  -> apne data fetch/state se control karo
 * <PKLoader minTime={3000} />       -> kam se kam kitni der dikhana hai (ms)
 *
 * Tailwind config me kuch add karne ki zaroorat nahi (v3 & v4 dono me chalega).
 */
 
const maskStyle = {
  WebkitMaskImage: `url(${logo})`,
  maskImage: `url(${logo})`,
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
};
 
const sparkles = [
  "top-[8%] left-[12%] h-4 w-4",
  "top-[18%] right-[6%] h-3 w-3 [animation-delay:.5s]",
  "bottom-[12%] left-[6%] h-3 w-3 [animation-delay:1s]",
  "bottom-[6%] right-[16%] h-4 w-4 [animation-delay:1.5s]",
];
 
export default function PKLoader({ loading, minTime = 2600 }) {
  const [start] = useState(() => Date.now());
  const [pageLoaded, setPageLoaded] = useState(
    typeof document !== "undefined" && document.readyState === "complete"
  );
  const [hide, setHide] = useState(false);
  const [mounted, setMounted] = useState(true);
 
  // loading prop diya hai to wahi use hoga, warna window "load" event
  const contentReady = loading === undefined ? pageLoaded : !loading;
 
  useEffect(() => {
    if (loading !== undefined || pageLoaded) return;
    const onLoad = () => setPageLoaded(true);
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, [loading, pageLoaded]);
 
  useEffect(() => {
    if (!contentReady) {
      setHide(false);
      setMounted(true);
      return;
    }
    const wait = Math.max(0, minTime - (Date.now() - start));
    const t1 = setTimeout(() => setHide(true), wait);
    const t2 = setTimeout(() => setMounted(false), wait + 650);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [contentReady, minTime, start]);
 
  if (!mounted) return null;
 
  return (
    <div
      data-pk-loader
      role="status"
      aria-label="Loading"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-6 bg-[radial-gradient(circle_at_50%_42%,#fffaf0_0%,#f6e6c4_100%)] transition-all duration-[600ms] ease-out ${
        hide ? "invisible opacity-0" : "visible opacity-100"
      }`}
    >
      {/* keyframes (Tailwind config me kuch add nahi karna padega) */}
      <style>{`
        @keyframes pkSpin{to{transform:rotate(360deg)}}
        @keyframes pkBob{0%,100%{transform:translateY(2px)}50%{transform:translateY(-6px)}}
        @keyframes pkPulse{0%,100%{transform:scale(.85);opacity:.6}50%{transform:scale(1.12);opacity:1}}
        @keyframes pkRunner{0%,100%{transform:scale(1)}50%{transform:scale(1.3)}}
        @keyframes pkFill{0%{clip-path:inset(100% 0 0 0)}65%,82%{clip-path:inset(0 0 0 0)}100%{clip-path:inset(0 0 0 0);opacity:0}}
        @keyframes pkShine{0%,60%{background-position:160% 0}100%{background-position:-60% 0}}
        @keyframes pkTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0)}50%{opacity:1;transform:scale(1) rotate(45deg)}}
        @keyframes pkDot{0%,100%{transform:translateY(0);opacity:.35}50%{transform:translateY(-5px);opacity:1}}
        @media (prefers-reduced-motion:reduce){[data-pk-loader] *{animation-duration:6s!important}}
      `}</style>
 
      <div className="relative grid aspect-square w-[min(62vw,270px)] place-items-center">
        {/* glow */}
        <div className="absolute h-[70%] w-[70%] animate-[pkPulse_2.4s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(255,205,90,.55),rgba(255,205,90,0)_70%)]" />
 
        {/* running ring + diamond runner */}
        <div className="absolute inset-0 animate-[pkSpin_2.2s_linear_infinite]">
          <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible" aria-hidden="true">
            <defs>
              <linearGradient id="pkGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ffe08a" />
                <stop offset="1" stopColor="#a86608" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(184,118,10,.18)" strokeWidth="2" />
            <circle
              cx="100" cy="100" r="96" fill="none"
              stroke="url(#pkGrad)" strokeWidth="4" strokeLinecap="round"
              strokeDasharray="160 600" transform="rotate(-180 100 100)"
            />
          </svg>
          <span className="absolute -top-[9px] left-1/2 -ml-[9px] h-[18px] w-[18px] animate-[pkRunner_.9s_ease-in-out_infinite] bg-gradient-to-br from-[#fff3c4] via-[#e0a01c] to-[#9a5f05] [clip-path:polygon(50%_0,100%_40%,50%_100%,0_40%)] [filter:drop-shadow(0_0_6px_rgba(255,190,50,.9))]" />
        </div>
 
        {/* logo: dim base + gold fill + shine */}
        <div className="relative aspect-[970/1050] w-[60%] animate-[pkBob_2.4s_ease-in-out_infinite]">
          <div
            className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-[.16]"
            style={{ backgroundImage: `url(${logo})` }}
          />
          <div
            className="absolute inset-0 animate-[pkFill_2.6s_cubic-bezier(.65,0,.35,1)_infinite] bg-gradient-to-b from-[#e9b23a] via-[#b8760a] to-[#8a5200]"
            style={maskStyle}
          />
          <div
            className="absolute inset-0 animate-[pkShine_2.6s_ease-in-out_infinite] bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,.95)_50%,transparent_65%)] [background-position:160%_0] [background-size:250%_100%]"
            style={maskStyle}
          />
        </div>
 
        {/* sparkles */}
        {sparkles.map((cls, i) => (
          <span
            key={i}
            className={`absolute animate-[pkTwinkle_2.2s_ease-in-out_infinite] bg-[#ffcf5a] opacity-0 [clip-path:polygon(50%_0,60%_40%,100%_50%,60%_60%,50%_100%,40%_60%,0_50%,40%_40%)] [filter:drop-shadow(0_0_4px_rgba(255,200,70,.9))] ${cls}`}
          />
        ))}
      </div>
 
      <p className="pl-[.38em] font-serif text-[15px] uppercase tracking-[.38em] text-[#8a5200]">
        Loading
        {[0, 0.15, 0.3].map((d, i) => (
          <span
            key={i}
            className="inline-block animate-[pkDot_1.2s_ease-in-out_infinite]"
            style={{ animationDelay: `${d}s` }}
          >
            .
          </span>
        ))}
      </p>
    </div>
  );
}
 