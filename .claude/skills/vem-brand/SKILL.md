---
name: vem-brand
description: Vann Equity Management (VEM) brand system — official color palette, logo variants and their usage rules, and typography/voice guidance. Use this whenever building, styling, reviewing, or improving any VEM web page, PWA, header, footer, or UI element, or whenever choosing colors, logos, or fonts for VEM. Pairs with the ten-k-checklist skill (this defines the brand; that defines the quality bar).
---

# Vann Equity Management — Brand System

Institutional, restrained, and trustworthy. VEM should read as a serious equity
management firm: deep navy and muted gold, generous white space, never loud.
When in doubt, dial it down.

This skill defines the brand. Apply it **together with** [`ten-k-checklist`]
— that skill sets the quality bar (principle 03 "restrained color system" and
02 "typography" are governed by the tokens below).

---

## Color palette

| Role | Name | Hex | Notes |
|------|------|-----|-------|
| **Primary Blue** | Deep royal navy | `#223168` | Core brand blue — headings, primary UI, brand surfaces |
| **Primary Gold** | Muted institutional gold | `#B99B5F` | The single accent. Sparingly: key actions, rules, highlights |
| **Secondary Navy** | Dark navy | `#0B1F44` | Darker grounding — header/footer fills, hero backgrounds, depth |
| **Secondary White** | White | `#FFFFFF` | Primary background and text on dark |
| **Secondary Gray** | Light gray | `#E5E6E8` | Dividers, card fills, subtle backgrounds, disabled states |

### Tokens (drop into `:root`)

```css
:root {
  --vem-navy:        #223168; /* primary blue   */
  --vem-gold:        #B99B5F; /* primary accent  */
  --vem-navy-dark:   #0B1F44; /* secondary navy  */
  --vem-white:       #FFFFFF;
  --vem-gray:        #E5E6E8;

  /* Suggested derived neutrals (tune, don't invent new hues) */
  --vem-ink:         #0B1F44; /* body text on light = secondary navy */
  --vem-gray-text:   #5B6172; /* muted captions/labels */
}
```

### Usage rules (color)

- **Gold is the only accent, and it is rationed.** Primary buttons, active
  states, thin rules/underlines, and a few intentional highlights. If more than
  a small fraction of a screen is gold, remove some.
- **Navy leads; dark navy grounds.** Use `#223168` as the brand blue and
  `#0B1F44` for the heavier fills (header bar fill, footer, hero) so layered
  navy surfaces have depth.
- **Most of the page is white and gray.** Light gray (`#E5E6E8`) for dividers,
  card backgrounds, and quiet sections — not as a text color.
- **Contrast:** body text is navy on white or white on navy (both pass AA).
  Gold on white is **decorative only** — it does NOT pass AA for body text, so
  never set paragraph copy in gold. Gold on dark navy is fine for small accents.
- **No new colors.** Everything traces back to the five above (or a tuned
  neutral derived from them). No stray blues, no second accent.

---

## Logo

Source mark: a navy/gold **"V" icon** plus the **"Vann Equity Management"**
wordmark lockup. Four committed variants live in [`/brand`](../../brand):

| Variant | File | When to use |
|---------|------|-------------|
| White icon | `brand/vann-icon-white.png` | **See-through / overlay header** over navy or imagery; compact dark-background spots |
| Navy icon | `brand/vann-icon-navy.png` | Favicon, compact marks on light backgrounds |
| Full lockup — navy | `brand/vann-lockup-navy.png` | Solid white / light backgrounds (footer, light pages) |
| Full lockup — white | `brand/vann-lockup-white.png` | Dark / navy backgrounds, hero overlays |

> If a file above is missing, the asset hasn't been dropped in yet — ask for it
> rather than substituting or recoloring another variant.

### Usage rules (logo)

- **Pick the variant that matches the background; never recolor on the fly.**
  White logo on navy/dark or over imagery; navy logo on white/light.
- **The white icon is the default for the transparent header bar** — that's its
  primary job. It sits over a navy hero or a translucent navy bar.
- **Clear space:** keep padding around the logo at least the width of the "V"
  mark on all sides. Don't crowd it with nav links or text.
- **Don't:** stretch, skew, rotate, add shadows/glows, place the navy logo on
  navy, the white logo on white, or busy imagery without a scrim.
- **Minimum size:** keep the wordmark legible — if "Vann Equity Management"
  starts to break down, switch to the icon-only mark instead.

### Transparent header pattern

```css
.site-header {
  position: fixed; inset: 0 0 auto 0;
  background: transparent;              /* over the navy hero */
  /* once scrolled past hero, swap to a translucent navy bar: */
}
.site-header.scrolled {
  background: rgba(11, 31, 68, 0.85);   /* --vem-navy-dark @ 85% */
  backdrop-filter: blur(8px);
}
.site-header .logo { height: 32px; }     /* white icon/lockup here */
```

---

## Typography

VEM is a serif-forward, institutional brand.

- **Logo / wordmark:** **Cinzel** — the official VEM logo font. A classical,
  engraved-capital serif. Reserve Cinzel for the logo lockup and, sparingly,
  marquee display headings (it is all-caps by nature and not for body or long
  headings). Available via Google Fonts.
- **Headings / display:** Cinzel for hero/marquee titles; for everyday section
  headings use a refined transitional serif that sits comfortably beside it
  (e.g. Cormorant, EB Garamond) so Cinzel stays special. Tight tracking on
  large sizes.
- **Body / UI:** a clean, highly legible sans (humanist grotesque) for
  paragraphs, labels, and controls.
- **Two text faces max** beyond the Cinzel logo accent. Use weights, not extra
  families, for variety.
- **Numbers:** tabular figures for any financial data, tables, or figures.
- Follow the `ten-k-checklist` type rules for scale, measure, and leading.

---

## Voice & tone

- Confident, plain, and precise — the way a trusted advisor speaks. No hype, no
  exclamation points, no buzzwords.
- Short, declarative sentences. Specific over generic.
- "Institutional gold, not casino gold" — restraint is the whole personality.

---

## Quick reference

- Accent: **gold `#B99B5F`**, used sparingly.
- Brand blue: **navy `#223168`**; grounding fill: **dark navy `#0B1F44`**.
- Backgrounds: **white**, dividers/quiet fills: **gray `#E5E6E8`**.
- Header: transparent → translucent dark-navy on scroll; **white icon**.
- Logo: match variant to background; never recolor or distort.
- Logo font: **Cinzel** (logo + marquee display only — never body).
- Don't introduce colors or fonts outside this system.
