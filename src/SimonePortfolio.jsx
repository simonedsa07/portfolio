import React, { useState, useEffect, useRef } from "react";
import simonePhoto from "./assets/simone.jpg";

/* ============================================================
   PALETTE — pastel iridescent / chrome / bold ink
   ============================================================ */
const C = {
  bg: "var(--bg)",
  ink: "var(--ink)",
  white: "var(--white)",
  blue: "var(--blue)",
  pink: "var(--pink)",
  purple: "var(--purple)",
  mint: "var(--mint)",
  peach: "var(--peach)",
  red: "var(--red)",
  green: "var(--green)",
  mute: "var(--mute)",
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,500;1,9..144,600&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`;

const display = { fontFamily: "'Fraunces', serif" };
const bodyFont = { fontFamily: "'Space Grotesk', sans-serif" };
const mono = { fontFamily: "'JetBrains Mono', monospace" };

/* ============================================================
   HOOKS
   ============================================================ */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, from = "translateY(48px)", to = "translate(0,0)", delay = 0, duration = 800, className = "", style = {}, as: Tag = "div" }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? to : from,
        transition: `opacity ${duration}ms cubic-bezier(.19,1,.22,1) ${delay}ms, transform ${duration}ms cubic-bezier(.19,1,.22,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}

function useParallax(speed = 0.2, rotateSpeed = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ticking = false;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const centerOffset = window.innerHeight / 2 - (rect.top + rect.height / 2);
      const y = centerOffset * speed;
      const r = centerOffset * rotateSpeed;
      el.style.transform = `translateY(${-y}px) rotate(${r}deg)`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed, rotateSpeed]);
  return ref;
}

function useMagnetic(strength = 0.3) {
  const ref = useRef(null);
  const rectRef = useRef(null);
  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    if (!rectRef.current) {
      rectRef.current = el.getBoundingClientRect();
    }
    const r = rectRef.current;
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };
  const onMouseLeave = () => {
    rectRef.current = null;
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };
  return { ref, onMouseMove, onMouseLeave };
}

/* ============================================================
   CHROME — cursor glow, scroll progress, edge badges, scroll-top pill
   ============================================================ */
function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0, raf;
    const move = (e) => { mx = e.clientX; my = e.clientY; };
    const loop = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ref.current) ref.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className="cursor-glow" aria-hidden />;
}

function ScrollProgressBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setP(Math.min(1, Math.max(0, h.scrollTop / (h.scrollHeight - h.clientHeight || 1))));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, height: 3, width: "100%", zIndex: 200, background: "rgba(11,11,12,0.06)" }}>
      <div style={{ height: "100%", width: `${p * 100}%`, background: `linear-gradient(90deg, ${C.blue}, ${C.pink}, ${C.purple}, ${C.mint})`, transition: "width 0.1s linear" }} />
    </div>
  );
}

function EdgeBadge({ side = "left", text }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className="edge-badge"
      style={{
        [side]: 14,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease 400ms",
      }}
    >
      <span>{text}</span>
    </div>
  );
}

function ScrollTopPill() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="scroll-top-pill"
      style={{ opacity: show ? 1 : 0, pointerEvents: show ? "auto" : "none", transform: show ? "translateY(0)" : "translateY(10px)" }}
      aria-label="Scroll to top"
    >
      <span className="pulse-dot" /> top
    </button>
  );
}

/* Decorative floating sticker shapes */
function PaperPlane({ size = 46, color = C.blue }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M4 24L44 6L26 44L21 27L4 24Z" fill={color} stroke={C.ink} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M21 27L44 6" stroke={C.ink} strokeWidth="1.2" />
    </svg>
  );
}
function Blob({ size = 40, color = C.red }) {
  return <div style={{ width: size, height: size * 0.85, background: color, borderRadius: "42% 58% 65% 35% / 55% 45% 55% 45%", border: `1.5px solid ${C.ink}` }} />;
}
function Squiggle({ size = 50, color = C.pink }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 60 36" fill="none">
      <path d="M2 30C10 6 18 6 26 20C34 34 42 34 50 10C52 6 55 4 58 4" stroke={color} strokeWidth="6" strokeLinecap="round" />
      <path d="M2 30C10 6 18 6 26 20C34 34 42 34 50 10C52 6 55 4 58 4" stroke={C.ink} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function Flower({ size = 52, color = C.pink }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      {/* petals */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx={28 + Math.cos((deg * Math.PI) / 180) * 12}
          cy={28 + Math.sin((deg * Math.PI) / 180) * 12}
          rx="8" ry="5"
          transform={`rotate(${deg} ${28 + Math.cos((deg * Math.PI) / 180) * 12} ${28 + Math.sin((deg * Math.PI) / 180) * 12})`}
          fill={color} stroke={C.ink} strokeWidth="1.2"
        />
      ))}
      {/* centre */}
      <circle cx="28" cy="28" r="7" fill={C.peach} stroke={C.ink} strokeWidth="1.4" />
      <circle cx="26" cy="26" r="1.5" fill={C.ink} opacity="0.4" />
      <circle cx="30" cy="27" r="1" fill={C.ink} opacity="0.3" />
    </svg>
  );
}

function Camera({ size = 52, color = C.mint }) {
  return (
    <svg width={size} height={size * 0.82} viewBox="0 0 56 46" fill="none">
      {/* body */}
      <rect x="2" y="10" width="52" height="33" rx="5" fill={color} stroke={C.ink} strokeWidth="1.5" />
      {/* viewfinder bump */}
      <path d="M18 10V5C18 3.9 18.9 3 20 3H36C37.1 3 38 3.9 38 5V10Z" fill={color} stroke={C.ink} strokeWidth="1.5" />
      {/* lens outer */}
      <circle cx="28" cy="27" r="9" fill={C.white} stroke={C.ink} strokeWidth="1.5" />
      {/* lens inner */}
      <circle cx="28" cy="27" r="5.5" fill={C.blue} stroke={C.ink} strokeWidth="1" />
      {/* lens shine */}
      <circle cx="25.5" cy="24.5" r="1.5" fill={C.white} opacity="0.7" />
      {/* flash */}
      <rect x="6" y="14" width="8" height="5" rx="2" fill={C.yellow || C.peach} stroke={C.ink} strokeWidth="1.2" />
    </svg>
  );
}

function CatFace({ size = 52, color = C.purple }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      {/* ears */}
      <polygon points="6,18 14,4 20,18" fill={color} stroke={C.ink} strokeWidth="1.4" strokeLinejoin="round" />
      <polygon points="36,18 42,4 50,18" fill={color} stroke={C.ink} strokeWidth="1.4" strokeLinejoin="round" />
      {/* inner ears */}
      <polygon points="9,16 14,7 18,16" fill={C.pink} />
      <polygon points="38,16 42,7 47,16" fill={C.pink} />
      {/* head */}
      <ellipse cx="28" cy="33" rx="22" ry="20" fill={color} stroke={C.ink} strokeWidth="1.5" />
      {/* eyes */}
      <ellipse cx="20" cy="30" rx="3.5" ry="4" fill={C.ink} />
      <ellipse cx="36" cy="30" rx="3.5" ry="4" fill={C.ink} />
      <circle cx="21.2" cy="28.8" r="1.2" fill={C.white} />
      <circle cx="37.2" cy="28.8" r="1.2" fill={C.white} />
      {/* nose */}
      <path d="M26 36 L28 34 L30 36 Z" fill={C.pink} stroke={C.ink} strokeWidth="0.8" />
      {/* mouth */}
      <path d="M24 38 Q28 41 32 38" stroke={C.ink} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* whiskers left */}
      <line x1="6" y1="35" x2="20" y2="36" stroke={C.ink} strokeWidth="0.9" strokeLinecap="round" />
      <line x1="6" y1="39" x2="20" y2="38" stroke={C.ink} strokeWidth="0.9" strokeLinecap="round" />
      {/* whiskers right */}
      <line x1="36" y1="36" x2="50" y2="35" stroke={C.ink} strokeWidth="0.9" strokeLinecap="round" />
      <line x1="36" y1="38" x2="50" y2="39" stroke={C.ink} strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

function BubbleCluster({ size = 60, color = C.blue }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="32" r="18" fill={`${color}55`} stroke={color} strokeWidth="1.5" />
      <circle cx="30" cy="32" r="18" fill="none" stroke={C.ink} strokeWidth="1" opacity="0.5" />
      <circle cx="14" cy="20" r="10" fill={`${color}44`} stroke={color} strokeWidth="1.3" />
      <circle cx="14" cy="20" r="10" fill="none" stroke={C.ink} strokeWidth="0.8" opacity="0.4" />
      <circle cx="44" cy="16" r="7" fill={`${color}44`} stroke={color} strokeWidth="1.2" />
      <circle cx="44" cy="16" r="7" fill="none" stroke={C.ink} strokeWidth="0.8" opacity="0.4" />
      {/* shine reflections */}
      <circle cx="25" cy="26" r="3" fill={C.white} opacity="0.45" />
      <circle cx="11" cy="16" r="2" fill={C.white} opacity="0.45" />
      <circle cx="41" cy="13" r="1.5" fill={C.white} opacity="0.45" />
    </svg>
  );
}

function IcedCoffee({ size = 52, color = "#C4A482" }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 40 52" fill="none">
      {/* Straw */}
      <line x1="26" y1="2" x2="16" y2="28" stroke="#FFB8E6" strokeWidth="3" strokeLinecap="round" />
      <line x1="26" y1="2" x2="16" y2="28" stroke={C.ink} strokeWidth="0.8" strokeLinecap="round" />
      {/* Lid */}
      <path d="M7 16 C 7 10, 33 10, 33 16" fill={C.white} stroke={C.ink} strokeWidth="1.5" />
      <rect x="5" y="15" width="30" height="3" rx="1.5" fill={C.white} stroke={C.ink} strokeWidth="1.5" />
      {/* Coffee Liquid */}
      <path d="M9 22 L31 22 L27 46 L13 46 Z" fill={color} />
      {/* Ice Cubes */}
      <rect x="12" y="24" width="7" height="7" rx="1" transform="rotate(15 12 24)" fill={C.white} opacity="0.6" stroke={C.ink} strokeWidth="1" />
      <rect x="22" y="28" width="6" height="6" rx="1" transform="rotate(-10 22 28)" fill={C.white} opacity="0.6" stroke={C.ink} strokeWidth="1" />
      {/* Cup Body */}
      <path d="M8 18 L32 18 L28 48 C27.8 49 26.8 50 25 50 L15 50 C13.2 50 12.2 49 12 48 Z" stroke={C.ink} strokeWidth="1.5" strokeLinejoin="round" />
      {/* Condensation drips */}
      <circle cx="12" cy="38" r="1" fill={C.blue} />
      <circle cx="28" cy="32" r="0.8" fill={C.blue} />
    </svg>
  );
}

function Headphones({ size = 52, color = C.purple }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Arch/Band */}
      <path d="M8 24 A 16 16 0 0 1 40 24" stroke={C.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M6 24 A 18 18 0 0 1 42 24" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Earcup connectors */}
      <line x1="8" y1="22" x2="8" y2="30" stroke={C.ink} strokeWidth="1.5" />
      <line x1="40" y1="22" x2="40" y2="30" stroke={C.ink} strokeWidth="1.5" />
      {/* Earcups */}
      <rect x="4" y="24" width="8" height="12" rx="3.5" fill={color} stroke={C.ink} strokeWidth="1.5" />
      <rect x="36" y="24" width="8" height="12" rx="3.5" fill={color} stroke={C.ink} strokeWidth="1.5" />
      {/* Inner ear cushions */}
      <rect x="9" y="26" width="3" height="8" rx="1.5" fill={C.white} stroke={C.ink} strokeWidth="1" />
      <rect x="36" y="26" width="3" height="8" rx="1.5" fill={C.white} stroke={C.ink} strokeWidth="1" />
    </svg>
  );
}

function MiniCodeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function MiniLayoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}

function MiniDbIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
    </svg>
  );
}

function MiniSparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
      <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
    </svg>
  );
}

function MiniUsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function MiniPaletteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
      <path d="M12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22Z" />
      <circle cx="7.5" cy="10.5" r="1.5" fill="currentColor" />
      <circle cx="11.5" cy="7.5" r="1.5" fill="currentColor" />
      <circle cx="16.5" cy="9.5" r="1.5" fill="currentColor" />
    </svg>
  );
}


/* Orbiting node diagram — center label with satellite dots
   circling on dashed rings, sly.systems "engine" motif */
function OrbitDiagram({ size = 200 }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="orbit-ring" style={{ inset: 0 }} />
      <div className="orbit-ring" style={{ inset: "18%" }} />
      <div className="orbit-spin" style={{ inset: 0, animationDuration: "14s" }}>
        <span className="orbit-dot" style={{ background: C.blue }} />
      </div>
      <div className="orbit-spin" style={{ inset: "18%", animationDuration: "10s", animationDirection: "reverse" }}>
        <span className="orbit-dot" style={{ background: C.pink }} />
      </div>
      <div className="orbit-spin" style={{ inset: 0, animationDuration: "20s", animationDelay: "-6s" }}>
        <span className="orbit-dot" style={{ background: C.purple, top: "auto", bottom: 0 }} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="chrome-text" style={{ ...display, fontStyle: "italic", fontSize: size * 0.36, fontWeight: 700, display: "inline-block", lineHeight: 1.2, padding: "0 0.15em", textAlign: "center" }}>S</span>
      </div>
    </div>
  );
}

/* ============================================================
   ORBITING TOOL ICONS — scattered in hero, orbit on hover-stop
   ============================================================ */
/* Inline Vector Brand Logos */
function ReactLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="8" fill="#00D8FF" />
      <ellipse cx="50" cy="50" rx="38" ry="14" stroke="#00D8FF" strokeWidth="4" />
      <ellipse cx="50" cy="50" rx="38" ry="14" stroke="#00D8FF" strokeWidth="4" transform="rotate(60 50 50)" />
      <ellipse cx="50" cy="50" rx="38" ry="14" stroke="#00D8FF" strokeWidth="4" transform="rotate(120 50 50)" />
    </svg>
  );
}

function TailwindLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 6.09 C8.2 6.09, 5.8 7.99, 4.85 11.79 C6.27 9.89, 7.69 9.18, 9.11 9.65 C9.92 9.92, 10.5 10.52, 11.13 11.17 C12.17 12.24, 13.43 13.53, 17.15 13.53 C20.95 13.53, 23.32 11.63, 24.27 7.83 C22.85 9.73, 21.43 10.44, 20.01 9.97 C19.2 9.7, 18.62 9.1, 17.99 8.45 C16.95 7.38, 15.69 6.09, 12 6.09 Z M4.85 13.53 C1.05 13.53, -1.32 15.43, -2.27 19.23 C-0.85 17.33, 0.57 16.62, 1.99 17.09 C2.8 17.36, 3.38 17.96, 4.01 18.61 C5.05 19.68, 6.31 20.97, 10.03 20.97 C13.83 20.97, 16.2 19.07, 17.15 15.27 C15.73 17.17, 14.31 17.88, 12.89 17.41 C12.08 17.14, 11.5 16.54, 10.87 15.89 C9.83 14.82, 8.57 13.53, 4.85 13.53 Z" fill="#06B6D4" />
    </svg>
  );
}

function FigmaLogo({ size = 36 }) {
  return (
    <svg width={size * 0.67} height={size} viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 0,25 C 0,11.2 11.2,0 25,0 C 38.8,0 50,11.2 50,25 L 50,50 L 25,50 C 11.2,50 0,38.8 0,25 Z" fill="#F24E1E" />
      <path d="M 50,25 C 50,11.2 61.2,0 75,0 C 88.8,0 100,11.2 100,25 C 100,38.8 88.8,50 75,50 L 50,50 Z" fill="#FF7262" />
      <path d="M 0,75 C 0,61.2 11.2,50 25,50 L 50,50 L 50,100 L 25,100 C 11.2,100 0,88.8 0,75 Z" fill="#A259FF" />
      <circle cx="75" cy="75" r="25" fill="#1ABC9C" />
      <path d="M 0,125 C 0,111.2 11.2,100 25,100 C 38.8,100 50,111.2 50,125 C 50,138.8 38.8,150 25,150 C 11.2,150 0,138.8 0,125 Z" fill="#0ACF83" />
    </svg>
  );
}

function SupabaseLogo({ size = 36 }) {
  return (
    <svg width={size * 0.92} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.36 11.02a.85.85 0 0 0-.75-.52h-7.65L16.2 3.12a.85.85 0 0 0-1.44-.84l-11.4 14.4a.85.85 0 0 0 .75 1.36h7.65L8.5 25.32a.85.85 0 0 0 1.44.84l11.4-14.4a.85.85 0 0 0 .02-.74z" fill="#3ECF8E" />
    </svg>
  );
}

function CanvaLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="50" fill="url(#canvaBgGrad)" />
      <defs>
        <linearGradient id="canvaBgGrad" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00C4CC" />
          <stop offset="100%" stopColor="#7D2AE8" />
        </linearGradient>
      </defs>
      <path d="M 76,51 C 74,40 64,36 54,38 C 42,40 34,51 34,62 C 34,74 44,83 55,83 C 65,83 73,77 75,70 L 68,68 C 66,73 61,76 55,76 C 48,76 41,70 41,62 C 41,53 47,45 54,44 C 61,43 67,46 69,53 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.2" />
    </svg>
  );
}

function NextjsLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#000000" stroke="#FFFFFF" strokeWidth="1.5" />
      <path d="M16.5 17.5 L8.5 7.5 H7.5 V16.5 H8.5 V9.5 L15.5 17.5 Z" fill="#FFFFFF" />
    </svg>
  );
}

function TypeScriptLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="3" fill="#3178C6" />
      <text x="5" y="17" fill="#FFFFFF" fontFamily="sans-serif" fontSize="11" fontWeight="bold">TS</text>
    </svg>
  );
}

function GitLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12a3 3 0 0 0-2.82-2H13V7.82a3 3 0 1 0-2 0V15.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 1.5-1.5h.32a3 3 0 1 0 0-2H8A3.5 3.5 0 0 0 4.5 15.5 3.5 3.5 0 0 0 8 19a3.5 3.5 0 0 0 3.5-3.5V8.82A3 3 0 0 0 13 8h3.18A3 3 0 1 0 19 12z" fill="#F05032" />
    </svg>
  );
}

/* ============================================================
   ORBITING TOOL ICONS — scattered in hero, orbit on hover-stop
   ============================================================ */
const TOOLS = [
  { label: "React", color: "#8EC9FF", LogoComponent: ReactLogo },
  { label: "Next.js", color: "#C9B6FF", LogoComponent: NextjsLogo },
  { label: "TypeScript", color: "#8EC9FF", LogoComponent: TypeScriptLogo },
  { label: "Figma", color: "#FFB8E6", LogoComponent: FigmaLogo },
  { label: "Supabase", color: "#B6FFE0", LogoComponent: SupabaseLogo },
  { label: "Tailwind", color: "#FFD9B8", LogoComponent: TailwindLogo },
  { label: "Git", color: "#FF4D4D", LogoComponent: GitLogo },
  { label: "Canva", color: "#C9B6FF", LogoComponent: CanvaLogo },
];

const TOOL_ANCHORS = [
  { x: 72, y: 14 },
  { x: 84, y: 32 },
  { x: 78, y: 54 },
  { x: 68, y: 72 },
  { x: 56, y: 84 },
  { x: 88, y: 66 },
  { x: 63, y: 20 },
  { x: 92, y: 46 },
];

function OrbitingTool({ label, color, LogoComponent, anchor, index }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const angleRef = useRef(index * (360 / TOOLS.length));
  const rafRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const radius = 20;
    const speed = 0.55 + index * 0.1;
    const animate = () => {
      if (!pausedRef.current) {
        angleRef.current = (angleRef.current + speed) % 360;
      }
      const rad = (angleRef.current * Math.PI) / 180;
      el.style.transform = `translate(${Math.cos(rad) * radius}px, ${Math.sin(rad) * radius}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [index]);

  const handleEnter = () => { pausedRef.current = true; setHovered(true); };
  const handleLeave = () => { pausedRef.current = false; setHovered(false); };

  return (
    <div style={{ position: "absolute", left: `${anchor.x}%`, top: `${anchor.y}%`, transform: "translate(-50%,-50%)", zIndex: 3 }}>
      <div style={{ position: "absolute", inset: -20, borderRadius: "50%", border: `1.5px dashed ${color}`, opacity: hovered ? 0.75 : 0, transition: "opacity 0.3s", pointerEvents: "none" }} />
      <div
        ref={ref}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        title={label}
        style={{
          width: 76, height: 76, borderRadius: "50%",
          background: `linear-gradient(135deg, ${color}CC, ${color}44)`,
          border: `1.5px solid rgba(11,11,12,0.2)`,
          boxShadow: hovered ? `0 8px 28px ${color}88` : `3px 3px 0 rgba(11,11,12,0.1)`,
          display: "flex", alignItems: "center", justifycontent: "center",
          cursor: "pointer", willChange: "transform", backdropFilter: "blur(4px)",
          transition: "box-shadow 0.3s, width 0.3s, height 0.3s",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <LogoComponent size={36} />
      </div>
    </div>
  );
}

/* ============================================================
   FLIPPABLE PROCESS CARD — front: icon+desc, back: tools used
   ============================================================ */
const PROCESS_BACK = [
  { tools: ["Research", "User Interviews", "Problem Mapping"], icon: "\uD83D\uDD0D" },
  { tools: ["Figma", "Wireframes", "Prototyping"], icon: "\uD83C\uDFA8" },
  { tools: ["React", "Next.js", "Supabase"], icon: "\u2699\uFE0F" },
  { tools: ["Vercel", "Testing", "Iteration"], icon: "\uD83D\uDE80" },
];

function FlipProcessCard({ Icon, title, desc, delay, backIndex }) {
  const [flipped, setFlipped] = useState(false);
  const back = PROCESS_BACK[backIndex];
  const pastelBgs = ["#8EC9FF", "#FFB8E6", "#B6FFE0", "#FFD9B8"];

  return (
    <Reveal delay={delay} from="translateY(36px) scale(0.94)" to="translateY(0) scale(1)" duration={700}>
      <div
        className="flip-card"
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        style={{ height: 204 }}
      >
        <div className={`flip-inner${flipped ? " flipped" : ""}`}>
          <div className="flip-face flip-front card-hard rounded-sm p-5">
            <Icon />
            <p className="text-sm font-semibold mt-4 mb-1 uppercase tracking-wide" style={{ ...bodyFont, color: C.ink }}>{title}</p>
            <p className="text-xs leading-relaxed" style={{ ...mono, color: C.mute }}>{desc}</p>
          </div>
          <div className="flip-face flip-back rounded-sm p-5" style={{ background: `linear-gradient(135deg, ${pastelBgs[backIndex % 4]}88, #C9B6FF44)`, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1.5px solid var(--ink)", boxShadow: "8px 8px 0 var(--shadow-color)" }}>
            <span style={{ fontSize: 28 }}>{back.icon}</span>
            <p className="text-xs font-bold uppercase tracking-widest mt-3 mb-2" style={{ ...mono, color: C.ink }}>{title}</p>
            <div className="flex flex-wrap gap-1">
              {back.tools.map((t) => (
                <span key={t} style={{ ...mono, fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "var(--surface)", border: "1px solid var(--ink)", color: "var(--ink)" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ============================================================
   SHARED PIECES
   ============================================================ */
function Eyebrow({ index, label }) {
  return (
    <Reveal from="translateX(-24px)" to="translateX(0)" duration={600} className="flex items-center gap-4 mb-8 sm:mb-10">
      <span className="text-xs px-2 py-1 border rounded-sm shrink-0" style={{ ...mono, borderColor: C.ink, color: C.ink }}>{index}</span>
      <span className="text-xs tracking-[0.2em] uppercase shrink-0" style={{ ...mono, color: C.ink }}>{label}</span>
      <span className="h-px flex-1" style={{ background: "rgba(11,11,12,0.2)" }} />
    </Reveal>
  );
}

function Chip({ children, delay = 0, bg = C.white }) {
  const [ref, visible] = useReveal();
  return (
    <span
      ref={ref}
      className="frost-chip inline-block text-sm px-3.5 py-1.5 rounded-full mr-2 mb-2"
      style={{
        ...bodyFont, color: C.ink, backgroundColor: bg,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(14px) scale(0.85)",
        transition: `opacity 500ms cubic-bezier(.19,1,.22,1) ${delay}ms, transform 500ms cubic-bezier(.19,1,.22,1) ${delay}ms, box-shadow 0.3s ease`,
      }}
    >
      {children}
    </span>
  );
}

function InkButton({ children, href, delay = 0 }) {
  const mag = useMagnetic(0.25);
  return (
    <Reveal as="span" delay={delay} from="translateY(20px) scale(0.9)" to="translateY(0) scale(1)" duration={500}>
      <a
        ref={mag.ref}
        onMouseMove={mag.onMouseMove}
        onMouseLeave={mag.onMouseLeave}
        href={href}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noreferrer" : undefined}
        className="ink-btn inline-block px-7 py-3 rounded-full text-sm font-medium"
        style={{ ...mono, color: C.white, backgroundColor: C.ink }}
      >
        {children}
      </a>
    </Reveal>
  );
}

function Mesh() {
  const a = useParallax(0.08);
  const b = useParallax(-0.12);
  const c = useParallax(0.05);
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div ref={a} className="mesh-blob" style={{ width: 480, height: 480, top: "-15%", left: "-10%", background: C.blue }} />
      <div ref={b} className="mesh-blob" style={{ width: 420, height: 420, top: "10%", right: "-10%", background: C.pink }} />
      <div ref={c} className="mesh-blob" style={{ width: 400, height: 400, bottom: "-20%", left: "20%", background: C.purple }} />
      <div className="mesh-blob mesh-still" style={{ width: 320, height: 320, bottom: "0%", right: "15%", background: C.mint }} />
    </div>
  );
}

/* ============================================================
   PROCESS ROW — "four moves" style line-art icon cards
   ============================================================ */
function IconScan() {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
      <circle cx="23" cy="23" r="18" stroke={C.ink} strokeWidth="1.2" opacity="0.5" />
      <circle cx="23" cy="23" r="11" stroke={C.ink} strokeWidth="1.2" opacity="0.7" />
      <circle className="icon-pulse-dot" cx="23" cy="23" r="3" fill={C.blue} stroke={C.ink} strokeWidth="1" />
    </svg>
  );
}
function IconLayers() {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
      <g className="icon-layers">
        <path d="M23 8L40 17L23 26L6 17L23 8Z" stroke={C.ink} strokeWidth="1.2" fill={C.purple} fillOpacity="0.5" />
        <path d="M6 24L23 33L40 24" stroke={C.ink} strokeWidth="1.2" />
        <path d="M6 31L23 40L40 31" stroke={C.ink} strokeWidth="1.2" opacity="0.6" />
      </g>
    </svg>
  );
}
function IconNode() {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
      <g className="icon-twinkle">
        <line x1="23" y1="23" x2="23" y2="6" stroke={C.ink} strokeWidth="1" opacity="0.5" />
        <line x1="23" y1="23" x2="38" y2="16" stroke={C.ink} strokeWidth="1" opacity="0.5" />
        <line x1="23" y1="23" x2="38" y2="32" stroke={C.ink} strokeWidth="1" opacity="0.5" />
        <line x1="23" y1="23" x2="10" y2="34" stroke={C.ink} strokeWidth="1" opacity="0.5" />
        <line x1="23" y1="23" x2="8" y2="14" stroke={C.ink} strokeWidth="1" opacity="0.5" />
        <circle cx="23" cy="23" r="4" fill={C.pink} stroke={C.ink} strokeWidth="1" />
        <circle cx="23" cy="6" r="2" fill={C.ink} />
        <circle cx="38" cy="16" r="2" fill={C.ink} />
        <circle cx="38" cy="32" r="2" fill={C.ink} />
        <circle cx="10" cy="34" r="2" fill={C.ink} />
        <circle cx="8" cy="14" r="2" fill={C.ink} />
      </g>
    </svg>
  );
}
function IconMark() {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
      <line x1="4" y1="30" x2="42" y2="30" stroke={C.ink} strokeWidth="1.2" opacity="0.5" />
      <path className="icon-rise" d="M13 30a10 10 0 0 1 20 0Z" fill={C.peach} stroke={C.ink} strokeWidth="1.2" />
    </svg>
  );
}

function ProcessCard({ Icon, title, desc, delay }) {
  return (
    <Reveal delay={delay} from="translateY(36px) scale(0.94)" to="translateY(0) scale(1)" duration={700} className="card-hard rounded-sm p-5 hover-lift">
      <Icon />
      <p className="text-sm font-semibold mt-4 mb-1 uppercase tracking-wide" style={{ ...bodyFont, color: C.ink }}>{title}</p>
      <p className="text-xs leading-relaxed" style={{ ...mono, color: C.mute }}>{desc}</p>
    </Reveal>
  );
}


/* ============================================================
   CARD DECK — scatter on hover, collapse when cursor leaves / scrolled out
   ============================================================ */
function CardDeck({ items }) {
  const [scattered, setScattered] = useState(false);
  const wrapRef = useRef(null);
  const n = items.length;

  /* Auto-collapse when section exits viewport */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (!entry.isIntersecting) setScattered(false); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Check mobile state to bypass fanning/absolute positioning */
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div ref={wrapRef} className="w-full relative">
      <p className="text-xs mb-8 tracking-[0.2em] uppercase text-center sm:text-left" style={{ ...mono, color: C.mute }}>
        {scattered ? "move cursor away to collapse ←" : "hover the deck to scatter →"}
      </p>

      {/* Flex container that handles either fanned overlap or wrapped scattering */}
      <div
        onMouseLeave={() => setScattered(false)}
        className="relative mx-auto flex no-scrollbar"
        style={{
          width: "100%",
          maxWidth: 1320,
          flexWrap: "wrap",
          justifyContent: "center",
          overflowX: "visible",
          padding: "16px 16px 24px",
          gap: scattered || isMobile ? 16 : 0,
          transition: "gap 0.5s cubic-bezier(.22,1,.36,1)",
          minHeight: isMobile ? "auto" : 280,
        }}
      >
        {items.map((it, i) => {
          const stackRot = (i - (n - 1) / 2) * 5.5;
          const stackX   = (i - (n - 1) / 2) * 12; // slight shift inside transform
          const stackY   = Math.abs(i - (n - 1) / 2) * 4;

          return (
            <div
              key={it.group}
              className="card-hard rounded-xl p-5"
              style={{
                position: "relative",
                width: 225,
                flexShrink: 0,
                // Negative margin on left (except first card) to stack them in the center on desktop
                marginLeft: !scattered && !isMobile && i > 0 ? -165 : 0,
                zIndex: scattered ? 20 : n - i,
                transform: !scattered && !isMobile
                  ? `translate(${stackX}px, ${stackY}px) rotate(${stackRot}deg) scale(1)`
                  : "translate(0px, 0px) rotate(0deg) scale(1)",
                boxShadow: scattered
                  ? "4px 6px 0 var(--shadow-color)"
                  : "6px 8px 0 var(--shadow-color)",
                transition: "margin-left 0.55s cubic-bezier(.22,1,.36,1), transform 0.55s cubic-bezier(.22,1,.36,1), box-shadow 0.3s ease, background 0.3s, border-color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = !scattered && !isMobile
                  ? `translate(${stackX}px, ${stackY - 8}px) rotate(${stackRot}deg) scale(1.03)`
                  : "translateY(-8px) scale(1.03)";
                e.currentTarget.style.boxShadow = `10px 12px 0px ${it.bg}`;
                e.currentTarget.style.zIndex = 50;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = !scattered && !isMobile
                  ? `translate(${stackX}px, ${stackY}px) rotate(${stackRot}deg) scale(1)`
                  : "translate(0px, 0px) rotate(0deg) scale(1)";
                e.currentTarget.style.boxShadow = scattered
                  ? "4px 6px 0 var(--shadow-color)"
                  : "6px 8px 0 var(--shadow-color)";
                e.currentTarget.style.zIndex = scattered ? 20 : n - i;
              }}
            >
              <p className="text-xs tracking-[0.15em] uppercase mb-4 font-bold border-b pb-2 flex items-center justify-between" style={{ ...mono, color: C.ink, borderColor: "var(--border)" }}>
                <span>{it.group}</span>
                {it.Icon && (
                  <span style={{ color: it.bg }}>
                    <it.Icon />
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {it.items.map((x, idx) => {
                  const pastelColors = ["#FFD9B8", "#8EC9FF", "#FFB8E6", "#B6FFE0", "#C9B6FF"];
                  const bgCol = pastelColors[idx % pastelColors.length];
                  return (
                    <span
                      key={x}
                      className="inline-block text-[11px] font-bold px-2.5 py-1.5 rounded-full transition-all duration-200 cursor-default select-none"
                      style={{
                        ...mono,
                        backgroundColor: bgCol,
                        color: "#0B0B0C",
                        border: "1.5px solid #0B0B0C",
                        boxShadow: "1.5px 1.5px 0px rgba(11,11,12,0.15)",
                        transform: "translateY(0)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3.5px)";
                        e.currentTarget.style.boxShadow = "3.5px 3.5px 0px rgba(11,11,12,0.35)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "1.5px 1.5px 0px rgba(11,11,12,0.15)";
                      }}
                    >
                      {x}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Hover target zone overlay covering fanned stack region exactly */}
        {!scattered && !isMobile && (
          <div
            style={{
              position: "absolute",
              top: -10,
              bottom: -10,
              width: 390,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: n + 10,
              cursor: "pointer",
            }}
            onMouseEnter={() => setScattered(true)}
          />
        )}
      </div>
    </div>
  );
}





/* ============================================================
   HERO
   ============================================================ */
function ChromeHero() {
  const chromeRef = useParallax(-0.15);
  const headlineRef = useParallax(0.08);
  const plane = useParallax(0.35, 8);
  const blob = useParallax(-0.25, -6);
  const squig = useParallax(0.4, 4);
  const orbit = useParallax(-0.1);

  return (
    <section className="relative w-full min-h-screen overflow-hidden flex flex-col justify-center px-6 sm:px-10 pt-10">
      <Mesh />

      {/* Whimsical floaters framing the Hero section */}
      <div ref={plane} className="float-slow" style={{ position: "absolute", top: "12%", right: "10%", zIndex: 3 }}>
        <PaperPlane />
      </div>
      <div ref={blob} className="float-slow" style={{ position: "absolute", bottom: "14%", left: "3%", zIndex: 1, animationDelay: "1.2s", opacity: 0.65 }}>
        <Blob size={55} />
      </div>
      <div ref={squig} className="float-slow" style={{ position: "absolute", top: "34%", left: "10%", zIndex: 3, animationDelay: "2s" }}>
        <Squiggle />
      </div>
      
      {/* Decorative floating bubbles & flowers for extra cuteness */}
      <div className="float-b hidden sm:block" style={{ position: "absolute", top: "15%", left: "4%", zIndex: 1, opacity: 0.6 }}>
        <BubbleCluster color={C.blue} size={50} />
      </div>
      <div className="float-alt hidden sm:block" style={{ position: "absolute", bottom: "15%", right: "6%", zIndex: 1, opacity: 0.7, animationDelay: "-2s" }}>
        <Flower color={C.pink} size={48} />
      </div>
      <div className="float-slow hidden sm:block" style={{ position: "absolute", top: "45%", right: "8%", zIndex: 1, opacity: 0.55, animationDelay: "-1.5s" }}>
        <BubbleCluster color={C.mint} size={42} />
      </div>

      <div ref={orbit} className="hidden sm:block" style={{ position: "absolute", bottom: "8%", right: "18%", zIndex: 2, opacity: 1.0 }}>
        <OrbitDiagram size={165} />
      </div>

      {/* Orbiting tool icons — lg+ only */}
      <div className="hidden lg:block" aria-hidden>
        {TOOLS.map((tool, i) => (
          <OrbitingTool key={tool.label} {...tool} anchor={TOOL_ANCHORS[i]} index={i} />
        ))}
      </div>

      <div className="relative" style={{ zIndex: 4 }}>
        <p className="rise text-xs tracking-[0.25em] uppercase mb-4" style={{ ...mono, color: C.ink, animationDelay: "80ms" }}>
          Design &amp; Engineering — Mumbai
        </p>

        <div ref={chromeRef} className="rise" style={{ animationDelay: "160ms" }}>
          <h1 className="chrome-text leading-none mb-2" style={{ ...display, fontStyle: "italic", fontWeight: 600, fontSize: "clamp(3.2rem, 12vw, 8.5rem)", letterSpacing: "-0.03em" }}>
            Simone D'sa
          </h1>
        </div>

        {/* Beautified Editorial Headline */}
        <div ref={headlineRef} className="rise mt-1" style={{ animationDelay: "320ms" }}>
          <h2 className="leading-[1.05] tracking-tight uppercase" style={{ ...bodyFont, fontWeight: 800, color: C.ink, fontSize: "clamp(1.7rem, 4.5vw, 3.2rem)", maxWidth: "24ch" }}>
            I BUILD FULL-STACK
            <br />
            PRODUCTS WITH{" "}
            <span className="chrome-text italic font-serif normal-case" style={{ fontFamily: "'Fraunces', serif" }}>
              craft &amp; taste.
            </span>
          </h2>
        </div>

        {/* Refined Badge Chips with star separator */}
        <div className="rise flex flex-wrap gap-3 mt-9" style={{ animationDelay: "480ms" }}>
          <Chip>✦ 3rd-year IT, DBIT</Chip>
          <Chip bg={C.mint}>✦ full-stack + design</Chip>
          <Chip bg={C.peach}>✦ CGPA 8.27</Chip>
        </div>

        <div className="rise mt-10" style={{ animationDelay: "600ms" }}>
          <InkButton href="#work">See the work ↓</InkButton>
        </div>
      </div>

      <div className="relative flex items-center justify-between mt-14 pt-4 border-t" style={{ zIndex: 4, borderColor: "rgba(11,11,12,0.15)" }}>
        <span className="text-[11px] tracking-[0.15em] uppercase flex items-center gap-2" style={{ ...mono, color: C.mute }}>
          <span className="pulse-dot" /> Open to work
        </span>
        <span className="text-[11px] tracking-[0.15em] uppercase" style={{ ...mono, color: C.mute }}>Mumbai, India</span>
        <span className="text-[11px] tracking-[0.15em] uppercase" style={{ ...mono, color: C.mute }}>Est. 2026</span>
      </div>
    </section>
  );
}

/* ============================================================
   MAIN
   ============================================================ */
export default function SimonePortfolio() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  const nav = ["Work", "About", "Skills", "Contact"];
  const navMag = useMagnetic(0.2);

  const skillTags = ["full-stack engineering", "UI/UX design", "brand identity", "problem solving", "clean type systems"];

  const project = {
    num: "01",
    title: "FitSync AI",
    tag: "AI-powered fitness app",
    desc: "A full-stack fitness application that turns workout intelligence into something people actually stick with — built end to end, from state management to auth to the AI layer.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Zustand", "Supabase"],
    link: "https://fit-sync-ai-chi.vercel.app",
  };

  const process = [
    { Icon: IconScan, title: "Discover", desc: "Read the brief, the users, the constraints — before touching a single pixel." },
    { Icon: IconLayers, title: "Design", desc: "Layer structure, type and color into something that actually holds together." },
    { Icon: IconNode, title: "Build", desc: "Full-stack, end to end — state, auth, data, all wired to the design." },
    { Icon: IconMark, title: "Ship", desc: "Polish, test, deploy — and keep iterating once it's live." },
  ];

  const toolbox = [
    { group: "Languages", items: ["Java", "C", "Python", "JavaScript", "TypeScript", "HTML", "CSS"], bg: C.blue, Icon: MiniCodeIcon },
    { group: "Frontend", items: ["React.js", "Next.js", "Tailwind CSS", "Zustand"], bg: C.pink, Icon: MiniLayoutIcon },
    { group: "Backend & Data", items: ["Supabase", "REST API Integration"], bg: C.mint, Icon: MiniDbIcon },
    { group: "AI/Tools", items: ["Nvidia API", "Git", "GitHub", "Figma"], bg: C.peach, Icon: MiniSparkleIcon },
    { group: "Community & Leadership", items: ["Cross-functional Delegation", "Technical Mentorship", "Event Logistics", "Production Timelines", "Strategic Planning"], bg: C.purple, Icon: MiniUsersIcon },
    { group: "Design & Branding", items: ["UI/UX Architecture", "Visual Identity Systems", "Figma", "Canva", "Adobe After Effects", "Video Editing", "Digital Media Strategy"], bg: C.blue, Icon: MiniPaletteIcon },
  ];


  const experience = [
    { role: "Design Head", org: "DBIT Marathi Club", date: "Aug 2026 – Present", desc: "Leading visual identity and creative direction, designing promotional campaigns, event branding, and digital assets for cultural events." },
    { role: "Intern, CrEAST Program", org: "DBIT × Larsen & Toubro", date: "Jul 2026 – Present", desc: "Selected for an L&T-sponsored initiative supporting underprivileged communities — teaching basic C programming to 8th and 9th graders." },
    { role: "Head of Design", org: "Colosseum '26 — DBIT Annual Tech Fest", date: "Feb 2026 – Apr 2026", desc: "Led 4 volunteers designing brochures, social posts, banners and logos. Kept one visual identity consistent from pre-event promotion through execution." },
    { role: "Social Media Head & Manager", org: "DBIT Dance Club", date: "Sep 2025 – Present", desc: "Managing social media presence and engagement, directing promotional reels, event coverage, and creative content strategy." },
    { role: "Assistant Design Head", org: "GDGC, DBIT", date: "Aug 2025 – Present", desc: "Design posters, banners and Instagram stories for event promotions, partnering with the core team on visual communication strategy." },
  ];

  const marqueeWords = ["FULL-STACK ENGINEER", "UI/UX DESIGNER", "MUMBAI, INDIA", "BRAND IDENTITY", "FITSYNC AI", "DBIT '28"];

  const aboutPlane = useParallax(0.3, -6);
  const workSquig = useParallax(-0.2, 5);
  const contactBlob = useParallax(0.25, 6);

  return (
    <div style={{ backgroundColor: C.bg, ...bodyFont, position: "relative" }} className="w-full min-h-screen overflow-x-hidden">
      <style>{`
        ${FONT_IMPORT}
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }

        .cursor-glow {
          position: fixed; top: -110px; left: -110px; width: 220px; height: 220px; border-radius: 50%;
          background: radial-gradient(circle, rgba(142,201,255,0.35), rgba(255,184,230,0.2) 45%, transparent 70%);
          pointer-events: none; z-index: 250; mix-blend-mode: multiply; filter: blur(6px);
        }
        @media (hover: none) { .cursor-glow { display: none; } }

        .mesh-blob { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.55; will-change: transform; }
        .mesh-still { opacity: 0.4; }

        @keyframes floatY { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-14px) rotate(3deg); } }
        .float-slow { animation: floatY 6s ease-in-out infinite; }
        @keyframes floatAlt { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(-4deg); } }
        .float-alt { animation: floatAlt 7s ease-in-out infinite; }
        @keyframes floatB { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-8px) scale(1.05); } }
        .float-b { animation: floatB 5s ease-in-out infinite; }

        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .chrome-text {
          background: var(--chrome-gradient);
          background-size: 300% 300%;
          -webkit-background-clip: text; background-clip: text; color: transparent;
          animation: gradientShift 6s ease-in-out infinite;
          filter: drop-shadow(0 2px 4px rgba(11, 11, 12, 0.05)) drop-shadow(0 6px 20px rgba(142, 201, 255, 0.2));
        }

        @keyframes heroRise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        .rise { opacity: 0; animation: heroRise 0.9s cubic-bezier(.19,1,.22,1) forwards; }

        /* flip card */
        .flip-card { perspective: 900px; }
        .flip-inner { position: relative; width: 100%; height: 100%; transition: transform 0.55s cubic-bezier(.22,1,.36,1); transform-style: preserve-3d; }
        .flip-inner.flipped { transform: rotateY(180deg); }
        .flip-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .flip-back { transform: rotateY(180deg); }

        .frost-chip { border: 1.5px solid ${C.ink}; box-shadow: 3px 3px 0px var(--shadow-color); transition: transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s ease; }
        .frost-chip:hover { transform: translateY(-4px); box-shadow: 5px 6px 0px var(--shadow-color); }

        .ink-btn { transition: transform 0.15s ease, box-shadow 0.3s ease; box-shadow: 4px 4px 0px var(--shadow-color); }
        .ink-btn:hover { box-shadow: 6px 7px 0px var(--shadow-color); }

        .underline-grow { position: relative; }
        .underline-grow::after { content: ''; position: absolute; left: 0; bottom: -4px; height: 2px; width: 0%; background: ${C.ink}; transition: width 0.3s ease; }
        .underline-grow:hover::after { width: 100%; }

        @keyframes marqueeScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { display: flex; width: max-content; animation: marqueeScroll 22s linear infinite; }

        .card-hard {
          border: 1.5px solid ${C.ink};
          box-shadow: 8px 8px 0px var(--shadow-color);
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .hover-lift { transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease; }
        .hover-lift:hover { transform: translateY(-6px); box-shadow: 10px 12px 0px var(--shadow-color); }

        /* edge badges */
        .edge-badge {
          position: fixed; top: 50%; transform: translateY(-50%);
          writing-mode: vertical-rl; text-orientation: mixed;
          z-index: 40; padding: 12px 8px; border-radius: 999px;
          border: 1.5px solid var(--border); background: var(--surface);
          backdrop-filter: blur(10px);
        }
        .edge-badge span { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: ${C.ink}; }

        /* scroll-to-top pill */
        .scroll-top-pill {
          position: fixed; bottom: 22px; right: 22px; z-index: 60;
          display: flex; align-items: center; gap: 6px;
          padding: 10px 16px; border-radius: 999px; border: 1.5px solid ${C.ink};
          background: var(--white); backdrop-filter: blur(10px);
          font-family: 'JetBrains Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;
          color: ${C.ink}; cursor: pointer; transition: transform 0.3s ease, opacity 0.3s ease, box-shadow 0.2s ease;
          box-shadow: 3px 3px 0px var(--shadow-color);
        }
        .scroll-top-pill:hover { box-shadow: 4px 5px 0px var(--shadow-color); transform: translateY(-2px); }

        @keyframes pulseDot { 0%,100% { box-shadow: 0 0 0 0 rgba(61,220,132,0.5); } 70% { box-shadow: 0 0 0 6px rgba(61,220,132,0); } }
        .pulse-dot { width: 7px; height: 7px; border-radius: 50%; background: ${C.green}; display: inline-block; animation: pulseDot 2s ease-out infinite; }

        /* orbit diagram */
        .orbit-ring { position: absolute; border: 1.2px dashed var(--ink); border-radius: 50%; opacity: 0.45; }
        .orbit-spin { position: absolute; animation: spin linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .orbit-dot { position: absolute; top: 0; left: 50%; width: 11px; height: 11px; border-radius: 50%; transform: translate(-50%, -50%); border: 1.5px solid ${C.ink}; }

        /* process icon animations */
        @keyframes pulseR { 0%,100% { r: 3; opacity: 1; } 50% { r: 4.5; opacity: 0.7; } }
        .icon-pulse-dot { animation: pulseR 2s ease-in-out infinite; transform-origin: center; }
        @keyframes layerFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
        .icon-layers { animation: layerFloat 3s ease-in-out infinite; transform-origin: center; }
        @keyframes twinkle { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        .icon-twinkle circle:not(:first-of-type) { animation: twinkle 2.4s ease-in-out infinite; }
        @keyframes riseUp { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
        .icon-rise { animation: riseUp 3s ease-in-out infinite; }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }


        @media (prefers-reduced-motion: reduce) {
          .float-slow, .float-alt, .float-b, .chrome-text, .rise, .cursor-glow, .orbit-spin, .icon-pulse-dot, .icon-layers, .icon-twinkle circle, .icon-rise, .pulse-dot { animation: none !important; opacity: 1 !important; transform: none !important; }
          .flip-inner { transition: none !important; }
        }

        @media (max-width: 640px) {
          .edge-badge { display: none; }
          .flip-card { height: 180px !important; }
        }
      `}</style>

      <CursorGlow />
      <ScrollProgressBar />
      <ScrollTopPill />

      <header className="sticky top-0 z-30 flex items-center justify-between px-6 sm:px-10 py-5 border-b" style={{ backgroundColor: "var(--nav-bg)", backdropFilter: "blur(14px)", borderColor: "var(--border)", transition: "background-color 0.4s ease, border-color 0.4s ease" }}>
        <span className="text-base sm:text-lg font-semibold tracking-tight flex items-center gap-2" style={{ ...display, color: C.ink }}>
          Simone D'sa
          <span className="chrome-text" style={{ ...display, fontStyle: "italic", fontSize: "1.1rem" }}>*</span>
        </span>
        <nav className="hidden sm:flex items-center gap-6">
          {nav.map((n) => (
            <a key={n} href={`#${n.toLowerCase()}`} className="text-xs tracking-[0.15em] uppercase underline-grow" style={{ ...mono, color: C.ink }}>{n}</a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a ref={navMag.ref} onMouseMove={navMag.onMouseMove} onMouseLeave={navMag.onMouseLeave} href="https://mail.google.com/mail/?view=cm&fs=1&to=simonedsa0507@gmail.com" target="_blank" rel="noreferrer" className="text-xs px-4 py-2 rounded-full" style={{ ...mono, backgroundColor: C.ink, color: C.white }}>
            Say hi
          </a>
        </div>
      </header>

      <ChromeHero />

      {/* MARQUEE */}
      <div className="relative py-3 border-y overflow-hidden" style={{ backgroundColor: C.ink, borderColor: C.ink }}>
        <div className="marquee-track">
          {[...marqueeWords, ...marqueeWords, ...marqueeWords].map((w, i) => (
            <span key={i} className="px-6 text-xs tracking-[0.2em] uppercase whitespace-nowrap" style={{ ...mono, color: C.white }}>
              {w} <span style={{ color: C.mint }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* HOW I WORK */}
      <section id="process" className="relative px-6 sm:px-10 py-16 sm:py-24 overflow-hidden">
        <Eyebrow index="02" label="How I work" />
        <Reveal from="translateY(30px)" to="translateY(0)" duration={700}>
          <h2 className="mb-10" style={{ ...bodyFont, color: C.ink, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700 }}>
            four moves. <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: C.mute, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>hover to flip →</span>
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {process.map((p, i) => (
            <FlipProcessCard key={p.title} {...p} delay={i * 100} backIndex={i} />
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative px-6 sm:px-10 py-16 sm:py-28 overflow-hidden">
        <Mesh />

        {/* ── floating stickers ── */}
        {/* top-right: squiggle */}
        <div ref={aboutPlane} className="float-slow" style={{ position: "absolute", top: "5%", right: "8%", zIndex: 2, opacity: 0.85 }}>
          <Squiggle color={C.blue} size={58} />
        </div>
        {/* top-left: flower */}
        <div className="float-alt" style={{ position: "absolute", top: "4%", left: "3%", zIndex: 2, animationDelay: "-2s", opacity: 0.8 }}>
          <Flower color={C.pink} size={60} />
        </div>
        {/* mid-right: camera */}
        <div className="float-slow" style={{ position: "absolute", top: "40%", right: "3%", zIndex: 2, animationDelay: "-3s", opacity: 0.75 }}>
          <Camera color={C.mint} size={58} />
        </div>
        {/* bottom-left: cat face */}
        <div className="float-alt" style={{ position: "absolute", bottom: "8%", left: "2%", zIndex: 2, animationDelay: "-1s", opacity: 0.8 }}>
          <CatFace color={C.purple} size={62} />
        </div>
        {/* bottom-right: bubbles */}
        <div className="float-b" style={{ position: "absolute", bottom: "10%", right: "10%", zIndex: 2, animationDelay: "-4s", opacity: 0.7 }}>
          <BubbleCluster color={C.blue} size={64} />
        </div>
        {/* mid-left: small flower alt colour */}
        <div className="float-b" style={{ position: "absolute", top: "55%", left: "4%", zIndex: 2, animationDelay: "-5s", opacity: 0.65 }}>
          <Flower color={C.peach} size={40} />
        </div>
        {/* EXTRA FLOATERS ADDED TO FILL SPACE */}
        {/* top-center bubbles */}
        <div className="float-slow" style={{ position: "absolute", top: "8%", left: "45%", zIndex: 2, animationDelay: "-1.8s", opacity: 0.6 }}>
          <BubbleCluster color={C.pink} size={50} />
        </div>
        {/* bottom-center flower */}
        <div className="float-alt" style={{ position: "absolute", bottom: "6%", left: "38%", zIndex: 2, animationDelay: "-2.8s", opacity: 0.75 }}>
          <Flower color={C.blue} size={46} />
        </div>
        {/* left-mid bubbles */}
        <div className="float-b" style={{ position: "absolute", top: "30%", left: "8%", zIndex: 2, animationDelay: "-0.8s", opacity: 0.65 }}>
          <BubbleCluster color={C.mint} size={44} />
        </div>
        {/* iced coffee - floating bottom/right area */}
        <div className="float-slow" style={{ position: "absolute", bottom: "25%", right: "3%", zIndex: 2, animationDelay: "-2.2s", opacity: 0.85 }}>
          <IcedCoffee size={48} />
        </div>
        {/* headphones - floating right/upper-mid area */}
        <div className="float-alt" style={{ position: "absolute", top: "22%", right: "6%", zIndex: 2, animationDelay: "-1.7s", opacity: 0.85 }}>
          <Headphones size={48} color={C.pink} />
        </div>

        <div className="relative" style={{ zIndex: 3 }}>
          <Eyebrow index="03" label="A little about me" />
          <div className="grid sm:grid-cols-[280px_1fr] md:grid-cols-[320px_1fr] lg:grid-cols-[350px_1fr] gap-12 md:gap-20 items-center relative">
            <Reveal from="translateX(-60px) rotate(-4deg) scale(0.94)" to="translateX(0) rotate(-2deg) scale(1)" duration={900} className="relative w-full max-w-xs mx-auto sm:mx-0">
              <div className="card-hard rounded-sm p-4 pb-10">
                <div className="aspect-[4/5] w-full overflow-hidden rounded-sm" style={{ position: "relative" }}>
                  <img
                    src={simonePhoto}
                    alt="Simone D'sa"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center top",
                      display: "block",
                    }}
                  />
                </div>
                <p className="text-center text-xs mt-4" style={{ ...mono, color: C.mute }}>designer who codes ✦</p>
              </div>
              <div className="absolute -top-5 -right-5">
                <Blob size={44} color={C.red} />
              </div>
            </Reveal>

            {/* Hand-drawn arrow connector pointing to the photo inside the column gap */}
            <div className="hidden lg:block absolute left-[354px] top-[30%] -translate-y-1/2 z-10 pointer-events-none">
              <div className="float-slow" style={{ animationDuration: "5s" }}>
                <svg width="76" height="50" viewBox="0 0 76 50" fill="none">
                  {/* curvier, left-pointing arrow line */}
                  <path
                    d="M66 36 C 54 38, 30 22, 10 16"
                    stroke={C.ink}
                    strokeWidth="1.8"
                    strokeDasharray="5 4"
                    strokeLinecap="round"
                  />
                  {/* arrow head pointing left */}
                  <path
                    d="M22 8 L8 16 L20 27"
                    stroke={C.ink}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="block text-[11px] font-bold tracking-wider" style={{ ...mono, color: C.pink, transform: "rotate(-6deg) translate(6px, -2px)", whiteSpace: "nowrap" }}>
                  that's me! ✦
                </span>
              </div>
            </div>

            {/* Mini bubble cluster inside the gap */}
            <div className="hidden lg:block absolute left-[285px] md:left-[325px] lg:left-[350px] top-[55%] z-20 pointer-events-none float-alt" style={{ animationDelay: "-1.5s" }}>
              <BubbleCluster color={C.blue} size={42} />
            </div>

            {/* Mini flower inside the gap */}
            <div className="hidden lg:block absolute left-[320px] md:left-[360px] lg:left-[390px] bottom-[18%] z-20 pointer-events-none float-b" style={{ animationDelay: "-3.5s" }}>
              <Flower color={C.peach} size={32} />
            </div>

            <Reveal from="translateX(60px)" to="translateX(0)" duration={800} delay={120}>

              <h2 className="leading-[0.95] mb-6" style={{ ...bodyFont, color: C.ink, fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700 }}>
                I MAKE THINGS
                <br />
                <span className="chrome-text" style={{ ...display, fontStyle: "italic" }}>make sense.</span>
              </h2>
              <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color: C.mute }}>
                Third-year IT student working at the intersection of design, development and execution — combining
                full-stack engineering with visual and brand design across academic, community and freelance work.
                Currently deepening core programming foundations through DBIT CrEAST, an L&T-sponsored initiative,
                while shipping full-stack apps independently.
              </p>
              <div>
                {skillTags.map((s, i) => (
                  <Chip key={s} delay={i * 90} bg={[C.blue, C.pink, C.mint, C.peach, C.purple][i % 5]}>{s}</Chip>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WORK — pastel iridescent */}
      <section id="work" className="relative px-6 sm:px-10 py-16 sm:py-28 overflow-hidden">
        <Mesh />
        <div ref={workSquig} className="float-slow" style={{ position: "absolute", top: "6%", right: "8%", zIndex: 1 }}>
          <PaperPlane color={C.purple} />
        </div>
        <div className="relative" style={{ zIndex: 2 }}>
          <Eyebrow index="04" label="Selected work" />
          <Reveal from="translateY(40px)" to="translateY(0)" duration={800}>
            <h2 className="leading-[0.9] mb-12" style={{ ...bodyFont, color: C.ink, fontSize: "clamp(2.4rem, 7vw, 5rem)", fontWeight: 700 }}>
              THE THING I'VE
              <br />
              <span className="chrome-text" style={{ ...display, fontStyle: "italic" }}>built.</span>
            </h2>
          </Reveal>

          <Reveal from="translateX(-60px) scale(0.97)" to="translateX(0) scale(1)" duration={900}>
            <div
              className="card-hard rounded-xl p-7 sm:p-10 relative"
              style={{
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, ${C.blue}22 55%, ${C.purple}1a 100%)`,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: `1.5px solid ${C.ink}`,
                boxShadow: "8px 8px 0 rgba(11,11,12,0.1)",
              }}
            >
              {/* top meta row */}
              <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 border rounded-sm" style={{ ...mono, borderColor: C.ink, color: C.ink }}>{project.num}</span>
                  <span className="text-xs tracking-[0.18em] uppercase" style={{ ...mono, color: C.mute }}>{project.tag}</span>
                </div>
                <span className="text-[10px] px-3 py-1 rounded-full tracking-[0.1em] uppercase font-semibold" style={{ ...mono, background: C.mint, border: `1px solid ${C.ink}` }}>
                  Live
                </span>
              </div>

              {/* title */}
              <h3 className="mb-3 leading-tight" style={{ ...bodyFont, fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: C.ink }}>{project.title}</h3>

              {/* desc */}
              <p className="text-sm sm:text-base leading-relaxed mb-5 max-w-xl" style={{ color: C.mute }}>{project.desc}</p>

              {/* stack chips */}
              <div className="mb-5">
                {project.stack.map((s, i) => (
                  <Chip key={s} delay={i * 80} bg={[C.blue, C.pink, C.mint, C.peach][i % 4]}>{s}</Chip>
                ))}
              </div>

              <a href={project.link} target="_blank" rel="noreferrer" className="text-sm underline-grow inline-flex items-center gap-1 font-medium" style={{ ...mono, color: C.ink }}>
                See the project ↗
              </a>
            </div>
          </Reveal>
        </div>
      </section>


      {/* TOOLBOX — card deck */}
      <section id="skills" className="relative px-6 sm:px-10 py-16 sm:py-32 overflow-hidden">
        <Mesh />
        <div className="relative" style={{ zIndex: 2 }}>
          <Eyebrow index="05" label="The toolbox" />
          <CardDeck items={toolbox} />
        </div>
      </section>

      {/* EXPERIENCE — pastel iridescent cloud bg */}
      <section id="experience" className="relative px-6 sm:px-10 py-16 sm:py-28 overflow-hidden">
        <Mesh />
        <div className="relative" style={{ zIndex: 2 }}>
          <Eyebrow index="06" label="Where I've worked" />
          <div className="relative flex flex-col pl-8">
            <div aria-hidden className="absolute left-2 top-2 bottom-2 w-0.5" style={{ background: `linear-gradient(to bottom, ${C.blue}, ${C.pink}, ${C.purple})` }} />
            {experience.map((e, idx) => (
              <Reveal key={e.role} from="translateX(-30px)" to="translateX(0)" delay={idx * 100} duration={750} className="relative py-6" style={{ borderTop: idx === 0 ? "none" : "1px solid rgba(11,11,12,0.12)" }}>
                <span aria-hidden className="absolute -left-8 top-8 w-3 h-3 rounded-full" style={{ background: C.ink }} />
                <p className="text-xs mb-1" style={{ ...mono, color: C.mute }}>{e.date}</p>
                <h4 style={{ ...bodyFont, fontWeight: 700, fontSize: "1.4rem", color: C.ink }}>{e.role}</h4>
                <p className="text-sm mb-2 font-medium" style={{ ...mono, color: C.ink, opacity: 0.7 }}>{e.org}</p>
                <p className="text-sm sm:text-base leading-relaxed max-w-2xl" style={{ color: C.mute }}>{e.desc}</p>
              </Reveal>
            ))}
          </div>
          <Reveal from="translateY(24px)" to="translateY(0)" duration={600} className="mt-10 pt-6" style={{ borderTop: "1px solid rgba(11,11,12,0.12)" }}>
            <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ ...mono, color: C.mute }}>Honors</p>
            <p style={{ color: C.ink }}>Selected, Smart India Hackathon (SIH) 2025 — college-level round.</p>
          </Reveal>
        </div>
      </section>


      {/* CONTACT */}
      <section id="contact" className="relative px-6 sm:px-10 py-16 sm:py-32 overflow-hidden">
        <Mesh />
        <div ref={contactBlob} className="float-slow" style={{ position: "absolute", bottom: "15%", right: "12%", zIndex: 2 }}>
          <Blob size={60} color={C.peach} />
        </div>
        <div className="relative" style={{ zIndex: 3 }}>
          <Eyebrow index="07" label="Say hello" />
          <Reveal from="translateY(44px)" to="translateY(0)" duration={850}>
            <h2 className="leading-[0.88] mb-10" style={{ ...bodyFont, color: C.ink, fontSize: "clamp(2.6rem, 9vw, 6rem)", fontWeight: 700 }}>
              LET'S MAKE
              <br />
              <span className="chrome-text" style={{ ...display, fontStyle: "italic" }}>something</span>
              <br />
              REAL.
            </h2>
          </Reveal>
          <div className="flex flex-wrap gap-4">
            <InkButton href="https://mail.google.com/mail/?view=cm&fs=1&to=simonedsa0507@gmail.com" delay={80}>Gmail ↗</InkButton>
            <InkButton href="https://www.linkedin.com/in/simone-d-sa-616913385" delay={180}>LinkedIn ↗</InkButton>
            <InkButton href="https://github.com/simonedsa07" delay={280}>GitHub ↗</InkButton>
          </div>
        </div>
      </section>

      <footer className="px-6 sm:px-10 py-6 flex flex-wrap items-center justify-between gap-2 border-t" style={{ backgroundColor: C.bg, borderColor: "rgba(11,11,12,0.12)" }}>
        <p className="text-xs" style={{ ...mono, color: C.mute }}>© 2026 Simone D'sa. Mumbai, India.</p>
      </footer>
    </div>
  );
}