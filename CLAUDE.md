# VEM Marketing Site — Build Playbook

Read this first in any new session. It captures how this site is built so work stays
consistent without depending on chat memory. Pair it with the two skills below.

## What this is
A **hand-coded** (no framework, no page builder) marketing website for **Vann Equity
Management, LLC (VEM)** — an independent, SEC-registered, GIPS-compliant fiduciary
equity firm (Plano & Austin, TX; founded 2010). Quality bar: a **$10,000 custom build**,
institutional and restrained. Plain HTML/CSS/vanilla JS, token-driven design system.

## Skills that govern this project (load them)
- **`vem-brand`** — official colors, logos, typography, voice. THE brand source of truth.
- **`ten-k-checklist`** — the 8-principle quality bar. Apply before any page is "done."

---

## Hard rules — do not break these
1. **Contact email on the marketing site is `info@vannequity.com` only.** Never put
   Aaron Vann's personal email anywhere. (Exception: legal/ADV document text may name
   the filed CCO contact — see "Compliance contacts" below.)
2. **Never touch the live site, WordPress, Elementor, custom code, or DNS/domains.**
   The real domains `www.vannequitymanagement.com` and `www.vannequity.com` redirect to
   the live site. We only ship to the **isolated Vercel preview** (URL below).
3. **The preview must stay hidden from search** — homepage + every page get
   `noindex` applied in staging, and staged `robots.txt` is `Disallow: /`. Do this in the
   STAGED COPY only; the real source files keep production SEO tags.
4. **All performance / GIPS numbers must match the audited GIPS PDF exactly.** Re-verify
   programmatically after any edit (see "Verify GIPS numbers"). Never invent a figure.
5. **Performance is presented as highlights of outperformance only** (SEC marketing-rule
   safe), never a table that buries losing periods. "Results vary by period/benchmark"
   hedge + "full data available on request."
6. **Publishing gate:** performance figures and disclosure text need CCO/Dharani sign-off
   before the site goes truly public. Preview-for-approval is fine.

---

## File / folder map
```
index.html              Homepage (rotating hero, sections, performance highlights, footer)
gips-report.html        GIPS Composite Report (8 composites, interactive Chart.js bars)
adv-part-2a.html        Form ADV Part 2A brochure (19 items, fee tables, PDF download)
css/
  tokens.css            Design tokens — SINGLE SOURCE OF TRUTH (colors, type, spacing).
                        --accent currently = blue; flip block at top to go gold.
  hero.css, sections.css, nav.css   Homepage styles
  gips.css              GIPS page + SHARED primitives (.container/.btn/.overline/
                        .report-header/.report-hero/.report-footer/.report__claim)
  adv.css               ADV page doc-body typography (loads tokens.css + gips.css too)
js/
  hero.js               Hero rotator (desktop only >760px), scrolled header, parallax
  nav.js                Dropdowns + mobile hamburger menu
  sections.js, process.js
  gips.js               Builds Chart.js bars by READING the annual tables (single source)
assets/
  brand/                Logo lockups + icons (white = on dark, navy = on light)
  img/                  Optimized web images (raw multi-MB generations are gitignored)
  docs/                 Downloadable PDFs (e.g. VEM-ADV-Part-2A.pdf, GIPS report)
content/performance.json   All 8 composites' verified GIPS numbers
robots.txt, sitemap.xml, llms.txt   SEO / AI-crawler files (domain vannequitymanagement.com)
```

---

## How to build a new page (the pattern)
New document/disclosure pages follow `gips-report.html` / `adv-part-2a.html`:
1. **Link only** `css/tokens.css` + `css/gips.css` (shared primitives) + an optional
   page-specific CSS (like `adv.css`). Don't re-import homepage CSS.
2. Structure: `<header class="report-header" id="top">` (logo + Back to home) →
   `<main class="report">` → full-bleed `<header class="report-hero">` (picture bg +
   `.report-hero__scrim` + large `.report-hero__title` + `.btn` actions) →
   `<div class="container">…content…</div>` → `<footer class="report-footer">`.
3. **Brand:** navy `--vem-navy #223168`, dark navy `--vem-navy-dark #0B1F44`, accent =
   current `--accent` (blue). Gold is rationed. Headings = Cormorant (`--font-display`);
   body = Hanken Grotesk; logo/marquee = Cinzel. Numbers use `.tnum` (tabular).
4. **Hero image:** use a `<picture>` — `(max-width:600px)` → mobile crop, then WebP, then
   JPG. Optimize first (recipe below). On-brand = deep navy architectural, gold accents,
   left negative space, no people/text.
5. **Reachability:** link the page from the homepage **Resources dropdown** (in
   `index.html` nav) and/or the **footer disclosure-docs line**. No orphan pages.
6. **SEO:** title, meta description, canonical, Open Graph, and JSON-LD when it fits.
   Production robots = `index, follow`; staging flips to `noindex` (see deploy).

## Image optimization recipe (Pillow / `python`)
Desktop 2400px wide + WebP + a portrait mobile crop (~4:5, 1100px). Target: desktop
≤ ~250 KB JPG / ≤ ~80 KB WebP, mobile ≤ ~130 KB. Raw generations go in `assets/img/` but
are gitignored (`Abstract_*.jpeg`, `Elegant_*.jpeg`). Save web versions as
`<name>.jpg/.webp` + `<name>-mobile.jpg`.

## Cache-busting
Every CSS/JS/image/PDF link carries `?v=N`. Bump on change:
`sed -i 's/?v=OLD/?v=NEW/g' <files>`. Pages can be at different N (each is internally
consistent). Current high-water mark: **v=52** (adv page). index/gips at v=50.

---

## Verify before shipping (always)
Run from project root. `python` is the one with PyMuPDF/Pillow/html5lib (not `python3`).

**HTML5 validity (must be 0 errors — refutes "AI code is broken" claims):**
```python
import html5lib
html5lib.HTMLParser(strict=True).parse(open("PAGE.html",encoding="utf-8").read())
```

**Verify GIPS numbers match the audited PDF** (every decimal on the page must exist in
the PDF — expect 0 missing). Source PDF lives in Downloads / `GIBS template project/`:
```python
import re, fitz; from collections import Counter
pdf = Counter(re.findall(r'-?\d{1,3}\.\d{2}', "".join(p.get_text() for p in fitz.open(PDF))))
htm = Counter(re.findall(r'-?\d{1,3}\.\d{2}', open("gips-report.html",encoding="utf-8").read()))
print([v for v in htm if pdf.get(v,0)<1])   # -> [] means all match
```

**Lighthouse (proof scores).** Run against the LIVE preview for Performance/Best-Practices/
Accessibility; run SEO against the LOCAL source (preview is intentionally noindex, which
tanks the SEO category — that's expected, not a bug). Target: Perf 90+, A11y 100, BP 100,
SEO 100 (production config).

---

## Local preview (for rendered checks)
A static server is preconfigured in `../vem-portal-pwa/.claude/launch.json` as **`vem-static`**,
serving THIS folder on **port 8754**. Use the Claude_Preview MCP: `preview_start` name
`vem-static`, then `preview_eval` / `preview_inspect` / `preview_resize`. Note: full-page
`preview_screenshot` can time out on the homepage (autoplaying hero video) — prefer
`preview_eval`/`preview_inspect`; other pages screenshot fine.

## Deploy (isolated preview only)
Stable preview URL Aaron uses: **https://vann-equity-management.vercel.app**
(Vercel project `vann-equity-management`, account `diesel1974`). Pure-static deploy — no
`vercel.json`. Steps:
1. Stage a clean copy to `/tmp/vem-deploy` (copy html/assets/css/js/content + robots/
   sitemap/llms). Drop the raw `Abstract_*.jpeg` / `Elegant_*.jpeg` from staged assets.
2. In the STAGED copy: flip each page's robots meta to `noindex, nofollow`, and write
   `robots.txt` = `User-agent: *\nDisallow: /`.
3. `cd /tmp/vem-deploy && rm -rf .vercel && npx vercel link --yes --project
   vann-equity-management && npx vercel deploy --prod --yes`
   (Linking each time avoids it creating a new project from the temp folder name.)
4. Verify live: curl the pages/assets for `200`, confirm robots says noindex.

## Git
Local repo (no GitHub remote yet — back up via OneDrive + zip + Vercel). Commit at clean
checkpoints with: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`. To add
GitHub later: install `gh` or create an empty repo and push.

---

## Compliance contacts (verify with firm before public)
- Marketing contact email: **info@vannequity.com** (only).
- **Open discrepancy:** the ADV page says CCO **Brandy Holder / bholder@vannequity.com**,
  but the filed May-2025 ADV PDF (the download) still says **John A. Vann /
  jvann@vannequity.com**. Page and filing must be reconciled by the firm before public
  launch — either amend/refile the ADV, or revert the page to John Vann.

## Known pending items
- Wire real links: `/news`, `/blog`, `/insights`, `/client-login`, brochure, 4 social
  profiles (add `sameAs` to homepage JSON-LD once provided). Currently placeholders.
- Optional "Coming soon" stub pages so Aaron hits no dead ends.
- Custom Higgsfield hero images (connector token kept expiring — generate in Imagen/
  Nano Banana instead; prompt style = deep navy architecture, gold accents, left
  negative space, 16:9, no people/text).
- CCO sign-off on performance + disclosures before true public launch.
