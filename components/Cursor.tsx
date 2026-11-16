"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";

/**
 * Custom cursor accent: a lime ring that trails the pointer with inertia,
 * plus a slower ghost ring and a snappy center dot so the cursor feels
 * physical, like it has weight. The native cursor is never hidden — this
 * is an addition, not a replacement. Renders only on fine-pointer
 * devices; touch devices get nothing.
 */
export default function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const ringRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fine || reduced) return;
    const ring = ringRef.current;
    const ghost = ghostRef.current;
    const dot = dotRef.current;
    if (!ring || !ghost || !dot) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let gx = x;
    let gy = y;
    let dx = x;
    let dy = y;
    let tx = x;
    let ty = y;
    let hovering = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const target = e.target as HTMLElement | null;
      hovering = !!target?.closest("a, button, [data-hover]");
    };

    const tick = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      gx += (tx - gx) * 0.08;
      gy += (ty - gy) * 0.08;
      dx += (tx - dx) * 0.35;
      dy += (ty - dy) * 0.35;
      const scale = hovering ? 2.1 : 1;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
      ghost.style.transform = `translate3d(${gx}px, ${gy}px, 0) translate(-50%, -50%)`;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      ring.style.opacity = "1";
      ghost.style.opacity = "1";
      dot.style.opacity = "1";
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;

  return (
    <>
      <div
        ref={ghostRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[89] h-12 w-12 rounded-full border border-white/60 opacity-0 mix-blend-difference transition-opacity duration-300"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90] h-8 w-8 rounded-full border-2 border-lime-deep opacity-0 transition-opacity duration-300"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[91] h-1.5 w-1.5 rounded-full bg-lime-deep opacity-0 transition-opacity duration-300"
      />
    </>
  );
}
