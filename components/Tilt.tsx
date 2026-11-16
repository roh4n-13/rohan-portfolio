"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { useMediaQuery, useReducedMotion } from "@/lib/hooks";

/**
 * Reusable 3D tilt wrapper: the child tilts in 3D toward the pointer
 * (max `max` degrees each way) with a slight smoothing lag. Fine
 * pointers only; reduced-motion and touch users get the child
 * untransformed.
 */
export default function Tilt({
  children,
  max = 5,
  className,
}: {
  children: ReactNode;
  max?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const active = !reduced && finePointer;

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * 2 * max, ry: px * 2 * max });
  };

  return (
    <div
      ref={ref}
      onMouseMove={active ? onMove : undefined}
      onMouseLeave={active ? () => setTilt({ rx: 0, ry: 0 }) : undefined}
      className={className}
      style={
        active
          ? {
              transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              transition: "transform 0.15s ease-out",
              transformStyle: "preserve-3d",
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
