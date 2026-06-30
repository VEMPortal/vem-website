---
title: "Your Post Title in Title Case"
slug: "kebab-case-url-slug-no-dates"
date: 2026-06-30
author: "Vann Equity Management"
category: "Market Commentary"
hero: assets/img/blog/your-hero-image.jpg
status: draft
summary: "One or two sentences (~150–300 chars) used as the meta description, the listing-card blurb, and the social share text. End educational pieces with: educational only, not a recommendation."
# disclosure: (OPTIONAL — see notes below)
---

## First Section Heading

Body starts at H2 (`##`). The H1 title comes from the front-matter above — never write an H1 here. Use three or more `##` sections to auto-generate the "On this page" table of contents.

Write normal Markdown: paragraphs, **bold**, *italic*, and:

- bullet lists
- like this

1. or numbered lists
2. like this

Use plain straight quotes ' and " and three hyphens --- for an em dash; the build converts them to typographic punctuation automatically. Do not hand-write the table of contents or the disclosures block — the build adds both.

## Second Section Heading

Content...

## Third Section Heading

Content...

<!--
=============================================================================
AUTHORING NOTES — delete this whole comment block before saving, or just leave
it; the build ignores HTML comments. This file is named _TEMPLATE.md; files
starting with "_" are skipped by build_content.py, so this never publishes.
=============================================================================

WHERE TO SAVE A REAL POST
  Blog post      -> content/blog/YYYY-MM-DD-slug.md
  Insight post   -> content/insights/YYYY-MM-DD-slug.md
  (The filename's date is just for ordering on disk. The URL is built from the
   `slug:` field, so keep `slug` clean and date-free.)

FRONT-MATTER FIELDS
  title     Required. Quoted. Title Case.
  slug      Required. kebab-case, no dates. Becomes /blog/<slug>.html.
  date      Required. YYYY-MM-DD (no quotes).
  author    Default "Vann Equity Management". A personal name renders as a Person.
  category  Blog:     "Market Commentary" (or "Blog")
            Insights: "Financial Market Insight"
  hero      Optional image path under assets/img/. For best results the matching
            <name>.webp and <name>-mobile.jpg should also exist next to it.
            Omit it and a branded placeholder is used.
  pdf       Optional (mainly Insights). Path under assets/docs/ — renders a gold
            "Download this report (PDF)" button. e.g. assets/docs/VEM-...-.pdf
  status    draft  -> builds with a "Draft preview" banner + noindex, and is
                      HIDDEN from the listing and sitemap. Use this for every
                      new post until the CCO signs off.
            published -> goes live on the listing + sitemap. The git commit that
                      flips draft->published IS the compliance sign-off record.
  summary   Required. The meta description / card blurb / share text.
  read_time Optional integer. Omit to let the build estimate from word count.
  disclosure  Optional override (see below).

DISCLOSURES (IMPORTANT — compliance)
  BLOG posts: if you omit `disclosure:`, a standard educational blog disclosure
  is applied automatically. Only add a `disclosure:` field if THIS post needs
  custom language (e.g. naming specific companies). Use a YAML block scalar:

      disclosure: >
        Full verbatim disclosure text here, wrapped across
        as many lines as you like.

  INSIGHTS posts: there is NO automatic section disclosure, so a Financial
  Market Insight should ALWAYS include the newsletter copyright disclosure
  verbatim in a `disclosure:` field (copy it from a previous insight).

COMPLIANCE HARD RULES
  - Start every post as status: draft. Only the CCO/firm flips to published.
  - Never include performance, GIPS, or return figures in a post without
    sign-off. Numbers on the site must match the audited source exactly.

BUILD + PUBLISH
  1. Save the .md into content/blog/ or content/insights/
  2. Run:  python build_content.py --validate     (must report 0 HTML5 errors)
  3. Commit + push to master -> Vercel auto-deploys in ~30s.
-->
