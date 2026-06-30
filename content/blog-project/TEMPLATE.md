---
title: "Your Post Title in Title Case"
slug: "kebab-case-url-slug-no-dates"
date: 2026-06-30
author: "Vann Equity Management"
category: "Market Commentary"
hero: assets/img/blog/your-hero-image.jpg
status: draft
summary: "One or two sentences (~150-300 chars): the meta description, listing-card blurb, and share text. End educational pieces with: educational only, not a recommendation."
# disclosure: (OPTIONAL for blog; REQUIRED verbatim for Insights — see COMPLIANCE-GUARDRAILS.md)
---

## First Section Heading

Body starts at H2 (`##`). The H1 title comes from the front-matter — never write
an H1 here. Use three or more `##` sections to auto-generate the table of contents.

Plain Markdown: paragraphs, **bold**, *italic*, `- ` bullets, `1.` numbered
lists, `>` blockquotes. Use straight quotes ' " and `---` for em dashes (the
build converts them). Do NOT hand-write the TOC, the by-line, or the disclosures
block — the build adds those.

## Second Section Heading

Content...

## Third Section Heading

Content...

<!--
FIELD QUICK-REFERENCE (this file is named TEMPLATE.md and lives outside the
build scan paths, so it never publishes):
  title     Required, quoted, Title Case.
  slug      Required, kebab-case, no dates -> /blog/<slug>.html
  date      Required, YYYY-MM-DD (no quotes).
  author    Default "Vann Equity Management".
  category  Blog: "Market Commentary"  |  Insights: "Financial Market Insight"
  hero      Optional image under assets/img/. Ideally with .webp + -mobile.jpg.
  pdf       Optional (Insights), path under assets/docs/ -> gold download button.
  status    draft (default; banner + noindex + hidden) | published (live).
  summary   Required. Meta description / card blurb / share text.
  read_time Optional integer; omit to auto-estimate.
  disclosure  Optional override (blog) / required verbatim (Insights).
Run the post through COMPLIANCE-GUARDRAILS.md before saving.
-->
