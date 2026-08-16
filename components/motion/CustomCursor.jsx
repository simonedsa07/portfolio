"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";

/**
 * <CustomCursor />
 *
 * Mount once near the root (inside the same layout as Preloader).
 * Small solid dot glued to the raw cursor position, larger ring trailing
 * behind via a spring. Grows + goes translucent over anything with
 * [data-cursor="hover"] (add that attribute to buttons/links/cards, or
 * use the <Magnetic> wrapper below which sets it automatically).
 *
 * Add `cursor-none` to <body> (or a top-level wrapper) in globals.css
 * when enableHeavyFX is true — see README for the tiny useEffect needed
 * to toggle that class, or just add `md:cursor-none` conditionally.
 */
export default function CustomCursor() {
  const { enableHeavyFX } = useDeviceCapability();
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 300, damping: 30, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 300, damping: 30, mass: 0.5 });

  useEffect(() => {
    if (!enableHeavyFX) return;
    document.documentElement.classList.add("cursor-none");

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!isVisible) setIsVisible(true);
      const target = e.target.closest?.('[data-cursor="hover"]');
      setIsHovering(Boolean(target));
    };
    const leave = () => setIsVisible(false);

    window.addEventListener("mousemove", move);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      document.documentElement.classList.remove("cursor-none");
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [enableHeavyFX, isVisible, x, y]);

  if (!enableHeavyFX) return null;

  return (
    <>
      {/* Trailing ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[998] rounded-full border border-foreground/50 mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: isHovering ? 56 : 32,
          height: isHovering ? 56 : 32,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
      {/* Core dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[998] h-1.5 w-1.5 rounded-full bg-foreground mix-blend-difference"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isHovering ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
