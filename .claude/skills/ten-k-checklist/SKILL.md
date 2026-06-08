---
name: ten-k-checklist
description: The $10K Checklist — eight design principles that separate a website that looks like a $10,000 build from one that looks like a free template. Use this whenever building, designing, reviewing, or improving any web page, landing page, or UI for this project (or any site). Apply ALL eight before considering a page done.
---

# The $10K Checklist

A website looks expensive not because of one flourish, but because of eight
disciplines applied together and consistently. Cheap sites violate several of
these; expensive ones violate none. Walk every page against this list — design,
build, and final review.

The eight, at a glance:

| # | Principle |
|---|-----------|
| 01 | Point of view, not a template |
| 02 | Typography that does work |
| 03 | A restrained color system |
| 04 | Hierarchy that breathes |
| 05 | Imagery with intent |
| 06 | Motion that whispers |
| 07 | Mobile that's designed, not shrunk |
| 08 | The invisible expensive stuff |

---

## 01 — Point of view, not a template

A $10K site makes a decision and commits to it. A template hedges.

- **Have one organizing idea.** Before any pixels, name the single feeling or
  message the page must land (e.g. "quiet authority," "fast and friendly").
  Every later choice gets measured against it.
- **Kill the hero-features-testimonials-CTA autopilot.** That stock section
  order is the single biggest tell of a template. Reorder, merge, or cut
  sections so the layout reflects *this* content, not a generic skeleton.
- **One signature move per page.** A distinctive layout, a custom section, an
  unexpected but tasteful detail — one thing a visitor remembers. Not ten.
- **Opinionated defaults.** No leftover Lorem ipsum, no placeholder stock,
  no "Your Company Here." Specific copy beats generic copy every time.

**Reject if:** the page could have its logo swapped and sell a different product
with no other change.

---

## 02 — Typography that does work

Type is the cheapest way to look expensive and the fastest way to look cheap.

- **Two typefaces, max** (often one with multiple weights). A characterful
  display/heading face paired with a clean, highly legible body face. Avoid
  default system stacks for headings — they read as "unstyled."
- **A real type scale.** Use a consistent ratio (e.g. 1.25 or 1.333), not
  arbitrary px values. Define sizes once as tokens and reuse them.
- **Body text 16–20px, line-height 1.5–1.7, measure 60–75 characters.** Long
  lines and cramped leading are instant tells.
- **Tighten large headings** (negative letter-spacing on big display type),
  and let small/caps text breathe with positive tracking.
- **Set the details:** real apostrophes/quotes (' "), en/em dashes, no widows
  on headlines, tabular numerals for figures and tables.

**Reject if:** three+ fonts, default Times/Arial headings, or walls of 14px
text at 1.2 line-height.

---

## 03 — A restrained color system

Expensive design is disciplined with color; cheap design sprays it.

- **Neutrals do the heavy lifting.** Pick a dominant neutral (true black, off-
  white, or a tuned near-black like #111) and build from it. Most of the page
  is neutral.
- **One accent, used sparingly.** A single brand/accent color reserved for the
  things that matter — primary actions, key highlights. When everything is
  highlighted, nothing is.
- **A real ramp, not random hexes.** Define 5–9 steps of your neutral and your
  accent as tokens. Pull every shade from the ramp; never eyeball a one-off.
- **Off-blacks and off-whites.** Pure #000 on #FFF is harsh and reads cheap.
  Warm or cool the extremes slightly.
- **Check contrast.** Body text ≥ 4.5:1, large text ≥ 3:1 (WCAG AA). This is
  both an accessibility floor and a polish signal.

**Reject if:** more than ~2 accent colors, gradients on everything, or shades
that don't trace back to a defined ramp.

---

## 04 — Hierarchy that breathes

Space is the most underused luxury material. Cheap sites are cramped; expensive
ones are generous and clearly ranked.

- **Whitespace is intentional, not leftover.** Give sections, headings, and key
  elements room. When unsure, add more space, not more stuff.
- **Use an 8px spacing scale.** All margins/padding/gaps are multiples (4/8/12/
  16/24/32/48/64…). Defined as tokens, applied consistently.
- **One clear focal point per section.** The eye should know instantly where to
  land. Size, weight, color, and space create the rank — not decoration.
- **Align to a grid.** Consistent gutters and column structure. Nothing floats
  arbitrarily; edges line up across the page.
- **Group by proximity.** Related things sit close; unrelated things get a gap.
  Spacing communicates structure before anyone reads a word.

**Reject if:** edge-to-edge cramped content, inconsistent gaps, or no obvious
"look here first" in a section.

---

## 05 — Imagery with intent

Every image earns its place or it's removed.

- **No generic stock.** Handshake-in-a-boardroom photos scream cheap. Use real
  product, real people, custom illustration, or considered abstract art.
- **Consistent treatment.** One visual language across all imagery — same
  duotone/filter, same crop ratios, same corner radius, same lighting mood.
- **Optimize and serve right.** Modern formats (WebP/AVIF), responsive
  `srcset`, correct dimensions, lazy-loading below the fold. A slow, heavy
  image undoes the whole effect.
- **Mind the seams.** Transparent PNGs on the wrong background, visible JPEG
  artifacts, and stretched/squished aspect ratios are dead giveaways.
- **Purposeful placement.** Imagery supports the message or demonstrates the
  product — it's not filler to fill a column.

**Reject if:** stock clichés, mismatched treatments, or images that exist only
because the layout had a gap.

---

## 06 — Motion that whispers

Good motion is felt, not noticed. Bad motion is a carnival.

- **Subtle and fast.** Most transitions 150–300ms with eased curves
  (ease-out / custom cubic-bezier), never linear. Movement should feel like
  physics, not a slideshow.
- **Motion has a reason.** Reveal on scroll, feedback on interaction, smoothing
  a state change. Decoration-only animation gets cut.
- **Respect the user.** Honor `prefers-reduced-motion` — disable or soften
  animation for those who ask for it.
- **Micro-interactions matter.** Buttons, links, and inputs respond to hover/
  focus/press with small, consistent feedback. Consistency across components
  is what reads as "crafted."
- **Never block content.** Animation can't delay reading or interaction. No
  bouncing, spinning, or attention-grabbing loops.

**Reject if:** big slow flashy entrances, everything animating at once, or
motion with no off-switch.

---

## 07 — Mobile that's designed, not shrunk

Most traffic is mobile. A desktop layout crammed into a phone is the clearest
"we didn't really try" signal.

- **Design the mobile layout deliberately.** It's a different composition, not
  the desktop one scaled down. Reflow, reorder, and resize for the small
  screen on its own terms.
- **Touch targets ≥ 44×44px** with adequate spacing. No tap-roulette.
- **Readable without zoom.** Body text stays 16px+ (also prevents iOS input
  zoom), line lengths stay comfortable, nothing requires horizontal scroll.
- **Mobile-appropriate navigation.** A real menu pattern, reachable controls,
  no hover-only interactions (there is no hover on touch).
- **Test the real thing.** Check actual breakpoints and a real device/emulator,
  including safe areas (notches, home indicators) for PWA/standalone.

**Reject if:** horizontal scroll, tiny tap targets, hover-dependent features, or
a layout that's obviously the desktop one squeezed.

---

## 08 — The invisible expensive stuff

The things no one points to but everyone feels. Their absence is what makes a
site feel cheap even when it "looks fine."

- **Performance.** Fast load, good Core Web Vitals (LCP, CLS, INP). No layout
  shift as things load. Speed is perceived as quality.
- **Favicon, social/OG tags, and metadata.** Proper title, description, and
  link-preview image. A missing favicon or broken share card is a tell.
- **Accessibility baseline.** Semantic HTML, keyboard navigability, visible
  focus states, alt text, sensible labels. Polish and inclusion overlap.
- **Every state is designed.** Hover, focus, active, disabled, loading, empty,
  and error states all exist and look intentional — not just the happy path.
- **No broken seams.** No console errors, no 404s, no dead links, no jank on
  resize, correct behavior on refresh and back-button.
- **Consistency everywhere.** Same button looks/behaves the same on every page;
  spacing, radii, and shadows come from the same tokens throughout.

**Reject if:** any unhandled state, console errors, missing metadata/favicon,
layout shift on load, or inconsistent components across pages.

---

## How to use this skill

1. **Before building** — define the page's point of view (01) and lock the
   tokens: type scale (02), color ramp (03), spacing scale (04).
2. **While building** — keep 02–07 open; each new section gets checked against
   them as you go.
3. **Before "done"** — run the full eight-point pass, especially 08. If any
   "Reject if" applies, it's not done.

A page passes only when **all eight** pass. One weak link is what separates a
$10K site from a free template.
