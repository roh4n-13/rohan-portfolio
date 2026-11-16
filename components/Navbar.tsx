"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { profile } from "@/data/profile";
import { scrollToId } from "@/lib/scroll";

const LINKS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "playground", label: "Playground" },
  { id: "stack", label: "Stack" },
  { id: "github", label: "GitHub" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const link of LINKS) {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open ]);

  const go = (id: string) => {
    setOpen(false);
    // Let the overlay close before scrolling so focus isn't trapped.
    window.setTimeout(() => scrollToId(id), 60);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-line bg-paper/85 text-ink backdrop-blur-md"
            : "border-b border-transparent bg-transparent text-paper"
        }`}
      >
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"
        >
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3"
            aria-label="Back to top"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-coal font-display text-sm font-bold text-paper">
              {profile.monogram}
            </span>
            <span className="hidden font-display text-sm font-semibold tracking-[0.14em] sm:block">
              ROHAN MAKWANA
            </span>
          </button>

          <ul className="hidden items-center gap-7 lg:flex">
            {LINKS.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => go(link.id)}
                  aria-current={active === link.id ? "true" : undefined}
                  className={`relative text-[13px] font-medium tracking-wide transition-colors ${
                    active === link.id
                      ? scrolled
                        ? "text-ink"
                        : "text-paper"
                      : scrolled
                        ? "text-ink/60 hover:text-ink"
                        : "text-paper/60 hover:text-paper"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-lime-deep transition-all duration-300 ${
                      active === link.id ? "w-full" : "w-0"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className={`hidden rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition-colors sm:block ${
                scrolled
                  ? "border-ink hover:bg-ink hover:text-paper"
                  : "border-paper/40 hover:bg-paper hover:text-ink"
              }`}
            >
              GitHub ↗
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-label="Open menu"
              className={`flex h-10 w-10 items-center justify-center rounded-full border lg:hidden ${
                scrolled ? "border-line bg-paper" : "border-paper/30 bg-transparent"
              }`}
            >
              <Menu size={18} />
            </button>
          </div>
        </nav>
        {/* Scroll progress hairline */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-lime-deep"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </header>

      {/* Full-screen overlay menu (mobile + small screens) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed inset-0 z-[80] flex flex-col bg-coal text-paper transition-all duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 sm:px-8">
          <span className="font-display text-sm font-semibold tracking-[0.14em]">
            ROHAN MAKWANA
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/30"
          >
            <X size={18} />
          </button>
        </div>
        <ul className="flex flex-1 flex-col justify-center gap-2 px-6">
          {LINKS.map((link, i) => (
            <li key={link.id}>
              <button
                type="button"
                onClick={() => go(link.id)}
                className="group flex w-full items-baseline gap-4 py-2 text-left"
              >
                <span className="font-mono text-xs text-lime">0{i + 1}</span>
                <span className="font-display text-4xl font-bold tracking-tight transition-colors group-hover:text-lime sm:text-5xl">
                  {link.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="px-6 pb-10 text-sm text-paper/60">
          Ahmedabad, India · BCA, Gujarat University
        </p>
      </div>
    </>
  );
}
