#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
VEM static content generator — Blog & Financial Market Insights.

Reads Markdown articles (YAML front-matter + body) from content/blog and
content/insights, stamps each into a branded HTML page using templates/, and
auto-builds the /blog and /insights listing pages. Output is plain static HTML;
no framework ships to the browser.

Compliance gate (SEC Marketing Rule):
  status: draft     -> page builds with noindex + a "Draft preview" banner, but
                       is EXCLUDED from the public listing and the sitemap.
  status: published -> appears on the listing + sitemap; the git commit that
                       flips it is the immutable sign-off record.

Usage:
  python build_content.py            # build everything
  python build_content.py --validate # build + HTML5-validate every output
"""

import os, re, sys, html, json, calendar, datetime
import yaml
import markdown

ROOT       = os.path.dirname(os.path.abspath(__file__))
SITE       = "https://www.vannequitymanagement.com"
CACHE      = "5"                       # asset ?v= for blog assets; bump on CSS change
YEAR       = datetime.datetime.now().year
TPL_DIR    = os.path.join(ROOT, "templates")

MD = markdown.Markdown(extensions=["extra", "sane_lists", "smarty", "toc"])

# ---- Section configuration ------------------------------------------------
SECTIONS = {
    "blog": {
        "src":       os.path.join(ROOT, "content", "blog"),
        "out":       os.path.join(ROOT, "blog"),
        "url":       "/blog/",
        "category":  "Blog",
        "title":     "Blog",
        "overline":  "Vann Equity Management",
        "hero":      "Notes on Markets &amp; <em>Discipline</em>",
        "lead":      "Perspective from our team on long-term, fiduciary equity investing "
                     "&mdash; the philosophy, the process, and the principles that guide how we manage capital.",
        "meta":      "The Vann Equity Management blog — perspective on disciplined, long-term, "
                     "fiduciary equity investing from our team.",
        "listing_hero": "assets/img/blog/blog-listing-hero.jpg",
        # Standard disclaimer applied to EVERY blog post (company-name reference
        # generalized so it is correct on any topic). A post may override it with
        # a `disclosure:` front-matter field.
        "disclosure":
            "This material is provided for informational and educational purposes only and "
            "should not be considered investment, legal, or tax advice. The information does not "
            "constitute a recommendation to buy, sell, participate in, or avoid any IPO, security, "
            "company, sector, asset class, or investment strategy. Any companies, securities, or "
            "strategies referenced are mentioned for educational market commentary only and should "
            "not be interpreted as a recommendation. Investing involves risk, including the possible "
            "loss of principal. IPOs and newly public companies may involve additional risks, "
            "including limited public operating history, valuation uncertainty, liquidity constraints, "
            "volatility, and changes in market conditions. Past performance does not guarantee future "
            "results. Vann Equity Management does not provide tax or legal advice. Investors should "
            "consult their financial, tax, or legal professional regarding their individual circumstances.",
    },
    "insights": {
        "src":       os.path.join(ROOT, "content", "insights"),
        "out":       os.path.join(ROOT, "insights"),
        "url":       "/insights/",
        "category":  "Financial Market Insight",
        "title":     "Financial Market Insights",
        "overline":  "Financial Market Insights",
        "hero":      "Financial <em>Market Insights</em>",
        "lead":      "Timely commentary on markets, the economy, and what it means for "
                     "long-term investors &mdash; written by Vann Equity Management.",
        "meta":      "Financial Market Insights from Vann Equity Management — timely commentary "
                     "on markets and the economy for long-term investors.",
        "listing_hero": "",   # placeholder — hero image coming
    },
}

DISCLOSURE = (
    "        <p>The information presented is for educational and informational purposes only and "
    "does not constitute investment, legal, or tax advice, nor an offer or solicitation to buy or "
    "sell any security. Views expressed are those of Vann Equity Management as of the date published "
    "and are subject to change without notice.</p>\n"
    "        <p>Vann Equity Management, LLC is an investment adviser registered with the U.S. "
    "Securities and Exchange Commission. Registration does not imply a certain level of skill or "
    "training. Past performance is not indicative of future results. All investing involves risk, "
    "including the possible loss of principal. Please consult your advisor regarding your specific "
    "circumstances before acting on any information herein.</p>"
)


def tpl(name):
    with open(os.path.join(TPL_DIR, name), encoding="utf-8") as f:
        return f.read()


def fill(template, mapping):
    out = template
    for k, v in mapping.items():
        out = out.replace("{{%s}}" % k, str(v))
    return out


def parse(path):
    """Return (frontmatter dict, markdown body)."""
    raw = open(path, encoding="utf-8").read().lstrip("﻿")
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n?(.*)$", raw, re.DOTALL)
    if not m:
        raise ValueError("Missing YAML front-matter in %s" % path)
    fm = yaml.safe_load(m.group(1)) or {}
    return fm, m.group(2).strip()


def slugify(text):
    text = re.sub(r"[^\w\s-]", "", text.lower()).strip()
    return re.sub(r"[\s_]+", "-", text)


def human_date(d):
    if isinstance(d, str):
        d = datetime.date.fromisoformat(d.strip())
    return "%s %d, %d" % (calendar.month_name[d.month], d.day, d.year), d.isoformat()


def read_time(body):
    words = len(re.findall(r"\w+", body))
    return max(1, round(words / 200.0))


def esc(s):
    return html.escape(str(s), quote=True)


def hero_media(hero):
    """Full-bleed hero background. Auto-uses a sibling .webp and a -mobile.jpg
    crop if those files exist next to the given image (same pattern as the
    GIPS/ADV/Privacy hero pages)."""
    if not hero:
        return ""
    rel = hero.lstrip("/")
    base, _ext = os.path.splitext(rel)
    webp = base + ".webp"
    mobile = base + "-mobile.jpg"
    sources = ""
    if os.path.exists(os.path.join(ROOT, mobile)):
        sources += '<source media="(max-width: 600px)" srcset="/%s?v=%s" />' % (mobile, CACHE)
    if os.path.exists(os.path.join(ROOT, webp)):
        sources += '<source type="image/webp" srcset="/%s?v=%s" />' % (webp, CACHE)
    return ('<div class="report-hero__media" aria-hidden="true"><picture>%s'
            '<img src="/%s?v=%s" alt="" /></picture></div>' % (sources, rel, CACHE))


def card_media(hero, title):
    if hero:
        src = hero if hero.startswith("/") else "/" + hero.lstrip("/")
        return ('<div class="post-card__media"><img src="%s?v=%s" alt="%s" loading="lazy" /></div>'
                % (src, CACHE, esc(title)))
    return ('<div class="post-card__media post-card__media--ph">'
            '<img class="post-card__phmark" src="/assets/brand/vann-icon-white.png?v=%s" alt="" /></div>'
            % CACHE)


def build_article(sec_key, sec, fm, body, validate_list):
    title   = fm["title"]
    slug    = fm.get("slug") or slugify(title)
    author  = fm.get("author", "Vann Equity Management")
    role    = fm.get("role", "")
    summary = fm.get("summary", "")
    hero    = fm.get("hero", "")
    status  = (fm.get("status") or "draft").lower()
    cat     = fm.get("category", sec["category"])
    date_h, date_iso = human_date(fm["date"])
    rt      = fm.get("read_time") or read_time(body)
    canonical = SITE + sec["url"] + slug + ".html"
    is_pub  = status == "published"

    body_html = MD.reset().convert(body)

    # Jump-link table of contents ("site map") built from the H2 sections.
    toc_items = [t for t in getattr(MD, "toc_tokens", []) if t.get("level") == 2]
    if len(toc_items) >= 3:
        links = "\n".join(
            '            <li><a href="#%s">%s</a></li>' % (t["id"], html.escape(t["name"], quote=False))
            for t in toc_items
        )
        toc_html = ('        <nav class="post-toc" aria-label="On this page">\n'
                    '          <p class="post-toc__title">On this page</p>\n'
                    '          <ol>\n%s\n          </ol>\n'
                    '        </nav>' % links)
    else:
        toc_html = ""

    # Per-article disclosure override (verbatim text from the source document).
    disc = fm.get("disclosure") or sec.get("disclosure")
    if disc:
        paras = [p.strip() for p in re.split(r"\n\s*\n", str(disc).strip()) if p.strip()]
        disclosure_html = "\n".join("        <p>%s</p>" % html.escape(p, quote=False) for p in paras)
    else:
        disclosure_html = DISCLOSURE

    author_type = "Organization" if author.strip().lower().startswith("vann equity") else "Person"
    ld = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": summary,
        "datePublished": date_iso,
        "dateModified": date_iso,
        "author": {"@type": author_type, "name": author},
        "publisher": {
            "@type": "FinancialService",
            "name": "Vann Equity Management, LLC",
            "url": SITE + "/",
        },
        "mainEntityOfPage": canonical,
    }
    if hero:
        ld["image"] = SITE + "/" + hero.lstrip("/")
    og_image = ('<meta property="og:image" content="%s/%s" />' % (SITE, hero.lstrip("/"))) if hero else ""

    page = fill(tpl("article.html"), {
        "TITLE":        esc(title),
        "META_DESC":    esc(summary),
        "CANONICAL":    canonical,
        "ROBOTS":       "index, follow, max-image-preview:large, max-snippet:-1" if is_pub else "noindex, nofollow",
        "CACHE":        CACHE,
        "OG_TITLE":     esc(title),
        "OG_IMAGE":     og_image,
        "JSONLD":       json.dumps(ld, indent=2, ensure_ascii=False),
        "DRAFT_BANNER": "" if is_pub else
                        '  <div class="draft-banner">Draft preview &mdash; pending compliance review. Not published.</div>',
        "BACK_HREF":    sec["url"],
        "BACK_LABEL":   sec["title"],
        "HERO_MEDIA":   hero_media(hero),
        "CATEGORY":     esc(cat),
        "POST_TITLE":   esc(title),
        "AUTHOR":       esc(author),
        "AUTHOR_ROLE":  (", " + esc(role)) if role else "",
        "DATE_ISO":     date_iso,
        "DATE_HUMAN":   date_h,
        "READ_TIME":    rt,
        "TOC":          toc_html,
        "BODY":         body_html,
        "DISCLOSURE":   disclosure_html,
        "YEAR":         YEAR,
    })

    os.makedirs(sec["out"], exist_ok=True)
    out_path = os.path.join(sec["out"], slug + ".html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(page)
    validate_list.append(out_path)

    return {
        "slug": slug, "title": title, "summary": summary, "hero": hero,
        "cat": cat, "date_h": date_h, "date_iso": date_iso, "rt": rt,
        "status": status, "url": sec["url"] + slug + ".html",
    }


def build_card(sec, a):
    return (
        '        <article class="post-card">\n'
        '          %s\n'
        '          <div class="post-card__body">\n'
        '            <p class="post-card__cat">%s</p>\n'
        '            <h2 class="post-card__title"><a class="post-card__link" href="%s">%s</a></h2>\n'
        '            <p class="post-card__summary">%s</p>\n'
        '            <div class="post-card__meta"><time datetime="%s">%s</time>'
        '<span class="dot" aria-hidden="true"></span><span>%s min read</span></div>\n'
        '          </div>\n'
        '        </article>'
        % (card_media(a["hero"], a["title"]), esc(a["cat"]), a["url"], esc(a["title"]),
           esc(a["summary"]), a["date_iso"], a["date_h"], a["rt"])
    )


def build_listing(sec_key, sec, articles, validate_list):
    pub = [a for a in articles if a["status"] == "published"]
    pub.sort(key=lambda a: a["date_iso"], reverse=True)
    canonical = SITE + sec["url"]

    if pub:
        cards = ('      <div class="post-grid">\n'
                 + "\n".join(build_card(sec, a) for a in pub)
                 + "\n      </div>")
        count = "%d article%s" % (len(pub), "" if len(pub) == 1 else "s")
        eyebrow = "Latest"
    else:
        cards = ('      <div class="listing-empty">\n'
                 '        <h2>Coming soon</h2>\n'
                 '        <p>We&rsquo;re preparing our first %s. Please check back shortly.</p>\n'
                 '      </div>' % sec["title"].lower())
        count = ""
        eyebrow = ""

    ld = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": sec["title"],
        "description": re.sub("<[^>]+>", "", sec["meta"]),
        "url": canonical,
        "isPartOf": {"@type": "WebSite", "name": "Vann Equity Management", "url": SITE + "/"},
    }

    listing_hero_img = sec.get("listing_hero", "")
    og_image = ('<meta property="og:image" content="%s/%s" />' % (SITE, listing_hero_img.lstrip("/"))) if listing_hero_img else ""

    page = fill(tpl("listing.html"), {
        "TITLE":       esc(sec["title"]),
        "META_DESC":   sec["meta"],
        "CANONICAL":   canonical,
        "ROBOTS":      "index, follow, max-image-preview:large, max-snippet:-1",
        "CACHE":       CACHE,
        "OG_TITLE":    esc(sec["title"]),
        "OG_IMAGE":    og_image,
        "JSONLD":      json.dumps(ld, indent=2, ensure_ascii=False),
        "OVERLINE":    sec["overline"],
        "HERO_TITLE":  sec["hero"],
        "HERO_LEAD":   sec["lead"],
        "HERO_MEDIA":  hero_media(listing_hero_img),
        "LIST_EYEBROW": eyebrow,
        "LIST_COUNT":  count,
        "CARDS":       cards,
        "YEAR":        YEAR,
    })

    os.makedirs(sec["out"], exist_ok=True)
    out_path = os.path.join(sec["out"], "index.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(page)
    validate_list.append(out_path)
    return pub


def update_sitemap(all_published):
    path = os.path.join(ROOT, "sitemap.xml")
    if not os.path.exists(path):
        return
    xml = open(path, encoding="utf-8").read()
    lines = []
    for sec_key, sec in SECTIONS.items():
        lines.append('  <url>\n    <loc>%s%s</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>'
                     % (SITE, sec["url"]))
    for a in all_published:
        lines.append('  <url>\n    <loc>%s%s</loc>\n    <lastmod>%s</lastmod>\n    <changefreq>yearly</changefreq>\n    <priority>0.5</priority>\n  </url>'
                     % (SITE, a["url"], a["date_iso"]))
    block = "  <!-- BLOG:START (auto-generated by build_content.py — do not edit by hand) -->\n" \
            + "\n".join(lines) + "\n  <!-- BLOG:END -->"
    if "<!-- BLOG:START" in xml:
        xml = re.sub(r"  <!-- BLOG:START.*?<!-- BLOG:END -->", block, xml, flags=re.DOTALL)
    else:
        xml = xml.replace("</urlset>", block + "\n</urlset>")
    with open(path, "w", encoding="utf-8") as f:
        f.write(xml)


def main():
    do_validate = "--validate" in sys.argv
    validate_list = []
    all_published = []
    summary_rows = []

    for sec_key, sec in SECTIONS.items():
        articles = []
        src = sec["src"]
        if os.path.isdir(src):
            for fn in sorted(os.listdir(src)):
                if not fn.endswith(".md") or fn.startswith("_"):
                    continue
                fm, body = parse(os.path.join(src, fn))
                articles.append(build_article(sec_key, sec, fm, body, validate_list))
        pub = build_listing(sec_key, sec, articles, validate_list)
        all_published.extend(pub)
        d = len(articles) - len(pub)
        summary_rows.append((sec["title"], len(pub), d))

    update_sitemap(all_published)

    print("Built:")
    for name, p, d in summary_rows:
        print("  %-26s %d published, %d draft" % (name, p, d))
    print("  %d page(s) written." % len(validate_list))

    if do_validate:
        import html5lib
        errs = 0
        for p in validate_list:
            try:
                html5lib.HTMLParser(strict=True).parse(open(p, encoding="utf-8").read())
            except Exception as e:
                errs += 1
                print("  HTML5 ERROR in %s: %s" % (os.path.relpath(p, ROOT), e))
        print("HTML5 validation: %s" % ("0 errors — all valid." if errs == 0 else "%d error(s)." % errs))
        if errs:
            sys.exit(1)


if __name__ == "__main__":
    main()
