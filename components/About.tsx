"use client";

import { profile, timeline } from "@/data/profile";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/**
 * About: a story, not a bio. The timeline is a learning journey in order —
 * deliberately dateless, because these are phases of learning, not
 * professional milestones.
 */
export default function About() {
  return (
    <section
      id="about"
      aria-label="About"
      className="relative overflow-hidden border-t border-line py-24 sm:py-32"
    >
      {/* Floating geometric accents */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute right-[8%] top-24 h-16 w-16 rotate-12 border-2 border-lime-deep/60" />
        <div className="absolute bottom-40 left-[4%] h-10 w-10 rounded-full bg-lime/50" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="01"
          eyebrow="ABOUT"
          lines={profile.aboutHeadline}
        />

        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-ink/80 sm:text-xl">
              {profile.aboutCopy}
            </p>
            <p className="mt-6 font-accent text-2xl italic leading-snug text-ink/80">
              “Useful beats impressive — every time.”
            </p>
            <dl className="mt-10 space-y-4 border-t border-line pt-6 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink/50">Based in</dt>
                <dd className="text-right font-medium">{profile.location}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/50">Studying</dt>
                <dd className="text-right font-medium">
                  {profile.education} · {profile.university}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/50">Expected graduation</dt>
                <dd className="text-right font-medium">{profile.graduation}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/50">Positioning</dt>
                <dd className="text-right font-medium">
                  {profile.positioning}
                </dd>
              </div>
            </dl>
          </Reveal>

          <ol className="lg:col-span-7">
            {timeline.map((step, i) => (
              <Reveal as="li" key={step.title}>
                <div className="group flex gap-6 border-t border-line py-8 transition-colors last:border-b hover:bg-paper-2/60 sm:gap-10">
                  <span className="font-display text-2xl font-bold text-lime-deep sm:text-3xl">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-xl leading-relaxed text-ink/70">
                      {step.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
