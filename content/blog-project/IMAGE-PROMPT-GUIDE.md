# VEM Hero Image — Prompt Guide

Every post gets a hero image in the VEM house style. Claude writes the prompt
from the formula below; Eric generates the image and hands it back (or Claude can
generate it here).

## House style (non-negotiable)
- **Mood:** deep navy, institutional, calm, premium, restrained.
- **Subject:** abstract architecture, structure, or material — NOT literal
  depictions of the topic. Think columns, facades, geometry, light, texture.
- **Accent:** sparing gold highlights only. Gold is rationed, never dominant.
- **Composition:** clear negative space on the LEFT (text/overline sits there),
  subject weighted right. 16:9 landscape.
- **Hard rules:** NO people, NO faces, NO text/letters/numbers, NO logos, NO
  charts or tickers, no busy clutter. Photographic or refined 3D render, not
  cartoonish.

## Prompt formula (fill the [brackets])
> Deep navy [architectural subject: e.g. a colonnade of fluted stone columns],
> cinematic low-key lighting with a single warm gold light accent, [material:
> e.g. polished marble and brushed brass], strong negative space on the left,
> subject composed to the right third, minimalist and institutional, premium
> finance brand aesthetic, ultra-detailed, 16:9, no people, no text, no logos.

## Worked examples by topic
- **Markets / volatility:** "Deep navy abstract of layered glass skyscraper
  facades at dusk, a single thin gold light line tracing one edge, fog and
  negative space on the left, calm and monumental, 16:9, no people, no text."
- **Energy / commodities:** "Deep navy industrial abstraction of smooth steel
  pipeline curves, one warm gold reflection, vast dark negative space left,
  minimalist, premium, 16:9, no people, no text."
- **Policy / Fed / rates:** "Deep navy neoclassical stone facade with tall
  columns in shadow, subtle gold rim light on one column edge, generous empty
  sky on the left, austere and institutional, 16:9, no people, no text."
- **AI / technology:** "Deep navy abstract of precise geometric circuitry
  etched in dark metal, faint gold traces, large quiet negative space on the
  left, refined and restrained, 16:9, no people, no text."

## After you have the image
1. Optimize to web sizes (desktop ~2400px wide):
   - `assets/img/blog/<name>.jpg`  (target <= ~250 KB)
   - `assets/img/blog/<name>.webp` (target <= ~80 KB)
   - `assets/img/blog/<name>-mobile.jpg` (~1100px, portrait-ish, <= ~130 KB)
   (Insights live under `assets/img/insights/`.)
2. Set the post's `hero:` field to the `.jpg` path. The build auto-uses the
   `.webp` and `-mobile.jpg` siblings if they exist.
3. If no image is ready, omit `hero:` — a branded placeholder is used.
