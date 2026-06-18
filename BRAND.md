# BRAND.md — DMClosed Brand Guidelines

The single source of truth for how DMClosed looks, sounds, and feels.
Implementation lives in `src/styles/tokens.css` (colors, type, spacing) and the
section components in `src/components/`.

---

## 1. Positioning

**DMClosed is a done-for-you AI sales agent service for businesses (B2B).**
We build, train, and operate an AI sales rep that lives inside a company's DMs —
WhatsApp, Instagram, Messenger, Telegram, SMS, iMessage, email, web chat — replies
in seconds, handles objections, follows up for days, and books qualified calls onto
the team's calendar, 24/7.

- Built on a white-labeled conversational-AI platform (the DMChamp engine), operated
  and tuned by DMClosed as a managed service. The customer never sees the underlying tool.
- **B2B only.** Copy speaks to operators / owners / heads of sales about revenue.
  Never addresses end-consumers.
- One-line promise: *speed-to-lead, weaponized.* Most replies die in the inbox;
  DMClosed answers in seconds and turns conversations into booked calls.

**Audience:** businesses with inbound DM/lead volume they can't answer fast enough —
coaching & info businesses, agencies, high-ticket service firms, e-commerce/DTC,
real estate, med-spa/clinics, B2B SaaS sales teams. Buyer = owner / head of sales / marketing lead.

---

## 2. Voice & tone

Operator-to-operator. Confident, direct, a little cinematic. Revenue language, not
chatbot-feature language.

- **Say:** "It's not a chatbot. It's an AI sales agent." / "Your DMs just hired a closer."
- **Do:** lead with outcomes (booked calls, closed deals, speed). Short, punchy headlines.
  Concrete proof ($40K deal closed in chat, replies in seconds, proven on $50K deals).
- **Don't:** address consumers, promise "free trials," use generic SaaS filler, or over-explain
  the underlying tech.

**Signature taglines**
- "Your DMs just hired a closer." (hero — *closer* rotates: closer → rainmaker → deal-maker)
- "It's not a chatbot. It's an AI sales agent."
- "Speed-to-lead, weaponized."

---

## 3. Color

Strategy: **incandescent-orange drench on cinematic near-black.** One molten color
carries the brand. Source of truth is OKLCH in `src/styles/tokens.css`; hex values
below are approximate references only.

| Role | Token | OKLCH | ~Hex |
|------|-------|-------|------|
| Hero stage | (literal) | — | `#000000` |
| Background | `--bg` | `oklch(0.11 0.020 45)` | `#17100b` |
| Deep well / footer | `--bg-deep` | `oklch(0.075 0.016 42)` | `#0f0a07` |
| Surface / cards | `--surface` | `oklch(0.155 0.026 46)` | `#221813` |
| Primary (molten orange) | `--primary` | `oklch(0.705 0.196 47)` | `#f26a1f` |
| Ember (deep red-orange) | `--ember` | `oklch(0.585 0.215 33)` | `#dd3a1c` |
| Accent (amber/gold) | `--accent` | `oklch(0.84 0.150 78)` | `#ffb24a` |
| Success (green) | `--success` | `oklch(0.78 0.160 150)` | `#34c97f` |
| Ink (warm white) | `--ink` | `oklch(0.972 0.012 70)` | `#fbf7f3` |
| Ink-2 (secondary) | `--ink-2` | `oklch(0.835 0.018 60)` | `#d4cabf` |
| Muted | `--muted` | `oklch(0.700 0.022 55)` | `#a99a8c` |
| Text on orange fills | `--on-primary` | `oklch(0.170 0.030 40)` | `#241108` |

**Rules**
- Text on bright-orange fills is **dark** (`--on-primary`), never white — orange at L0.70
  fails contrast against white. Orange headlines/accents sit on dark backgrounds (high contrast).
- Body text holds ≥4.5:1; muted text stays ≥4.5:1 on its surface.
- The hero is **solid black**; deeper sections use restrained orange accents so the page breathes.

---

## 4. Typography

| Use | Family | Notes |
|-----|--------|-------|
| Display (all headings) | **Bricolage Grotesque** (variable) | contemporary grotesque; weights 700–800 |
| Body | **Barlow** | humanist grotesk, 400–600 |
| Accent (the rotating hero word) | **Spectral**, italic 500 | elegant serif, orange — the *closer.* word |

- Fluid `clamp()` scale (≥1.25 ratio); display headline caps ~5.4–6rem.
- Display letter-spacing around `-0.025em`; never tighter than `-0.04em`.
- The hero pairs a bold contemporary grotesk with an italic-serif accent — that contrast
  is the brand's signature type move. Don't swap the serif for another sans.

---

## 5. Logo

`public/logo.png` (legacy blue mark) is tinted to brand orange in CSS via
`hue-rotate` (see `src/components/Logo.astro`). **Long-term:** replace with a native
orange/transparent logo asset and remove the filter.

---

## 6. Motion

Cinematic but disciplined. Implemented in `src/scripts/motion.js` (GSAP + Lenis).

- **Smooth scroll** via Lenis, synced to GSAP ScrollTrigger.
- **Hero:** entrance choreography (headline lines rise, copy staggers, video wipes in);
  the robot video gently zooms/parallaxes as you scroll out; the accent word rotates
  through 3 synonyms (fade + blur + rise loop).
- **Reveals (Apple-style):** every section assembles as you scroll into it — elements
  **fade + rise + de-blur**, cascading with a small stagger. CSS-transition driven so
  content can never get stuck hidden.
- **Micro:** magnetic primary buttons, channel/card hover lifts, the $40K proof thread.
- Easing: ease-out (quint / expo / quart). No bounce, no elastic.
- **`prefers-reduced-motion` is honored everywhere** — reveals show instantly, loops stop.

---

## 7. Anti-slop guardrails

- No eyebrow above every section (numbers only where it's a real sequence — How It Works).
- No gradient text, no side-stripe borders, no glassmorphism-by-default, no identical card grids.
- Imagery is non-negotiable in the hero (the robot video). No colored-block placeholders.
- If someone can say "an AI made this" without hesitation, it's failed — commit to the
  orange-on-black drench and the bold-grotesk + italic-serif type voice.
