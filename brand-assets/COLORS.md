# DMClosed — Brand Colors

Orange-drench on cinematic near-black. **Hex values below are the exact sRGB renders**
of the OKLCH tokens in `src/styles/tokens.css` (the authoritative source). Use hex for
the dashboard; OKLCH given for reference.

## Brand
| Name | Hex | OKLCH | Use |
|------|-----|-------|-----|
| **Primary** (molten orange) | `#FD6F00` | `oklch(0.705 0.196 47)` | primary buttons, links, key accents, active states |
| Primary hover | `#FF8C25` | `oklch(0.765 0.183 53)` | hover / brighter primary |
| **Ember** (deep red-orange) | `#DE2E02` | `oklch(0.585 0.215 33)` | depth, gradients, glows, pressed states |
| Accent (amber/gold) | `#FFBD47` | `oklch(0.84 0.150 78)` | sparing highlights, badges, small icons |

## Surfaces & text
| Name | Hex | OKLCH | Use |
|------|-----|-------|-----|
| Hero / pure black | `#000000` | — | hero / full-bleed dark stage |
| Background | `#090301` | `oklch(0.11 0.020 45)` | app/page background (warm near-black) |
| Background deep | `#030100` | `oklch(0.075 0.016 42)` | deepest wells, footers |
| Surface / cards | `#150904` | `oklch(0.155 0.026 46)` | panels, cards, raised surfaces |
| **Ink** (primary text) | `#FBF5ED` | `oklch(0.972 0.012 70)` | headings & body text on dark |
| Ink secondary | `#D2C6BE` | `oklch(0.835 0.018 60)` | secondary text |
| Muted | `#AA9B92` | `oklch(0.700 0.022 55)` | labels, captions, tertiary text |

## Supporting
| Name | Hex | OKLCH | Use |
|------|-----|-------|-----|
| Success | `#5FD37F` | `oklch(0.78 0.160 150)` | positive / booked / paid states |
| Text on orange | `#1A0B06` | `oklch(0.170 0.030 40)` | **text/icons placed on orange fills** (never white — orange is too light for white text) |

## Rules
- Default theme is **dark**. Text on bright-orange fills must be the dark `#1A0B06`, not white.
- Orange (`#FD6F00`) as text/accents sits on dark backgrounds (high contrast).
- Body text should hold ≥4.5:1 contrast; keep muted text ≥4.5:1 on its surface.

## Fonts
- **Display / headings:** Bricolage Grotesque (Google Fonts) — weights 700–800
- **Body:** Barlow (Google Fonts) — 400–600
- **Accent italic:** Spectral (Google Fonts) — italic 500 (the decorative serif word)
