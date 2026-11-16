"use client";

import { useState } from "react";
import { techGroups } from "@/data/profile";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import Tilt from "./Tilt";

/**
 * Tech stack as grouped clusters, not skill bars. Selecting a group focuses
 * it and dims the rest. No percentages anywhere — these are tools I work
 * with, not proficiency claims.
 */
export default function TechStack() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section
      id="stack"
      aria-label="Technology stack"
      className="border-t border-line bg-paper-2/50 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="04"
          eyebrow="TECH STACK"
          lines={["TOOLS I REACH", "FOR, GROUPED."]}
          description="No percentages, no skill bars. These are the technologies I work with, grouped by where they fit. Select a group to focus it — the rest steps back."
        />

        <Reveal>
          <div
            role="group"
            aria-label="Filter technology groups"
            className="flex flex-wrap gap-2"
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-pressed={selected === null}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                selected === null
                  ? "bg-ink text-paper"
                  : "border border-ink/25 bg-paper hover:border-ink"
              }`}
            >
              All groups
            </button>
            {techGroups.map((group) => (
              <button
                key={group.label}
                type="button"
                onClick={() =>
                  setSelected(selected === group.label ? null : group.label)
                }
                aria-pressed={selected === group.label}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  selected === group.label
                    ? "bg-lime text-ink"
                    : "border border-ink/25 bg-paper hover:border-ink"
                }`}
              >
                {group.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {techGroups.map((group) => {
            const focused = selected === null || selected === group.label;
            return (
              <Reveal key={group.label}>
                <Tilt>
                <button
                  type="button"
                  onClick={() =>
                    setSelected(selected === group.label ? null : group.label)
                  }
                  aria-pressed={selected === group.label}
                  className={`block w-full rounded-3xl border bg-paper p-6 text-left transition-all duration-300 ${
                    focused
                      ? "border-ink shadow-[0_2px_0_0_var(--color-ink)]"
                      : "border-line opacity-40"
                  }`}
                >
                  <p className="flex items-center justify-between font-display text-sm font-bold tracking-[0.18em]">
                    {group.label.toUpperCase()}
                    <span className="h-2 w-2 rounded-full bg-lime-deep" />
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full bg-paper-2 px-3 py-1.5 text-sm font-medium"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-xs leading-relaxed text-ink/50">
                    {focused
                      ? "Listed as familiar — not a proficiency rating."
                      : "Select to focus this group."}
                  </p>
                </button>
                </Tilt>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
