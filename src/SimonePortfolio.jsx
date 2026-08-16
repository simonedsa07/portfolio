import React, { useState, useEffect, useRef } from "react";

/* ============================================================
   PALETTE — pastel iridescent / chrome / bold ink
   ============================================================ */
const C = {
  bg: "#EAF0FB",
  ink: "#0B0B0C",
  white: "#FFFFFF",
  blue: "#8EC9FF",
  pink: "#FFB8E6",
  purple: "#C9B6FF",
  mint: "#B6FFE0",
  peach: "#FFD9B8",
  red: "#FF4D4D",
  green: "#3DDC84",
  mute: "rgba(11,11,12,0.6)",
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
  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };
  const onMouseLeave = () => {
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
        <span className="chrome-text" style={{ ...display, fontStyle: "italic", fontSize: size * 0.22 }}>S</span>
      </div>
    </div>
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
   CARD DECK — fanned stack that un-stacks on hover
   ============================================================ */
function CardDeck({ items }) {
  const [hovered, setHovered] = useState(null);
  const n = items.length;
  const spread = 30;

  return (
    <div>
      <div className="relative deck-wrap" onMouseLeave={() => setHovered(null)}>
        {items.map((it, i) => {
          const isHovered = hovered === i;
          const rot = (i - (n - 1) / 2) * 4;
          const offsetX = (i - (n - 1) / 2) * spread;
          return (
            <div
              key={it.group}
              onMouseEnter={() => setHovered(i)}
              className="card-hard deck-card rounded-lg p-5"
              style={{
                left: `calc(50% + ${offsetX}px)`,
                background: it.bg,
                transform: isHovered
                  ? `translate(-50%, -22px) rotate(0deg) scale(1.08)`
                  : `translate(-50%, 0px) rotate(${rot}deg) scale(${hovered === null ? 1 : 0.94})`,
                zIndex: isHovered ? 50 : 10 + i,
                opacity: hovered !== null && !isHovered ? 0.7 : 1,
              }}
            >
              <p className="text-xs tracking-[0.15em] uppercase mb-3 font-semibold" style={{ ...mono, color: C.ink }}>{it.group}</p>
              <div>
                {it.items.map((x) => (
                  <span key={x} className="block text-sm mb-1" style={{ ...bodyFont, color: C.ink, opacity: 0.85 }}>{x}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs mt-6 tracking-[0.2em] uppercase" style={{ ...mono, color: C.mute }}>
        hover a card to explore
      </p>
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

      <div ref={plane} className="float-slow" style={{ position: "absolute", top: "16%", right: "10%", zIndex: 3 }}>
        <PaperPlane />
      </div>
      <div ref={blob} className="float-slow" style={{ position: "absolute", bottom: "26%", left: "6%", zIndex: 3, animationDelay: "1s" }}>
        <Blob />
      </div>
      <div ref={squig} className="float-slow" style={{ position: "absolute", top: "30%", left: "12%", zIndex: 3, animationDelay: "2s" }}>
        <Squiggle />
      </div>
      <div ref={orbit} className="hidden sm:block" style={{ position: "absolute", bottom: "8%", right: "8%", zIndex: 2, opacity: 0.85 }}>
        <OrbitDiagram size={150} />
      </div>

      <div className="relative" style={{ zIndex: 4 }}>
        <p className="rise text-xs tracking-[0.25em] uppercase mb-3" style={{ ...mono, color: C.ink, animationDelay: "80ms" }}>
          Design &amp; Engineering — Mumbai
        </p>

        <div ref={chromeRef} className="rise" style={{ animationDelay: "160ms" }}>
          <h2 className="chrome-text leading-none" style={{ ...display, fontStyle: "italic", fontWeight: 600, fontSize: "clamp(4.5rem, 18vw, 11rem)" }}>
            hey
          </h2>
        </div>

        <div ref={headlineRef} className="rise -mt-4 sm:-mt-8" style={{ animationDelay: "320ms" }}>
          <h1 className="leading-[0.95] tracking-tight" style={{ ...bodyFont, fontWeight: 700, color: C.ink, fontSize: "clamp(2rem, 6vw, 3.6rem)", maxWidth: "14ch" }}>
            I BUILD FULL-STACK PRODUCTS WITH CRAFT &amp; TASTE.
          </h1>
        </div>

        <div className="rise flex flex-wrap gap-3 mt-8" style={{ animationDelay: "480ms" }}>
          <Chip>3rd-year IT, DBIT</Chip>
          <Chip bg={C.mint}>full-stack + design</Chip>
          <Chip bg={C.peach}>CGPA 8.27</Chip>
        </div>

        <div className="rise mt-8" style={{ animationDelay: "600ms" }}>
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
    { group: "Languages", items: ["Java", "C", "Python", "JavaScript", "TypeScript"], bg: C.blue },
    { group: "Frontend", items: ["React.js", "Next.js", "Tailwind CSS", "Zustand"], bg: C.pink },
    { group: "Backend & Data", items: ["Supabase", "REST APIs"], bg: C.mint },
    { group: "Tools", items: ["Git", "GitHub", "Figma"], bg: C.peach },
    { group: "Design", items: ["UI/UX Design", "Brand Identity"], bg: C.purple },
  ];

  const experience = [
    { role: "Head of Design", org: "Colosseum '26 — DBIT Annual Tech Fest", date: "Feb 2026 – Apr 2026", desc: "Led 4 volunteers designing brochures, social posts, banners and logos. Kept one visual identity consistent from pre-event promotion through execution." },
    { role: "Assistant Design Head", org: "GDGC, DBIT", date: "Aug 2025 – Present", desc: "Design posters, banners and Instagram stories for event promotions, partnering with the core team on visual communication strategy." },
    { role: "Intern, CrEAST Program", org: "DBIT × Larsen & Toubro", date: "Jul 2026 – Present", desc: "Selected for an L&T-sponsored initiative supporting underprivileged communities — teaching basic C programming to 8th and 9th graders." },
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

        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .chrome-text {
          background: linear-gradient(110deg, ${C.white} 0%, ${C.blue} 20%, ${C.white} 40%, ${C.purple} 60%, ${C.white} 80%, ${C.pink} 100%);
          background-size: 300% 300%;
          -webkit-background-clip: text; background-clip: text; color: transparent;
          animation: gradientShift 6s ease-in-out infinite;
          filter: drop-shadow(0 6px 18px rgba(142,201,255,0.5));
          -webkit-text-stroke: 1px rgba(11,11,12,0.08);
        }

        @keyframes heroRise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        .rise { opacity: 0; animation: heroRise 0.9s cubic-bezier(.19,1,.22,1) forwards; }

        .frost-chip { border: 1.5px solid ${C.ink}; box-shadow: 3px 3px 0px rgba(11,11,12,0.12); transition: transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s ease; }
        .frost-chip:hover { transform: translateY(-4px); box-shadow: 5px 6px 0px rgba(11,11,12,0.16); }

        .ink-btn { transition: transform 0.15s ease, box-shadow 0.3s ease; box-shadow: 4px 4px 0px rgba(11,11,12,0.2); }
        .ink-btn:hover { box-shadow: 6px 7px 0px rgba(11,11,12,0.25); }

        .underline-grow { position: relative; }
        .underline-grow::after { content: ''; position: absolute; left: 0; bottom: -4px; height: 2px; width: 0%; background: ${C.ink}; transition: width 0.3s ease; }
        .underline-grow:hover::after { width: 100%; }

        @keyframes marqueeScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { display: flex; width: max-content; animation: marqueeScroll 22s linear infinite; }

        .card-hard { border: 1.5px solid ${C.ink}; box-shadow: 8px 8px 0px rgba(11,11,12,0.1); background: ${C.white}; }
        .hover-lift { transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease; }
        .hover-lift:hover { transform: translateY(-6px); box-shadow: 10px 12px 0px rgba(11,11,12,0.12); }

        /* edge badges */
        .edge-badge {
          position: fixed; top: 50%; transform: translateY(-50%);
          writing-mode: vertical-rl; text-orientation: mixed;
          z-index: 40; padding: 12px 8px; border-radius: 999px;
          border: 1px solid rgba(11,11,12,0.2); background: rgba(255,255,255,0.65);
          backdrop-filter: blur(10px);
        }
        .edge-badge span { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: ${C.ink}; }

        /* scroll-to-top pill */
        .scroll-top-pill {
          position: fixed; bottom: 22px; right: 22px; z-index: 60;
          display: flex; align-items: center; gap: 6px;
          padding: 10px 16px; border-radius: 999px; border: 1.5px solid ${C.ink};
          background: rgba(255,255,255,0.85); backdrop-filter: blur(10px);
          font-family: 'JetBrains Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;
          color: ${C.ink}; cursor: pointer; transition: transform 0.3s ease, opacity 0.3s ease, box-shadow 0.2s ease;
          box-shadow: 3px 3px 0px rgba(11,11,12,0.15);
        }
        .scroll-top-pill:hover { box-shadow: 4px 5px 0px rgba(11,11,12,0.2); transform: translateY(-2px); }

        @keyframes pulseDot { 0%,100% { box-shadow: 0 0 0 0 rgba(61,220,132,0.5); } 70% { box-shadow: 0 0 0 6px rgba(61,220,132,0); } }
        .pulse-dot { width: 7px; height: 7px; border-radius: 50%; background: ${C.green}; display: inline-block; animation: pulseDot 2s ease-out infinite; }

        /* orbit diagram */
        .orbit-ring { position: absolute; border: 1px dashed rgba(11,11,12,0.25); border-radius: 50%; }
        .orbit-spin { position: absolute; animation: spin linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .orbit-dot { position: absolute; top: 0; left: 50%; width: 9px; height: 9px; border-radius: 50%; transform: translate(-50%, -50%); border: 1.5px solid ${C.ink}; }

        /* process icon animations */
        @keyframes pulseR { 0%,100% { r: 3; opacity: 1; } 50% { r: 4.5; opacity: 0.7; } }
        .icon-pulse-dot { animation: pulseR 2s ease-in-out infinite; transform-origin: center; }
        @keyframes layerFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
        .icon-layers { animation: layerFloat 3s ease-in-out infinite; transform-origin: center; }
        @keyframes twinkle { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        .icon-twinkle circle:not(:first-of-type) { animation: twinkle 2.4s ease-in-out infinite; }
        @keyframes riseUp { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
        .icon-rise { animation: riseUp 3s ease-in-out infinite; }

        /* card deck */
        .deck-wrap { height: 210px; margin: 0 auto; max-width: 640px; }
        .deck-card { position: absolute; top: 0; width: 200px; transition: transform 0.4s cubic-bezier(.22,1,.36,1), opacity 0.4s ease, z-index 0s; cursor: pointer; }

        @media (prefers-reduced-motion: reduce) {
          .float-slow, .chrome-text, .rise, .cursor-glow, .orbit-spin, .icon-pulse-dot, .icon-layers, .icon-twinkle circle, .icon-rise, .pulse-dot { animation: none !important; opacity: 1 !important; transform: none !important; }
        }

        @media (max-width: 640px) {
          .edge-badge { display: none; }
          .deck-wrap { height: 480px; }
          .deck-card { position: relative; width: 90%; margin: 0 auto 14px; left: 50% !important; transform: translateX(-50%) !important; }
        }
      `}</style>

      <CursorGlow />
      <ScrollProgressBar />
      <EdgeBadge side="left" text="Design & Engineering" />
      <EdgeBadge side="right" text="Portfolio — 2026" />
      <ScrollTopPill />

      {/* NAV */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 sm:px-10 py-5 border-b" style={{ backgroundColor: "rgba(234,240,251,0.75)", backdropFilter: "blur(14px)", borderColor: "rgba(11,11,12,0.12)" }}>
        <span className="text-base sm:text-lg font-semibold tracking-tight flex items-center gap-2" style={{ ...display, color: C.ink }}>
          Simone D'sa
          <span className="chrome-text" style={{ ...display, fontStyle: "italic", fontSize: "1.1rem" }}>*</span>
        </span>
        <nav className="hidden sm:flex items-center gap-6">
          {nav.map((n) => (
            <a key={n} href={`#${n.toLowerCase()}`} className="text-xs tracking-[0.15em] uppercase underline-grow" style={{ ...mono, color: C.ink }}>{n}</a>
          ))}
        </nav>
        <a ref={navMag.ref} onMouseMove={navMag.onMouseMove} onMouseLeave={navMag.onMouseLeave} href="mailto:simonedsa0507@gmail.com" className="text-xs px-4 py-2 rounded-full" style={{ ...mono, backgroundColor: C.ink, color: C.white }}>
          Say hi
        </a>
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
      <section className="relative px-6 sm:px-10 py-16 sm:py-24 overflow-hidden">
        <Eyebrow index="02" label="How I work" />
        <Reveal from="translateY(30px)" to="translateY(0)" duration={700}>
          <h2 className="mb-10" style={{ ...bodyFont, color: C.ink, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700 }}>four moves.</h2>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {process.map((p, i) => (
            <ProcessCard key={p.title} {...p} delay={i * 100} />
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative px-6 sm:px-10 py-16 sm:py-28 overflow-hidden">
        <Mesh />
        <div ref={aboutPlane} className="float-slow" style={{ position: "absolute", top: "8%", right: "10%", zIndex: 2 }}>
          <Squiggle color={C.blue} />
        </div>
        <div className="relative" style={{ zIndex: 3 }}>
          <Eyebrow index="03" label="A little about me" />
          <div className="grid sm:grid-cols-2 gap-12 items-center">
            <Reveal from="translateX(-60px) rotate(-4deg) scale(0.94)" to="translateX(0) rotate(-2deg) scale(1)" duration={900} className="relative w-full max-w-xs mx-auto sm:mx-0">
              <div className="card-hard rounded-sm p-4 pb-10">
                <div className="aspect-[4/5] w-full flex items-center justify-center rounded-sm" style={{ background: `linear-gradient(150deg, ${C.blue}, ${C.purple}, ${C.pink})` }}>
                  <span className="chrome-text" style={{ ...display, fontStyle: "italic", fontSize: "5rem" }}>S</span>
                </div>
                <p className="text-center text-xs mt-4" style={{ ...mono, color: C.mute }}>designer who codes, probably</p>
              </div>
              <div className="absolute -top-5 -right-5">
                <Blob size={44} color={C.red} />
              </div>
            </Reveal>

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

      {/* WORK */}
      <section id="work" className="relative px-6 sm:px-10 py-16 sm:py-28 overflow-hidden" style={{ backgroundColor: C.ink }}>
        <div ref={workSquig} className="float-slow" style={{ position: "absolute", top: "6%", right: "8%", zIndex: 1 }}>
          <PaperPlane color={C.mint} />
        </div>
        <div className="relative" style={{ zIndex: 2 }}>
          <span className="text-xs px-2 py-1 border rounded-sm inline-block mb-8" style={{ ...mono, borderColor: "rgba(255,255,255,0.3)", color: C.white }}>04 — Selected work</span>
          <Reveal from="translateY(40px)" to="translateY(0)" duration={800}>
            <h2 className="leading-[0.9] mb-14" style={{ ...bodyFont, color: C.white, fontSize: "clamp(2.4rem, 7vw, 5rem)", fontWeight: 700 }}>
              THE THING I'VE
              <br />
              <span className="chrome-text" style={{ ...display, fontStyle: "italic" }}>built.</span>
            </h2>
          </Reveal>

          <Reveal from="translateX(-70px) rotate(-3deg) scale(0.95)" to="translateX(0) rotate(0deg) scale(1)" duration={900}>
            <div className="card-hard rounded-sm p-6 sm:p-10 grid sm:grid-cols-[auto_1fr] gap-6 sm:gap-10 items-start relative">
              <span className="absolute top-4 right-4 text-[10px] px-2.5 py-1 rounded-full tracking-[0.1em] uppercase font-semibold" style={{ ...mono, background: C.mint, border: `1px solid ${C.ink}` }}>
                Live
              </span>
              <span className="text-xs px-2 py-1 border rounded-sm h-fit" style={{ ...mono, borderColor: C.ink, color: C.ink }}>{project.num}</span>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ ...mono, color: C.ink, opacity: 0.6 }}>{project.tag}</p>
                <h3 className="mb-3" style={{ ...bodyFont, fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: C.ink }}>{project.title}</h3>
                <p className="text-sm sm:text-base leading-relaxed mb-4 max-w-xl" style={{ color: C.mute }}>{project.desc}</p>
                <div className="mb-4">
                  {project.stack.map((s, i) => (
                    <Chip key={s} delay={i * 80} bg={[C.blue, C.pink, C.mint, C.peach][i % 4]}>{s}</Chip>
                  ))}
                </div>
                <a href={project.link} target="_blank" rel="noreferrer" className="text-sm underline-grow inline-flex items-center gap-1 font-medium" style={{ ...mono, color: C.ink }}>
                  See the project ↗
                </a>
              </div>
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

      {/* EXPERIENCE */}
      <section className="px-6 sm:px-10 py-16 sm:py-28" style={{ backgroundColor: C.white }}>
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
            <InkButton href="mailto:simonedsa0507@gmail.com" delay={80}>simonedsa0507@gmail.com</InkButton>
            <InkButton href="https://linkedin.com/in/simone-d-sa" delay={180}>LinkedIn ↗</InkButton>
            <InkButton href="https://github.com/simonedsa07" delay={280}>GitHub ↗</InkButton>
          </div>
        </div>
      </section>

      <footer className="px-6 sm:px-10 py-6 flex flex-wrap items-center justify-between gap-2 border-t" style={{ backgroundColor: C.bg, borderColor: "rgba(11,11,12,0.12)" }}>
        <p className="text-xs" style={{ ...mono, color: C.mute }}>© 2026 Simone D'sa. Mumbai, India.</p>
        <p className="text-xs" style={{ ...mono, color: C.mute }}>+91-9920154918</p>
      </footer>
    </div>
  );
}