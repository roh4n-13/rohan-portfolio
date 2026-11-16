"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { techGroups } from "@/data/profile";
import { useReducedMotion } from "@/lib/hooks";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const OrbitLab = dynamic(() => import("./OrbitLab"), { ssr: false });
const TerrainLab = dynamic(() => import("./TerrainLab"), { ssr: false });

/**
 * Playground / Experiments: six real interactions, not screenshots.
 * Every canvas pauses off-screen and cleans up after itself; reduced-motion
 * users get static equivalents instead of animation loops.
 */
export default function Playground() {
  return (
    <section
      id="playground"
      aria-label="Playground and experiments"
      className="border-t border-line py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="03"
          eyebrow="PLAYGROUND / EXPERIMENTS"
          lines={["TOUCH IT.", "IT MOVES."]}
          description="Small, fast experiments. Nothing here is required to understand the site — it's here because building playful things is the point."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <ExperimentCard
              title="Particle field"
              hint="Move your pointer across the canvas — particles scatter away from it. Keyboard: focus the canvas, arrows move the scatter point, Space bursts."
            >
              <ParticleField />
            </ExperimentCard>
          </Reveal>
          <Reveal>
            <ExperimentCard
              title="Inertia follower"
              hint="Move or tap inside the box — the orb chases your pointer with a lazy, physical lag. Keyboard: focus the box, arrows move the orb."
            >
              <InertiaFollower />
            </ExperimentCard>
          </Reveal>
          <Reveal>
            <ExperimentCard
              title="Technology constellation"
              hint="Select a node to see which group it belongs to. No percentages, no fake ratings."
            >
              <TechConstellation />
            </ExperimentCard>
          </Reveal>
          <Reveal>
            <ExperimentCard
              title="Type & colour lab"
              hint="Cycle the colour and typeface of the sample headline."
            >
              <TypeColorLab />
            </ExperimentCard>
          </Reveal>
          <Reveal>
            <ExperimentCard
              title="Orbit lab"
              hint="Drag to spin the 3D object — it keeps turning slowly on its own when you let go."
            >
              <OrbitLab />
            </ExperimentCard>
          </Reveal>
          <Reveal>
            <ExperimentCard
              title="Terrain lab"
              hint="Move your pointer over the terrain — the ground rises under it like a hill forming."
            >
              <TerrainLab />
            </ExperimentCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ExperimentCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-paper">
      <div className="border-b border-line px-6 py-4">
        <h3 className="font-display text-lg font-bold tracking-tight">
          {title}
        </h3>
        <p className="mt-1 text-sm text-ink/60">{hint}</p>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------ Particle field ----------------------------- */

type Particle = { x: number; y: number; vx: number; vy: number; r: number };

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];
    let visible = true;
    let pointer = { x: -9999, y: -9999, inside: false };
    let disposed = false;

    const seed = () => {
      const count = Math.min(
        90,
        Math.max(30, Math.floor(canvas.clientWidth / 12)),
      );
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.clientWidth,
        y: Math.random() * canvas.clientHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1.5 + Math.random() * 2.5,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p, i) => {
        if (pointer.inside) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < 120 && d > 0.01) {
            const force = (120 - d) / 120;
            p.vx += (dx / d) * force * 0.9;
            p.vy += (dy / d) * force * 0.9;
          }
        }
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        // Canvas cannot consume CSS variables; these mirror --color-lime-deep and --color-ink.
        ctx.fillStyle = i % 7 === 0 ? "#9dc22e" : "rgba(22, 21, 15, 0.35)";
        ctx.fill();
      });
    };

    const loop = () => {
      if (disposed) return;
      if (visible) draw();
      raf = requestAnimationFrame(loop);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        inside: true,
      };
    };
    const onLeave = () => {
      pointer = { x: -9999, y: -9999, inside: false };
    };

    // Keyboard alternative: arrows move a scatter point, Space bursts.
    // The point starts at the centre and only activates on first use.
    let keyPoint = {
      x: canvas.clientWidth / 2,
      y: canvas.clientHeight / 2,
      active: false,
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (e.key === " ") {
        e.preventDefault();
        const px = keyPoint.active ? keyPoint.x : w / 2;
        const py = keyPoint.active ? keyPoint.y : h / 2;
        particles.forEach((p) => {
          const dx = p.x - px;
          const dy = p.y - py;
          const d = Math.hypot(dx, dy);
          if (d < 120 && d > 0.01) {
            const force = ((120 - d) / 120) * 2;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
        });
        pointer = { x: px, y: py, inside: true };
        if (reduced) draw();
        return;
      }
      const moves: Record<string, [number, number]> = {
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
      };
      const move = moves[e.key];
      if (!move) return;
      e.preventDefault();
      if (!keyPoint.active) {
        keyPoint = { x: w / 2, y: h / 2, active: true };
      }
      keyPoint.x = Math.min(w, Math.max(0, keyPoint.x + move[0] * 24));
      keyPoint.y = Math.min(h, Math.max(0, keyPoint.y + move[1] * 24));
      pointer = { x: keyPoint.x, y: keyPoint.y, inside: true };
      if (reduced) draw();
    };
    const onBlur = () => {
      pointer = { x: -9999, y: -9999, inside: false };
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("blur", onBlur);

    if (reduced) {
      draw();
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("blur", onBlur);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      tabIndex={0}
      aria-label="Interactive particle field. Move your pointer over it to scatter the particles, or focus it and use arrow keys to move the scatter point and Space for a burst."
      className="block h-64 w-full touch-none bg-paper-2/50 sm:h-72"
    />
  );
}

/* ---------------------------- Inertia follower ----------------------------- */

function InertiaFollower() {
  const boxRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const box = boxRef.current;
    const orb = orbRef.current;
    const ring = ringRef.current;
    if (!box || !orb || !ring) return;

    let raf = 0;
    let disposed = false;
    const pos = { x: 0.5, y: 0.5 };
    const ringPos = { x: 0.5, y: 0.5 };
    const target = { x: 0.5, y: 0.5 };

    const place = () => {
      const w = box.clientWidth;
      const h = box.clientHeight;
      orb.style.transform = `translate(${pos.x * w - 28}px, ${pos.y * h - 28}px)`;
      ring.style.transform = `translate(${ringPos.x * w - 44}px, ${ringPos.y * h - 44}px)`;
    };

    const onPointer = (e: PointerEvent) => {
      const rect = box.getBoundingClientRect();
      target.x = Math.min(
        0.95,
        Math.max(0.05, (e.clientX - rect.left) / rect.width),
      );
      target.y = Math.min(
        0.9,
        Math.max(0.1, (e.clientY - rect.top) / rect.height),
      );
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const step = 0.08;
      if (e.key === "ArrowLeft") target.x = Math.max(0.05, target.x - step);
      else if (e.key === "ArrowRight")
        target.x = Math.min(0.95, target.x + step);
      else if (e.key === "ArrowUp") target.y = Math.max(0.1, target.y - step);
      else if (e.key === "ArrowDown")
        target.y = Math.min(0.9, target.y + step);
      else return;
      e.preventDefault();
      if (reduced) place();
    };

    place();
    box.addEventListener("pointermove", onPointer);
    box.addEventListener("pointerdown", onPointer);
    box.addEventListener("keydown", onKeyDown);

    if (!reduced) {
      const loop = () => {
        if (disposed) return;
        pos.x += (target.x - pos.x) * 0.12;
        pos.y += (target.y - pos.y) * 0.12;
        ringPos.x += (pos.x - ringPos.x) * 0.06;
        ringPos.y += (pos.y - ringPos.y) * 0.06;
        place();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      box.removeEventListener("pointermove", onPointer);
      box.removeEventListener("pointerdown", onPointer);
      box.removeEventListener("keydown", onKeyDown);
    };
  }, [reduced]);

  return (
    <div
      ref={boxRef}
      tabIndex={0}
      role="application"
      aria-label="Inertia follower. Move your pointer or tap inside to move the orb, or focus the box and use arrow keys."
      className="relative h-64 touch-none overflow-hidden bg-paper-2/50 sm:h-72"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="absolute left-0 top-0 h-[88px] w-[88px] rounded-full border-2 border-lime-deep/50"
      />
      <div
        ref={orbRef}
        aria-hidden="true"
        className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper shadow-lg"
      >
        <span className="h-3 w-3 rounded-full bg-lime" />
      </div>
    </div>
  );
}

/* --------------------------- Tech constellation ---------------------------- */

type NodePos = { name: string; group: string; x: number; y: number };

const NODE_POSITIONS: Record<string, [number, number]> = {
  HTML: [12, 22],
  CSS: [26, 12],
  JavaScript: [38, 28],
  React: [52, 14],
  "Next.js": [66, 26],
  "Node.js": [20, 62],
  Express: [38, 74],
  APIs: [56, 60],
  Python: [74, 62],
  C: [86, 42],
  Java: [88, 76],
  Git: [14, 88],
  GitHub: [34, 90],
  "VS Code": [58, 88],
  Vercel: [78, 90],
};

function TechConstellation() {
  const nodes: NodePos[] = techGroups.flatMap((g) =>
    g.items.map((name) => ({
      name,
      group: g.label,
      x: NODE_POSITIONS[name]?.[0] ?? 50,
      y: NODE_POSITIONS[name]?.[1] ?? 50,
    })),
  );
  const [active, setActive] = useState<NodePos | null>(null);

  const lines: Array<[NodePos, NodePos]> = [];
  for (const g of techGroups) {
    const members = nodes.filter((n) => n.group === g.label);
    for (let i = 0; i < members.length - 1; i++) {
      lines.push([members[i], members[i + 1]]);
    }
  }

  const activeGroup = active?.group;

  return (
    <div className="bg-paper-2/50 p-4 sm:p-6">
      <div className="relative aspect-[4/3] w-full">
        <svg
          aria-hidden="true"
          viewBox="0 0 100 75"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          {lines.map(([a, b], i) => {
            const highlighted =
              activeGroup != null && a.group === activeGroup;
            return (
              <line
                key={`${a.name}-${b.name}-${i}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                style={{
                  stroke: highlighted
                    ? "var(--color-lime-deep)"
                    : "var(--color-line)",
                }}
                strokeWidth={highlighted ? 1.4 : 1}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
        {nodes.map((node) => {
          const isActive = active?.name === node.name;
          const dimmed =
            activeGroup != null && node.group !== activeGroup;
          return (
            <button
              key={node.name}
              type="button"
              onClick={() => setActive(node)}
              onFocus={() => setActive(node)}
              aria-label={`${node.name}, ${node.group}`}
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all sm:text-xs ${
                isActive
                  ? "border-lime-deep bg-lime text-ink shadow-md"
                  : dimmed
                    ? "border-line bg-paper text-ink/40"
                    : "border-ink/20 bg-paper text-ink hover:border-ink"
              }`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              {node.name}
            </button>
          );
        })}
      </div>
      <p className="mt-4 min-h-6 text-center text-sm text-ink/70" role="status">
        {active ? (
          <>
            <span className="font-semibold text-ink">{active.name}</span> ·{" "}
            {active.group} group · listed as familiar, not a proficiency rating
          </>
        ) : (
          "Select a node to see its group."
        )}
      </p>
    </div>
  );
}

/* ------------------------------ Type & colour ------------------------------ */

// Demo palette mirrors the @theme tokens by design.
const LAB_COLORS = [
  { name: "Acid lime", value: "#9dc22e" },
  { name: "Ink", value: "#16150f" },
  { name: "Silver", value: "#b9bdb2" },
];

const LAB_FONTS = [
  { name: "Space Grotesk", className: "font-display" },
  { name: "Instrument Serif italic", className: "font-accent italic" },
  { name: "Inter", className: "font-body" },
];

function TypeColorLab() {
  const [colorIdx, setColorIdx] = useState(0);
  const [fontIdx, setFontIdx] = useState(0);
  const color = LAB_COLORS[colorIdx];
  const font = LAB_FONTS[fontIdx];

  return (
    <div className="bg-paper-2/50 p-6 sm:p-8">
      <p
        className={`text-4xl font-bold leading-tight tracking-tight sm:text-5xl ${font.className}`}
        style={{ color: color.value }}
      >
        Build, break, learn.
      </p>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/60">
        A BCA student in Ahmedabad, exploring software, AI, and the art of
        building useful things.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setColorIdx((i) => (i + 1) % LAB_COLORS.length)}
          className="rounded-full border border-ink/25 bg-paper px-4 py-2 text-xs font-semibold transition-colors hover:border-ink"
        >
          Colour: {color.name} ↻
        </button>
        <button
          type="button"
          onClick={() => setFontIdx((i) => (i + 1) % LAB_FONTS.length)}
          className="rounded-full border border-ink/25 bg-paper px-4 py-2 text-xs font-semibold transition-colors hover:border-ink"
        >
          Typeface: {font.name} ↻
        </button>
      </div>
    </div>
  );
}
