"use client";

import Reveal from "./Reveal";

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  lines: string[];
  description?: string;
  dark?: boolean;
};

/** Shared editorial section heading: index, eyebrow, oversized lines. */
export default function SectionHeading({
  index,
  eyebrow,
  lines,
  description,
  dark = false,
}: SectionHeadingProps) {
  return (
    <div className="mb-12 sm:mb-16">
      <Reveal>
        <p
          className={`flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] sm:text-xs ${
            dark ? "text-paper/60" : "text-ink/60"
          }`}
        >
          <span className="font-mono text-lime-deep">{index}</span>
          {eyebrow}
        </p>
      </Reveal>
      <Reveal>
        <h2
          className={`mt-5 font-display text-4xl font-bold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl ${
            dark ? "text-paper" : "text-ink"
          }`}
        >
          {lines.map((line, i) => (
            <span key={line} className="block">
              {i === lines.length - 1 ? (
                <span className={dark ? "text-outline-paper" : "text-outline"}>
                  {line}
                </span>
              ) : (
                line
              )}
            </span>
          ))}
        </h2>
      </Reveal>
      {description ? (
        <Reveal>
          <p
            className={`mt-6 max-w-2xl text-base leading-relaxed sm:text-lg ${
              dark ? "text-paper/70" : "text-ink/70"
            }`}
          >
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
