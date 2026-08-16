"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useDeviceCapability } from "../../hooks/useDeviceCapability";

export default function SmoothScrollProvider({ children }) {
  const { isMobile, prefersReducedMotion } = useDeviceCapability();
  const lenisRef = useRef(null);

  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [isMobile, prefersReducedMotion]);

  return children;
}
