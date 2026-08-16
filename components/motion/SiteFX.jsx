"use client";

import { useState } from "react";
import Preloader from "./Preloader";
import CustomCursor from "./CustomCursor";
import CatMascot from "./CatMascot";
import SmoothScrollProvider from "./SmoothScrollProvider";

/**
 * Drop this ONCE into your root layout, wrapping your existing app:
 *
 *   // app/layout.jsx
 *   import SiteFX from "@/components/motion/SiteFX";
 *
 *   export default function RootLayout({ children }) {
 *     return (
 *       <html lang="en">
 *         <body className="bg-background text-foreground font-sans">
 *           <SiteFX label="YOUR NAME">{children}</SiteFX>
 *         </body>
 *       </html>
 *     );
 *   }
 *
 * This does not add any wrapper DOM around `children` beyond the Lenis
 * scroll container requirement, and introduces no new colors — every
 * visual piece reads currentColor / bg-background / bg-primary etc.
 * from your existing theme.
 */
export default function SiteFX({ children, label = "PORTFOLIO" }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Preloader label={label} onFinish={() => setLoaded(true)} />
      <CustomCursor />
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
      {loaded && <CatMascot />}
    </>
  );
}
