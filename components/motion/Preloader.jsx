"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * <Preloader label="SIMONE" onFinish={() => {}} />
 *
 * Drop this as the FIRST child inside your root layout, wrapping (or
 * sitting above) your existing hero. It renders on top of everything
 * (fixed, inset-0, high z-index) using your site's own `bg-background`
 * and `text-foreground` tokens — no new colors introduced.
 *
 * Sequence:
 *  1. SVG monogram/line draws itself (stroke-dashoffset)
 *  2. Label text reveals letter-by-letter (staggered y/opacity)
 *  3. Thin progress rule fills
 *  4. Whole thing exits: slides up, scales down slightly, blurs out
 *
 * Swap `bg-background` / `text-foreground` / `bg-primary` below for
 * whatever your tailwind.config theme tokens are actually called if
 * they differ (check your existing globals.css / tailwind.config).
 */
export default function Preloader({
  label = "PORTFOLIO",
  minDuration = 1800,
  onFinish,
}) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Replace this with real asset-load tracking if you have any
    // (e.g. Promise.all of font.load() / image preloads) — the timer
    // is just a sane minimum so the animation never feels clipped.
    const t = setTimeout(() => {
      setDone(true);
      onFinish?.();
    }, minDuration);
    return () => clearTimeout(t);
  }, [minDuration, onFinish]);

  const letters = label.split("");

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            scale: 0.96,
            filter: "blur(8px)",
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* SVG line-draw mark */}
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            className="mb-6 text-foreground"
          >
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0.4 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
            />
          </svg>

          {/* Staggered letter reveal */}
          <div className="flex overflow-hidden text-sm font-medium tracking-[0.35em] uppercase text-foreground">
            {letters.map((ch, i) => (
              <motion.span
                key={i}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  delay: 0.4 + i * 0.045,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block"
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            ))}
          </div>

          {/* Progress rule */}
          <div className="mt-6 h-px w-32 overflow-hidden bg-foreground/10">
            <motion.div
              className="h-full bg-primary"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              style={{ originX: 0 }}
              transition={{
                duration: minDuration / 1000 - 0.3,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
