"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";

/**
 * <SmoothScrollProvider>{children}</SmoothScrollProvider>
 *
 * Wrap your existing page content (inside <body>, below <Preloader> and
 * <CustomCursor>) with this. It does NOT change your DOM structure or
 * styling — it only hijacks native scroll and drives it via rAF for the
 * buttery Lenis easing.
 *
 * `npm install lenis` (formerly @studio-freight/lenis).
 * If you also use GSAP ScrollTrigger anywhere, the effect below keeps
 * it in sync automatically (safe no-op if GSAP isn't installed — just
 * delete that block).
 *
 * Disabled entirely on mobile/reduced-motion: falls back to native
 * scroll behavior, which is what you want for touch devices anyway.
 */
export default function SmoothScrollProvider({ children }) {
  const { isMobile, prefersReducedMotion } = useDeviceCapability();
  const lenisRef = useRef(null);

  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
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

    // --- Optional GSAP ScrollTrigger sync (remove if unused) ---
    let gsapCleanup = () => {};
    (async () => {
      try {
        const { gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
        gsapCleanup = () => gsap.ticker.remove((time) => lenis.raf(time * 1000));
      } catch {
        // GSAP not installed — Lenis still works standalone.
      }
    })();
    // -------------------------------------------------------------

    return () => {
      cancelAnimationFrame(rafId);
      gsapCleanup();
      lenis.destroy();
    };
  }, [isMobile, prefersReducedMotion]);

  return children;
}
