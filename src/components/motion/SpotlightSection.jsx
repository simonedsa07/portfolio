"use client";

import { useRef, useState } from "react";
import { useDeviceCapability } from "../../hooks/useDeviceCapability";

/**
 * <SpotlightSection className="bg-background dark:bg-neutral-950">
 *   ...your existing dark section / project grid markup, untouched...
 * </SpotlightSection>
 *
 * Wraps a section and paints a radial gradient that follows the cursor,
 * using your theme's own `--primary` token at low opacity so it tints
 * rather than overrides your palette. Pure CSS custom-property update on
 * mousemove — no re-render, no layout thrash, GPU-cheap.
 *
 * Pass `spotlightColor` to override the token if your primary color is
 * too bright/dark for this treatment (e.g. an off-white on a dark section).
 */
export default function SpotlightSection({
  children,
  className = "",
  spotlightColor = "var(--primary, currentColor)",
  size = 500,
  ...props
}) {
  const { enableHeavyFX } = useDeviceCapability();
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!enableHeavyFX || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative isolate overflow-hidden ${className}`}
      {...props}
    >
      {enableHeavyFX && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(${size}px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${spotlightColor}14, transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
