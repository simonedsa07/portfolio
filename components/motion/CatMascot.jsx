"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";

/**
 * <CatMascot />
 *
 * A clean-vector Persian cat, fixed bottom-right, cohesive with a modern
 * tech portfolio (flat shapes + currentColor so it always matches your
 * theme's foreground/primary tokens — no external asset needed).
 *
 * - Head + eyes subtly track the cursor anywhere on screen (spring-damped).
 * - Hover: ears perk, tail flicks.
 * - Click: paw swipe animation plays once, then resets.
 * - Fully disabled (falls back to a static, non-tracking icon) on mobile /
 *   reduced-motion / touch-only, per the responsiveness constraint.
 */
export default function CatMascot() {
  const { enableHeavyFX } = useDeviceCapability();
  const [isPawing, setIsPawing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
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

  useEffect(() => {
    if (!enableHeavyFX) return;

    const handleMove = (e) => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (window.innerWidth / 2);
      const dy = (e.clientY - cy) / (window.innerHeight / 2);
      mouseX.set(Math.max(-1, Math.min(1, dx)));
      mouseY.set(Math.max(-1, Math.min(1, dy)));
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [enableHeavyFX, mouseX, mouseY]);

  const handleClick = () => {
    if (isPawing) return;
    setIsPawing(true);
    setTimeout(() => setIsPawing(false), 650);
  };

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
      className="fixed bottom-5 right-5 z-40 h-20 w-20 select-none rounded-full text-foreground/90 drop-shadow-[0_4px_16px_rgba(0,0,0,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:h-24 sm:w-24"
      style={{ touchAction: "manipulation" }}
    >
      <motion.svg
        viewBox="0 0 120 120"
        className="h-full w-full"
        style={
          enableHeavyFX
            ? { rotate: headRotate, y: headTiltY }
            : undefined
        }
      >
        {/* Tail */}
        <motion.path
          d="M96 92 C 112 88, 114 70, 104 60"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          animate={
            isHovering
              ? { d: "M96 92 C 116 92, 118 68, 100 58" }
              : { d: "M96 92 C 112 88, 114 70, 104 60" }
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Body */}
        <ellipse cx="60" cy="86" rx="30" ry="20" fill="currentColor" opacity="0.12" />

        {/* Ears */}
        <motion.path
          d="M32 42 L22 18 L48 34 Z"
          fill="currentColor"
          animate={{ rotate: isHovering ? -6 : 0 }}
          style={{ transformOrigin: "32px 42px" }}
        />
        <motion.path
          d="M88 42 L98 18 L72 34 Z"
          fill="currentColor"
          animate={{ rotate: isHovering ? 6 : 0 }}
          style={{ transformOrigin: "88px 42px" }}
        />

        {/* Head (flat Persian face: round + short muzzle) */}
        <circle cx="60" cy="56" r="30" fill="currentColor" opacity="0.16" />
        <circle cx="60" cy="56" r="30" fill="none" stroke="currentColor" strokeWidth="2" />

        {/* Cheek fluff */}
        <circle cx="38" cy="66" r="7" fill="currentColor" opacity="0.1" />
        <circle cx="82" cy="66" r="7" fill="currentColor" opacity="0.1" />

        {/* Eyes (whites) */}
        <circle cx="48" cy="54" r="6.5" fill="var(--background, #fff)" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="72" cy="54" r="6.5" fill="var(--background, #fff)" stroke="currentColor" strokeWidth="1.5" />

        {/* Pupils — track cursor */}
        <motion.circle
          cx="48"
          cy="54"
          r="3"
          fill="currentColor"
          style={enableHeavyFX ? { x: pupilX, y: pupilY } : undefined}
        />
        <motion.circle
          cx="72"
          cy="54"
          r="3"
          fill="currentColor"
          style={enableHeavyFX ? { x: pupilX, y: pupilY } : undefined}
        />

        {/* Nose + mouth */}
        <path d="M60 62 L56 66 L64 66 Z" fill="currentColor" />
        <path d="M60 66 Q60 70 55 71 M60 66 Q60 70 65 71" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Whiskers */}
        <g stroke="currentColor" strokeWidth="1" opacity="0.5" strokeLinecap="round">
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
          className="pointer-events-none absolute -left-2 bottom-2 h-8 w-8 text-foreground/90"
          initial={{ opacity: 0, x: 10, rotate: -20 }}
          animate={{ opacity: [0, 1, 1, 0], x: [10, -6, -14], rotate: [-20, 10, 20] }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <ellipse cx="20" cy="20" rx="12" ry="9" fill="currentColor" opacity="0.9" />
          <circle cx="10" cy="14" r="3" fill="currentColor" />
          <circle cx="16" cy="9" r="3" fill="currentColor" />
          <circle cx="24" cy="9" r="3" fill="currentColor" />
          <circle cx="30" cy="14" r="3" fill="currentColor" />
        </motion.svg>
      )}
    </motion.button>
  );
}
