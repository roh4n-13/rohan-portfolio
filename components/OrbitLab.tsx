"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/hooks";

/**
 * Orbit Lab: a hands-on 3D toy for the Playground. Drag to spin the
 * central icosahedron — it keeps turning slowly on its own when you let
 * go. Two tilted orbit rings and three glowing dots circle it.
 *
 * Caps pixel ratio, pauses when off-screen, disposes everything, and
 * renders a single static frame for reduced-motion users. Touch works
 * via pointer events (the container is touch-none so dragging doesn't
 * scroll the page).
 */
export default function OrbitLab() {
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
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, 6);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const dir = new THREE.DirectionalLight(0xffffff, 1.2);
      dir.position.set(4, 6, 4);
      scene.add(dir);
      const limePoint = new THREE.PointLight(0xc8f542, 10, 20);
      limePoint.position.set(-3, -1, 3);
      scene.add(limePoint);

      const group = new THREE.Group();
      scene.add(group);

      const coreGeo = new THREE.IcosahedronGeometry(1.1, 0);
      const core = new THREE.Mesh(
        coreGeo,
        new THREE.MeshStandardMaterial({
          color: 0x16150f,
          metalness: 0.55,
          roughness: 0.4,
        }),
      );
      group.add(core);
      const wire = new THREE.LineSegments(
        new THREE.WireframeGeometry(coreGeo),
        new THREE.LineBasicMaterial({
          color: 0xc8f542,
          transparent: true,
          opacity: 0.35,
        }),
      );
      group.add(wire);

      const ringMat = new THREE.LineBasicMaterial({
        color: 0xc8f542,
        transparent: true,
        opacity: 0.5,
      });
      const ringGeo = new THREE.TorusGeometry(1.9, 0.02, 8, 64);
      const ring1 = new THREE.LineSegments(
        new THREE.WireframeGeometry(ringGeo),
        ringMat,
      );
      ring1.rotation.x = 1.1;
      group.add(ring1);
      const ring2 = new THREE.LineSegments(
        new THREE.WireframeGeometry(ringGeo),
        ringMat,
      );
      ring2.rotation.x = -0.9;
      ring2.rotation.y = 0.6;
      group.add(ring2);

      const dotMat = new THREE.MeshStandardMaterial({
        color: 0xc8f542,
        emissive: 0xc8f542,
        emissiveIntensity: 0.9,
      });
      const dotGeo = new THREE.SphereGeometry(0.09, 16, 16);
      const orbiters: THREE.Mesh[] = [];
      for (let i = 0; i < 3; i++) {
        const dot = new THREE.Mesh(dotGeo, dotMat);
        orbiters.push(dot);
        group.add(dot);
      }

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

      // Drag-to-spin state.
      let dragging = false;
      let lastX = 0;
      let lastY = 0;
      let targetRX = 0.3;
      let targetRY = 0.4;
      let curRX = targetRX;
      let curRY = targetRY;

      const onDown = (e: PointerEvent) => {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
      };
      const onMove = (e: PointerEvent) => {
        if (!dragging) return;
        targetRY += (e.clientX - lastX) * 0.012;
        targetRX = Math.max(
          -1.1,
          Math.min(1.1, targetRX + (e.clientY - lastY) * 0.01),
        );
        lastX = e.clientX;
        lastY = e.clientY;
      };
      const onUp = () => {
        dragging = false;
      };
      mount.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerup", onUp);

      const clock = new THREE.Clock();
      const render = () => {
        if (disposed || !renderer) return;
        const t = clock.getElapsedTime();
        if (!dragging) targetRY += 0.005;
        curRX += (targetRX - curRX) * 0.08;
        curRY += (targetRY - curRY) * 0.08;
        group.rotation.x = curRX;
        group.rotation.y = curRY;
        orbiters.forEach((dot, i) => {
          const angle = t * (0.6 + i * 0.2) + i * 2.1;
          dot.position.set(
            Math.cos(angle) * 1.9,
            Math.sin(angle * 1.3) * 1.0,
            Math.sin(angle) * 1.4,
          );
        });
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
        mount.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        scene.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          const mat = mesh.material as THREE.Material | THREE.Material[];
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else if (mat) mat.dispose();
        });
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
      aria-label="Orbit lab. Drag to spin the 3D object."
      className="relative h-64 w-full touch-none overflow-hidden bg-coal sm:h-72 [&>canvas]:h-full [&>canvas]:w-full"
    />
  );
}
