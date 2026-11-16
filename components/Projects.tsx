"use client";

import { useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight, Download, Package } from "lucide-react";
import GithubIcon from "./GithubIcon";
import { projects, type Project } from "@/data/profile";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import Tilt from "./Tilt";

const STATUS_STYLES: Record<Project["status"], string> = {
  Completed: "bg-lime text-ink",
  "In Development": "bg-paper-2 text-ink border border-line",
  Experimental: "bg-silver/40 text-ink border border-line",
};

/**
 * Projects: one compact panel, kept deliberately short. It has a shifting
 * title and an arrow that follows the pointer inside the panel (fine
 * pointers only). All links are real; no live demo is linked because
 * none exists.
 */
export default function Projects() {
  return (
    <section
      id="projects"
      aria-label="Projects"
      className="relative overflow-hidden bg-coal py-24 text-paper sm:py-32 grain"
    >
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="02"
          eyebrow="PROJECTS"
          lines={["ONE PROJECT,", "BUILT TO SHIP."]}
          description="One project, kept short."
          dark
        />

        <div className="space-y-6 sm:space-y-8">
          {projects.map((project) => (
            <ProjectPanel key={project.id} project={project} />
          ))}
        </div>

      </div>
    </section>
  );
}

function ProjectPanel({ project }: { project: Project }) {
  const panelRef = useRef<HTMLElement>(null);
  const [arrow, setArrow] = useState<{ x: number; y: number; on: boolean }>({
    x: 0,
    y: 0,
    on: false,
  });

  const onMove = (e: MouseEvent) => {
    if (!panelRef.current) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = panelRef.current.getBoundingClientRect();
    setArrow({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      on: true,
    });
  };

  return (
    <Reveal>
      <Tilt>
      <article
        ref={panelRef}
        onMouseMove={onMove}
        onMouseLeave={() => setArrow((a) => ({ ...a, on: false }))}
        className="group relative overflow-hidden rounded-3xl border border-paper/15 bg-paper/[0.04] p-6 transition-colors duration-300 hover:border-paper/30 sm:p-10"
      >
        {/* Pointer-following arrow */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute z-20 flex h-12 w-12 items-center justify-center rounded-full bg-lime text-ink transition-opacity duration-200 ${
            arrow.on ? "opacity-100" : "opacity-0"
          }`}
          style={{
            left: arrow.x,
            top: arrow.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <ArrowUpRight size={20} />
        </span>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <span className="font-display text-6xl font-bold text-paper/15 sm:text-7xl">
            {project.index}
          </span>
          <span
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide ${STATUS_STYLES[project.status]}`}
          >
            {project.status}
          </span>
        </div>

        <p className="mt-4 text-xs font-semibold tracking-[0.25em] text-lime">
          {project.role.toUpperCase()}
        </p>
        <h3 className="mt-2 font-display text-3xl font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-2 sm:text-5xl">
          {project.name}
        </h3>
        <p className="mt-4 max-w-3xl leading-relaxed text-paper/70">
          {project.description}
        </p>

        <ul aria-label="Technologies" className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li
              key={t}
              className="rounded-full border border-paper/20 px-3 py-1 text-xs font-medium text-paper/80"
            >
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-lime"
          >
            <GithubIcon className="h-4 w-4" />
            {project.repoLabel}
            <ArrowUpRight size={16} />
          </a>
          {project.releaseUrl ? (
            <a
              href={project.releaseUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-paper/30 px-5 py-3 text-sm font-semibold transition-colors hover:border-paper hover:bg-paper/10"
            >
              <Package size={16} />
              {project.releaseLabel}
              <ArrowUpRight size={16} />
            </a>
          ) : null}
          {project.apkUrl ? (
            <a
              href={project.apkUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-paper"
            >
              <Download size={16} />
              {project.apkLabel ?? "Download APK"}
              <ArrowUpRight size={16} />
            </a>
          ) : null}
          <span className="text-sm text-paper/50">
            Live demo — not published
          </span>
        </div>
      </article>
      </Tilt>
    </Reveal>
  );
}

