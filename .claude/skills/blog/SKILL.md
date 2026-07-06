---
name: blog
description: >
  Draft a new VEM blog post from a topic, outline, or draft text. Use this
  whenever the user asks to write a blog post, draft an article for /blog, or
  says "add a blog post about X." Writes `content/blog/YYYY-MM-DD-slug.md`
  with correct front-matter, defaults to `status: draft` unless the user
  explicitly says to publish, runs `build_content.py`, and reports the
  result/preview URL.
---

# Blog post authoring

Turns a topic or draft into a new post through the site's existing
`content/blog/*.md` → `build_content.py` pipeline (documented in
`CLAUDE.md`), following VEM's brand voice: confident, plain, precise — no
hype, no exclamation points, no buzzwords.

## Procedure

1. **Gather inputs**: topic/draft text, working title, date (default today),
   author (default `"Vann Equity Management"`), and a short summary if one
   isn't obvious from the draft.
2. **Derive the slug** the same way `build_content.py` does (lowercase,
   hyphenated) and check `content/blog/` for a filename collision before
   writing.
3. **Draft the body** in VEM voice, Markdown with `##` H2 sections (the
   article template auto-generates a table of contents once there are 3 or
   more).
4. **Decide `status`**: default to `draft` unless the user has explicitly said
   to publish or make it live now. If it's ambiguous, ask rather than assume.
5. **Resolve the hero image**: ask the user for one rather than inventing a
   path to a file that doesn't exist.
6. **Write the front-matter** at `content/blog/<date>-<slug>.md`:
   ```yaml
   title: "..."
   slug: "<slug>"
   date: <date>
   author: "Vann Equity Management"
   category: "Blog"
   hero: assets/img/...
   status: draft
   summary: "..."
   ```
7. **Build.** Run `python build_content.py --validate` from the site root.
8. **Report back**: if `status: draft`, the direct-link preview URL (excluded
   from the listing/sitemap by design until published); if `status:
   published`, confirm it now appears on `/blog/` and in `sitemap.xml`.
