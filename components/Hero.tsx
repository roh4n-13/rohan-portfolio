"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { profile } from "@/data/profile";
import { useMediaQuery, useReducedMotion } from "@/lib/hooks";
import { scrollToId } from "@/lib/scroll";
import Magnetic from "./Magnetic";

gsap.registerPlugin(ScrollTrigger);

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

type HeroProps = {
  /** True once the intro has lifted; hero line reveals play then. */
  start: boolean;
};

/**
 * Full-viewport cinematic hero on near-black. The 3D here is a full
 * scene, not a single object: a dim particle wave recedes behind the
 * headline while small geometric shards float around it, plus a
 * pointer-following glow, headline letters that fill on hover, click
 * ripples across the wave, a watermark that drifts against the
 * pointer, and a scroll-linked parallax exit — motion that supports
 * the typography instead of overpowering it.
 */
export default function Hero({ start }: HeroProps) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);

  // The hero is plain DOM, so it is ready as soon as it mounts — this
  // feeds the intro's genuine progress milestones.
  useEffect(() => {
    window.dispatchEvent(new Event("hero-ready"));
  }, []);

  // Hide lines on mount (the intro covers the screen anyway), reveal on start.
  useEffect(() => {
    if (reduced) return;
    const lines = lineRefs.current.filter(Boolean) as HTMLSpanElement[];
    gsap.set(lines, { yPercent: 110 });
  }, [reduced]);

  useEffect(() => {
    if (!start || reduced) return;
    const lines = lineRefs.current.filter(Boolean) as HTMLSpanElement[];
    const ctx = gsap.context(() => {
      gsap.to(lines, {
        yPercent: 0,
        duration: 1.05,
        stagger: 0.13,
        ease: "power4.out",
      });
    });
    return () => ctx.revert();
  }, [start, reduced]);

  // 3D headline tilt: the giant headline leans toward the pointer in
  // 3D (fine pointers only). Separate element from the scroll parallax
  // target, so the two transforms never fight.
  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = headlineRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const px = (e.clientX / window.innerWidth) * 2 - 1;
      const py = (e.clientY / window.innerHeight) * 2 - 1;
      gsap.to(el, {
        rotationY: px * 5,
        rotationX: -py * 4,
        transformPerspective: 900,
        duration: 0.7,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);

  // RM watermark parallax: the giant backdrop letters drift slightly
  // against the pointer, so the backdrop has depth instead of sitting
  // flat behind the type. Same gsap pattern as the headline tilt.
  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = watermarkRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const px = (e.clientX / window.innerWidth) * 2 - 1;
      const py = (e.clientY / window.innerHeight) * 2 - 1;
      gsap.to(el, {
        x: px * -14,
        y: py * -10,
        duration: 0.9,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);

  // Cinematic exit: as the hero scrolls away, the copy lifts, fades,
  // and tilts back in 3D while the backdrop drifts slower, creating depth.
  useEffect(() => {
    if (!start || reduced) return;
    const ctx = gsap.context(() => {
      const trigger = {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      };
      gsap.to(contentRef.current, {
        yPercent: -14,
        opacity: 0.15,
        rotationX: 6,
        transformPerspective: 1000,
        ease: "none",
        scrollTrigger: trigger,
      });
      gsap.to(backdropRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: trigger,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [start, reduced]);

  // Safety net: if the intro signal is ever lost, never leave the headline
  // hidden — reveal it after 6 seconds regardless.
  useEffect(() => {
    if (start || reduced) return;
    const timer = window.setTimeout(() => {
      const lines = lineRefs.current.filter(Boolean) as HTMLSpanElement[];
      gsap.to(lines, {
        yPercent: 0,
        duration: 1.05,
        stagger: 0.13,
        ease: "power4.out",
      });
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [start, reduced]);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Introduction"
      className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-coal pt-24 text-paper"
    >
      {/* Backdrop: 3D scene, watermark, spotlight — no gradient blobs */}
      <div
        ref={backdropRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <HeroScene />
        <span ref={watermarkRef} className="text-outline-paper absolute -right-6 top-1/2 hidden -translate-y-1/2 select-none font-display text-[24rem] font-bold leading-none opacity-25 lg:block">
          RM
        </span>
        <Spotlight />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 sm:px-8"
      >
        <div className="flex items-baseline justify-between gap-4">
          <RevealLabel text={profile.heroLabel} />
          <span className="hidden shrink-0 text-[11px] font-semibold tracking-[0.28em] text-paper/40 sm:block">
            PORTFOLIO — 2026
          </span>
        </div>

        <h1
          ref={headlineRef}
          className="font-display text-[13.5vw] font-bold leading-[0.92] tracking-tight sm:text-[11vw] lg:text-[clamp(6rem,11vw,10rem)]"
        >
          {profile.heroHeadline.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-1">
              <span
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                className="block"
              >
                {i === 1 ? (
                  <>
                    <span className="text-outline-paper">
                      {line
                        .split(" ")
                        .slice(0, -1)
                        .join(" ")
                        .split("")
                        .map((ch, j) =>
                          ch === " " ? (
                            <span key={j}> </span>
                          ) : (
                            <span key={j} className="hero-outline-letter">
                              {ch}
                            </span>
                          ),
                        )}{" "}
                    </span>
                    <span className="font-accent font-normal italic text-lime">
                      {line.split(" ").slice(-1)[0]}
                    </span>
                  </>
                ) : (
                  line
                )}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <p className="max-w-xl text-base leading-relaxed text-paper/70 sm:text-lg">
              {profile.heroCopy}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetic>
                <button
                  type="button"
                  onClick={() => scrollToId("projects")}
                  className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-paper px-7 py-3.5 text-sm font-semibold tracking-wide text-ink"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 translate-y-full bg-lime transition-transform duration-300 ease-out group-hover:translate-y-0"
                  />
                  <span className="relative flex items-center gap-2">
                    EXPLORE MY WORK
                    <ArrowDown
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-y-0.5"
                    />
                  </span>
                </button>
              </Magnetic>
              <Magnetic>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-full border border-paper/30 px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors hover:border-paper hover:bg-paper/10"
                >
                  VISIT GITHUB
                  <ArrowUpRight size={16} />
                </a>
              </Magnetic>
              {profile.resumeUrl ? (
                <Magnetic>
                  <a
                    href={profile.resumeUrl}
                    download
                    className="flex items-center gap-2 rounded-full border border-paper/30 px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors hover:border-paper hover:bg-paper/10"
                  >
                    DOWNLOAD RESUME
                    <Download size={16} />
                  </a>
                </Magnetic>
              ) : null}
            </div>

            {profile.availability ? (
              <p className="mt-8 flex items-center gap-3 text-sm text-paper/70">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
                </span>
                {profile.availability}
              </p>
            ) : null}

            <ul aria-label="Interests" className="mt-10 flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <li
                  key={interest}
                  className="rounded-full border border-paper/20 bg-paper/5 px-3.5 py-1.5 text-xs font-medium text-paper/70 backdrop-blur-sm"
                >
                  {interest}
                </li>
              ))}
            </ul>
          </div>

          {/* Spec column: what he is exploring, as a hairline index */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <p className="text-[11px] font-semibold tracking-[0.28em] text-lime">
              CURRENTLY EXPLORING
            </p>
            <ul className="mt-4 divide-y divide-paper/15 border-y border-paper/15">
              {profile.currentlyExploring.map((item, i) => (
                <li
                  key={item}
                  className="flex items-baseline justify-between gap-4 py-3"
                >
                  <span className="text-sm text-paper/80">{item}</span>
                  <span className="shrink-0 font-mono text-xs text-paper/40">
                    0{i + 1}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-paper/50">
              <span className="font-accent text-lg italic text-paper/80">
                Learning in public
              </span>{" "}
              — the repositories and experiments below show the
              work, not just the claim.
            </p>
          </aside>
        </div>
      </div>

      {/* Bottom info bar: education · location · scroll cue */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-6 border-t border-paper/15 px-5 py-6 max-sm:justify-center sm:px-8">
        <p className="hidden text-xs tracking-[0.2em] text-paper/50 sm:block">
          {profile.education} · {profile.university} · Class of{" "}
          {profile.graduation}
        </p>
        <p className="hidden text-xs tracking-[0.2em] text-paper/50 md:block">
          AHMEDABAD, GUJARAT, INDIA
        </p>
        <button
          type="button"
          onClick={() => scrollToId("about")}
          aria-label="Scroll to About section"
          className="flex items-center gap-3 text-paper/60 transition-colors hover:text-paper"
        >
          <span className="text-[10px] tracking-[0.3em]">
            SCROLL TO EXPLORE
          </span>
          <span className="flex h-10 w-6 items-start justify-center rounded-full border border-paper/30 p-1.5">
            <span className="animate-scroll-dot block h-2 w-1 rounded-full bg-lime" />
          </span>
        </button>
      </div>
    </section>
  );
}

function RevealLabel({ text }: { text: string }) {
  return (
    <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] text-paper/60 sm:text-xs">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
      </span>
      {text}
    </p>
  );
}

/**
 * Pointer spotlight: a soft lime glow that follows the cursor across the
 * hero with a lazy, physical lag (the same lerp feel as the Playground's
 * inertia follower). It is the hero's main living element now that the
 * 3D sculpture is gone — visible the moment the mouse moves, invisible
 * on touch devices and for reduced-motion users.
 */
function Spotlight() {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || !finePointer) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let disposed = false;
    const target = { x: window.innerWidth * 0.7, y: 320 };
    const pos = { ...target };

    const onMove = (e: MouseEvent) => {
      const rect = el.parentElement?.getBoundingClientRect();
      if (!rect) return;
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
    };

    const loop = () => {
      if (disposed) return;
      pos.x += (target.x - pos.x) * 0.08;
      pos.y += (target.y - pos.y) * 0.08;
      el.style.transform = `translate3d(${pos.x - 288}px, ${pos.y - 288}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [reduced, finePointer]);

  if (reduced || !finePointer) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute left-0 top-0 h-[36rem] w-[36rem] rounded-full bg-lime/10 blur-[100px]"
    />
  );
}
