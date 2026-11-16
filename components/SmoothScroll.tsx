"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/scroll";
import { useReducedMotion } from "@/lib/hooks";

/**
 * Lenis smooth scrolling, wired to GSAP's ticker when available.
 * Disabled entirely for reduced-motion users — native scroll instead.
 */
export default function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setLenis(null);
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
    });
    setLenis(lenis);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return null;
}
