# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Primary: recruiters and hiring managers evaluating a fresher candidate. Situation: scanning a portfolio in seconds to decide whether to shortlist or contact. Job: judge real capability and honesty from real work, not from claims.
- Secondary: peers and other developers browsing the work.

## Product Purpose

Present Rohan Makwana, a BCA student at Gujarat University (2025–2028), as an aspiring software developer open to fresher roles in Ahmedabad and remote. Success means a recruiter can verify his capability from one real shipped project and contact him.

## Positioning

One project, built to ship — not a list of claims. The portfolio's proof is a single real Android app with a public repository and a downloadable release build, framed honestly: what exists is shown, and what does not exist is never implied.

## Operating Context

- Single-page portfolio (intro, hero, about, projects, playground, tech stack, GitHub, contact).
- All site content is centralized in data/profile.ts; the resume PDF ships in public/.
- Contact path: email call-to-action and resume download, plus GitHub and APK links for the featured project.
- The site is fully static, with no backend, no environment variables, and no analytics.

## Capabilities and Constraints

- Built with Next.js 16, TypeScript, and Tailwind CSS v4; fully static build.
- The hero includes a pointer- and click-reactive 3D scene; reduced-motion users are never shown the intro animation, and a WebGL failure falls back to a 2D presentation.
- Only one project is featured, by the owner's explicit decision; other work is deliberately left out.
- No live demos exist for the featured app, and none are claimed.
- No invented employment, clients, awards, or metrics anywhere on the site.
- LinkedIn URL: not provided (open decision).
- Deployment target: undecided (open decision).
- Public domain choice: undecided (open decision).

## Brand Commitments

- Name: Rohan Makwana; site mark: RM monogram.
- Voice: direct and honest, no clichéd or template-style copy.
- Feel references, explicitly feel-only and never to be copied: landonorris.com, antigravity.
- Quality standard set by the owner: human craft signals over template signals; the site must not read as a generic AI-generated template.

## Evidence on Hand

- Featured project repository: https://github.com/roh4n-13/muse-taskapp
- Release build: https://github.com/roh4n-13/muse-taskapp/releases/download/v1.0.0/app-release.1.apk (version 1.0.0, signed release APK)
- Resume PDF shipped in public/ (Rohan_Makwana_Resume.pdf)
- Absences future work must not fabricate: no live demos, no testimonials, no clients, no awards, no metrics.

## Product Principles

1. One shipped project beats a list of claims.
2. Every claim traces to a verified fact; nothing is invented.
3. Minimal scope: one project, honest framing, no filler sections.
4. Respect the visitor's time: fast, scannable, skippable intro.

## Accessibility & Inclusion

- Reduced-motion users are never shown the intro animation.
- WebGL failure falls back to a 2D presentation.
- No formal accessibility standard has been adopted for this site.
