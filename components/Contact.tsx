"use client";

import { useSyncExternalStore } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import GithubIcon from "./GithubIcon";
import { profile } from "@/data/profile";
import { scrollToId } from "@/lib/scroll";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";

/**
 * Contact: dramatic closing. GitHub is always linked. Email and LinkedIn
 * CTAs render ONLY when real values exist in data/profile.ts — while they
 * are null, an honest placeholder line is shown instead of a fake link.
 */
export default function Contact() {
  // Year is read client-side only, not during render: Next.js prerendering
  // rejects `new Date()` in client components, and this stays current on
  // every visit instead of freezing at build time.
  const year = useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => null,
  );

  return (
    <footer id="contact" aria-label="Contact" className="relative overflow-hidden">
      <section className="relative overflow-hidden border-t border-line py-24 sm:py-32">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] text-ink/60 sm:text-xs">
              <span className="font-mono text-lime-deep">06</span>
              CONTACT
            </p>
          </Reveal>
          <Reveal>
            <h2 className="mt-5 font-display text-[11.5vw] font-bold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
              {profile.contactHeadline.map((line, i) => (
                <span key={line} className="block">
                  {i === 1 ? (
                    <span className="text-outline">{line}</span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h2>
          </Reveal>
          <Reveal>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
              A project idea, a collaboration, or just a question about the
              work — the fastest way to reach me is through GitHub.
            </p>
          </Reveal>
          <Reveal>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetic className="inline-block">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-coal"
                >
                  <GithubIcon className="h-[18px] w-[18px]" />
                  Visit GitHub
                  <ArrowUpRight size={16} />
                </a>
              </Magnetic>
              {profile.email ? (
                <Magnetic className="inline-block">
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-ink"
                  >
                    Email me
                    <ArrowUpRight size={16} />
                  </a>
                </Magnetic>
              ) : null}
              {profile.resumeUrl ? (
                <Magnetic className="inline-block">
                  <a
                    href={profile.resumeUrl}
                    download
                    className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-ink"
                  >
                    Download Resume
                    <Download size={16} />
                  </a>
                </Magnetic>
              ) : null}
              {profile.linkedin ? (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-ink"
                >
                  LinkedIn
                  <ArrowUpRight size={16} />
                </a>
              ) : null}
            </div>
          </Reveal>
          {profile.availability ? (
            <Reveal>
              <p className="mt-6 text-sm text-ink/60">{profile.availability}</p>
            </Reveal>
          ) : null}
          {!profile.email && !profile.linkedin ? (
            <Reveal>
              <p className="mt-6 text-sm text-ink/50">
                Email and LinkedIn links will appear here once you share
                them — no placeholder addresses are used.
              </p>
            </Reveal>
          ) : null}
        </div>
      </section>

      <div className="bg-coal py-8 text-paper">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 sm:px-8 md:flex-row md:items-center">
          <p className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-lime font-display text-xs font-bold text-ink">
              {profile.monogram}
            </span>
            <span className="text-sm text-paper/70">
              © {year} {profile.name} · {profile.location}
            </span>
          </p>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-5">
            {[
              { id: "about", label: "About" },
              { id: "projects", label: "Projects" },
              { id: "playground", label: "Playground" },
              { id: "stack", label: "Stack" },
              { id: "top", label: "Back to top" },
            ].map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() =>
                  link.id === "top"
                    ? window.scrollTo({ top: 0, behavior: "smooth" })
                    : scrollToId(link.id)
                }
                className="text-sm text-paper/60 transition-colors hover:text-lime"
              >
                {link.label}
              </button>
            ))}
          </nav>
          <p className="text-xs leading-relaxed text-paper/40">
            Set in Space Grotesk, Inter and Instrument Serif · Built with
            Next.js, GSAP and Three.js · Last updated October 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
