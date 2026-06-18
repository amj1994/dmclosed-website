# DESIGN.md — DMClosed

## Aesthetic lane
**Incandescent-orange drench on cinematic near-black.** Named reference: a dark AI-product
hero (Fluxora-style) with one committed molten-orange identity carrying the brand — not
SaaS-cream, not editorial-serif, not navy-fintech. Color strategy: **Committed → Drenched**
in the hero, restrained-orange-accent in the deeper sections so the page breathes.

The hero centerpiece is real imagery: a looping, orange-graded video of a humanoid robot
turning its head (`/media/robot-hero.mp4` + `.webm`, poster `.jpg`). Watermark removed,
ping-pong looped for seamless motion. Imagery is non-negotiable here.

## Color — OKLCH (in `src/styles/tokens.css`)
- Surfaces: warm near-black `--bg` → deep wells → tinted surfaces (chroma toward orange hue ~45).
- Brand: `--primary` molten orange `oklch(0.70 0.196 47)`; `--ember` deep red-orange for depth;
  `--accent` amber/gold `oklch(0.83 0.15 75)` used sparingly.
- Text on bright orange fills is **dark** (`--on-primary`) for AA contrast — orange at L0.70
  fails against white. Headlines/accents in orange sit on dark bg (high contrast, fine).
- Body ink is a warm off-white; muted text stays ≥4.5:1 on its surface.

## Type
- Display: **Barlow Condensed** (700/800) — industrial, bold, tight. Carries big cinematic headlines.
- Body: **Barlow** (400–600). Same type system, strong width/weight contrast = deliberate, not reflex.
- Fluid `clamp()` scale, ≥1.25 ratio. Display max ≤ 6rem. Letter-spacing floor -0.04em on display.

## Motion (in `src/scripts/motion.js`)
- Lenis smooth scroll synced to GSAP ScrollTrigger.
- THREE.js ambient particle/wire field behind hero (orange), pointer + scroll reactive,
  paused offscreen and under `prefers-reduced-motion`.
- GSAP: staggered reveals tuned per section (not one uniform fade), magnetic primary buttons,
  counters, channel marquee, hero entrance choreography, parallax on floating proof chips.
- Ease-out expo/quart only. Every motion has a reduced-motion fallback (content visible by default).

## Anti-slop guardrails honored
- No eyebrow above every section (numbers only where it's a real sequence — How It Works).
- No gradient text, no side-stripe borders, no glassmorphism-by-default, no identical card grids.
- Cards used only where they're the right affordance; sections get distinct treatments.
