---
name: Rohan Makwana
description: "Building What's Next — personal developer portfolio"
colors:
  paper: "#faf8f3"
  paper-2: "#f0ede5"
  ink: "#16150f"
  coal: "#0c0c09"
  lime: "#c8f542"
  lime-deep: "#9dc22e"
  silver: "#b9bdb2"
  line: "#e3dfd3"
typography:
  display:
    fontFamily: "Space Grotesk, Inter, system-ui, sans-serif"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    letterSpacing: "0.18em"
  accent:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontWeight: 400
rounded:
  full: "9999px"
  card: "24px"
  md: "16px"
  sm: "8px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.lime}"
  button-accent:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "12px 20px"
  button-accent-hover:
    backgroundColor: "{colors.paper}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.full}"
    padding: "12px 20px"
  button-ghost-hover:
    backgroundColor: "rgba(250, 248, 243, 0.1)"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
  card-project:
    backgroundColor: "rgba(250, 248, 243, 0.04)"
    rounded: "{rounded.card}"
    padding: "24px"
---

# Design System: Rohan Makwana

## Overview

**Creative North Star: "The Dark Workbench"**

A dark, tactile workshop where everything responds to touch. The hero is a dark, cinematic, touch-reactive 3D scene; the sections that follow are calm paper, and the whole site is built around one idea the owner named himself: touch it, it moves. Nothing on the page is decorative for its own sake — every effect answers the pointer, the scroll, or the tap.

**Key Characteristics:**
- Dark-first hero on coal, light paper sections after it, one lime accent throughout.
- Pill shapes for every button and chip; large soft cards (24px) for panels.
- Outlined display type whose accent words fill on hover.
- Film grain on dark surfaces; flat tonal layering instead of shadows.
- Motion is pointer-driven and skippable; reduced-motion users never see the intro.

## Colors

One lime accent over a warm paper-and-ink neutral system; dark coal for the hero and footer, paper for everything else.

### Primary
- **Acid Lime** (#c8f542): the only accent. CTAs, the active state, the cursor ring, and attention moments. Its rarity is the point.
- **Deep Lime** (#9dc22e): the working shade of the accent — focus outlines, the 3D wave, small markers, section indices.

### Neutral
- **Warm Paper** (#faf8f3): light section backgrounds and primary-button fill.
- **Paper Shadow** (#f0ede5): the quieter light surface for alternating sections.
- **Soft Ink** (#16150f): text on paper, primary-button text, dark card fills.
- **Coal** (#0c0c09): hero, intro overlay, and footer backgrounds.
- **Silver** (#b9bdb2): muted text on coal.
- **Hairline** (#e3dfd3): borders on paper.

### Named Rules
**The One Accent Rule.** Lime is the only accent color. It marks action and attention, never decoration for its own sake.
**The Tonal Depth Rule.** Depth comes from tonal steps (paper to paper-2, paper at 4–5% over coal), never from a second accent or a gradient wash.

## Typography

**Display Font:** Space Grotesk (with Inter, system-ui fallback)
**Body Font:** Inter (with system-ui fallback)
**Label/Mono Font:** Inter semibold for labels; the default monospace stack for section indices only
**Accent Font:** Instrument Serif italic, for accent words only

**Character:** Space Grotesk carries the big editorial statements; Inter stays quiet and readable for everything else; Instrument Serif italic appears only where a single word needs a human, handwritten-feeling lift.

### Hierarchy
- **Display** (700, fluid clamp up to 11.5vw on small screens, 7xl–8xl on desktop, line-height 0.95–0.98): hero headlines and footer statement only.
- **Headline** (700, 4xl–7xl, line-height 0.98): section headings, with the last line outlined.
- **Title** (700, xl–5xl, tight): project titles and card titles.
- **Body** (400, base–lg, leading relaxed 1.625, max measure 65–75ch via max-w-xl/3xl): descriptions and supporting copy.
- **Label** (600, 11px rising to 12px at the small breakpoint, letter-spacing 0.18em–0.28em, uppercase feel): eyebrows, section indices, small buttons.

### Named Rules
**The Outline-Only-For-Accent Rule.** Outlined display text (1.5px stroke, transparent fill) is for accent words and final heading lines only — never for body copy.
**The One Serif Rule.** Instrument Serif italic appears on single accent words only (for example the final word of the hero headline), never on sentences.

## Layout

One centered column, max-w-7xl (80rem), with 20px side padding on mobile and 32px from the small breakpoint up. Sections stack vertically with generous whitespace; the hero fills the viewport. Density is calm: one idea per viewport, cards breathing with 24px padding on mobile and 40px on desktop.

Responsive behavior is fluid, not breakpoint-jumpy: display type scales with viewport width on small screens, the giant watermark hides below the large breakpoint, and the 3D scene drops density on mobile. The mobile menu is a full dialog with a labeled close action.

## Elevation & Depth

Flat by default. Depth is conveyed by tonal layering (paper over paper-2, translucent paper over coal), film grain on dark surfaces, and the 3D hero scene — not by shadows.

### Shadow Vocabulary
- **Orb lift** (`0 10px 15px rgba(0,0,0,0.1)`): the inertia-follower orb only.
- **Active node** (`0 4px 6px rgba(0,0,0,0.1)`): the selected constellation node only.
- **Pressed card edge** (`0 2px 0 0 #16150f`): the selected technology card only.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, selection, activation).

## Shapes

Pill-first: every button and chip is fully rounded (9999px). Panels use large soft corners (24px for project, playground, and tech cards; 16px for GitHub rows). Small square marks use 8px and 6px radii. Focus is a 2px deep-lime outline offset 3px with a 2px radius — visible on every interactive element.

## Components

### Buttons
- **Shape:** pill (9999px).
- **Primary:** paper fill, ink text, 14px 28px padding; hover fills lime.
- **Accent:** lime fill, ink text, 12px 20px padding; hover fills paper.
- **Ghost:** transparent fill, paper text, hairline border; hover adds a 10% paper wash.
- **Focus:** 2px deep-lime outline, 3px offset, on all variants.

### Chips
- **Style:** pill outline, 6px 14px padding, xs semibold text.
- **State:** static chips are informational; filter chips use pressed state (aria-pressed) with an ink fill when selected.

### Cards / Containers
- **Corner Style:** 24px for feature panels, 16px for list rows.
- **Background:** translucent paper (4%) over coal on dark sections, solid paper on light sections.
- **Shadow Strategy:** flat at rest; see Elevation & Depth.
- **Border:** 15% paper on dark, 25% ink or hairline on light; hover strengthens the border.
- **Internal Padding:** 24px mobile, 40px desktop.

### Navigation
- **Style:** fixed top bar, transparent over the hero, turning to 85% paper with a blur backdrop and hairline bottom border once scrolled.
- **Links:** small text, muted paper on dark, turning lime on hover; the mobile menu is a labeled dialog with a labeled close button.

### Signature Component: Round Cursor
- **Style:** three layers — a lime ring that follows the pointer, a slower ghost ring, and a center dot. The native cursor is never hidden, and the rings only appear for fine pointers.
- **Behavior:** the main ring scales up over interactive elements; the whole cursor is hidden from assistive technology and disabled for reduced-motion users.

## Do's and Don'ts

### Do:
- **Do** take every color, font, and radius from the @theme tokens in app/globals.css.
- **Do** keep lime as the single accent; use deep lime for focus and small markers.
- **Do** keep outlined type to accent words and final heading lines.
- **Do** preserve the reduced-motion alternatives (no intro, no cursor rings, no magnetic pull) exactly as implemented.
- **Do** keep buttons as real buttons with visible focus outlines.

### Don't:
- **Don't** add gradient blobs or washes — the owner had them removed as template-looking.
- **Don't** add new projects or sections beyond the one featured project — minimal scope is an owner decision.
- **Don't** nest cards inside cards; the system has no nested-card pattern.
- **Don't** use Inter for display type or Space Grotesk for body copy.
- **Don't** invent claims, metrics, clients, or awards in any new surface.
- **Don't** use a second accent color alongside lime.
