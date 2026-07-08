---
name: launch-day
description: >
  The complete go-live checklist for the Vann Equity Management (VEM) website.
  Use this whenever the user is preparing to launch, go public, "flip the
  switch," ship to production, take the site live, or asks "are we ready to
  launch?" / "what's left before launch?" / "is everything ready for go-live?".
  Covers the crawlability swap (robots.txt), sitemap, custom domain + HTTPS,
  redirects, the contact form endpoint, analytics, and the compliance (CCO)
  sign-off gate. Run this BEFORE flipping the site public, and again right AFTER,
  so nothing critical is missed. Trigger it even if the user only mentions one
  piece (e.g. "swap the robots file" or "submit the sitemap") — the point is to
  catch the rest of the launch steps they may have forgotten.
---

# VEM Launch Day

This skill turns "going live" from a memory test into a repeatable checklist. The
VEM site is a static site deployed on Vercel and served from
`https://www.vannequitymanagement.com`. It has been built in **preview mode** —
deliberately invisible to search engines until the firm's CCO signs off. Launch
is the act of *carefully* removing that invisibility and confirming the public
experience works end-to-end.

The single most important fact: **the live `robots.txt` currently says
`Disallow: /`, which blocks the entire site from Google.** Almost everything else
is verification; this one swap is the actual launch. Do not do it until Phase 0
clears.

## How to use this skill

Work the phases in order. Phase 0 is a human gate — do not skip it or rush it.
Phase 1 runs the bundled script to get an objective snapshot. Phases 2–6 are the
actions, with the script re-run at the end to confirm.

The site lives at: `C:\Users\alpha\vem-site-link` (a directory junction —
follow it, it resolves to the real checkout). The user has reorganized the
Desktop before, so if that path 404s, search `Desktop\**\vem web sight v001`
rather than assuming the old bare-Desktop path still works. Most checks assume
this path; pass it explicitly when running the script.

---

## Phase 0 — Compliance gate (HUMAN sign-off, do not automate)

The entire preview-mode design exists because a registered investment advisor's
public site is a regulated marketing document. Going live without sign-off is a
compliance problem, not just a technical one. Confirm with the user, out loud,
each of these before touching anything:

- **CCO has signed off** on the site going public. This is the gate the
  `robots.txt` preview comment refers to. If the answer is "not yet," stop here —
  nothing else should happen.
- **`gips-report.html` decision.** It is intentionally `noindex` pending CCO
  approval of the GIPS composite. Either it stays `noindex` (leave as-is) or the
  CCO has approved it — in which case remove the `noindex` meta AND add it to
  `sitemap.xml`. Never do one without the other.
- **Draft/pending content.** `insights/draft-example-pending-review.html` is the
  compliance-gate example (a `draft` that is `noindex`). Confirm it's meant to
  ship as-is or be removed. Don't let a placeholder draft go live by accident.

Only when all three are explicitly confirmed do you proceed.

## Phase 1 — Run the verification script (objective snapshot)

Run the bundled script to get a pass/fail report on every mechanical check. It is
read-only — it inspects files, it never changes them.

```powershell
& "<skill-dir>/scripts/verify-launch.ps1" -SitePath "C:\Users\alpha\vem-site-link"
```

For the deeper code/GEO layer (JSON validation, CSS integrity, JSON-LD, AI
crawler policy, llms.txt, site mapping), also run the global `site-code-check`
skill's scanner alongside this script:

```
python "C:\Users\alpha\.claude\skills\site-code-check\scripts\site_check.py" "C:\Users\alpha\vem-site-link" --base-url https://www.vannequitymanagement.com
```

Read its output with the user. It reports the robots mode, sitemap/noindex
consistency, broken links, `.vercelignore` coverage, the contact-form endpoint,
and analytics presence. Treat every `FAIL` as a blocker and every `WARN` as a
"confirm this is intentional." The most important line is **ROBOTS MODE** — it
tells you whether the site is still in preview (blocked) or production (crawlable).

## Phase 2 — The crawlability swap (THE launch action)

This is the moment the site becomes visible. The production rules live in
`robots.production.txt` (which welcomes Google + AI crawlers). The swap is to make
the *served* `robots.txt` contain those production rules.

Important: `robots.production.txt` is listed in `.vercelignore`, so it is **never
served** — it's a source-of-truth file. "Swapping" therefore means copying its
*contents* into `robots.txt` (not renaming, which would just un-ignore it).

```powershell
$site = "C:\Users\alpha\vem-site-link"
Copy-Item (Join-Path $site "robots.production.txt") (Join-Path $site "robots.txt") -Force
```

Then re-run the Phase 1 script and confirm **ROBOTS MODE: PRODUCTION**. The live
`robots.txt` must no longer contain `Disallow: /`. This is the single check that,
if wrong, makes the whole launch a no-op.

## Phase 3 — Deploy, domain & redirects

The crawlability swap only matters once it's deployed and the domain resolves.

- **Deploy** the change (git push → Vercel auto-deploys, per the project's normal
  flow). Confirm the deployment succeeded before announcing launch.
- **Custom domain**: confirm `www.vannequitymanagement.com` is attached in Vercel
  and serves with a valid HTTPS certificate (no browser warning).
- **Apex → www** (or chosen canonical) redirect works: visiting the bare domain
  lands on the canonical host that matches `sitemap.xml` (`https://www.…`).
- **Spot-check `vercel.json` redirects.** The file defines many legacy-URL
  redirects (e.g. `/contact` → `/contact.html`, old `/2024/..` blog paths →
  `/blog/`). Test 2–3 live to confirm they 301 correctly — broken redirects lose
  the SEO equity they were built to preserve.

## Phase 4 — Contact form & analytics

The site's whole purpose is converting visitors into consultations, so the form
and tracking must actually work on the live domain.

- **Contact form endpoint.** `contact.html`'s form (`#consultForm`) has a
  `data-endpoint` attribute. If it's **empty**, submissions fall back to the
  `data-fallback-email` (`info@vannequitymanagement.com`) at best, or silently do
  nothing at worst. Before launch, either wire the real endpoint or explicitly
  confirm the fallback path delivers. Then **send a live test submission** and
  verify it arrives.
- **Analytics.** As of this writing the site ships with **no analytics at all**
  (no GA4, no Microsoft Clarity, no Plausible). A launch you can't measure is a
  launch you can't learn from, so decide *before* go-live whether to add a
  tracker. If one is added, confirm it loads on production and records sessions;
  the Phase 1 script will then report it under "Analytics detected." If launching
  intentionally without analytics, note that so the WARN isn't mistaken for an
  oversight.

## Phase 5 — Go live, then verify from the outside

Once deployed and crawlable, verify the site as a search engine sees it.

- **Fetch the live `robots.txt`** (`https://www.vannequitymanagement.com/robots.txt`)
  and confirm it shows the production (Allow) rules, not `Disallow: /`.
- **Fetch the live `sitemap.xml`** and confirm it loads and lists the indexable
  pages.
- **Google Search Console**: add/verify the property, **submit `sitemap.xml`**,
  and request indexing of the homepage. (Human step — you can't do this for them;
  walk them through it.)
- **Smoke test** the live site: homepage, one blog post, one insight, the contact
  page, and a couple of `vercel.json` redirects all load without errors.

## Phase 5b — Post-launch 404 monitoring (first weeks)

The Phase 1 script's internal-link check only catches broken links *within*
the built site — it can't predict which old bookmarked or Google-indexed URLs
from the previous WordPress/GHL site will get hit after cutover. That's a
separate, ongoing job, not a one-time launch check:

- Log into the WordPress admin backend — the `wp.vannequitymanagement.com`
  install where DNS historically lived. Per the DNS cutover plan, this
  install stays live post-cutover (only `A @` and `CNAME www` move to Vercel),
  so its admin panel and plugins remain reachable.
- **Tools → Redirection → 404s tab.** This logs every real visitor/crawler hit
  to a URL that doesn't resolve. Check it on a schedule: daily for the first
  week after go-live, then weekly for the first month. Traffic to stale URLs
  tends to taper off but rarely stops immediately (old backlinks, cached
  search results, bookmarks).
- For each logged 404 that maps to real migrated content, add a redirect —
  either directly in the Redirection plugin, or mirror it into `vercel.json`
  if the static site should own the canonical redirect table going forward.
  Either location works; duplicating the rule in both isn't harmful.
- This step is complementary to, not a replacement for, the Phase 1
  internal-link check: Phase 1 catches broken links *inside* the new site
  before launch; this catches broken *inbound* links from the outside world
  after launch. Claude has no API/login access to the WordPress admin or its
  plugins, so this specific check is a human step — walk the user through it
  rather than trying to automate it.

## Phase 6 — Final report

Summarize for the user: what passed, what was changed (the robots swap), what
still needs a human (GSC submission, CCO confirmations, Phase 5b's WordPress
404-log schedule), and the live URLs to spot-check. End with an explicit
**"GO" or "NO-GO"** call based on whether any Phase-0 gate or Phase-1 `FAIL`
is unresolved.

---

## Reference: what "good" looks like

- `robots.txt` served content == `robots.production.txt` content (Allow rules).
- `sitemap.xml` contains every indexable page and **no** `noindex` page.
- `.vercelignore` excludes build-only files (`templates/`, `content/`, `*.md`,
  `hero/`, `build_content.py`, `robots.production.txt`) so they never get served.
- No broken internal links.
- Contact form `data-endpoint` is set (or fallback confirmed working).
- Analytics firing on production.
- CCO sign-off on record.
- WordPress Redirection 404 log checked on a schedule for the first few weeks
  post-launch (daily → weekly), with any real stale-URL hits redirected.

If the user wants to re-audit at any time, the Phase 1 script is safe to run
repeatedly — it changes nothing.
