"use client";

import { ArrowUpRight } from "lucide-react";
import GithubIcon from "./GithubIcon";
import { profile, repoFacts } from "@/data/profile";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import Magnetic from "./Magnetic";
import Tilt from "./Tilt";

/**
 * GitHub + learning section. Repository facts are build-time facts verified
 * from public GitHub data on 26 October 2026 — not a live feed, and labelled
 * as such. No live demo links exist for the Android apps, so none are shown.
 */
export default function GithubSection() {
  return (
    <section
      id="github"
      aria-label="GitHub and learning"
      className="relative overflow-hidden bg-coal py-24 text-paper sm:py-32 grain"
    >
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="05"
          eyebrow="GITHUB & LEARNING"
          lines={["OPEN SOURCE,", "IN PUBLIC."]}
          description="The work lives on GitHub, in the open. Repository facts below were verified from public GitHub data on 26 October 2026 — they are build-time facts, not a live feed."
          dark
        />

        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-paper/70">
              Building in public keeps me honest: the code, the iterations,
              and the unfinished parts are all visible. If you want to see how
              I actually work, the repository is the best place to look.
            </p>
            <Magnetic className="mt-8 inline-block">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-paper"
              >
                <GithubIcon className="h-[18px] w-[18px]" />
                github.com/{profile.githubHandle}
                <ArrowUpRight size={16} />
              </a>
            </Magnetic>
          </Reveal>

          <div className="lg:col-span-7">
            <ul className="space-y-4">
              {repoFacts.map((repo) => (
                <Reveal as="li" key={repo.repo}>
                  <Tilt>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start justify-between gap-4 rounded-2xl border border-paper/15 bg-paper/[0.04] p-6 transition-colors hover:border-paper/30"
                  >
                    <div>
                      <p className="font-display text-lg font-bold">
                        {repo.repo}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-paper/60">
                        {repo.note}
                      </p>
                      <p className="mt-3 text-xs font-medium tracking-wide text-paper/50">
                        Language: {repo.language}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={20}
                      className="mt-1 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime"
                    />
                  </a>
                  </Tilt>
                </Reveal>
              ))}
            </ul>

            <Reveal>
              <div className="mt-10 rounded-2xl border border-paper/15 p-6">
                <h3 className="font-display text-sm font-bold tracking-[0.2em] text-lime">
                  CURRENTLY EXPLORING
                </h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {profile.currentlyExploring.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-paper/80">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-lime"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
