"use client";

import { useEffect, useState } from "react";

/**
 * Central capability check used by every "crazy" effect in this package.
 * Returns { isMobile, prefersReducedMotion, canHover, enableHeavyFX }.
 *
 * enableHeavyFX = false on:
 *   - viewports <= 768px (Tailwind's `md` breakpoint)
 *   - devices without a fine pointer (touch-only)
 *   - prefers-reduced-motion: reduce
 *
 * Every custom-cursor / magnetic / tilt / mascot-tracking component in this
 * package reads this hook and no-ops (falling back to plain CSS/scroll
 * reveals) when enableHeavyFX is false, per the responsiveness constraint.
 */
export function useDeviceCapability() {
  const [state, setState] = useState({
    isMobile: false,
    prefersReducedMotion: false,
    canHover: true,
  });

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 768px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqHover = window.matchMedia("(hover: hover) and (pointer: fine)");

    const update = () =>
      setState({
        isMobile: mqMobile.matches,
        prefersReducedMotion: mqMotion.matches,
        canHover: mqHover.matches,
      });

    update();
    mqMobile.addEventListener("change", update);
    mqMotion.addEventListener("change", update);
    mqHover.addEventListener("change", update);
    return () => {
      mqMobile.removeEventListener("change", update);
      mqMotion.removeEventListener("change", update);
      mqHover.removeEventListener("change", update);
    };
  }, []);

  const enableHeavyFX =
    !state.isMobile && !state.prefersReducedMotion && state.canHover;

  return { ...state, enableHeavyFX };
}
