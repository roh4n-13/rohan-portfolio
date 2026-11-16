"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/lib/hooks";

type IntroProps = {
  onDone: () => void;
};

/**
 * Cinematic intro with an RM monogram and a progress readout.
 *
 * The percentage reflects genuine loading milestones only — it never runs on
 * a decorative timer:
 *   15%  component mounted
 *   45%  webfonts ready (document.fonts.ready)
 *   75%  hero reports ready (custom "hero-ready" event from the hero
 *        section itself, once it has mounted)
 *   100% window "load" (or document already complete)
 *
 * Skippable via the Skip button or the Escape key. Reduced-motion users
 * never see the intro at all.
 */
export default function Intro({ onDone }: IntroProps) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(15);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setProgress(100);
    setLeaving(true);
    window.setTimeout(onDone, 750);
  };

  useEffect(() => {
    if (reduced) {
      onDone();
      return;
    }    if (document.readyState === "complete") {
      finish();
      return;
    }

    const bump = (value: number) =>
      setProgress((p) => Math.max(p, value));

    let fontsDone = false;
    if (document.fonts) {
      document.fonts.ready.then(() => {
        fontsDone = true;
        bump(45);
      });
    }

    const onHeroReady = () => bump(75);
    const onLoad = () => finish();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };

    window.addEventListener("hero-ready", onHeroReady);
    window.addEventListener("load", onLoad);
    window.addEventListener("keydown", onKey);

    // If fonts resolve after load, load still wins; nothing here is a timer
    // that advances progress on its own.
    void fontsDone;

    return () => {
      window.removeEventListener("hero-ready", onHeroReady);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // Cinematic letter reveal: the R and M rise out of their masks in
  // sequence, then the name fades in beneath.
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".intro-letter", {
        yPercent: 115,
        duration: 0.9,
        stagger: 0.14,
        ease: "power4.out",
      });
      gsap.from(".intro-name", {
        opacity: 0,
        y: 12,
        duration: 0.7,
        delay: 0.55,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      role="status"
      aria-label="Loading portfolio"
      style={{
        clipPath: leaving ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)",
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-coal text-paper transition-[clip-path] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
    >
      <button
        type="button"
        onClick={finish}
        className="absolute right-6 top-6 rounded-full border border-paper/30 bg-transparent px-4 py-2 text-xs font-medium tracking-[0.18em] text-paper transition-colors hover:border-paper"
      >
        SKIP →
      </button>

      <div className="overflow-hidden">
        <p className="font-display text-[22vw] font-bold leading-none tracking-tight text-paper sm:text-[13rem]">
          <span className="inline-block overflow-hidden align-top">
            <span className="intro-letter inline-block">R</span>
          </span>
          <span className="inline-block overflow-hidden align-top">
            <span className="intro-letter inline-block">M</span>
          </span>
        </p>
      </div>
      <p className="intro-name mt-2 font-accent text-xl italic text-paper/70">
        Rohan Makwana
      </p>

      <div className="mt-10 h-px w-56 overflow-hidden bg-paper/15 sm:w-72">
        <div
          className="h-full bg-lime transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 font-mono text-xs tracking-[0.25em] text-paper/60">
        {progress}%
      </p>
    </div>
  );
}
