# DMClosed — Website

Marketing site for **DMClosed** — a done-for-you **AI sales agent service for businesses (B2B)**.
We build, train, and operate an AI rep that lives in a company's DMs (WhatsApp, Instagram,
Messenger, Telegram, SMS, iMessage, email, web chat), replies in seconds, handles objections,
follows up for days, and books calls 24/7. Managed service, from **$497/mo**.

Built with **Astro** (static, fast, SEO-friendly) + **GSAP / Lenis** for motion. Cinematic
orange-on-black theme with a full-bleed, orange-graded robot hero video.

> **Docs:** [PRODUCT.md](PRODUCT.md) (positioning) · [BRAND.md](BRAND.md) (visual + voice
> guidelines) · [CONTENT.md](CONTENT.md) (all site copy) · [DESIGN.md](DESIGN.md) (design system).

---

## Quick start

Requires Node 18+.

```bash
npm install        # install dependencies
npm run dev        # dev server with hot reload → http://localhost:4321
npm run build      # production build → /dist
npm run preview    # preview the production build locally
```

---

## Project structure

```
dmclosed/
├─ astro.config.mjs           # Astro config
├─ PRODUCT.md / BRAND.md / CONTENT.md / DESIGN.md   # brand + content source of truth
├─ public/
│  ├─ media/                  # hero robot video assets (see "Hero video" below)
│  │  ├─ robot-hero.mp4       # HD, orange-graded, watermark-free, looped (Safari)
│  │  ├─ robot-hero.webm      # HD VP9 (Chrome/Firefox/Edge)
│  │  └─ robot-hero-poster.jpg
│  └─ logo.png, icon.png, favicon.svg
└─ src/
   ├─ layouts/Layout.astro    # <head>, SEO meta, JSON-LD, fonts
   ├─ pages/index.astro       # the single landing page (imports all sections)
   ├─ components/             # one file per section: Nav, Hero, Problem, HowItWorks,
   │                          # Capabilities, Channels, Proof, Pricing, FAQ, CTA, Footer, Logo
   ├─ styles/
   │  ├─ tokens.css           # ALL brand colors (OKLCH), fonts, spacing, motion vars
   │  └─ global.css           # base styles, buttons, reveal system, font imports
   └─ scripts/motion.js       # Lenis smooth scroll + GSAP reveals, hero choreography,
                              # rotating accent word, magnetic buttons, counters
```

## Where to edit
- **Copy:** each section's `.astro` file in `src/components/` (mirror changes in `CONTENT.md`).
- **Colors / fonts / spacing:** `src/styles/tokens.css`.
- **Pricing:** the `plans` array at the top of `Pricing.astro` ($497 / $897).
- **SEO title / description:** `src/layouts/Layout.astro`.

---

## Hero video pipeline

The hero robot is a source AI clip processed with **ffmpeg**: Kling watermark cropped out,
color-graded toward the brand orange, sharpened, scaled to HD (2282×1280), and made into a
seamless **ping-pong (forward+reverse) loop** so the head-turn never jump-cuts. Exported as
faststart H.264 `.mp4`, VP9 `.webm`, and a poster `.jpg`. To regenerate from a new source clip,
re-run the same crop → `hue`/`eq` grade → `scale`+`unsharp` → `split/reverse/concat` chain into
`public/media/`.

---

## Deploy (Vercel)

Static Astro — Vercel auto-detects the framework.

- **Build command:** `astro build` (auto) · **Output dir:** `dist` (auto) · **Install:** `npm install`
- Connect the GitHub repo in the Vercel dashboard, or `vercel --prod` with the CLI.
- No environment variables or serverless functions required (fully static).
- Set the production domain to `dmclosed.com` (matches `site` in `astro.config.mjs`).
