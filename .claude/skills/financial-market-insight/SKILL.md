---
name: financial-market-insight
description: >
  Turn a VEM Financial Market Insight PDF newsletter into a published-ready
  draft article on the site. Use this whenever the user drops in a Financial
  Market Insight PDF, or says "add this insight," "publish this newsletter,"
  or "turn this PDF into an insight article." Extracts title/date/summary,
  requires user-supplied chart images (never fabricates or regenerates
  charts), copies body text verbatim from the PDF (never paraphrases), writes
  `content/insights/YYYY-MM-DD-slug.md` defaulting to `status: draft` (the
  compliance/CCO sign-off gate is mandatory for financial content — never
  bypass it), runs `build_content.py`, and reports the draft preview URL for
  review.
---

# Financial Market Insight publishing

Turns a VEM Financial Market Insight PDF into a draft article through the
site's existing `content/insights/*.md` → `build_content.py` pipeline
(documented in `CLAUDE.md`). This is financial content reviewed by the firm's
CCO before it can go live — the draft/compliance gate is not optional.

Model/effort note (informational — skills can't set this themselves): the
user has said Sonnet 5 at medium effort is sufficient for this skill's
extraction/transcription work.

## Hard rules

- **Never fabricate or regenerate a chart.** Chart/figure images must come
  from the user. If a referenced chart isn't already in `assets/img/insights/`
  and hasn't been supplied, stop and ask for it — do not proceed with a
  placeholder or an AI-recreated chart.
- **Copy body text verbatim from the PDF.** No paraphrasing, no summarizing
  of the analysis itself. The published article must match the source PDF's
  wording exactly.
- **Default to `status: draft`.** Only a human (CCO sign-off) flips it to
  `published`. Never set `status: published` on this skill's own initiative.
- **Never guess a date, title, or figure.** Present extracted values back to
  the user for confirmation before writing the `.md` file.

## Procedure

1. **Locate the PDF.** If not already attached/provided, ask for it. Copy it
   into `assets/docs/VEM-Financial-Market-Insight-<YYYY-MM-DD>.pdf`, matching
   the naming convention of existing files in that folder.
2. **Extract and confirm metadata** before writing anything:
   - `date` — from the filename/PDF content (format `YYYY-MM-DD`).
   - `slug` — `financial-market-insight-<date>`.
   - `title` — pattern used by existing articles: `"Financial Market Insight —
     <Month D, YYYY>"`.
   - `summary` — a 1–3 sentence summary of the newsletter's contents.
   Show these back to the user and get confirmation before proceeding.
3. **Resolve chart images.** Identify every chart/figure the PDF references.
   Check `assets/img/insights/` for a matching user-supplied image (existing
   naming pattern: `fmi-<date>-<name>.png`). If any are missing, stop here and
   ask the user to supply them — do not continue past this step with a gap.
4. **Write the Markdown body.** Copy the PDF's body text verbatim (headings →
   `##`/`###`), placing chart images with the same `<figure><img
   src="...">/<figcaption>` pattern used in existing insight `.md` files.
5. **Write the front-matter** at `content/insights/<date>-<slug>.md`:
   ```yaml
   title: "..."
   slug: "<slug>"
   date: <date>
   author: "Vann Equity Management"
   category: "Financial Market Insight"
   hero: assets/img/insights/insights-hero-<date>.jpg
   pdf: assets/docs/VEM-Financial-Market-Insight-<date>.pdf
   status: draft
   summary: "..."
   ```
   Only add a `disclosure:` override if this newsletter's legal/copyright
   footer differs from the section default in `build_content.py` — copy that
   text verbatim from the PDF too (see the existing 2025-07-15 article for the
   expected format).
6. **Build.** Run `python build_content.py --validate` from the site root.
7. **Report back**: the draft preview URL (`/insights/<slug>.html` — reachable
   only by direct link while `status: draft`, excluded from the listing and
   sitemap by design) and a reminder that it needs CCO sign-off (flip
   `status: published` in the `.md`, then re-run the build) before it goes
   live.
