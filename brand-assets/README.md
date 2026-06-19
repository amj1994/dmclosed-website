# DMClosed — Brand Assets (handoff)

Everything needed to build a branded dashboard. All PNGs have **transparent backgrounds**.

## Files

### Icon (the mark) — use anywhere
The orange speech-bubble + check. Works on any background. Use for favicon, app icon,
sidebar collapsed state, loading screens.
- `icon-orange.png` — 1024×1024 master
- `icon-orange-512.png`, `-256`, `-128`, `-64`, `-32` — ready-made sizes (favicon = 32/64)
- `favicon.svg` — scalable favicon

### Logo (full wordmark) — two versions
Icon + "DMClosed" lockup. **Pick by background:**
- `logo-light.png` — 1307×402 — **for LIGHT / white backgrounds.** "DM" orange, "Closed" dark. ✅ use this on a white dashboard.
- `logo-orange.png` — 1307×402 — **for DARK / colored backgrounds.** "DM" orange, "Closed" light/cream.

(On the wrong background each becomes low-contrast — light logo on dark, or dark "Closed" on white — so match the version to the surface.)

### Colors
- `colors-swatch.png` — visual palette sheet (hand this to anyone, opens anywhere)
- `colors-swatch.svg` — vector version (Figma/illustrator-friendly)
- `COLORS.md` — exact hex + OKLCH values + usage rules

### Originals (reference only)
- `icon-blue-original.png`, `logo-blue-original.png` — the pre-rebrand blue versions. **Don't
  use these** for the dashboard; the brand is orange.

## Quick facts for the dashboard
- **Primary brand color:** `#FD6F00` (orange). Dark theme by default.
- **Text on orange buttons:** `#1A0B06` (dark), not white.
- **Fonts:** Bricolage Grotesque (headings), Barlow (body), Spectral italic (accent) — all on Google Fonts.
- Full spec in `COLORS.md`.
