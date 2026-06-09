---
title: "Example: A Note Awaiting Compliance Review"
slug: "draft-example-pending-review"
date: 2026-06-10
author: "Vann Equity Management"
summary: "This is a draft example. It demonstrates how an article stays off the public listing until the Chief Compliance Officer approves it and changes its status to published."
category: "Financial Market Insight"
status: draft
---

This article exists to demonstrate the **compliance gate** built into the publishing system.

Because its front-matter says `status: draft`, three things are true:

1. It does **not** appear on the public Financial Market Insights listing page.
2. It is **not** included in the sitemap submitted to search engines.
3. This page itself carries a `noindex` tag and a visible "Draft preview" banner, so even someone with the direct link can see it is not yet public.

## How it gets published

When the Chief Compliance Officer has reviewed the content and approved it, a single change — `status: draft` becomes `status: published` — moves it live. The git commit that makes that change becomes the permanent, time-stamped record of who approved it and when, which satisfies the recordkeeping expectations of the SEC Marketing Rule.

You can safely delete this example file at any time.
