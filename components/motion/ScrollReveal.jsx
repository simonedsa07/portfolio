"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * <ScrollReveal><h2>Section title</h2></ScrollReveal>
 * <ScrollReveal direction="left" delay={0.1}>...</ScrollReveal>
 *
 * Wrap any existing element/section — fades + slides it in once it
 * enters the viewport. Uses `viewport={{ once: true }}` so it never
 * re-triggers and never fights your layout (transform/opacity only).
 */
export function ScrollReveal({
  children,
  direction = "up", // "up" | "down" | "left" | "right" | "none"
  delay = 0,
  duration = 0.7,
  as: Tag = motion.div,
  className = "",
}) {
  const offsets = {
    up: { y: 32, x: 0 },
    down: { y: -32, x: 0 },
    left: { y: 0, x: 32 },
    right: { y: 0, x: -32 },
    none: { y: 0, x: 0 },
  };
  const { x, y } = offsets[direction];

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}

/**
 * <StaggerGroup><StaggerItem>Card A</StaggerItem><StaggerItem>Card B</StaggerItem></StaggerGroup>
 *
 * For lists / grids (project cards, skill chips) — children reveal in
 * sequence rather than all at once.
 */
export function StaggerGroup({ children, className = "", stagger = 0.08 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * <Parallax speed={0.3}><img .../></Parallax>
 *
 * Subtle parallax for background elements / big section headers — moves
 * slower (speed < 1) or faster (speed > 1) than native scroll. Purely
 * `transform: translateY`, GPU-accelerated.
 */
export function Parallax({ children, speed = 0.3, className = "" }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => v * speed * -0.15);

  return (
    <motion.div className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
