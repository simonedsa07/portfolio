"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* Custom vector cloud logo badge replacing the image asset */
function CloudLogo() {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center justify-center"
      style={{ width: 370, height: 210, marginBottom: 4 }}
    >
      {/* SVG Cloud background & vector sparkles */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 370 210" style={{ zIndex: 1 }}>
        <defs>
          {/* Very soft translucent iridescent fill */}
          <linearGradient id="cloudFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8EC9FF28" />
            <stop offset="50%" stopColor="#FFB8E628" />
            <stop offset="100%" stopColor="#C9B6FF18" />
          </linearGradient>

          {/* Shifting gloss iridescent chrome lining gradient */}
          <linearGradient id="chromeLining" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8EC9FF">
              <animate attributeName="stop-color" values="#8EC9FF; #FFB8E6; #C9B6FF; #B6FFE0; #8EC9FF" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#FFB8E6">
              <animate attributeName="stop-color" values="#FFB8E6; #C9B6FF; #B6FFE0; #8EC9FF; #FFB8E6" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#C9B6FF">
              <animate attributeName="stop-color" values="#C9B6FF; #B6FFE0; #8EC9FF; #FFB8E6; #C9B6FF" dur="4s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>

        {/* Soft shadow glow underneath the cloud */}
        <path
          d="M 90,162 C 50,162 30,137 30,107 C 30,77 70,57 105,67 C 125,37 245,37 265,67 C 300,57 340,77 340,107 C 340,137 320,162 280,162 C 230,174 140,174 90,162 Z"
          fill="rgba(11,11,12,0.06)"
        />

        {/* Cloud Main Path with animated chrome lining */}
        <path
          d="M 90,160 C 50,160 30,135 30,105 C 30,75 70,55 105,65 C 125,35 245,35 265,65 C 300,55 340,75 340,105 C 340,135 320,160 280,160 C 230,172 140,172 90,160 Z"
          fill="url(#cloudFillGrad)"
          stroke="url(#chromeLining)"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* ── Micro-animated floating bubbles & sparkles ── */}
      {/* Sparkle 1 (top-left) */}
      <motion.svg
        width="16" height="16" viewBox="0 0 16 16"
        style={{ position: "absolute", top: "18%", left: "15%", zIndex: 3 }}
        animate={{ scale: [0.85, 1.15, 0.85], rotate: [0, 10, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M 0,8 Q 8,8 8,0 Q 8,8 16,8 Q 8,8 8,16 Q 8,8 0,8 Z" fill="#FFB8E6" stroke="#0B0B0C" strokeWidth="0.8" />
      </motion.svg>

      {/* Sparkle 2 (top-right) */}
      <motion.svg
        width="18" height="18" viewBox="0 0 16 16"
        style={{ position: "absolute", top: "12%", right: "16%", zIndex: 3 }}
        animate={{ scale: [1.1, 0.85, 1.1], rotate: [0, -15, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <path d="M 0,8 Q 8,8 8,0 Q 8,8 16,8 Q 8,8 8,16 Q 8,8 0,8 Z" fill="#8EC9FF" stroke="#0B0B0C" strokeWidth="0.8" />
      </motion.svg>

      {/* Sparkle 3 (bottom-left) */}
      <motion.svg
        width="12" height="12" viewBox="0 0 16 16"
        style={{ position: "absolute", bottom: "16%", left: "18%", zIndex: 3 }}
        animate={{ scale: [0.9, 1.2, 0.9] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <path d="M 0,8 Q 8,8 8,0 Q 8,8 16,8 Q 8,8 8,16 Q 8,8 0,8 Z" fill="#C9B6FF" stroke="#0B0B0C" strokeWidth="0.8" />
      </motion.svg>

      {/* Sparkle 4 (bottom-right) */}
      <motion.svg
        width="14" height="14" viewBox="0 0 16 16"
        style={{ position: "absolute", bottom: "18%", right: "20%", zIndex: 3 }}
        animate={{ scale: [1.15, 0.85, 1.15] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      >
        <path d="M 0,8 Q 8,8 8,0 Q 8,8 16,8 Q 8,8 8,16 Q 8,8 0,8 Z" fill="#B6FFE0" stroke="#0B0B0C" strokeWidth="0.8" />
      </motion.svg>

      {/* Bubble 1 (left mid) */}
      <motion.div
        className="absolute"
        style={{
          width: 22, height: 22, borderRadius: "50%",
          border: "1.2px solid #0B0B0C", backgroundColor: "rgba(142,201,255,0.25)",
          top: "45%", left: "8%", zIndex: 3,
          boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.1)"
        }}
        animate={{ y: [0, -8, 0], x: [0, 3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "#FFF", opacity: 0.7, margin: "2px 0 0 3px" }} />
      </motion.div>

      {/* Bubble 2 (right mid) */}
      <motion.div
        className="absolute"
        style={{
          width: 26, height: 26, borderRadius: "50%",
          border: "1.2px solid #0B0B0C", backgroundColor: "rgba(255,184,230,0.25)",
          top: "52%", right: "8%", zIndex: 3,
          boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.1)"
        }}
        animate={{ y: [0, -12, 0], x: [0, -4, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      >
        <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#FFF", opacity: 0.7, margin: "3px 0 0 4px" }} />
      </motion.div>

      {/* Bubble 3 (top center) */}
      <motion.div
        className="absolute"
        style={{
          width: 16, height: 16, borderRadius: "50%",
          border: "1px solid #0B0B0C", backgroundColor: "rgba(201,182,255,0.25)",
          top: "14%", left: "42%", zIndex: 3
        }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <div style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "#FFF", opacity: 0.7, margin: "2px 0 0 2px" }} />
      </motion.div>

      {/* Script & Sans-serif typography centered completely inside the Cloud */}
      <div className="relative text-center flex flex-col items-center justify-center" style={{ zIndex: 5, marginTop: -10, paddingLeft: 12 }}>
        <h1
          className="preloader-chrome"
          style={{
            fontFamily: "'Fraunces', serif",
            fontStyle: "italic",
            fontSize: "2.9rem",
            fontWeight: 700,
            lineHeight: 0.9,
            letterSpacing: "-0.015em",
            margin: 0,
            padding: 0,
          }}
        >
          Simone's
        </h1>
        <h2
          className="preloader-chrome"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "0.95rem",
            fontWeight: 800,
            letterSpacing: "0.22em",
            textIndent: "0.22em", // Center fix for letter-spacing
            lineHeight: 1,
            margin: 0,
            padding: 0,
            marginTop: "4px",
          }}
        >
          PORTFOLIO
        </h2>
      </div>
    </motion.div>
  );
}


export default function Preloader({
  label = "PORTFOLIO",
  minDuration = 5000,
  onFinish,
}) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDone(true);
      onFinish?.();
    }, minDuration);
    return () => clearTimeout(t);
  }, [minDuration, onFinish]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#EAF0FB" }}
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            scale: 0.96,
            filter: "blur(12px)",
            transition: { duration: 0.95, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Custom style block for galaxy and chrome logo animations */}
          <style>{`
            @keyframes preloaderGradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes preloaderFloat1 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(40px, -30px) scale(1.15); }
            }
            @keyframes preloaderFloat2 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(-50px, 40px) scale(0.9); }
            }
            @keyframes preloaderFloat3 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(30px, 50px) scale(1.2); }
            }
            .preloader-chrome {
              background: linear-gradient(110deg, #0B0B0C 0%, #8EC9FF 35%, #FFB8E6 65%, #C9B6FF 85%, #0B0B0C 100%);
              background-size: 260% auto;
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              animation: preloaderGradient 4s ease infinite;
            }
          `}</style>

          {/* ── pastel iridescent galaxy bg blobs ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              filter: "blur(110px)",
              opacity: 0.75,
              zIndex: 1,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "48vw",
                height: "48vw",
                top: "-10%",
                left: "-5%",
                borderRadius: "50%",
                background: "radial-gradient(circle, #8EC9FF 0%, rgba(255,255,255,0) 70%)",
                animation: "preloaderFloat1 8s ease-in-out infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "45vw",
                height: "45vw",
                bottom: "-10%",
                right: "-5%",
                borderRadius: "50%",
                background: "radial-gradient(circle, #FFB8E6 0%, rgba(255,255,255,0) 70%)",
                animation: "preloaderFloat2 9s ease-in-out infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "40vw",
                height: "40vw",
                top: "20%",
                right: "15%",
                borderRadius: "50%",
                background: "radial-gradient(circle, #C9B6FF 0%, rgba(255,255,255,0) 70%)",
                animation: "preloaderFloat3 7s ease-in-out infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "35vw",
                height: "35vw",
                bottom: "15%",
                left: "10%",
                borderRadius: "50%",
                background: "radial-gradient(circle, #B6FFE0 0%, rgba(255,255,255,0) 70%)",
                animation: "preloaderFloat1 10s ease-in-out infinite alternate",
              }}
            />
          </div>

          {/* ── content card container ── */}
          <div className="flex flex-col items-center justify-center relative" style={{ zIndex: 10 }}>
            
            {/* Custom vector cloud logo */}
            <CloudLogo />

            {/* Custom outlined progress bar */}
            <div
              className="p-[3px]"
              style={{
                width: 250,
                height: 12,
                borderRadius: 99,
                border: "2px solid #0B0B0C",
                background: "rgba(255,255,255,0.5)",
                backdropFilter: "blur(4px)"
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  background: "linear-gradient(to right, #8EC9FF, #FFB8E6, #C9B6FF)",
                  borderRadius: 99,
                  originX: 0
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: minDuration / 1000 - 0.4,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
