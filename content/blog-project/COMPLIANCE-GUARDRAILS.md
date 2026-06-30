# VEM Blog Compliance Guardrails

Every post must pass this checklist before `status` is flipped to `published`.
These guardrails are built into how Claude drafts, but the **CCO/firm has final
sign-off** — this file does not replace legal/compliance review.

## Which rules apply (read this first)
- **VEM is an SEC-registered investment adviser (RIA).** The governing standard
  is the **SEC Marketing Rule, Advisers Act Rule 206(4)-1**.
- **FINRA Rule 2210** governs broker-dealers, not RIAs. If VEM is purely an RIA,
  FINRA 2210 does not strictly apply — but its content standards (fair, balanced,
  no promissory/exaggerated claims) are a sound, conservative bar, so we apply
  them too. **Confirm with the CCO** whether VEM has any BD affiliation that makes
  2210 mandatory.

## The hard "never" list (fails the post immediately)
1. **No performance, return, or GIPS figures** in a blog/insight without explicit
   CCO sign-off. If any figure appears, it must match the audited source exactly.
2. **No testimonials or endorsements.** Client quotes, praise, star ratings, or
   third-party ratings trigger strict SEC conditions — keep them out of posts.
3. **No predictions or guarantees.** No "will," "guaranteed," "ensures,"
   "can't lose," price targets, or promissory/projected returns.
4. **No exaggerated or unwarranted claims.** No "best," "#1," "safe," "risk-free,"
   superlatives about VEM or any security.
5. **No recommendation of a specific security.** Companies/sectors may be
   discussed for education only, never as buy/sell/hold advice.
6. **No cherry-picking.** Don't present only favorable facts; give balanced
   treatment of risks and benefits.

## The "always" list (required to pass)
1. **Fair and balanced.** Risks presented alongside any potential benefit; a
   sound basis for any opinion stated.
2. **Educational framing.** Make clear it is general information, not individual
   investment, legal, or tax advice.
3. **Substantiation.** Every factual claim/number traceable to a cited, reliable
   source (Eric supplies sources during research).
4. **Material context.** Include the qualifications a reader needs so the piece
   is not misleading by omission.
5. **Disclosure block present.**
   - Blog: the standard educational disclosure auto-applies; add a custom
     `disclosure:` only if the post names specific companies/securities.
   - Insight: include the newsletter copyright disclosure verbatim (copy from a
     prior insight) — Insights have no auto-default.
6. **Draft first.** Ship as `status: draft`; a human flips to `published`.

## SEC Marketing Rule — the seven general prohibitions (plain English)
An advertisement may not:
1. Include an untrue statement of material fact, or omit a material fact making
   it misleading.
2. Make a material statement the adviser can't substantiate on demand.
3. Include information likely to cause an untrue or misleading implication.
4. Discuss benefits without fair and balanced treatment of risks/limitations.
5. Reference specific advice in a way that is not fair and balanced.
6. Include or exclude performance in a misleading way.
7. Otherwise be materially misleading.

## Pre-publish checklist (run every time)
- [ ] No performance/GIPS numbers (or CCO-approved and exact)
- [ ] No testimonials, endorsements, or third-party ratings
- [ ] No predictions, guarantees, or promissory language
- [ ] No superlatives/exaggeration about VEM or any security
- [ ] No specific buy/sell/hold recommendation
- [ ] Risks shown alongside benefits (fair & balanced)
- [ ] Educational/"not individual advice" framing present
- [ ] All facts/figures sourced and accurate
- [ ] Correct disclosure block (blog default or custom; Insights = verbatim)
- [ ] `status: draft` until CCO sign-off; publish commit = the sign-off record

## Sources (regulatory basis)
- SEC Marketing Rule 206(4)-1 (SEC.gov Marketing Compliance FAQ; 2020 adopting
  release; Dec 2025 Division of Examinations risk alert on testimonials,
  endorsements, and third-party ratings).
- FINRA Rule 2210, Communications with the Public (content standards: fair,
  balanced, no false/exaggerated/unwarranted/promissory/misleading claims; no
  predicting or projecting performance).
