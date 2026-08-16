"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";

/**
 * <Magnetic strength={0.35}><Button>Contact</Button></Magnetic>
 *
 * Wrap ANY existing nav link, button, or social icon with this — it
 * doesn't touch your element's own classes/styles, it just measures the
 * cursor's offset from the element's center and nudges the element (via
 * transform, GPU-friendly) toward it. Also tags the element with
 * data-cursor="hover" so <CustomCursor> enlarges over it automatically.
 *
 * On mobile / reduced-motion it renders children completely untouched.
 */
export default function Magnetic({ children, strength = 0.4, range = 80 }) {
  const { enableHeavyFX } = useDeviceCapability();
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  if (!enableHeavyFX) {
    return <>{children}</>;
  }

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const dist = Math.hypot(relX, relY);

    if (dist < range) {
      x.set(relX * strength);
      y.set(relY * strength);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      data-cursor="hover"
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY, display: "inline-block", willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
