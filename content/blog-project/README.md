# VEM Blog Project

The in-house workspace for producing Vann Equity Management blog posts and
Financial Market Insights. Everything needed to take a post from idea to live
page lives in this folder. No external authoring tool required.

This folder is internal only: it sits outside the `build_content.py` scan paths
(`content/blog/`, `content/insights/`), and `content/` is excluded from the
public Vercel deployment, so nothing here is ever published.

## Files in this project
- `TEMPLATE.md` — the fill-in skeleton for a single post (front-matter + body).
- `COMPLIANCE-GUARDRAILS.md` — the SEC + FINRA checklist every post must pass.
- `IMAGE-PROMPT-GUIDE.md` — house image style + a per-post prompt formula.

## Roles
- **Eric:** supplies the research, facts, figures, and source links; reviews;
  generates the hero image from the supplied prompt; handles publish/sign-off.
- **Claude:** drafts the post in VEM voice, applies the compliance guardrails,
  outputs the ready-to-drop `.md`, and writes the matching image prompt.

## Workflow (idea -> live)
1. **Research (Eric).** Gather the topic, key points, any data/figures, and
   source links. Hand them to Claude. Note: do NOT include VEM performance or
   GIPS figures without CCO sign-off (see guardrails).
2. **Draft (Claude).** Claude writes the post per `TEMPLATE.md`, runs it through
   `COMPLIANCE-GUARDRAILS.md`, and returns a single `.md` file with
   `status: draft`.
3. **Image (Eric).** Claude also returns a hero-image prompt built from
   `IMAGE-PROMPT-GUIDE.md`. Eric generates the image and hands it back. (Claude
   can also generate it here if preferred.)
4. **Place the image.** Save the web-optimized image into
   `assets/img/blog/<name>.jpg` (+ `.webp` + `-mobile.jpg` if available) and set
   the `hero:` field to that path.
5. **Save the post.** Drop the `.md` into `content/blog/YYYY-MM-DD-slug.md`
   (or `content/insights/...`).
6. **Build.** `python build_content.py --validate` (must report 0 HTML5 errors).
   The article page, listing card, count, JSON-LD, and sitemap update themselves.
7. **Preview + push.** It's a draft (banner + hidden from listing). Commit + push
   to master; Vercel deploys in ~30s. Review the draft URL.
8. **Publish (sign-off).** When approved, flip `status: draft` -> `published`
   and push again. That commit is the compliance sign-off record.

## Guardrail principle
Every post is built as a **draft** first and stays a draft until a human approves
it. The system makes publishing a deliberate, recorded act — not an accident.
