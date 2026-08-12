import React, { useState, useEffect, useRef } from "react";
import simonePhoto from "./assets/simone.jpg";

/**
 * Design tokens
 * cream:  #F3EEE2  paper background
 * ink:    #1C1F18  near-black text / dark sections
 * forest: #38452F  deep green section bg
 * rust:   #BF4E2C  accent (CTA, underline, dot)
 * sage:   #AEC08F  accent (chips, italic headline)
 * clay:   #E7DCC4  card / tag bg
 */

const COLORS = {
  cream: "#F3EEE2",
  ink: "#1C1F18",
  forest: "#38452F",
  rust: "#BF4E2C",
  sage: "#AEC08F",
  clay: "#E7DCC4",
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`;

const display = { fontFamily: "'Fraunces', serif" };
const body = { fontFamily: "'Space Grotesk', sans-serif" };
const mono = { fontFamily: "'JetBrains Mono', monospace" };

const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/* ---------------------------------------------------------
   Reveal: a generic scroll-triggered "scrapbook piece lands
   on the page" wrapper. Each element starts off-canvas /
   rotated / faded, and settles into place once it's ~15%
   into view. Fires once, respects reduced motion via CSS.
--------------------------------------------------------- */
function Reveal({
  children,
  from = "translateY(56px) rotate(-3deg) scale(0.96)",
  to = "translate(0,0) rotate(0deg) scale(1)",
  delay = 0,
  duration = 850,
  className = "",
  style = {},
  as: Tag = "div",
}) {
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

/* Little piece of washi tape, gently wiggling forever. */
function Tape({ top, left, right, bottom, rot = -6, color = "rgba(231,220,196,0.9)", delay = 0, wide = 64 }) {
  return (
    <span
      className="tape-wiggle"
      style={{
        position: "absolute",
        top, left, right, bottom,
        width: wide,
        height: 22,
        backgroundColor: color,
        boxShadow: "0 2px 4px rgba(28,31,24,0.22)",
        opacity: 0.92,
        zIndex: 5,
        "--base-rot": `${rot}deg`,
        animationDelay: `${delay}ms`,
      }}
    />
  );
}

function Eyebrow({ index, label, dark }) {
  return (
    <Reveal from="translateX(-24px)" to="translateX(0)" duration={600} className="flex items-center gap-4 mb-8 sm:mb-10">
      <span
        className="text-xs px-2 py-1 border rounded-sm shrink-0"
        style={{ ...mono, borderColor: dark ? COLORS.clay : COLORS.ink, color: dark ? COLORS.clay : COLORS.ink }}
      >
        {index}
      </span>
      <span
        className="text-xs tracking-[0.2em] uppercase shrink-0"
        style={{ ...mono, color: dark ? COLORS.sage : COLORS.forest }}
      >
        {label}
      </span>
      <span className="h-px flex-1" style={{ backgroundColor: dark ? "rgba(243,238,226,0.25)" : "rgba(28,31,24,0.2)" }} />
    </Reveal>
  );
}

function Chip({ children, dark, delay = 0 }) {
  return (
    <Reveal
      as="span"
      from="translateY(14px) scale(0.85)"
      to="translateY(0) scale(1)"
      duration={500}
      delay={delay}
      className="inline-block text-sm px-3 py-1.5 border rounded-full mr-2 mb-2 hover-lift"
      style={{
        ...body,
        borderColor: dark ? "rgba(243,238,226,0.35)" : COLORS.ink,
        color: dark ? COLORS.cream : COLORS.ink,
        backgroundColor: dark ? "transparent" : COLORS.clay,
      }}
    >
      {children}
    </Reveal>
  );
}

export default function SimonePortfolio() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  const nav = ["Work", "About", "Skills", "Contact"];

  const facts = [
    { label: "3rd-year IT student", sub: "Don Bosco Institute of Technology" },
    { label: "Mumbai, India", sub: "University of Mumbai" },
    { label: "Design + code", sub: "engineering meets visual craft" },
    { label: "CGPA 8.27", sub: "Expected 2028" },
  ];

  const factRot = [-3, 2, -2, 3];

  const skillTags = [
    "full-stack engineering",
    "UI/UX design",
    "brand identity",
    "problem solving",
    "clean type systems",
  ];

  const project = {
    num: "01",
    title: "FitSync AI",
    tag: "AI-powered fitness app",
    desc:
      "A full-stack fitness application that turns workout intelligence into something people actually stick with — built end to end, from state management to auth to the AI layer.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Zustand", "Supabase"],
    link: "fit-sync-ai-chi.vercel.app",
    bg: COLORS.forest,
  };

  const toolbox = [
    { group: "Languages", items: ["Java", "C", "Python", "JavaScript", "TypeScript", "HTML", "CSS"] },
    { group: "Frontend", items: ["React.js", "Next.js", "Tailwind CSS", "Zustand"] },
    { group: "Backend & Data", items: ["SQL & MongoDB", "REST APIs"] },
    { group: "Tools", items: ["Git", "GitHub", "Figma"] },
    { group: "Design", items: ["UI/UX Design", "Visual & Brand Identity"] },
  ];

  const experience = [
    {
      role: "Head of Design",
      org: "Colosseum '26 — DBIT Annual Tech Fest",
      date: "Feb 2026 – Apr 2026",
      desc: "Led 4 volunteers designing brochures, social posts, banners and logos. Kept one visual identity consistent from pre-event promotion through execution.",
    },
    {
      role: "Assistant Design Head",
      org: "GDGC, DBIT",
      date: "Aug 2025 – Present",
      desc: "Design posters, banners and Instagram stories for event promotions, partnering with the core team on visual communication strategy.",
    },
    {
      role: "Intern, CrEAST Program",
      org: "DBIT × Larsen & Toubro",
      date: "Jul 2026 – Present",
      desc: "Selected for an L&T-sponsored initiative supporting underprivileged communities — teaching basic C programming to 8th and 9th graders.",
    },
  ];

  const marqueeWords = ["FULL-STACK ENGINEER", "UI/UX DESIGNER", "MUMBAI, INDIA", "BRAND IDENTITY", "FITSYNC AI", "DBIT '28"];

  return (
    <div style={{ backgroundColor: COLORS.cream, ...body, position: "relative" }} className="w-full min-h-screen overflow-x-hidden">
      <style>{`
        ${FONT_IMPORT}
        html { scroll-behavior: smooth; }

        .hover-lift { transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease; }
        .hover-lift:hover { transform: translateY(-6px) rotate(-0.5deg); }

        .underline-grow { position: relative; }
        .underline-grow::after {
          content: ''; position: absolute; left: 0; bottom: -4px; height: 1px; width: 0%;
          background: currentColor; transition: width 0.3s ease;
        }
        .underline-grow:hover::after { width: 100%; }

        @keyframes tapeWiggle {
          0%, 100% { transform: translateX(-50%) rotate(calc(var(--base-rot) - 1.5deg)); }
          50% { transform: translateX(-50%) rotate(calc(var(--base-rot) + 1.5deg)); }
        }
        .tape-wiggle {
          transform-origin: center;
          animation: tapeWiggle 4.5s ease-in-out infinite;
        }

        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 22s linear infinite;
        }

        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .float-slow { animation: floatY 5s ease-in-out infinite; }

        @keyframes heroIn {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-line { opacity: 0; animation: heroIn 0.9s cubic-bezier(.19,1,.22,1) forwards; }

        @keyframes navIn {
          from { opacity: 0; transform: translateY(-14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hover-lift, .underline-grow::after, .tape-wiggle, .marquee-track, .float-slow, .hero-line { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* GRAIN OVERLAY — scrapbook paper texture across the whole page */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: GRAIN_URL,
          opacity: 0.05,
          mixBlendMode: "multiply",
          pointerEvents: "none",
          zIndex: 50,
        }}
      />

      {/* NAV */}
      <header
        className="sticky top-0 z-30 border-b"
        style={{
          backgroundColor: COLORS.cream,
          borderColor: "rgba(28,31,24,0.15)",
          opacity: loaded ? 1 : 0,
          animation: loaded ? "navIn 0.6s cubic-bezier(.19,1,.22,1) forwards" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 sm:px-10 py-5">
          <span className="text-base sm:text-lg font-semibold tracking-tight" style={{ ...display, color: COLORS.ink }}>
            Simone D'sa<span style={{ color: COLORS.rust }}>*</span>
          </span>
          <nav className="hidden sm:flex items-center gap-6">
            {nav.map((n) => (
              <a
                key={n}
                href={`#${n.toLowerCase()}`}
                className="text-xs tracking-[0.15em] uppercase underline-grow"
                style={{ ...mono, color: COLORS.ink }}
              >
                {n}
              </a>
            ))}
          </nav>
          <a
            href="mailto:simonedsa0507@gmail.com"
            className="text-xs px-4 py-2 rounded-full border hover-lift"
            style={{ ...mono, borderColor: COLORS.ink, color: COLORS.ink }}
          >
            Say hi
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-16 sm:pt-24 pb-14">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 text-left">
          <p
            className="hero-line text-xs tracking-[0.25em] uppercase mb-5"
            style={{ ...mono, color: COLORS.rust, animationDelay: "80ms" }}
          >
            Portfolio — Mumbai, India
          </p>
          <h1
            className="hero-line leading-[1.05] tracking-tight"
            style={{ ...display, color: COLORS.ink, fontSize: "clamp(3rem, 10vw, 7.5rem)", fontWeight: 600, animationDelay: "180ms" }}
          >
            Simone D'sa
          </h1>
          <p
            className="hero-line leading-[1.1] mt-1 sm:mt-2"
            style={{ ...display, color: COLORS.forest, fontStyle: "italic", fontWeight: 500, fontSize: "clamp(2.2rem, 7vw, 5rem)", animationDelay: "320ms" }}
          >
            builds things that work.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12">
            {facts.map((f, i) => (
              <Reveal
                key={f.label}
                delay={i * 110}
                from={`translateY(50px) rotate(${factRot[i] * 2}deg) scale(0.9)`}
                to={`translateY(0) rotate(${factRot[i]}deg) scale(1)`}
                className="relative hover-lift border rounded-sm px-4 py-4"
                style={{ backgroundColor: COLORS.sage, borderColor: COLORS.ink, boxShadow: "6px 6px 0px rgba(28,31,24,0.1)" }}
              >
                <Tape top={-10} left="50%" rot={factRot[i]} wide={40} delay={i * 300} />
                <p className="text-sm sm:text-base font-semibold" style={{ ...body, color: COLORS.ink }}>
                  {f.label}
                </p>
                <p className="text-xs mt-1" style={{ ...mono, color: COLORS.ink, opacity: 0.75 }}>
                  {f.sub}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE RIBBON — scrapbook washi-tape banner */}
      <div
        className="relative py-3 border-y overflow-hidden"
        style={{ backgroundColor: COLORS.ink, borderColor: COLORS.ink, transform: "rotate(-0.6deg)", margin: "0 -6px" }}
      >
        <div className="marquee-track">
          {[...marqueeWords, ...marqueeWords, ...marqueeWords].map((w, i) => (
            <span
              key={i}
              className="px-6 text-xs tracking-[0.2em] uppercase whitespace-nowrap"
              style={{ ...mono, color: COLORS.cream }}
            >
              {w} <span style={{ color: COLORS.rust }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 text-left">
          <Eyebrow index="02" label="A little about me" />
          <div className="grid sm:grid-cols-2 gap-12 items-center">
            <Reveal
              from="translateX(-60px) rotate(-10deg) scale(0.9)"
              to="translateX(0) rotate(-4deg) scale(1)"
              duration={900}
              className="relative w-full max-w-xs mx-auto sm:mx-0"
            >
              <div
                className="relative border-2 rounded-sm p-4 pb-14 hover-lift"
                style={{ backgroundColor: COLORS.clay, borderColor: COLORS.ink, boxShadow: "10px 10px 0px rgba(28,31,24,0.12)" }}
              >
                <img
                  src={simonePhoto}
                  alt="Simone D'sa"
                  className="aspect-[4/5] w-full object-cover rounded-sm float-slow border"
                  style={{ borderColor: COLORS.ink }}
                />
                <p className="text-center text-xs mt-4" style={{ ...mono, color: COLORS.ink }}>
                  A Designer who codes!
                </p>
              </div>
              <Reveal
                as="span"
                delay={500}
                from="translate(20px, -10px) rotate(-4deg) scale(0.6)"
                to="translate(0,0) rotate(6deg) scale(1)"
                duration={550}
                className="absolute -top-4 -right-6 text-xs px-3 py-1 rounded-sm border"
                style={{ ...mono, backgroundColor: COLORS.rust, color: COLORS.cream, borderColor: COLORS.ink }}
              >
                this is me →
              </Reveal>
            </Reveal>

            <Reveal from="translateX(60px)" to="translateX(0)" duration={800} delay={120}>
              <h2
                className="leading-[1.1] mb-6 text-left"
                style={{ ...display, color: COLORS.ink, fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 600 }}
              >
                I make things
                <br />
                <span style={{ fontStyle: "italic", color: COLORS.forest }}>make sense.</span>
              </h2>
              <p className="text-base sm:text-lg leading-relaxed mb-6 text-left" style={{ ...body, color: COLORS.ink, opacity: 0.85 }}>
                Third-year IT student working at the intersection of design, development and execution — combining
                full-stack engineering with visual and brand design across academic, community and freelance work.
                Currently deepening core programming foundations through DBIT CrEAST, an L&T-sponsored initiative,
                while shipping full-stack apps independently.
              </p>
              <div className="text-left">
                {skillTags.map((s, i) => (
                  <Chip key={s} delay={i * 90}>{s}</Chip>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SELECTED WORK */}
      <section id="work" className="py-16 sm:py-24" style={{ backgroundColor: COLORS.forest }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 text-left">
          <Eyebrow index="03" label="Selected work" dark />
          <Reveal from="translateY(40px)" to="translateY(0)" duration={800}>
            <h2
              className="leading-[1.1] mb-14"
              style={{ ...display, color: COLORS.cream, fontSize: "clamp(2.6rem, 8vw, 5.5rem)", fontWeight: 600 }}
            >
              The thing I've
              <br />
              <span style={{ fontStyle: "italic", color: COLORS.sage }}>built.</span>
            </h2>
          </Reveal>

          <Reveal
            from="translateX(-70px) rotate(-4deg) scale(0.95)"
            to="translateX(0) rotate(0deg) scale(1)"
            duration={900}
            className="relative"
          >
            <div
              onMouseEnter={() => setHoveredProject(project.num)}
              onMouseLeave={() => setHoveredProject(null)}
              className="relative hover-lift border rounded-sm p-6 sm:p-10 grid sm:grid-cols-[auto_1fr] gap-6 sm:gap-10 items-start text-left"
              style={{
                backgroundColor: hoveredProject === project.num ? COLORS.clay : "rgba(243,238,226,0.04)",
                borderColor: "rgba(243,238,226,0.3)",
              }}
            >
              <Tape top={-12} left={28} rot={-8} color="rgba(174,192,143,0.85)" />
              <Tape top={-12} right={28} rot={7} color="rgba(174,192,143,0.85)" delay={600} />
              <span
                className="text-xs px-2 py-1 border rounded-sm h-fit text-center"
                style={{ ...mono, borderColor: hoveredProject === project.num ? COLORS.ink : COLORS.sage, color: hoveredProject === project.num ? COLORS.ink : COLORS.sage }}
              >
                {project.num}
              </span>
              <div>
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-2"
                  style={{ ...mono, color: hoveredProject === project.num ? COLORS.rust : COLORS.sage }}
                >
                  {project.tag}
                </p>
                <h3
                  className="leading-tight mb-3"
                  style={{ ...display, fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: hoveredProject === project.num ? COLORS.ink : COLORS.cream }}
                >
                  {project.title}
                  <span style={{ color: COLORS.rust }}>.</span>
                </h3>
                <p
                  className="text-sm sm:text-base leading-relaxed mb-4 max-w-xl"
                  style={{ ...body, color: hoveredProject === project.num ? COLORS.ink : COLORS.cream, opacity: 0.85 }}
                >
                  {project.desc}
                </p>
                <div className="mb-4">
                  {project.stack.map((s, i) => (
                    <Reveal
                      as="span"
                      key={s}
                      delay={i * 80}
                      from="translateY(10px) scale(0.85)"
                      to="translateY(0) scale(1)"
                      duration={450}
                      className="inline-block text-xs px-2.5 py-1 rounded-full mr-2 mb-2 border"
                      style={{
                        ...mono,
                        borderColor: hoveredProject === project.num ? COLORS.ink : "rgba(243,238,226,0.4)",
                        color: hoveredProject === project.num ? COLORS.ink : COLORS.cream,
                      }}
                    >
                      {s}
                    </Reveal>
                  ))}
                </div>
                {project.link && (
                  <a
                    href={`https://${project.link}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm underline-grow inline-flex items-center gap-1"
                    style={{ ...mono, color: hoveredProject === project.num ? COLORS.rust : COLORS.sage }}
                  >
                    See the project ↗
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TOOLBOX */}
      <section id="skills" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 text-left">
          <Eyebrow index="04" label="The toolbox" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {toolbox.map((g, gi) => (
              <Reveal key={g.group} delay={gi * 90} from="translateY(36px)" to="translateY(0)" duration={700} className="text-left">
                <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ ...mono, color: COLORS.rust }}>
                  {g.group}
                </p>
                <div>
                  {g.items.map((i, ii) => (
                    <Chip key={i} delay={ii * 70}>{i}</Chip>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="py-16 sm:py-24" style={{ backgroundColor: COLORS.clay }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 text-left">
          <Eyebrow index="05" label="Where I've worked" />
          <div className="flex flex-col">
            {experience.map((e, idx) => (
              <Reveal
                key={e.role}
                from={idx % 2 === 0 ? "translateX(-50px) rotate(-1.5deg)" : "translateX(50px) rotate(1.5deg)"}
                to="translateX(0) rotate(0deg)"
                duration={750}
                className="grid sm:grid-cols-[1fr_2fr] gap-2 sm:gap-10 py-6 text-left"
                style={{ borderTop: idx === 0 ? "none" : `1px solid rgba(28,31,24,0.15)` }}
              >
                <p className="text-xs" style={{ ...mono, color: COLORS.forest }}>
                  {e.date}
                </p>
                <div>
                  <h4 style={{ ...display, fontWeight: 600, fontSize: "1.4rem", color: COLORS.ink }}>{e.role}</h4>
                  <p className="text-sm mb-2" style={{ ...mono, color: COLORS.rust }}>
                    {e.org}
                  </p>
                  <p className="text-sm sm:text-base leading-relaxed" style={{ ...body, color: COLORS.ink, opacity: 0.8 }}>
                    {e.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-16 sm:py-28" style={{ backgroundColor: COLORS.rust }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 text-left">
          <Eyebrow index="06" label="Say hello" dark />
          <Reveal from="translateY(44px)" to="translateY(0)" duration={850}>
            <h2
              className="leading-[1.05] mb-10"
              style={{ ...display, color: COLORS.cream, fontSize: "clamp(2.8rem, 10vw, 6.5rem)", fontWeight: 600 }}
            >
              Let's make
              <br />
              <span style={{ fontStyle: "italic", color: COLORS.sage }}>something</span>
              <br />
              real.
            </h2>
          </Reveal>
          <div className="flex flex-wrap gap-4">
            <Reveal as="span" delay={80} from="translateY(20px) scale(0.9)" to="translateY(0) scale(1)" duration={500}>
              <a
                href="mailto:simonedsa0507@gmail.com"
                className="px-6 py-3 rounded-full border text-sm hover-lift inline-block"
                style={{ ...mono, backgroundColor: COLORS.cream, borderColor: COLORS.ink, color: COLORS.ink }}
              >
                simonedsa0507@gmail.com
              </a>
            </Reveal>
            <Reveal as="span" delay={180} from="translateY(20px) scale(0.9)" to="translateY(0) scale(1)" duration={500}>
              <a
                href="https://linkedin.com/in/simone-d-sa"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-full border text-sm hover-lift inline-block"
                style={{ ...mono, borderColor: COLORS.cream, color: COLORS.cream }}
              >
                LinkedIn ↗
              </a>
            </Reveal>
            <Reveal as="span" delay={280} from="translateY(20px) scale(0.9)" to="translateY(0) scale(1)" duration={500}>
              <a
                href="https://github.com/simonedsa07"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-full border text-sm hover-lift inline-block"
                style={{ ...mono, borderColor: COLORS.cream, color: COLORS.cream }}
              >
                GitHub ↗
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <footer className="py-6" style={{ backgroundColor: COLORS.ink }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs" style={{ ...mono, color: "rgba(243,238,226,0.6)" }}>
            © 2026 Simone D'sa. Mumbai, India.
          </p>
          <p className="text-xs" style={{ ...mono, color: "rgba(243,238,226,0.6)" }}>
            +91-9920154918
          </p>
        </div>
      </footer>
    </div>
  );
}
