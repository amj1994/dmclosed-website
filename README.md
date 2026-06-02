# DMClosed — Website

The marketing website for **DMClosed**, an AI sales agent that lives in your DMs (Instagram, WhatsApp, SMS, Messenger), replies in seconds, handles objections, and books calls 24/7.

Built with **Astro** (fast, SEO-friendly, static output) + **GSAP / Lenis** for motion.

---

## Quick start

You need Node.js 18+ installed.

```bash
# 1. Install dependencies (creates node_modules)
npm install

# 2. Start the dev server (hot reload)
npm run dev
# open the printed URL, usually http://localhost:4321

# 3. Build the production site (outputs to /dist)
npm run build

# 4. Preview the production build locally
npm run preview
```

> Note: `node_modules` is NOT included in this zip. Run `npm install` once and it will be recreated from `package.json`.

---

## Project structure

```
dmclosed/
├─ astro.config.mjs          # Astro config (site URL etc.)
├─ package.json              # dependencies + scripts
├─ public/                   # static assets served as-is
│  ├─ logo.png               # nav/footer logo (1307x402, transparent)
│  ├─ icon.png               # square app icon
│  └─ favicon.svg            # browser-tab icon
└─ src/
   ├─ layouts/
   │  └─ Layout.astro        # <head>, SEO meta, JSON-LD, fonts
   ├─ pages/
   │  └─ index.astro         # the single landing page (imports all sections)
   ├─ components/            # one file per page section
   │  ├─ Nav.astro
   │  ├─ Hero.astro          # animated DM-closing scene + motion graphics
   │  ├─ Problem.astro       # animated stat + speed bars
   │  ├─ HowItWorks.astro    # 3-step flow with progress ring
   │  ├─ Proof.astro         # $40K FueGenix case-study conversation
   │  ├─ Capabilities.astro  # alternating feature rows
   │  ├─ Channels.astro      # channel cards
   │  ├─ Pricing.astro       # $97 / $297 / $497 tiers
   │  ├─ FAQ.astro           # accordion
   │  ├─ CTA.astro           # closing call-to-action
   │  ├─ Footer.astro
   │  └─ Logo.astro          # shared logo component
   ├─ styles/
   │  ├─ tokens.css          # ALL brand colors (OKLCH), fonts, spacing, motion
   │  └─ global.css          # base styles, buttons, reveal system
   └─ scripts/
      └─ motion.js           # Lenis smooth scroll + GSAP scroll reveals + counters
```

---

## Brand reference

| Token | Value |
|-------|-------|
| Primary (blue) | `#456AF7` |
| Accent (cyan) | `#00D0EC` |
| Background | near-black (see `src/styles/tokens.css`) |
| Display font | Barlow Condensed |
| Body font | Barlow |

All colors live in `src/styles/tokens.css` as CSS variables — change them there and the whole site updates.

---

## Where to start editing

- **Copy / text:** each section's `.astro` file in `src/components/`
- **Colors / fonts / spacing:** `src/styles/tokens.css`
- **Pricing:** `src/components/Pricing.astro` (the `plans` array at the top)
- **Logo:** replace `public/logo.png`
- **SEO title / description:** `src/layouts/Layout.astro`

---

Built as the starting point for the next iteration. Not from scratch. 🚀
