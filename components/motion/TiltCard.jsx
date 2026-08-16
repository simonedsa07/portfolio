"use client";

import { createContext, useContext, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";

/**
 * Wrap your existing project/experience card grid:
 *
 *   <TiltGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
 *     {projects.map((p) => (
 *       <TiltCard key={p.id}>
 *         ...your existing card markup (image, title, tags) — untouched...
 *       </TiltCard>
 *     ))}
 *   </TiltGroup>
 *
 * TiltGroup tracks which card (if any) is hovered and passes that down
 * via context so siblings can dim/scale/blur — no prop drilling needed
 * in your existing card components.
 */
const TiltContext = createContext(null);

export function TiltGroup({ children, className = "" }) {
  const [activeId, setActiveId] = useState(null);
  return (
    <TiltContext.Provider value={{ activeId, setActiveId }}>
      <div className={className}>{children}</div>
    </TiltContext.Provider>
  );
}

let idCounter = 0;

export function TiltCard({
  children,
  className = "",
  maxTilt = 10, // degrees
  glow = true,
  glowColor = "var(--primary, currentColor)",
}) {
  const { enableHeavyFX } = useDeviceCapability();
  const ctx = useContext(TiltContext);
  const idRef = useRef(++idCounter);
  const cardRef = useRef(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 250, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 250, damping: 20 });

  const angle = useMotionValue(0); // for the perimeter-tracking glow
  const glowBackground = useMotionTemplate`conic-gradient(from ${angle}deg, ${glowColor}00, ${glowColor}80, ${glowColor}00 30%)`;

  const isActive = ctx?.activeId === idRef.current;
  const isDimmed = enableHeavyFX && ctx?.activeId != null && !isActive;

  const handleMouseMove = (e) => {
    if (!enableHeavyFX || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1

    rotateY.set((px - 0.5) * maxTilt * 2);
    rotateX.set((0.5 - py) * maxTilt * 2);

    const cx = e.clientX - (rect.left + rect.width / 2);
    const cy = e.clientY - (rect.top + rect.height / 2);
    angle.set((Math.atan2(cy, cx) * 180) / Math.PI + 90);
  };

  const handleEnter = () => ctx?.setActiveId(idRef.current);
  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    ctx?.setActiveId((id) => (id === idRef.current ? null : id));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      animate={{
        scale: isDimmed ? 0.96 : 1,
        opacity: isDimmed ? 0.5 : 1,
        filter: isDimmed ? "blur(2px)" : "blur(0px)",
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{ perspective: 1000 }}
      className={`relative ${className}`}
    >
      {/* Glow border — sits behind the card content, tracks mouse angle */}
      {glow && enableHeavyFX && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glowBackground, opacity: isActive ? 1 : 0 }}
        />
      )}

      {/* Actual tilting surface — keep your existing card classes on the
          inner element (bg-card, border, rounded-xl, padding, etc.) */}
      <motion.div
        style={
          enableHeavyFX
            ? {
                rotateX: springX,
                rotateY: springY,
                transformStyle: "preserve-3d",
              }
            : undefined
        }
        className="relative z-10 h-full rounded-[inherit] bg-background"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
