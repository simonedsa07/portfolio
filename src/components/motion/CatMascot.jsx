"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useDeviceCapability } from "../../hooks/useDeviceCapability";

/**
 * <CatMascot />
 *
 * An interactive kawaii Persian cat, fixed bottom-right.
 * - Subtly tracks the cursor with spring physics.
 * - Click: swiping paw micro-interaction.
 * - Sleep mode: Inactive for 6 seconds closes eyes and snoozes.
 * - Section-Aware Scroll Reactions:
 *   - "hero" (Top / Home): Standard happy cat.
 *   - "process" (How I Work): Scholar cat wearing round black-rimmed glasses!
 *   - "about" (About Me): Heart-eyes calico cat feeling the love!
 *   - "work" (Selected Projects): Cool cat wearing black sunglasses with white sparkles!
 *   - "skills" (The Toolbox): Playful cat sticking out a cute pink tongue!
 *   - "experience" (Where I've Worked): Inspired cat with sparkling stars in its eyes!
 *   - "contact" (Footer/Say Hello): Cheerful winking cat blowing a kiss!
 */
export default function CatMascot() {
  const { enableHeavyFX } = useDeviceCapability();
  const [isPawing, setIsPawing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [activeSection, setActiveSection] = useState("hero"); // "hero" | "process" | "about" | "work" | "skills" | "experience" | "contact"
  const [mascotState, setMascotState] = useState("normal"); // "normal" | "sleeping"
  const wrapRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springCfg = { stiffness: 120, damping: 14, mass: 0.4 };
  const headX = useSpring(mouseX, springCfg);
  const headY = useSpring(mouseY, springCfg);
  const eyeX = useSpring(mouseX, { ...springCfg, stiffness: 200 });
  const eyeY = useSpring(mouseY, { ...springCfg, stiffness: 200 });

  const headRotate = useTransform(headX, [-1, 1], [-6, 6]);
  const headTiltY = useTransform(headY, [-1, 1], [-3, 3]);
  const pupilX = useTransform(eyeX, [-1, 1], [-2.2, 2.2]);
  const pupilY = useTransform(eyeY, [-1, 1], [-1.6, 1.6]);

  const sleepTimerRef = useRef(null);

  const resetSleepTimer = () => {
    if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    sleepTimerRef.current = setTimeout(() => {
      setMascotState("sleeping");
    }, 6000);
  };

  useEffect(() => {
    resetSleepTimer();

    // IntersectionObserver to watch scroll sections
    const observerOptions = {
      root: null,
      rootMargin: "-35% 0px -35% 0px", // triggers when section is near viewport center
      threshold: 0.1,
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = ["process", "about", "work", "skills", "experience", "contact"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Fallback scroll listener for top/Hero section
    const handleScroll = () => {
      // Wake up if sleeping
      setMascotState((prev) => (prev === "sleeping" ? "normal" : prev));
      resetSleepTimer();

      if (window.scrollY < 200) {
        setActiveSection("hero");
      }
    };

    const handleMouseMove = () => {
      setMascotState((prev) => (prev === "sleeping" ? "normal" : prev));
      resetSleepTimer();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    };
  }, []);

  const handleClick = () => {
    if (isPawing) return;
    setIsPawing(true);
    setMascotState("normal");
    resetSleepTimer();
    setTimeout(() => setIsPawing(false), 650);
  };

  const offWhite = "#FAF6EE";
  const pinkAccent = "#FFB8E6";

  // Dynamic ear rotation values based on state/hovering
  const leftEarRot = mascotState === "sleeping" ? 8 : activeSection === "skills" ? -14 : isHovering ? -6 : 0;
  const rightEarRot = mascotState === "sleeping" ? -8 : activeSection === "skills" ? 14 : isHovering ? 6 : 0;

  // Head offset adjustments
  const stateHeadY = mascotState === "sleeping" ? 4 : activeSection === "skills" ? -2 : 0;

  return (
    <motion.button
      ref={wrapRef}
      aria-label="Say hi to the mascot"
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-5 right-5 z-40 h-28 w-28 select-none rounded-full drop-shadow-[0_4px_18px_rgba(0,0,0,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:h-32 sm:w-32"
      style={{ touchAction: "manipulation" }}
    >
      <motion.svg
        viewBox="0 0 120 120"
        className="h-full w-full"
        animate={{ y: stateHeadY }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        style={
          enableHeavyFX
            ? { rotate: headRotate, y: headTiltY }
            : undefined
        }
      >
        {/* Tail (Outlined with off-white inside) */}
        <motion.path
          d="M96 92 C 112 88, 114 70, 104 60"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          animate={
            isHovering || activeSection === "skills"
              ? { d: "M96 92 C 116 92, 118 68, 100 58" }
              : { d: "M96 92 C 112 88, 114 70, 104 60" }
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        <motion.path
          d="M96 92 C 112 88, 114 70, 104 60"
          stroke={offWhite}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          animate={
            isHovering || activeSection === "skills"
              ? { d: "M96 92 C 116 92, 118 68, 100 58" }
              : { d: "M96 92 C 112 88, 114 70, 104 60" }
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Body (Solid off-white with outline) */}
        <ellipse cx="60" cy="86" rx="30" ry="20" fill={offWhite} stroke="currentColor" strokeWidth="2.5" />

        {/* Ears with rounded tips for extra cuteness */}
        {/* Left ear */}
        <motion.path
          d="M32 42 L20 18 C22 15, 28 15, 32 18 L48 34 Z"
          fill={offWhite}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
          animate={{ rotate: leftEarRot }}
          style={{ transformOrigin: "32px 42px" }}
        />
        {/* Right ear */}
        <motion.path
          d="M88 42 L100 18 C98 15, 92 15, 88 18 L72 34 Z"
          fill={offWhite}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
          animate={{ rotate: rightEarRot }}
          style={{ transformOrigin: "88px 42px" }}
        />

        {/* Inner Ears (Pink details) */}
        <motion.path
          d="M31 38 L25 21 C23 19, 27 19, 30 21 L43 32 Z"
          fill={pinkAccent}
          animate={{ rotate: leftEarRot }}
          style={{ transformOrigin: "32px 42px" }}
        />
        <motion.path
          d="M89 38 L98 21 C97 19, 93 19, 90 21 L77 32 Z"
          fill={pinkAccent}
          animate={{ rotate: rightEarRot }}
          style={{ transformOrigin: "88px 42px" }}
        />

        {/* Head (Solid off-white base) */}
        <circle cx="60" cy="56" r="30" fill={offWhite} stroke="currentColor" strokeWidth="2.5" />

        {/* Cheek pink blush marks */}
        <motion.circle
          cx="36"
          cy="66"
          r="4.5"
          fill={pinkAccent}
          opacity="0.8"
          animate={{ scale: activeSection === "about" ? 1.25 : 1 }}
        />
        <motion.circle
          cx="84"
          cy="66"
          r="4.5"
          fill={pinkAccent}
          opacity="0.8"
          animate={{ scale: activeSection === "about" ? 1.25 : 1 }}
        />

        {/* ── DYNAMIC EYES BASED ON MASCOT STATE AND ACTIVE SECTION ── */}
        {mascotState === "sleeping" ? (
          <>
            {/* Sleeping left eye curve */}
            <path d="M41 55 Q47 59 53 55" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            {/* Sleeping right eye curve */}
            <path d="M67 55 Q73 59 79 55" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </>
        ) : activeSection === "contact" ? (
          <>
            {/* Winking Eyes (Left open, Right winking curve) */}
            <circle cx="48" cy="54" r="7" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.8" />
            <motion.g style={enableHeavyFX ? { x: pupilX, y: pupilY } : undefined}>
              <circle cx="48" cy="54" r="3.5" fill="currentColor" />
              <circle cx="50" cy="52" r="1.1" fill="#FFFFFF" />
            </motion.g>
            {/* Right eye winking Happy curve */}
            <path d="M67 54 Q73 59 79 54" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </>
        ) : activeSection === "about" ? (
          <>
            {/* Heart Eyes whites */}
            <circle cx="48" cy="54" r="7" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="72" cy="54" r="7" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.8" />
            {/* Heart Pupils overlay */}
            <g transform="translate(48, 54) scale(0.48)">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FF88A8" transform="translate(-12, -12)" />
            </g>
            <g transform="translate(72, 54) scale(0.48)">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FF88A8" transform="translate(-12, -12)" />
            </g>
          </>
        ) : activeSection === "experience" ? (
          <>
            {/* Sparkly Star Eyes whites */}
            <circle cx="48" cy="54" r="7" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="72" cy="54" r="7" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.8" />
            {/* Shiny 4-pointed star pupils */}
            <path d="M 48 48 Q 48 54 42 54 Q 48 54 48 60 Q 48 54 54 54 Q 48 54 48 48 Z" fill="#FFB8E6" stroke="currentColor" strokeWidth="0.8" />
            <path d="M 72 48 Q 72 54 66 54 Q 72 54 72 60 Q 72 54 78 54 Q 72 54 72 48 Z" fill="#FFB8E6" stroke="currentColor" strokeWidth="0.8" />
          </>
        ) : (
          <>
            {/* Standard Gaze Eyeballs */}
            <circle cx="48" cy="54" r="7" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="72" cy="54" r="7" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.8" />

            {/* Pupils with white shine dots grouped to track gaze */}
            <motion.g style={enableHeavyFX ? { x: pupilX, y: pupilY } : undefined}>
              <circle cx="48" cy="54" r="3.5" fill="currentColor" />
              <circle cx="50" cy="52" r="1.1" fill="#FFFFFF" />
            </motion.g>
            <motion.g style={enableHeavyFX ? { x: pupilX, y: pupilY } : undefined}>
              <circle cx="72" cy="54" r="3.5" fill="currentColor" />
              <circle cx="74" cy="52" r="1.1" fill="#FFFFFF" />
            </motion.g>
          </>
        )}

        {/* ── GLASSES OVERLAY FOR SCHOLAR CAT IN "PROCESS" SECTION ── */}
        {activeSection === "process" && mascotState !== "sleeping" && (
          <g style={{ zIndex: 12 }}>
            <circle cx="48" cy="54" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="72" cy="54" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M57.5 54 Q60 51.5 62.5 54" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M38.5 54 L32 52" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <path d="M81.5 54 L88 52" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </g>
        )}

        {/* ── COOL SUNGLASSES OVERLAY IN "WORK" SECTION ── */}
        {activeSection === "work" && mascotState !== "sleeping" && (
          <g style={{ zIndex: 12 }}>
            {/* Sleek retro black lenses */}
            <path d="M36 49 H58 V57 C58 61.5, 53.5 63, 47 63 C40.5 63, 36 61.5, 36 57 Z" fill="currentColor" />
            <path d="M62 49 H84 V57 C84 61.5, 79.5 63, 73 63 C66.5 63, 62 61.5, 62 57 Z" fill="currentColor" />
            {/* Frame top bar */}
            <rect x="34" y="47" width="52" height="3.2" rx="1.5" fill="currentColor" />
            {/* White diagonal shines for cool reflection */}
            <line x1="41" y1="51" x2="47" y2="59" stroke="#FAF6EE" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="67" y1="51" x2="73" y2="59" stroke="#FAF6EE" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        )}

        {/* Muzzle (Cute overlapping puff cheeks in center) */}
        <circle cx="56" cy="62" r="4.5" fill={offWhite} stroke="currentColor" strokeWidth="1.5" />
        <circle cx="64" cy="62" r="4.5" fill={offWhite} stroke="currentColor" strokeWidth="1.5" />

        {/* Pink Nose */}
        <path d="M60 59 C59.5 59, 58.5 59.5 58.5 60.5 C58.5 61.5, 60 62.5, 60 62.5 C60 62.5, 61.5 61.5, 61.5 60.5 C61.5 59.5, 60.5 59, 60 59 Z" fill="#FF88A8" stroke="currentColor" strokeWidth="0.8" />

        {/* Mouth expression based on section reactions */}
        {activeSection === "contact" && mascotState !== "sleeping" ? (
          /*Surprised/Kissing open mouth for winking contact */
          <ellipse cx="60" cy="66" rx="2" ry="2.8" fill="#FF88A8" stroke="currentColor" strokeWidth="1.2" />
        ) : (
          /* Normal smile */
          <path d="M56 62 Q58 64 60 62 Q62 64 64 62" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        )}

        {/* Playful pink tongue sticking out in "SKILLS" section */}
        {activeSection === "skills" && mascotState !== "sleeping" && (
          <path d="M58 62 C58 62, 60 68, 62 68 C64 68, 64 62, 64 62 Z" fill="#FF88A8" stroke="currentColor" strokeWidth="1" />
        )}

        {/* Paws resting on the bottom edge */}
        <circle cx="42" cy="85" r="7.5" fill={offWhite} stroke="currentColor" strokeWidth="2" />
        <circle cx="78" cy="85" r="7.5" fill={offWhite} stroke="currentColor" strokeWidth="2" />
        {/* Paw pad tick lines */}
        <path d="M40 82 L40 85 M44 82 L44 85" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M76 82 L76 85 M80 82 L80 85" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />

        {/* Whiskers */}
        <g stroke="currentColor" strokeWidth="1.2" opacity="0.6" strokeLinecap="round">
          <path d="M30 58 L14 55" />
          <path d="M30 63 L14 64" />
          <path d="M90 58 L106 55" />
          <path d="M90 63 L106 64" />
        </g>
      </motion.svg>

      {/* Paw swipe micro-interaction */}
      {isPawing && (
        <motion.svg
          viewBox="0 0 40 40"
          className="pointer-events-none absolute -left-2 bottom-2 h-8 w-8"
          initial={{ opacity: 0, x: 10, rotate: -20 }}
          animate={{ opacity: [0, 1, 1, 0], x: [10, -6, -14], rotate: [-20, 10, 20] }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Outlined off-white paw with pink pads */}
          <ellipse cx="20" cy="20" rx="12" ry="9" fill={offWhite} stroke="currentColor" strokeWidth="1.8" />
          <circle cx="10" cy="14" r="3" fill={pinkAccent} stroke="currentColor" strokeWidth="1" />
          <circle cx="16" cy="9" r="3" fill={pinkAccent} stroke="currentColor" strokeWidth="1" />
          <circle cx="24" cy="9" r="3" fill={pinkAccent} stroke="currentColor" strokeWidth="1" />
          <circle cx="30" cy="14" r="3" fill={pinkAccent} stroke="currentColor" strokeWidth="1" />
        </motion.svg>
      )}
    </motion.button>
  );
}
