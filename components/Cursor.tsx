"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";

/**
 * Custom cursor: a ring that trails the pointer with inertia, plus a
 * slower ghost ring and a snappy center dot so the cursor feels
 * physical, like it has weight. The rings are white with
 * mix-blend-difference, so they invert against whatever sits behind
 * them — dark hero, lime 3D shapes, light paper — and never blend into
 * the theme. The native cursor is hidden while this runs — the ring IS
 * the pointer — but only via a `custom-cursor` class added here once
 * the effect starts, so if JS fails the native cursor simply stays.
 * Renders only on fine-pointer devices; touch devices and
 * reduced-motion users get nothing (and keep their native cursor).
 * The ring scales up over interactive elements and presses in slightly
 * on mousedown; the dot pops a little at the same moment.
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
    let pressed = false;
    let raf = 0;

    // Hide the native cursor only while this cursor is actually running.
    document.documentElement.classList.add("custom-cursor");

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const target = e.target as HTMLElement | null;
      hovering = !!target?.closest("a, button, [data-hover]");
    };

    const onDown = () => {
      pressed = true;
    };

    const onUp = () => {
      pressed = false;
    };

    const tick = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      gx += (tx - gx) * 0.08;
      gy += (ty - gy) * 0.08;
      dx += (tx - dx) * 0.35;
      dy += (ty - dy) * 0.35;
      const scale = (hovering ? 2.1 : 1) * (pressed ? 0.8 : 1);
      ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
      ghost.style.transform = `translate3d(${gx}px, ${gy}px, 0) translate(-50%, -50%)`;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%) scale(${pressed ? 1.6 : 1})`;
      ring.style.opacity = "1";
      ghost.style.opacity = "1";
      dot.style.opacity = "1";
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
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
        className="pointer-events-none fixed left-0 top-0 z-[90] h-8 w-8 rounded-full border-2 border-white opacity-0 mix-blend-difference transition-opacity duration-300"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[91] h-1.5 w-1.5 rounded-full bg-white opacity-0 mix-blend-difference transition-opacity duration-300"
      />
    </>
  );
}
