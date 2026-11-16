# Rohan Makwana — Portfolio

A cinematic, interactive developer portfolio for Rohan Makwana (BCA student,
Ahmedabad, India). Built with Next.js 16 (App Router), TypeScript, Tailwind
CSS v4, GSAP + ScrollTrigger, Lenis smooth scrolling, and Three.js (3D
throughout: hero scene, tilt cards, orbit + terrain labs).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (typecheck + lint run separately)
npm start        # serve the production build
```

## Deploy it

The easiest route is Vercel:

1. Push this folder to a **new** GitHub repository (nothing in this project
   touches the existing `muse-taskapp` repo).
2. On [vercel.com/new](https://vercel.com/new), import that repository.
   No environment variables are needed; the defaults work.

Or deploy anywhere that serves a Node.js app with `npm run build && npm start`.

## Edit the content

Almost everything editable lives in one file: [`data/profile.ts`](data/profile.ts)

- Name, location, education, interests, timeline, projects, tech groups,
  "currently exploring" list, and social links.
- `linkedin` is intentionally `null` until a real URL is supplied. While
  null, the site renders **no** LinkedIn CTA. `email` is set to the
  owner's professional address (added at his direction on 26 Oct 2026),
  which renders the "Email me" button in the Contact section.

## What was verified (26 October 2026)

- The Muse repository was read directly before writing project copy:
  - `roh4n-13/muse-taskapp` — Kotlin + Jetpack Compose, local-first task
    manager, 21 structured fields, 133 unit tests per its README, v1.0.0
    released. Described as **Completed**, and it is the only project shown
    on the site.
- No live web demo exists for this Android app, so no demo links are
  shown anywhere on the site — the panel says so explicitly.
- Repository facts in the GitHub section are build-time facts from that
  check, labelled as such. There is no live GitHub fetch at runtime.

## What is deliberately not claimed

- No employment history, clients, awards, certifications, or metrics
  beyond what is verified above. The About timeline is a learning journey
  (dateless phases), not professional milestones.
- The featured project's dashboard visual is an **illustrative preview** built
  from verified features — it is not a screenshot and contains no real
  user data (values are shown as "—").
- The hero 3D — a particle wave and floating geometric shards — is
  abstract decoration, not an app render or a product model.

## Behaviour notes

- Intro: an RM monogram with progress tied to real milestones (fonts
  ready, hero ready, window load). Skippable (Skip button / Escape), and
  never shown to reduced-motion users.
- Motion: GSAP scroll reveals, Lenis smooth scroll, magnetic CTAs, and a
  custom cursor (main ring, slower ghost ring, snappy center dot;
  native cursor is never hidden). All animations are disabled or
  reduced under `prefers-reduced-motion`, and canvases pause
  off-screen. 3D runs through the whole site: the hero has a dense
  particle wave that ripples under the pointer and rings out where you
  click, floating geometric shards in three materials and varied
  scales, a giant RM watermark that drifts against the pointer, and a
  giant wireframe shell with orbit rings that lean toward the pointer
  behind the type;
  the headline itself tilts in 3D toward the pointer and tilts back as
  it scrolls away; project/GitHub/stack cards tilt in 3D on hover; and
  the Playground has two 3D toys — Orbit Lab (drag to spin) and Terrain
  Lab (the ground rises under your pointer). If WebGL fails, the site
  still works fully in 2D.
- Design honesty: no gradient blobs or template filler — the hero
  backdrop is the 3D scene, film grain, and the RM watermark only,
  and the footer carries a colophon (type credits, stack, and a
  last-updated date) instead of generic filler.
- Recruiter-ready additions (Oct 2026 ideas round, user picked 1–5):
  the general resume PDF lives in public/ and is linked from the hero
  and contact via profile.resumeUrl; the project panel links the
  v1.0.0 APK download; an availability line ("Open to fresher
  roles · Ahmedabad & remote") shows in the hero and contact.
  (Oct 2026 update: the case-study block and Notes section were
  removed at the owner's direction — the site keeps the app to one
  compact panel so it stays a personal portfolio, not a product page.)
- Accessibility: semantic sections, keyboard-operable menus and
  experiments, visible focus states, and aria labels on interactive
  canvases.

## Checks run

- `npx tsc --noEmit` — clean
- `npm run lint` — clean
- `npm run build` — passes, fully static (`/` prerendered)
- Production server smoke test — HTTP 200, all sections present in HTML

Not yet done in a real browser: visual review on physical desktop/mobile
devices and a screen-reader pass. If you open the site and anything looks
off, tell me the device and section and I will fix it.
