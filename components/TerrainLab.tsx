"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/hooks";

/**
 * Terrain Lab: a second hands-on 3D toy for the Playground. A wireframe
 * terrain ripples with slow waves — and wherever your pointer moves, the
 * ground rises under it like a hill forming. Move away and it settles
 * back down.
 *
 * Caps pixel ratio, pauses when off-screen, disposes everything, and
 * renders a single static frame for reduced-motion users.
 */
export default function TerrainLab() {
  const mountRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let raf = 0;
    let disposed = false;
    let visible = true;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
      camera.position.set(0, 0, 9);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const geo = new THREE.PlaneGeometry(12, 8, 50, 32);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x9dc22e,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
      });
      const terrain = new THREE.Mesh(geo, mat);
      terrain.rotation.x = -1.0;
      scene.add(terrain);

      const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
      const base = new Float32Array(posAttr.array);

      const resize = () => {
        if (!renderer) return;
        const w = mount.clientWidth || 1;
        const h = mount.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener("resize", resize);

      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { threshold: 0 },
      );
      io.observe(mount);

      // Pointer mapped onto the plane (approximation, fine for a toy).
      let pointer = { x: 0, y: 0, active: 0, target: 0 };
      const onPointer = (e: PointerEvent) => {
        const rect = mount.getBoundingClientRect();
        pointer = {
          x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
          y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
          active: pointer.active,
          target: 1,
        };
      };
      const onLeave = () => {
        pointer = { ...pointer, target: 0 };
      };
      mount.addEventListener("pointermove", onPointer);
      mount.addEventListener("pointerleave", onLeave);

      const clock = new THREE.Clock();
      const render = () => {
        if (disposed || !renderer) return;
        const t = clock.getElapsedTime();
        pointer.active += (pointer.target - pointer.active) * 0.08;
        const px = pointer.x * 6;
        const py = -pointer.y * 4;
        for (let v = 0; v < posAttr.count; v++) {
          const bx = base[v * 3];
          const by = base[v * 3 + 1];
          let z =
            Math.sin(bx * 0.5 + t * 0.8) * 0.45 +
            Math.cos(by * 0.4 + t * 0.6) * 0.35;
          const dx = bx - px;
          const dy = by - py;
          const d = Math.hypot(dx, dy);
          if (d < 2.5) {
            z += (1 - d / 2.5) * 1.4 * pointer.active;
          }
          posAttr.setZ(v, z);
        }
        posAttr.needsUpdate = true;
        terrain.rotation.z = Math.sin(t * 0.1) * 0.05;
        renderer.render(scene, camera);
      };

      if (reduced) {
        render();
      } else {
        const loop = () => {
          if (disposed) return;
          if (visible) render();
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      }

      return () => {
        disposed = true;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        io.disconnect();
        mount.removeEventListener("pointermove", onPointer);
        mount.removeEventListener("pointerleave", onLeave);
        geo.dispose();
        mat.dispose();
        renderer?.dispose();
        renderer?.domElement.remove();
        renderer = null;
      };
    } catch {
      // WebGL unavailable: the card simply stays empty, nothing breaks.
      return () => {
        disposed = true;
        cancelAnimationFrame(raf);
      };
    }
  }, [reduced]);

  return (
    <div
      ref={mountRef}
      role="application"
      aria-label="Terrain lab. Move your pointer over it to raise the terrain."
      className="relative h-64 w-full touch-none overflow-hidden bg-coal sm:h-72 [&>canvas]:h-full [&>canvas]:w-full"
    />
  );
}
