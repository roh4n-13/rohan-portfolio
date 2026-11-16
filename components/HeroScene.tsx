"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/hooks";

/**
 * Full hero 3D scene: an ambient particle wave plus floating geometric
 * shards — the site's 3D centerpiece.
 *
 * - The wave is dim, slow, and behind the copy; it never competes with
 *   the typography. It also ripples under the pointer — a soft hill
 *   follows the cursor across the wave — and clicking anywhere in the
 *   hero sends an expanding ring across it, so the hero feels touched
 *   rather than looped.
 * - The shards are small solids in three materials — dark, glowing
 *   lime, and paper — varied in scale and scattered with a loose
 *   jitter, bobbing gently and tilting as a group with the pointer.
 *   They rotate slowly in place, but nothing here is a single dominant
 *   spinning object — the old rotating sculpture's problem,
 *   deliberately avoided. The wireframe shell and its orbit rings lean
 *   slightly toward the pointer too, so the whole backdrop feels
 *   alive rather than looped.
 * - Caps pixel ratio, pauses when off-screen, disposes everything, and
 *   renders a single static frame for reduced-motion users.
 * - WebGL failure: removes itself silently; the hero still works fully
 *   in 2D (spotlight, hover letters, reveals).
 */
export default function HeroScene() {
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
      camera.position.set(0, 1.4, 9);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      const isSmall = window.innerWidth < 768;
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, isSmall ? 1.5 : 2),
      );
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xffffff, 0.9));
      const dir = new THREE.DirectionalLight(0xffffff, 1.4);
      dir.position.set(5, 8, 5);
      scene.add(dir);
      const limePoint = new THREE.PointLight(0xc8f542, 12, 20);
      limePoint.position.set(-4, -2, 3);
      scene.add(limePoint);

      /* ---- Particle wave: calmer than before, kept below the copy ---- */
      const cols = isSmall ? 64 : 88;
      const rows = isSmall ? 36 : 48;
      const count = cols * rows;
      const positions = new Float32Array(count * 3);
      const xs: number[] = [];
      const zs: number[] = [];
      let i = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = (c / (cols - 1) - 0.5) * 34;
          const z = (r / (rows - 1) - 0.5) * 20 - 9;
          xs.push(x);
          zs.push(z);
          positions[i++] = x;
          positions[i++] = 0;
          positions[i++] = z;
        }
      }
      const waveGeo = new THREE.BufferGeometry();
      waveGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const waveMat = new THREE.PointsMaterial({
        color: 0x9dc22e,
        size: 0.08,
        transparent: true,
        opacity: 0.35,
        sizeAttenuation: true,
      });
      const wave = new THREE.Points(waveGeo, waveMat);
      wave.position.y = -2.7;
      wave.rotation.x = 0.55;
      scene.add(wave);
      const posAttr = waveGeo.getAttribute("position") as THREE.BufferAttribute;

      /* ---- Floating shards ---- */
      const shardGroup = new THREE.Group();
      scene.add(shardGroup);
      const shardGeos = [
        new THREE.TetrahedronGeometry(0.45),
        new THREE.OctahedronGeometry(0.5),
        new THREE.IcosahedronGeometry(0.55, 0),
        new THREE.TorusGeometry(0.5, 0.14, 12, 32),
      ];
      const darkMat = new THREE.MeshStandardMaterial({
        color: 0x16150f,
        metalness: 0.6,
        roughness: 0.35,
      });
      const limeMat = new THREE.MeshStandardMaterial({
        color: 0xc8f542,
        emissive: 0xc8f542,
        emissiveIntensity: 0.45,
        metalness: 0.2,
        roughness: 0.3,
      });
      const paperMat = new THREE.MeshStandardMaterial({
        color: 0xfaf8f3,
        metalness: 0.1,
        roughness: 0.5,
      });
      const shardCount = isSmall ? 12 : 16;
      type Shard = {
        mesh: THREE.Mesh;
        baseY: number;
        phase: number;
        rsx: number;
        rsy: number;
      };
      const shards: Shard[] = [];
      for (let s = 0; s < shardCount; s++) {
        const mesh = new THREE.Mesh(
          shardGeos[s % shardGeos.length],
          s % 4 === 3 ? limeMat : s % 5 === 4 ? paperMat : darkMat,
        );
        mesh.scale.setScalar(0.7 + Math.random() * 0.6);
        // Keep the center clear: shards live in the left/right edge
        // bands (|x| 5.5–13) so none drift across the headline.
        const side = s % 2 === 0 ? -1 : 1;
        const x =
          side * (5.5 + Math.random() * 7.5) + (Math.random() - 0.5) * 1.5;
        const y = -1 + Math.random() * 4.5;
        const z = -8 + Math.random() * 5;
        mesh.position.set(x, y, z);
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        shardGroup.add(mesh);
        shards.push({
          mesh,
          baseY: y,
          phase: Math.random() * Math.PI * 2,
          rsx: 0.15 + Math.random() * 0.25,
          rsy: 0.2 + Math.random() * 0.3,
        });
      }

      /* ---- Giant wireframe shell + orbit rings: backdrop depth ---- */
      const shell = new THREE.LineSegments(
        new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(6.5, 1)),
        new THREE.LineBasicMaterial({
          color: 0xc8f542,
          transparent: true,
          opacity: 0.22,
        }),
      );
      shell.position.set(2.5, 0.8, -7);
      shell.rotation.x = 0.3;
      scene.add(shell);

      const ringMat = new THREE.LineBasicMaterial({
        color: 0xc8f542,
        transparent: true,
        opacity: 0.15,
      });
      const ringGeo1 = new THREE.TorusGeometry(8.5, 0.03, 8, 72);
      const ring1 = new THREE.LineSegments(
        new THREE.WireframeGeometry(ringGeo1),
        ringMat,
      );
      ring1.position.copy(shell.position);
      ring1.rotation.x = 1.1;
      scene.add(ring1);
      const ringGeo2 = new THREE.TorusGeometry(10, 0.03, 8, 72);
      const ring2 = new THREE.LineSegments(
        new THREE.WireframeGeometry(ringGeo2),
        ringMat,
      );
      ring2.position.copy(shell.position);
      ring2.rotation.x = -0.9;
      ring2.rotation.y = 0.6;
      scene.add(ring2);

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

      let px = 0;
      let py = 0;
      let tx = 0;
      let ty = 0;
      let pointerSeen = false;
      const onPointer = (e: MouseEvent) => {
        tx = (e.clientX / window.innerWidth) * 2 - 1;
        ty = (e.clientY / window.innerHeight) * 2 - 1;
        pointerSeen = true;
      };
      window.addEventListener("mousemove", onPointer, { passive: true });

      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { threshold: 0 },
      );
      io.observe(mount);

      const clock = new THREE.Clock();

      // Click ripples: pressing anywhere in the hero sends an expanding
      // ring across the wave — "touch it" made literal. Touch taps work
      // the same way through pointerdown.
      type Ripple = { x: number; z: number; t0: number };
      const ripples: Ripple[] = [];
      const onDown = (e: PointerEvent) => {
        const section = mount.closest("section");
        if (!section || !section.contains(e.target as Node)) return;
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        ripples.push({
          x: nx * 12,
          z: -9 + ny * 5,
          t0: clock.getElapsedTime(),
        });
        if (ripples.length > 4) ripples.shift();
      };
      window.addEventListener("pointerdown", onDown, { passive: true });

      const waveAt = (t: number) => {
        // Pointer ripple: a soft gaussian hill centered where the
        // cursor is over the wave. Zero until the first mouse move.
        const wx = px * 12;
        const wz = -9 + py * 5;
        for (let k = 0; k < count; k++) {
          const dx = xs[k] - wx;
          const dz = zs[k] - wz;
          const d2 = dx * dx + dz * dz;
          const bump = pointerSeen ? Math.exp(-d2 / 18) * 1.1 : 0;
          // Click ripples: expanding rings that fade over ~3 seconds.
          let ring = 0;
          for (const r of ripples) {
            const age = t - r.t0;
            if (age < 0 || age > 3) continue;
            const rdx = xs[k] - r.x;
            const rdz = zs[k] - r.z;
            const d = Math.sqrt(rdx * rdx + rdz * rdz);
            const radius = age * 7;
            ring +=
              Math.exp(-((d - radius) * (d - radius)) / 8) *
              Math.exp(-age * 1.1) *
              1.3;
          }
          posAttr.setY(
            k,
            Math.sin(xs[k] * 0.32 + t * 0.5) * 0.45 +
              Math.cos(zs[k] * 0.28 + t * 0.35) * 0.3 +
              bump +
              ring,
          );
        }
        posAttr.needsUpdate = true;
      };

      const render = () => {
        if (disposed || !renderer) return;
        const t = clock.getElapsedTime();
        px += (tx - px) * 0.04;
        py += (ty - py) * 0.04;
        waveAt(t);
        shardGroup.rotation.y = px * 0.12;
        shardGroup.rotation.x = py * -0.08;
        shell.rotation.y = t * 0.1 + px * 0.18;
        shell.rotation.x = 0.3 + Math.sin(t * 0.1) * 0.05 + py * -0.08;
        ring1.rotation.z = t * 0.08;
        ring1.rotation.x = 1.1 + py * -0.05;
        ring2.rotation.z = -t * 0.06;
        ring2.rotation.y = 0.6 + px * 0.06;
        for (const s of shards) {
          s.mesh.rotation.x = t * s.rsx + s.phase;
          s.mesh.rotation.y = t * s.rsy;
          s.mesh.position.y = s.baseY + Math.sin(t * 0.6 + s.phase) * 0.35;
        }
        wave.position.y = -2.7 - window.scrollY * 0.0004;
        renderer.render(scene, camera);
      };

      if (reduced) {
        waveAt(0.8);
        renderer.render(scene, camera);
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
        window.removeEventListener("mousemove", onPointer);
        window.removeEventListener("pointerdown", onDown);
        io.disconnect();
        ringGeo1.dispose();
        ringGeo2.dispose();
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
      // WebGL unavailable: hero keeps working fully in 2D.
      return () => {
        disposed = true;
        cancelAnimationFrame(raf);
      };
    }
  }, [reduced]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-0 [&>canvas]:h-full [&>canvas]:w-full"
    />
  );
}
