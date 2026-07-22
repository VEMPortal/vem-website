# VEM Blog Post — Pre-Publish Checklist

Run through this before any post moves from draft to published, and again
before sending a preview link to anyone. Doubles as the self-review pass
described in `SKILL.md`.

## Grammar & Writing Quality

- [ ] No subject/verb mismatches (things that can't perform their own verb —
      "the analysis pushed back" instead of "analysts pushed back")
- [ ] No unclear pronoun references (every "it," "this," "that" has one
      obvious antecedent)
- [ ] No repeated words in the same sentence/paragraph that read as sloppy
      rather than intentional
- [ ] Tense is consistent within each paragraph (past-tense narration
      doesn't randomly drift into present or future)
- [ ] Sentence rhythm varies — not every sentence is the same length/structure
- [ ] Title and hook lead with a concrete fact or number, not a vague category
- [ ] `summary:` field has its own hook — doesn't just restate the title

## Internal Consistency

- [ ] Any number/figure mentioned more than once matches every time it appears
- [ ] If two sources give different figures for the same thing, the post
      reconciles or hedges — never silently picks one
- [ ] Dates, day-of-week references, and event sequencing are all internally
      consistent

## Sourcing

- [ ] Every claim traces back to a real source found during research —
      nothing invented
- [ ] Every entry in "Sources and References" is a real, working, clickable
      link
- [ ] Each link actually supports the specific claim it's attached to
- [ ] No source cited from memory/assumption — only from an actual search
      result

## Compliance (SEC Marketing Rule)

- [ ] Opening paragraph explicitly states the post is educational only and
      not a recommendation
- [ ] Nothing in the post advises buying, selling, holding, or avoiding a
      specific security — even implicitly
- [ ] No fabricated facts, quotes, or statistics anywhere in the body
- [ ] "Risk and Context" section present and accurate for the topic
- [ ] No real company logos or trademarks depicted in the hero image

## Disclosure

- [ ] Disclosure block present (default auto-applies, or custom
      `disclosure:` front-matter if the topic needs specific risk language)
- [ ] Disclosure ends with "AI was used in the creation of these materials."
- [ ] If a custom disclosure was written, it wasn't just copy-pasted without
      checking it still ends with that same sentence

## Front Matter & Build

- [ ] `title`, `slug`, `date`, `author`, `category`, `hero`, `status`,
      `summary` all present and correct
- [ ] `status: draft` unless explicit go-ahead was given to publish
- [ ] Slug doesn't collide with an existing file in `content/blog/`
- [ ] `python build_content.py --validate` runs with 0 HTML errors
- [ ] Hero image has desktop + mobile + webp variants, all showing correctly

## Before It Goes Live

- [ ] Compliance review actually happened (not just marked as done) — John
      Vann sign-off
- [ ] Marketing Record created once published, with screenshot, sources, and
      approval log filled in
- [ ] Preview link tested end-to-end (loads, renders, no broken
      images/links) before sharing with anyone
