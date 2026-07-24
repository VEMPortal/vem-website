---
name: blog
description: >
  Publish a VEM blog post through this repo's `content/blog/*.md` →
  `build_content.py` pipeline. Use when the user asks to write, add, build,
  or publish a blog post while working in the VEM site repo. Handles the
  parts that only exist here: the build script, hero-image variants and
  overlay CSS, the cache constant, the draft/preview flow, and the Marketing
  Record. Writing craft, research, and the self-review pass belong to the
  global `blog-post` skill — this skill uses it rather than repeating it.
---

# VEM blog — site pipeline

This skill owns the **site-repo half** of a blog post: building it,
previewing it, publishing it, and recording it.

The **writing half** — research, drafting, voice, titles, the self-review
pass, and the SEC Marketing Rule content rules — lives in the global
`blog-post` skill (`~/.claude/skills/blog-post/`). Use it. Don't restate its
rules here; if guidance conflicts, the global skill is canonical for craft
and content compliance, and this file is canonical for anything touching
this repo's files.

That split exists so a post drafted in Cowork and a post drafted here come
out identical, and so a fix to the writing rules only has to happen once.

## Procedure

1. **Draft it with the global `blog-post` skill.** That covers gathering
   inputs, two-pass research, drafting in VEM voice, title options, hero
   concept, front matter, and the self-review report. It writes
   `content/blog/YYYY-MM-DD-slug.md` with `status: draft`.

   If the draft already exists (written in Cowork and handed over), skip to
   step 2 — but still run the global skill's
   `references/pre-publish-checklist.md` against it before building. A draft
   arriving from elsewhere has not necessarily been self-reviewed.

2. **Place the hero image.** `assets/img/blog/blog-hero-<date>.jpg` plus a
   `.webp` sibling and a `-mobile.jpg` portrait crop. `hero_media()` in
   `build_content.py` auto-detects the siblings — no HTML edits needed. Keep
   heroes optimized: the desktop `.webp` should land well under ~250KB.

3. **Build.** `python build_content.py --validate` from the site root.
   Expect 0 HTML errors. Confirm the post shows in the draft count.

4. **Check the hero overlay** — see below. Bright or oddly-composed images
   frequently need a per-post override.

5. **Report the preview URL.** While `status: draft`, the page is reachable
   by direct link only and is excluded from `/blog/` and `sitemap.xml` by
   design. For outside review (compliance), put it on a
   `review/<descriptive-slug>` branch, staging **only** the files for that
   post — never sweep in unrelated cache-bump diffs across dozens of pages.

6. **Publish only on explicit instruction.** Flip `status: published`,
   rebuild, merge, push. Per the standing rule: when Eric says "push it,"
   verbal compliance approval is already in hand — don't re-ask. Never set
   `published` on this skill's own initiative.

7. **Create the Marketing Record once live.** This is an SEC recordkeeping
   requirement, not optional paperwork: what went out, when, who approved
   it, and where its sources came from. Capture the live screenshot from
   production, not from a preview URL.

   **Compliance lives OUTSIDE this repo — deliberately.** The record
   generator and every record it produces are stored locally only, in the
   OneDrive compliance folder:
   `Desktop\VEM- compliance-docs-social posts, blogs, financial market
   insights\` — `_scripts\` holds `fill_marketing_records.py` and
   `generate_marketing_record.py`; the `.docx` records and screenshots sit
   in the per-type folders alongside it. This repo deploys to a **public**
   website, so nothing containing reviewer names, approval logs, or internal
   compliance analysis may ever be committed here. Run the generator from
   that OneDrive `_scripts\` folder, never from the site repo.

## Hero overlay tuning

The article hero has a dark scrim over the image (`.report-hero__scrim` in
`css/blog.css`) so white title text stays readable on any photo. That
default is tuned for a typically-dark image. Two things to check whenever a
hero is notably bright, or has its subject concentrated in one part of the
frame:

- **Overlay strength.** If the image should stay bright, or the scrim is
  visibly washing out a naturally light photo, add a per-post override
  scoped to `body.post-<slug> .report-hero__scrim` with lower alpha values.
  Copy the gradient direction and shape from an existing per-post override
  in `blog.css` — only soften the opacity numbers. Keep enough darkening on
  the side the title sits over.

- **Crop position.** The hero uses `object-fit: cover`, which center-crops.
  If the image has empty space (sky, background) in one area and the actual
  subject (skyline, main content) in another, a center crop can cut the
  subject off depending on viewport. Add:

  ```css
  body.post-<slug> .report-hero__media img { object-position: center bottom; }
  ```

- **Bump `CACHE` in `build_content.py` after any `blog.css` edit.** It's a
  manually incremented constant, not automatic — skip it and the new CSS
  silently won't apply for anyone with a warm cache.

- When commissioning a *new* hero it is cheaper to ask for a composition
  that fills the frame edge-to-edge than to correct a bad crop with CSS
  afterward. Mention that before the image is generated, not after.

## What lives where

| Concern | Owner |
|---|---|
| Research, drafting, voice, titles | global `blog-post` |
| Self-review + pre-publish checklist | global `blog-post` |
| Marketing Rule content rules, disclosure text | global `blog-post` → `references/vem-house-rules.md` |
| Compliance risk flagging | `vem-marketing-compliance` |
| Build, validate, cache, overlay CSS, paths | **this skill** |
| Draft/preview branches, publish, push | **this skill** |
| Marketing Record | **this skill** → `scripts/MARKETING_RECORD_WORKFLOW.md` |
