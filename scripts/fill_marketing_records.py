# -*- coding: utf-8 -*-
"""Fill VEM Marketing Records for VEM blog posts (and, going forward, Financial
Market Insight pieces) published on vannequitymanagement.com.

Run: python scripts/fill_marketing_records.py
Writes .docx files into the output directory below.

RECORD ID / MULTI-CHANNEL CONVENTION
-------------------------------------
Each Marketing Record documents ONE published creative on ONE channel, because
that's what the SEC Marketing Rule cares about: the exact content, as it
actually appeared, on that specific platform. A blog article and its social
repost are almost always different creatives (different caption length,
different image crop, different approval/publish dates), so they get separate
records rather than being combined into one.

Convention: the website record for an article is the base number, e.g.
"Blog 001". If/when the same article is also posted to social, each channel
gets its own sibling record using the same base number plus a platform
suffix:
    Blog 001         -> vannequitymanagement.com/blog (the website post)
    Blog 001-LI       -> LinkedIn
    Blog 001-X        -> X / Twitter
    Blog 001-FB       -> Facebook
    Blog 001-IG       -> Instagram
Each sibling record gets its own Platforms field, its own "Final Approved
Caption" (the text as it actually posted on that channel -- not the full
article), its own Published URL, its own approval/publish dates, and its own
screenshot. None of the records below have social siblings yet -- add one
only once a specific post is actually published to that channel; never
create a placeholder record for a channel nothing has been posted to.
"""
import os
from generate_marketing_record import build_record

OUT_DIR = r"C:\Users\alpha\OneDrive\Attachments\Desktop\Business (VEM)\VEM-Marketing-Records"
os.makedirs(OUT_DIR, exist_ok=True)

WEBSITE_PLATFORM = "VEM Website — vannequitymanagement.com/blog"

STANDARD_BLOG_DISCLOSURE = (
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
    "consult their financial, tax, or legal professional regarding their individual circumstances."
)

AI_IPO_DISCLOSURE = (
    "This material is provided for informational and educational purposes only and should not be "
    "considered investment, legal, or tax advice. The information does not constitute a recommendation to "
    "buy, sell, participate in, or avoid any IPO, security, company, sector, asset class, or investment "
    "strategy. References to SpaceX, OpenAI, Anthropic, or any other company are for educational market "
    "commentary only and should not be interpreted as a recommendation. Investing involves risk, including "
    "the possible loss of principal. IPOs and newly public companies may involve additional risks, including "
    "limited public operating history, valuation uncertainty, liquidity constraints, volatility, and changes "
    "in market conditions. Past performance does not guarantee future results. Vann Equity Management does "
    "not provide tax or legal advice. Investors should consult their financial, tax, or legal professional "
    "regarding their individual circumstances."
)

ENERGY_DISCLOSURE = (
    "This material is provided for informational and educational purposes only and should not be "
    "considered investment, legal, tax, or financial advice. The information does not constitute a "
    "recommendation to buy, sell, or hold any security, company, commodity, sector, asset class, IPO, or "
    "investment strategy. References to energy markets, oil, natural gas, electricity, renewables, data "
    "centers, or infrastructure are for educational market commentary only. Investing involves risk, "
    "including the possible loss of principal. Commodity and energy-related investments may involve "
    "additional risks, including price volatility, geopolitical risk, regulatory risk, liquidity risk, and "
    "changes in supply and demand. Past performance does not guarantee future results. Vann Equity "
    "Management does not provide tax or legal advice. Investors should consult their financial, tax, or "
    "legal professional regarding their individual circumstances."
)

IRAN_DISCLOSURE = (
    "This material is provided for informational and educational purposes only and should not be "
    "considered investment, legal, tax, or financial advice. The information does not constitute a "
    "recommendation to buy, sell, or hold any security, commodity, sector, asset class, company, ETF, IPO, "
    "or investment strategy. References to Iran, the Strait of Hormuz, oil, LNG, shipping, inflation, or "
    "market volatility are for educational market commentary only. Investing involves risk, including the "
    "possible loss of principal. Commodity and energy-related investments may involve additional risks, "
    "including price volatility, geopolitical risk, regulatory risk, liquidity risk, and changes in supply "
    "and demand. Past performance does not guarantee future results. Vann Equity Management does not provide "
    "tax or legal advice. Investors should consult their financial, tax, or legal professional regarding "
    "their individual circumstances."
)

# ---------------------------------------------------------------------------
# RECORD 001 — "Inflation Cools as Bank Earnings Put Economic Resilience to
# the Test" — merged to master and live in production.
# ---------------------------------------------------------------------------
record_1 = {
    "record_id": "Blog 001",
    "post_title": "Inflation Cools as Bank Earnings Put Economic Resilience to the Test",
    "status": "Published",
    "date_created": "7/14/2026",
    "publish_date": "7/17/2026",
    "archive_date": "TBD",

    "platforms": WEBSITE_PLATFORM,
    "content_category": "Market Commentary",
    "post_type": "Blog Article",
    "author": "Aaron Vann",
    "compliance_reviewer": "John Vann",
    "approval_date": "7/17/2026",
    "published_by": "Eric Capo",
    "published_url": "https://www.vannequitymanagement.com/blog/inflation-cools-bank-earnings-economic-resilience.html",
    "screenshot_saved": "Yes",
    "archive_folder": "TBD",

    "media_filenames": "blog-hero-2026-07-14.jpg, blog-hero-2026-07-14.webp, blog-hero-2026-07-14-mobile.jpg",
    "screenshot_path": os.path.join(OUT_DIR, "images", "blog-001.png"),

    "caption_paragraphs": [
        "At a Glance",
        "Consumer prices declined sharply in June, offering investors a potentially encouraging sign on inflation. However, annual inflation remains elevated, and Federal Reserve officials continue to emphasize the importance of achieving sustainable price stability.",
        "At the same time, second-quarter bank earnings are providing investors with a closer look at consumer activity, lending conditions, credit quality, trading activity, and the broader health of the economy.",
        "June Inflation Declined Sharply",
        "The Consumer Price Index declined 0.4% in June on a seasonally adjusted basis after increasing 0.5% in May. According to the U.S. Bureau of Labor Statistics, this was the largest monthly decline in consumer prices since April 2020.",
        "Despite the monthly decline, the Consumer Price Index remained 3.5% higher than it was one year earlier.",
        "The contrast between the monthly and annual readings is important. June's decline suggests that some near-term price pressures eased, but the year-over-year rate indicates that the overall price level remains meaningfully higher than it was twelve months ago.",
        "One monthly report can influence market expectations, but it does not necessarily establish a lasting inflation trend.",
        "The Federal Reserve Remains Focused on Price Stability",
        "During his semiannual testimony before Congress, Federal Reserve Chairman Kevin Warsh described the economy as continuing to expand at a solid pace.",
        "He noted that household consumption growth has been moderate, manufacturing output has moved higher, and the housing sector continues to lag. He also reiterated the Federal Reserve's focus on addressing the inflation pressures that have affected households and businesses.",
        "The Federal Reserve will likely continue evaluating several categories of information, including: Inflation trends; Labor-market conditions; Consumer spending; Manufacturing activity; Housing conditions; Financial conditions.",
        "Investors should therefore be cautious about assuming that a single favorable inflation report automatically produces an immediate change in monetary policy.",
        "Bank Earnings Offer Another View of the Economy",
        "Several of the largest U.S. financial institutions reported second-quarter results Tuesday.",
        "Bank of America reported $31.6 billion in revenue, $9.1 billion in net income, diluted earnings per share of $1.21, and a 17.0% return on tangible common equity.",
        "Goldman Sachs reported diluted earnings per share of $20.98 and an annualized return on common equity of 23.5%.",
        "The headline numbers are important, but investors may gain even more information from management commentary about: Consumer credit; Loan demand; Deposit costs; Delinquencies; Corporate borrowing; Merger and acquisition activity; Trading volumes; Capital-market activity.",
        "Banks sit near the center of the financial system. Their results can provide useful information about how households and businesses are responding to interest rates and economic uncertainty.",
        "What Investors Should Watch Next",
        "The next question is whether the improvement in monthly inflation continues in upcoming reports.",
        "Investors should also watch whether bank executives describe consumers and businesses as remaining resilient or becoming more cautious.",
        "Additional inflation, employment, retail-sales, housing, and production data will help determine whether June represented a lasting shift or simply one volatile monthly reading.",
        "VEM Perspective",
        "June's inflation report was encouraging, but it did not eliminate inflation risk.",
        "The economy continues to show areas of resilience, while housing and other interest-rate-sensitive areas remain under pressure. Bank earnings may help investors assess whether tighter financial conditions are beginning to affect borrowing, spending, and corporate activity more broadly.",
        "Rather than reacting to one headline, disciplined investors should evaluate how inflation, monetary policy, corporate earnings, and economic growth develop together over time.",
    ],

    "disclosure": STANDARD_BLOG_DISCLOSURE,

    "sources": [
        "U.S. Bureau of Labor Statistics, \"Consumer Price Index -- June 2026\" -- https://www.bls.gov/news.release/cpi.nr0.htm",
        "Federal Reserve, \"Semiannual Monetary Policy Report to Congress\" -- https://www.federalreserve.gov/newsevents/testimony/warsh20260714a.htm",
        "Bank of America Investor Relations, \"Second Quarter 2026 Financial Results\" -- https://investor.bankofamerica.com/quarterly-earnings",
        "Bank of America Q2 2026 Earnings Conference Call -- https://investor.bankofamerica.com/events-and-presentations/events/detail/20260714-q2-2026-bank-of-america-earnings-conference-call",
    ],

    "approval_log": [
        ("Draft Completed", "Aaron Vann", "7/14/2026"),
        ("Compliance Review", "John Vann", "7/17/2026"),
        ("Approved", "John Vann", "7/17/2026"),
        ("Published", "TBD", "7/17/2026"),
    ],

    "revision_history": [
        ("1", "7/14/2026", "Initial draft published to review branch; sources added with verified URLs"),
        ("2", "7/17/2026", "Publish date updated to 7/17/2026; merged to production (master) and live"),
    ],

    "notes": (
        "Fields marked TBD still need confirmation: Published By, Screenshot Saved, and Archive Folder path. "
        "This record was generated from the site's build source (content/blog/*.md) and live production URL."
    ),
}

# ---------------------------------------------------------------------------
# RECORD 002 — "Cooling Inflation Lifts Stocks, But Chipmakers Split on the
# Same Day" — still status: draft, pending compliance approval, NOT live.
# ---------------------------------------------------------------------------
record_2 = {
    "record_id": "Blog 002",
    "post_title": "Cooling Inflation Lifts Stocks, But Chipmakers Split on the Same Day",
    "status": "Published",
    "date_created": "7/15/2026",
    "publish_date": "7/17/2026",
    "archive_date": "TBD",

    "platforms": WEBSITE_PLATFORM,
    "content_category": "Market Commentary",
    "post_type": "Blog Article",
    "author": "Aaron Vann",
    "compliance_reviewer": "John Vann",
    "approval_date": "7/17/2026",
    "published_by": "Eric Capo",
    "published_url": "https://www.vannequitymanagement.com/blog/cooling-inflation-lifts-stocks-chipmakers-split.html",
    "screenshot_saved": "Yes",
    "archive_folder": "TBD",

    "media_filenames": "blog-hero-2026-07-15.jpg, blog-hero-2026-07-15.webp, blog-hero-2026-07-15-mobile.jpg",
    "screenshot_path": os.path.join(OUT_DIR, "images", "blog-002.png"),

    "caption_paragraphs": [
        "At a Glance",
        "Stocks moved higher on Wednesday as a softer-than-expected wholesale inflation reading gave investors more evidence that price pressures are easing. Big Tech names advanced broadly, led by Apple's move to a new all-time high. At the same time, semiconductor stocks told two different stories on the same day: chip equipment maker ASML surged on a raised full-year outlook, while Micron Technology fell sharply. Elsewhere, BlackRock posted its best day in more than a year on a strong earnings beat, while SpaceX shares slipped below their IPO price for the first time. This article is educational only and does not recommend buying, selling, or avoiding any security.",
        "Key Takeaways",
        "The S&P 500 rose 0.38% to 7,572.40, the Nasdaq Composite gained 0.62% to 26,269.23, and the Dow Jones Industrial Average added 0.29% to 52,658.64. June producer prices (PPI) fell 0.3%, versus expectations for no change, while core PPI (excluding food and energy) rose 0.2%, below the 0.3% forecast. Apple rose about 4% to a new all-time high; Amazon, Alphabet, and Microsoft also advanced. Semiconductor stocks were mixed: ASML rose roughly 2% on a raised revenue outlook, while Micron Technology fell about 7% the same day. BlackRock shares had their best single day in over a year after second-quarter earnings beat estimates; SpaceX shares fell below their IPO price for the first time. This is market commentary only, not investment advice.",
        "Inflation Cools, and the Market Responds",
        "The producer price index fell 0.3% in June, compared with expectations for no change. Core PPI, which excludes food and energy, rose 0.2%, below the 0.3% consensus forecast. Producer prices measure what U.S. businesses receive for their goods and services before they reach the consumer, so a softer-than-expected reading can be an early signal that broader inflation pressure is easing.",
        "Markets responded favorably. Lower wholesale price pressure can ease concern that the Federal Reserve will need to hold interest rates higher for longer, and Wednesday's session reflected that relief across the major indexes. By the close, the S&P 500 was up 0.38%, the Nasdaq Composite was up 0.62%, and the Dow Jones Industrial Average was up 0.29%.",
        "A single month of cooler producer prices does not settle the inflation question on its own. It is one data point the Fed will weigh alongside consumer price data, labor market conditions, and its own read on demand.",
        "Big Tech Leads, But One Sector Tells Two Stories",
        "Much of the day's gains came from large technology companies. Apple rose about 4% to a new all-time high. Amazon and Alphabet each advanced, and Microsoft moved higher as well.",
        "Semiconductor stocks, however, did not move as a single group. Dutch chip equipment maker ASML raised its full-year 2026 revenue guidance to a range of roughly EUR43 billion to EUR45 billion, above the approximately EUR39.8 billion analysts had been expecting. ASML shares rose about 2% on the news.",
        "At the same time, Micron Technology shares fell roughly 7% the same day.",
        "Elsewhere in the market, BlackRock shares rose more than 5% -- their best single-day move in over a year -- after second-quarter earnings beat analyst expectations. SpaceX shares fell below their IPO price for the first time.",
        "What Long-Term Investors Can Focus On",
        "Days like this are a useful reminder to separate the index-level headline from what is happening underneath it. The goal is not to chase the day's winners or avoid its losers, but to understand why a single sector can produce both a rally and a decline on the same afternoon.",
        "Risk and Context",
        "Producer price and other inflation data can be revised in subsequent reports, and a single month's reading does not establish a trend on its own. Individual company results, including earnings beats and guidance changes, reflect that company's specific circumstances and are not indicative of sector-wide or market-wide performance. Semiconductor, technology, and newly public company shares can be more volatile than the broader market and may carry concentration, valuation, and execution risks. Past performance, including a single day's gains or losses, does not guarantee future results.",
    ],

    "disclosure": STANDARD_BLOG_DISCLOSURE,

    "sources": [
        "Yahoo Finance, \"Stock market today: Dow, S&P 500, Nasdaq rise as Apple notches record high\" -- https://finance.yahoo.com/markets/live/stock-market-today-wednesday-july-15-dow-sp-nasdaq-091813320.html",
        "CNBC, \"Stock market today\" live updates, July 15, 2026 -- https://www.cnbc.com/2026/07/15/stock-market-today-live-updates.html",
        "TheStreet, \"Stock Market Today (July 15, 2026): SpaceX dips below IPO price for first time\" -- https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-july-15-2026",
        "24/7 Wall St., \"Fed Rate Hikes Dead? Producer Prices Fall by Largest Amount Since Pandemic\" -- https://247wallst.com/investing/2026/07/15/fed-rate-hikes-dead-producer-prices-fall-by-largest-amount-since-pandemic/",
        "Benzinga, \"ASML Holding Q2 2026 Earnings Call: Complete Transcript\" -- https://www.benzinga.com/news/26/07/60488275/asml-holding-q2-2026-earnings-call-complete-transcript",
    ],

    "approval_log": [
        ("Draft Completed", "Aaron Vann", "7/15/2026"),
        ("Compliance Review", "John Vann", "7/17/2026"),
        ("Approved", "John Vann", "7/17/2026"),
        ("Published", "TBD", "7/17/2026"),
    ],

    "revision_history": [
        ("1", "7/15/2026", "Initial draft; sources listed as plain-text citations (no links)"),
        ("2", "7/17/2026", "Publish date updated to 7/17/2026; sources converted to clickable, verified links per standing house rule; compliance approved and merged to production"),
    ],

    "notes": (
        "Fields marked TBD still need confirmation: Published By, Screenshot Saved, and Archive Folder path. "
        "This record was generated from the site's build source (content/blog/*.md) and live production URL."
    ),
}

# ---------------------------------------------------------------------------
# RECORD 003 — "What SpaceX, OpenAI, and Anthropic IPOs May Signal About
# Today's Market" — published 6/9/2026, backfilled record.
# ---------------------------------------------------------------------------
record_3 = {
    "record_id": "Blog 003",
    "post_title": "What SpaceX, OpenAI, and Anthropic IPOs May Signal About Today's Market",
    "status": "Published",
    "date_created": "6/9/2026",
    "publish_date": "6/9/2026",
    "archive_date": "TBD",

    "platforms": WEBSITE_PLATFORM,
    "content_category": "Blog",
    "post_type": "Blog Article",
    "author": "Aaron Vann",
    "compliance_reviewer": "John Vann",
    "approval_date": "6/9/2026",
    "published_by": "Eric Capo",
    "published_url": "https://www.vannequitymanagement.com/blog/what-spacex-openai-anthropic-ipos-may-signal-about-todays-market.html",
    "screenshot_saved": "Yes",
    "archive_folder": "TBD",

    "media_filenames": "blog-hero-2026-06-09.jpg, blog-hero-2026-06-09.webp, blog-hero-2026-06-09-mobile.jpg",
    "screenshot_path": os.path.join(OUT_DIR, "images", "blog-003.png"),

    "caption_paragraphs": [
        "At-a-Glance",
        "SpaceX, OpenAI, and Anthropic are drawing attention because they sit at the center of several major market themes: artificial intelligence, infrastructure spending, aerospace innovation, and investor demand for large private growth companies. This article is educational only and does not recommend buying, selling, or participating in any IPO.",
        "Why These IPOs Matter",
        "Some IPOs are company events. Others become market events.",
        "The potential public listings of SpaceX, OpenAI, and Anthropic fall into the second category because they touch several forces currently shaping investor sentiment: artificial intelligence, compute infrastructure, private market valuations, passive index demand, and the public market's appetite for high-growth companies.",
        "That does not mean these IPOs are automatically attractive investments. It simply means they may become important reference points for how the market values innovation at scale.",
        "For investors, the question is not whether a company is exciting. The better question is whether the market is pricing growth, risk, profitability, competition, and execution appropriately.",
        "SpaceX: A Test Of Scale And Expectations",
        "SpaceX is unusual because it is not just a traditional aerospace story. It sits at the intersection of launch services, satellite communications, space infrastructure, and broader investor interest in Elon Musk-led companies.",
        "Recent reporting has suggested that SpaceX could pursue one of the largest public offerings in history. That size alone may make it a major market event if completed. Large IPOs can influence index construction, passive fund demand, market liquidity, and investor psychology.",
        "But scale cuts both ways.",
        "A large valuation may reflect confidence in long-term growth, but it can also raise the bar for execution. When a company comes public at a significant valuation, investors may have less margin for disappointment if revenue, profitability, or business milestones do not develop as expected.",
        "For SpaceX, investors may focus on several questions: How durable are its core aerospace and satellite businesses? How much of the valuation depends on future projects rather than current results? How quickly could the company become profitable, if it is not already? How much public float will be available at launch? How might index inclusion affect short-term demand?",
        "None of those questions has a simple answer. That is exactly why discipline matters.",
        "OpenAI And Anthropic: AI Moves Toward Public Markets",
        "OpenAI and Anthropic represent another side of the same broader market story: the public market's growing interest in artificial intelligence platforms.",
        "AI has already influenced large public technology companies, semiconductor demand, data center construction, power infrastructure, cloud spending, and software adoption. The potential IPOs of major AI model developers could give public investors more direct exposure to companies building the models themselves.",
        "That would be meaningful.",
        "Until now, much of the public market AI trade has been expressed through companies that sell chips, cloud capacity, software platforms, or infrastructure. OpenAI and Anthropic would represent a different kind of exposure: businesses built around frontier AI models, enterprise adoption, developer tools, and potentially new consumer and business software ecosystems.",
        "But the business model questions are serious.",
        "Frontier AI companies require enormous investment in computing capacity, talent, data, infrastructure, safety systems, and product development. Revenue growth may be strong, but investors still need to evaluate profitability timelines, capital intensity, competitive pressure, customer concentration, regulation, and governance.",
        "The market may reward growth. It may also punish uncertainty when expectations become too high.",
        "What This Means For The Market",
        "These IPOs may signal that private market leaders are increasingly willing to test public market demand.",
        "That matters because many of the most discussed companies in AI, space, defense technology, fintech, and software have stayed private for longer than companies did in earlier market cycles. If more of these large private companies come public, investors may get a clearer view of how public markets value late-stage innovation.",
        "There are several potential market implications: large IPOs can absorb investor capital; index inclusion can matter and may affect trading demand; valuation discipline becomes more important; and the IPO market can influence broader sentiment.",
        "Risks Behind The Excitement",
        "IPO investing comes with distinct risks. Newly public companies may have limited public operating history. Financial disclosures may be new to the market. Trading can be volatile. Early valuations may be influenced by limited share float, strong brand recognition, insider ownership, or short-term investor enthusiasm.",
        "For AI companies specifically, investors should also consider high infrastructure costs, competition from large public technology companies, model performance uncertainty, regulatory and legal risk, profitability timing, customer adoption trends, and dependence on cloud, chips, energy, and data center capacity.",
        "For SpaceX, investors may also consider execution risk in aerospace and satellite operations, capital intensity, regulatory approvals, competition, dependence on future projects, and valuation sensitivity.",
        "These are not reasons to ignore the companies. They are reasons to evaluate them carefully.",
        "Practical Investor Takeaway",
        "The potential IPOs of SpaceX, OpenAI, and Anthropic are important because they may help define the next stage of market leadership. They may also test how much public investors are willing to pay for innovation, scale, and future growth.",
        "But investors should separate interest from action.",
        "A company can be important without being appropriate for every portfolio. A business can be innovative while still carrying valuation risk. A major IPO can be newsworthy without being a recommendation.",
        "For long-term investors, the disciplined approach is to watch how these companies come to market, evaluate the disclosures, understand the risks, and consider any exposure within the context of goals, risk tolerance, time horizon, liquidity needs, and overall portfolio construction.",
        "Excitement is not a process. Discipline is.",
    ],

    "disclosure": AI_IPO_DISCLOSURE,

    "sources": [
        "No Sources and References section in the published article. Body cites reporting generally (e.g. \"recent reporting\") without named outlets or URLs -- predates the house rule requiring clickable source links (see [[blog-sources-must-be-links]]). Flag for Brandy/John: confirm whether this pre-dates the rule and is grandfathered, or should be amended with real citations.",
    ],

    "approval_log": [
        ("Draft Completed", "Aaron Vann", "6/9/2026"),
        ("Compliance Review", "John Vann", "6/9/2026"),
        ("Approved", "John Vann", "6/9/2026"),
        ("Published", "TBD", "6/9/2026"),
    ],

    "revision_history": [
        ("1", "7/17/2026", "Marketing Record created retroactively for already-published post"),
    ],

    "notes": (
        "Backfilled record for a post that was already live before the Marketing Record process started. "
        "John Vann approved this post at the time it was created and posted, per standing firm practice -- "
        "this formal Marketing Record template did not exist yet when the site's original content was "
        "built, so Compliance Review/Approved above are being documented retroactively rather than logged "
        "in real time. Published By, Screenshot Saved, and Archive Folder are still TBD pending confirmation. "
        "This article has no linked sources -- flagged above for compliance follow-up."
    ),
}

# ---------------------------------------------------------------------------
# RECORD 004 — "What the Next Wave of AI IPOs May Mean for Investors" —
# published 6/10/2026, backfilled record.
# ---------------------------------------------------------------------------
record_4 = {
    "record_id": "Blog 004",
    "post_title": "What the Next Wave of AI IPOs May Mean for Investors",
    "status": "Published",
    "date_created": "6/10/2026",
    "publish_date": "6/10/2026",
    "archive_date": "TBD",

    "platforms": WEBSITE_PLATFORM,
    "content_category": "Market Commentary",
    "post_type": "Blog Article",
    "author": "Aaron Vann",
    "compliance_reviewer": "John Vann",
    "approval_date": "6/10/2026",
    "published_by": "Eric Capo",
    "published_url": "https://www.vannequitymanagement.com/blog/ai-ipos-market-impact.html",
    "screenshot_saved": "Yes",
    "archive_folder": "TBD",

    "media_filenames": "blog-hero-2026-06-10.jpg, blog-hero-2026-06-10.webp, blog-hero-2026-06-10-mobile.jpg",
    "screenshot_path": os.path.join(OUT_DIR, "images", "blog-004.png"),

    "caption_paragraphs": [
        "At-a-Glance",
        "The potential IPOs of SpaceX, OpenAI, and Anthropic are not just company stories. They may become market structure stories. These companies sit at the intersection of artificial intelligence, infrastructure, aerospace, private market valuations, and investor demand for innovation. This article is educational only and does not recommend buying, selling, participating in, or avoiding any IPO.",
        "Key Takeaways",
        "Major AI and space-related IPOs may test public market appetite for large private growth companies. A company can be important without being appropriate for every investor. IPO excitement should be balanced with valuation, profitability, liquidity, governance, and execution risk. This is market commentary only, not investment advice.",
        "When an IPO Becomes a Market Event",
        "Some IPOs simply introduce a company to public markets. Others can become market events.",
        "The potential public listings of SpaceX, OpenAI, and Anthropic may fall into the second category because they represent several forces investors are already watching: artificial intelligence, compute demand, aerospace infrastructure, private market valuations, and the public market's willingness to pay for future growth.",
        "Recent reporting has indicated that OpenAI confidentially filed for a U.S. IPO after Anthropic said it had also confidentially filed. Reuters also reported that SpaceX is pursuing what could become one of the largest public offerings in history. These reports matter because they suggest that some of the most important private companies in technology may be moving closer to public market access.",
        "That does not mean these offerings should be treated as automatic opportunities. It means they may become useful signals.",
        "A major IPO can tell investors something about risk appetite. It can show whether public markets are willing to absorb large private companies at high valuations. It can also reveal whether investors are prioritizing growth narratives, profitability, cash flow, or long-term optionality.",
        "For AI companies, the questions are complex. OpenAI and Anthropic are linked to frontier AI models, enterprise adoption, developer tools, cloud infrastructure, and large-scale compute. But these businesses may also require significant capital investment, talent spending, data center capacity, and ongoing research costs.",
        "SpaceX brings a different but related question. It is not only an aerospace company in the traditional sense. It also touches satellite communications, launch services, reusable rocket systems, and reported AI-related infrastructure ambitions. Reuters reported that SpaceX is targeting a large valuation and has discussed orbital AI computing tests as part of its longer-term growth narrative.",
        "The market may eventually decide that some of these companies deserve premium valuations. It may also decide that expectations became too aggressive. Both outcomes are possible.",
        "Importance Is Not Suitability",
        "For investors, the disciplined approach is to separate importance from suitability.",
        "A company can be strategically important and still be difficult to value. A business can be innovative and still face execution risk. A major IPO can be exciting and still trade with significant volatility.",
        "That is especially true when a company comes public with a large valuation, limited public trading history, or intense investor attention. Newly public companies often face a period where narrative, liquidity, index demand, and price discovery all interact at once.",
        "This is why investors should focus less on the headline and more on the process.",
        "Important questions include: What is the company actually earning today? How much of the valuation depends on future assumptions? What are the major risks listed in the prospectus? How much stock will be freely tradeable? What role could index inclusion play? How durable is the business model? What could go wrong?",
        "The possible IPO wave in AI and space may help define the next stage of market leadership. It may also test whether public investors are willing to fund capital-intensive innovation at scale.",
        "Either way, the takeaway is not to chase headlines. The takeaway is to study what the market is telling us.",
        "Risk and Context",
        "IPO investing can involve heightened risk, including limited public operating history, valuation uncertainty, liquidity constraints, lock-up expirations, governance concerns, and significant price volatility. These risks can be greater when investor enthusiasm is high or when expectations depend heavily on future growth.",
    ],

    "disclosure": AI_IPO_DISCLOSURE,

    "sources": [
        "Reuters: OpenAI expects to go public within the next year; OpenAI confidential IPO filing. (No URL published in article -- plain-text citation, predates the sources-must-be-links house rule.)",
        "Reuters: SpaceX aims to launch orbital AI computing tests and is pursuing a large IPO. (No URL published in article.)",
        "Investor.gov: IPO definition and investor education context. (No URL published in article.)",
    ],

    "approval_log": [
        ("Draft Completed", "Aaron Vann", "6/10/2026"),
        ("Compliance Review", "John Vann", "6/10/2026"),
        ("Approved", "John Vann", "6/10/2026"),
        ("Published", "TBD", "6/10/2026"),
    ],

    "revision_history": [
        ("1", "7/17/2026", "Marketing Record created retroactively for already-published post"),
    ],

    "notes": (
        "Backfilled record for a post that was already live before the Marketing Record process started. "
        "John Vann approved this post at the time it was created and posted, per standing firm practice -- "
        "this formal Marketing Record template did not exist yet when the site's original content was "
        "built, so Compliance Review/Approved above are being documented retroactively rather than logged "
        "in real time. Published By, Screenshot Saved, and Archive Folder are still TBD pending confirmation. "
        "Sources and References section lists outlets by name but has no clickable URLs -- flagged above for "
        "compliance follow-up per the standing house rule that all sources must be clickable links."
    ),
}

# ---------------------------------------------------------------------------
# RECORD 005 — "Global Energy Markets in 2026: Demand, Supply, and Risk" —
# published 6/10/2026, backfilled record.
# ---------------------------------------------------------------------------
record_5 = {
    "record_id": "Blog 005",
    "post_title": "Global Energy Markets in 2026: Demand, Supply, and Risk",
    "status": "Published",
    "date_created": "6/10/2026",
    "publish_date": "6/10/2026",
    "archive_date": "TBD",

    "platforms": WEBSITE_PLATFORM,
    "content_category": "Market Commentary",
    "post_type": "Blog Article",
    "author": "Aaron Vann",
    "compliance_reviewer": "John Vann",
    "approval_date": "6/10/2026",
    "published_by": "Eric Capo",
    "published_url": "https://www.vannequitymanagement.com/blog/global-energy-markets-2026.html",
    "screenshot_saved": "Yes",
    "archive_folder": "TBD",

    "media_filenames": "blog-hero-2026-06-10-energy.jpg, blog-hero-2026-06-10-energy.webp, blog-hero-2026-06-10-energy-mobile.jpg",
    "screenshot_path": os.path.join(OUT_DIR, "images", "blog-005.png"),

    "caption_paragraphs": [
        "At-a-Glance",
        "The global energy market is being shaped by several forces at once: oil supply risk, natural gas demand, electricity growth, AI data centers, renewable capacity expansion, and geopolitical uncertainty. This article is educational market commentary only and does not recommend any security, sector, commodity, or investment strategy.",
        "Key Takeaways",
        "Energy markets are being pulled between security, affordability, demand growth, and transition. Oil remains sensitive to geopolitical disruption and inventory pressure. Natural gas continues to play an important role in power generation and global energy security. Electricity demand is becoming a larger market driver, especially as AI data centers and electrification expand. Renewable capacity continues to grow, but grid reliability, storage, and transmission remain critical.",
        "Energy Is Being Pulled in Multiple Directions",
        "Energy is one of the few market themes that touches nearly everything. It affects inflation, transportation, manufacturing, utilities, consumer spending, national security, data centers, and corporate margins. It also sits at the center of the transition from traditional fossil fuels toward more electrified and lower-emission power systems.",
        "Oil markets are still sensitive to disruption. Natural gas remains important for power generation and industrial demand. Electricity consumption is rising as economies electrify. AI data centers are adding a new layer of demand. Renewables are growing quickly, but the grid still has to absorb that growth reliably.",
        "The result is a market that is not moving in one clean direction. It is a system under pressure from several sides at once.",
        "Oil Markets Remain Sensitive to Supply Risk",
        "Oil is still the most visible energy price for most consumers and investors. It affects gasoline, diesel, jet fuel, shipping, petrochemicals, and inflation expectations.",
        "The current oil market is especially sensitive to supply risk. The EIA's June 2026 Short-Term Energy Outlook describes global oil markets as highly volatile under its assumptions, including limited shipping traffic through the Strait of Hormuz and reduced Middle East production. EIA forecasts global oil demand to decline by 1.1 million barrels per day in 2026, compared with 104.0 million barrels per day in 2025, before rebounding in 2027.",
        "For investors, the lesson is that oil remains a security-sensitive market. Inventories, spare capacity, shipping lanes, policy decisions, and demand response can all matter. But that does not make oil easy to forecast.",
        "Natural Gas Remains a Key Bridge Fuel",
        "Natural gas continues to play an important role in the global energy system: power generation, heating, industrial processes, and liquefied natural gas exports. It can also act as a balancing fuel when renewable generation varies or when electricity demand spikes.",
        "Reuters reported that EIA expects U.S. dry natural gas production to rise from 107.7 billion cubic feet per day in 2025 to 111.0 billion cubic feet per day in 2026, with LNG exports also expected to increase.",
        "Natural gas also has its own risks. Prices can be affected by weather, storage levels, LNG export capacity, pipeline constraints, power demand, and policy.",
        "Electricity Demand Is Becoming the Bigger Story",
        "The energy conversation is shifting from barrels and pipelines to megawatts and grid capacity. Electricity demand is rising because more parts of the economy are becoming electric, and AI adds another layer because large data centers need substantial electricity and reliable grid connections.",
        "EIA expects U.S. power consumption to reach record highs in 2026 and 2027, with AI data centers and electrification helping drive demand.",
        "For investors, this means the energy story is not just oil and gas. It is also grid investment, power reliability, data center siting, cooling, storage, and electricity pricing.",
        "Renewables Continue to Scale",
        "Renewables remain one of the strongest growth areas in global energy. Reuters reported from IRENA data that global renewable power capacity reached 5,149 GW at the end of 2025, up 692 GW from 2024. Solar was the largest contributor, adding 511 GW.",
        "Renewables can help reduce exposure to fuel-price volatility, but they are not a full answer by themselves -- storage, transmission, permitting, interconnection, critical minerals, grid congestion, and local politics can all slow deployment.",
        "What This Means for Investors",
        "Energy markets matter because they influence both the economy and capital markets. For long-term investors, the most useful approach is to avoid reducing energy to a single headline -- it is not just oil, not just renewables, not just AI power demand, not just inflation. It is all of those at once.",
        "A disciplined investor may want to watch several indicators: oil inventories and supply disruption risk; natural gas storage, LNG exports, and power-sector demand; electricity demand growth; data center power requirements; renewable capacity additions; grid investment and transmission constraints; policy changes and permitting rules; and inflation sensitivity.",
        "Risk and Context",
        "Energy markets are volatile. Energy-related investments may carry significant risks, including commodity price volatility, regulatory risk, project execution risk, interest rate sensitivity, technology risk, and valuation risk. Market themes do not guarantee investment results.",
        "Practical Investor Takeaway",
        "The current global energy market is best understood as a transition under stress. That combination creates opportunity, but it also creates complexity. For investors, the key is not to chase the energy headline of the day. The key is to understand how energy affects inflation, infrastructure, company margins, and long-term market leadership. Energy is no longer just a commodity story. It is a market structure story.",
    ],

    "disclosure": ENERGY_DISCLOSURE,

    "sources": [
        "U.S. Energy Information Administration, June 2026 Short-Term Energy Outlook. (No URL published in article -- plain-text citation, predates the sources-must-be-links house rule.)",
        "Reuters: reporting on EIA natural gas production/LNG export forecasts. (No URL published in article.)",
        "Reuters / IRENA: 2026 renewable capacity statistics. (No URL published in article.)",
    ],

    "approval_log": [
        ("Draft Completed", "Aaron Vann", "6/10/2026"),
        ("Compliance Review", "John Vann", "6/10/2026"),
        ("Approved", "John Vann", "6/10/2026"),
        ("Published", "TBD", "6/10/2026"),
    ],

    "revision_history": [
        ("1", "7/17/2026", "Marketing Record created retroactively for already-published post"),
    ],

    "notes": (
        "Backfilled record for a post that was already live before the Marketing Record process started. "
        "John Vann approved this post at the time it was created and posted, per standing firm practice -- "
        "this formal Marketing Record template did not exist yet when the site's original content was "
        "built, so Compliance Review/Approved above are being documented retroactively rather than logged "
        "in real time. Published By, Screenshot Saved, and Archive Folder are still TBD pending confirmation. "
        "Sources are cited by name in-body (EIA, Reuters, IRENA) but have no clickable URLs -- flagged above "
        "for compliance follow-up per the standing house rule that all sources must be clickable links."
    ),
}

# ---------------------------------------------------------------------------
# RECORD 006 — "How Iran Tensions and the Strait of Hormuz Are Affecting
# Markets" — published 6/10/2026, backfilled record.
# ---------------------------------------------------------------------------
record_6 = {
    "record_id": "Blog 006",
    "post_title": "How Iran Tensions and the Strait of Hormuz Are Affecting Markets",
    "status": "Published",
    "date_created": "6/10/2026",
    "publish_date": "6/10/2026",
    "archive_date": "TBD",

    "platforms": WEBSITE_PLATFORM,
    "content_category": "Market Commentary",
    "post_type": "Blog Article",
    "author": "Aaron Vann",
    "compliance_reviewer": "John Vann",
    "approval_date": "6/10/2026",
    "published_by": "Eric Capo",
    "published_url": "https://www.vannequitymanagement.com/blog/iran-strait-of-hormuz-markets.html",
    "screenshot_saved": "Yes",
    "archive_folder": "TBD",

    "media_filenames": "blog-hero-2026-06-10-iran.jpg, blog-hero-2026-06-10-iran.webp, blog-hero-2026-06-10-iran-mobile.jpg",
    "screenshot_path": os.path.join(OUT_DIR, "images", "blog-006.png"),

    "caption_paragraphs": [
        "At-a-Glance",
        "Rising tensions involving Iran and the Strait of Hormuz can affect markets because the region is central to global energy flows. The market impact may show up through oil prices, shipping costs, inflation expectations, interest rates, equity volatility, and investor sentiment. This article is educational market commentary only and does not recommend any security, sector, commodity, or investment strategy.",
        "Key Takeaways",
        "The Strait of Hormuz is a critical energy transit chokepoint. Iran-related tensions can affect oil, LNG, shipping, insurance, and inflation expectations. Energy price shocks can flow into broader markets through interest rates, consumer costs, and corporate margins. Geopolitical market reactions can change quickly, especially when diplomacy, supply routes, or inventories shift. The disciplined response is to understand the risk, not to chase the headline.",
        "Why the Strait of Hormuz Matters",
        "The Strait of Hormuz is one of the most important energy chokepoints in the world. It connects the Persian Gulf with the Gulf of Oman and the Arabian Sea, making it a key route for crude oil, refined products, and liquefied natural gas moving from the Middle East to global customers.",
        "When tensions rise around Iran, investors pay attention because the Strait is narrow, strategically important, and difficult to replace quickly. Even when energy continues to move, the perception of risk can affect prices. Oil traders, shipping companies, insurers, governments, and investors all have to price the possibility that energy flows could become less reliable.",
        "How Energy Risk Moves Through Markets",
        "The most direct market channel is oil. When investors believe supply could be disrupted, oil prices may rise, which can influence both consumer inflation and business margins.",
        "The Strait of Hormuz also matters for liquefied natural gas -- LNG disruptions can affect countries that depend on imported gas for power generation, industrial activity, or winter heating. Shipping and insurance are another layer: when geopolitical risk rises, ships may slow down, reroute, wait outside danger zones, or pay higher insurance premiums, which can affect trade flows, supply chains, and the cost of doing business.",
        "Inflation, Rates, and Investor Sentiment",
        "Energy shocks matter because they can feed inflation expectations. If oil or fuel prices rise enough, consumers may feel it quickly, and businesses may face higher input costs.",
        "For the Federal Reserve and other central banks, energy shocks can be complicated. A sudden rise in energy prices can raise headline inflation, but if higher energy prices also slow consumer spending, the economic signal becomes mixed. That uncertainty can affect bond yields, equity valuations, and investor sentiment.",
        "Why Geopolitical Markets Can Reverse Quickly",
        "Geopolitical market moves can be sharp, but they can also reverse quickly -- oil prices may rise when conflict risk increases, then fall if shipping lanes remain open, diplomacy improves, inventories stabilize, or alternative supply routes become more credible. Investors should be careful about making portfolio decisions based only on one headline.",
        "What Investors Should Watch",
        "Investors may want to monitor several indicators: Brent and WTI crude oil prices; global oil inventory levels; LNG shipping activity; tanker traffic through the Strait; shipping insurance costs; OPEC and OPEC+ production decisions; U.S. and international diplomatic statements; inflation expectations; bond yields; and equity market volatility.",
        "What This Means for Investors",
        "Iran-related tension and Strait of Hormuz disruption can matter for portfolios, but not because every investor needs to make an immediate move -- they matter because energy is connected to inflation, interest rates, corporate profits, consumer spending, and market psychology. A disciplined investor should avoid turning geopolitical news into a trading impulse, and instead review whether the portfolio remains aligned with long-term goals, risk tolerance, liquidity needs, and time horizon.",
        "Risk and Context",
        "Energy markets are volatile. Geopolitical events can change quickly. A rise in energy prices does not guarantee positive results for energy-related investments, and a geopolitical event does not automatically create an investment opportunity.",
        "Practical Investor Takeaway",
        "The Strait of Hormuz matters because it is a pressure point in the global energy system. Iran tensions can affect markets through oil prices, LNG flows, shipping risk, inflation expectations, interest rates, and investor sentiment -- but the presence of risk does not automatically mean investors should make rapid portfolio changes. The disciplined approach is to understand the transmission mechanism, review the portfolio in context, and avoid letting geopolitical headlines replace a long-term investment process.",
    ],

    "disclosure": IRAN_DISCLOSURE,

    "sources": [
        "No Sources and References section in the published article. Body describes general market mechanics without named outlets or URLs -- predates the house rule requiring clickable source links. Flag for Brandy/John: confirm whether this pre-dates the rule and is grandfathered, or should be amended with real citations.",
    ],

    "approval_log": [
        ("Draft Completed", "Aaron Vann", "6/10/2026"),
        ("Compliance Review", "John Vann", "6/10/2026"),
        ("Approved", "John Vann", "6/10/2026"),
        ("Published", "TBD", "6/10/2026"),
    ],

    "revision_history": [
        ("1", "7/17/2026", "Marketing Record created retroactively for already-published post"),
    ],

    "notes": (
        "Backfilled record for a post that was already live before the Marketing Record process started. "
        "John Vann approved this post at the time it was created and posted, per standing firm practice -- "
        "this formal Marketing Record template did not exist yet when the site's original content was "
        "built, so Compliance Review/Approved above are being documented retroactively rather than logged "
        "in real time. Published By, Screenshot Saved, and Archive Folder are still TBD pending confirmation. "
        "This article has no linked sources -- flagged above for compliance follow-up."
    ),
}

# ---------------------------------------------------------------------------
# RECORD 007 — "When a Record Quarter Meets a Hawkish Fed" — published
# 6/30/2026, backfilled record.
# ---------------------------------------------------------------------------
record_7 = {
    "record_id": "Blog 007",
    "post_title": "When a Record Quarter Meets a Hawkish Fed",
    "status": "Published",
    "date_created": "6/30/2026",
    "publish_date": "6/30/2026",
    "archive_date": "TBD",

    "platforms": WEBSITE_PLATFORM,
    "content_category": "Market Commentary",
    "post_type": "Blog Article",
    "author": "Aaron Vann",
    "compliance_reviewer": "John Vann",
    "approval_date": "6/30/2026",
    "published_by": "Eric Capo",
    "published_url": "https://www.vannequitymanagement.com/blog/record-quarter-meets-hawkish-fed.html",
    "screenshot_saved": "Yes",
    "archive_folder": "TBD",

    "media_filenames": "blog-hero-2026-06-30.jpg, blog-hero-2026-06-30.webp, blog-hero-2026-06-30-mobile.jpg",
    "screenshot_path": os.path.join(OUT_DIR, "images", "blog-007.png"),

    "caption_paragraphs": [
        "At a Glance",
        "As the second quarter of 2026 closed, two things were true at the same time. U.S. equities just finished their strongest quarter in six years, and the Federal Reserve signaled that it may raise interest rates rather than cut them. Strength in the market and caution from the central bank are not a contradiction. For long-term investors, the more useful question is not which signal to believe, but how to hold both without overreacting to either. This article is educational only and does not recommend buying, selling, or avoiding any security.",
        "Key Takeaways",
        "The S&P 500 closed its best quarter in six years, led by technology and supported by strong corporate earnings and improving market breadth. At its June meeting, the Federal Reserve held rates steady but removed its prior expectation of a rate cut this year and signaled at least one possible hike. A strong market and a more cautious Fed can coexist; each is describing a different thing. Elevated valuations and a hawkish policy shift are real risks worth respecting, not reasons to abandon a long-term plan. This is market commentary only, not investment advice.",
        "A Record Quarter — and What Drove It",
        "By the close of June, the S&P 500 had registered its best quarterly performance in roughly six years, with the index up about 11% year to date. Analysts estimated S&P 500 year-over-year earnings growth of roughly 23% for the second quarter, extending a stretch of several consecutive quarters of double-digit profit growth.",
        "Leadership came from technology, where large-cap and semiconductor names tied to artificial intelligence and the ongoing capital-spending cycle rebounded after an earlier stretch of weakness. Market breadth improved, with roughly 64% of S&P 500 companies trading above their 50-day moving average late in the quarter, up from about half a month earlier. A falling oil price, as geopolitical tension around Iran appeared to ease, also relieved pressure on more economically sensitive sectors such as industrials and financials.",
        "The Fed Changes Its Tone",
        "While markets rallied, the Federal Reserve grew more cautious. At its June meeting -- the first chaired by Kevin Warsh -- the Federal Open Market Committee left its benchmark rate unchanged at 3.5% to 3.75%, but changed its outlook in a meaningful way.",
        "In its prior projections, the median official had expected rate cuts. In June, that expectation was removed. The median estimate for the federal funds rate at year-end 2026 rose to about 3.8%, up from 3.4% in March, implying the committee now sees at least one hike as more likely than a cut. Some forecasters went further -- Bank of America, for example, projected several quarter-point increases that would lift the rate toward 4.25% to 4.5%.",
        "The reason is inflation. Price pressures remain above the Fed's 2% goal, in part because of supply shocks in areas such as energy. When inflation is sticky, a central bank can be reluctant to ease even while the economy and markets look healthy.",
        "Two True Things at Once",
        "It can feel jarring for the market to celebrate while the Fed signals caution. But the two are measuring different things. The market, in the short run, reflects earnings, sentiment, liquidity, and expectations about the future. The Fed reflects its read on inflation and the labor market, and its job is to lean against overheating.",
        "Higher-for-longer or rising rates can pressure the valuations of exactly the fast-growing companies that led this rally, and a forward price-to-earnings ratio near 20 leaves less room for disappointment than a cheaper market would. At the same time, durable earnings growth and broadening participation are genuine positives.",
        "What Long-Term Investors Can Focus On",
        "For investors with a multi-year horizon, quarters like this are a good moment to return to process rather than prediction. A few questions tend to matter more than the headline: Is your asset allocation still aligned with your goals and time horizon, rather than with the last three months of returns? After a strong run, has any part of the portfolio grown well beyond its intended weight, suggesting a disciplined rebalance? How would the plan hold up if rates rose and the most expensive segments of the market repriced? Are decisions being driven by a long-term framework, or by the emotion of a record quarter or a hawkish headline?",
        "The goal is not to guess the Fed's next move or to chase the quarter's leaders. It is to stay invested in a way that can withstand more than one outcome, because both strength and caution are part of a normal market cycle.",
    ],

    "disclosure": STANDARD_BLOG_DISCLOSURE,

    "sources": [
        "TheStreet and Schwab: market coverage noting the S&P 500 and Nasdaq closing their best quarter in about six years (June 2026). (No URL published in article.)",
        "FactSet Earnings Insight: estimated Q2 2026 S&P 500 year-over-year earnings growth (~23%) and forward 12-month P/E (~20). (No URL published in article.)",
        "Deutsche Bank / market commentary: tech-led rebound and improving market breadth into quarter-end. (No URL published in article.)",
        "CNBC and Federal Reserve: June 17, 2026 FOMC decision, updated projections, and the shift away from an expected cut. (No URL published in article.)",
        "Fortune: Bank of America's projection for multiple 2026 rate hikes toward 4.25%-4.5%. (No URL published in article.)",
    ],

    "approval_log": [
        ("Draft Completed", "Aaron Vann", "6/30/2026"),
        ("Compliance Review", "John Vann", "6/30/2026"),
        ("Approved", "John Vann", "6/30/2026"),
        ("Published", "TBD", "6/30/2026"),
    ],

    "revision_history": [
        ("1", "7/17/2026", "Marketing Record created retroactively for already-published post"),
    ],

    "notes": (
        "Backfilled record for a post that was already live before the Marketing Record process started. "
        "John Vann approved this post at the time it was created and posted, per standing firm practice -- "
        "this formal Marketing Record template did not exist yet when the site's original content was "
        "built, so Compliance Review/Approved above are being documented retroactively rather than logged "
        "in real time. Published By, Screenshot Saved, and Archive Folder are still TBD pending confirmation. "
        "Sources and References section lists outlets by name but has no clickable URLs -- flagged above for "
        "compliance follow-up per the standing house rule that all sources must be clickable links."
    ),
}

# ---------------------------------------------------------------------------
# RECORD "Insight 001" — first Marketing Record for a Financial Market
# Insight (separate numbering sequence from the Blog records, per the
# multi-channel convention above -- this is a distinct content type/channel).
# Sourcing differs from the blog records: the content is the firm's own
# proprietary newsletter PDF (copied verbatim per house rule), not commentary
# built from external news articles, so "Supporting Documentation" points to
# that internal source PDF rather than external URLs.
# ---------------------------------------------------------------------------
INSIGHT_WEBSITE_PLATFORM = "VEM Website — vannequitymanagement.com/insights"

FMI_DISCLOSURE = (
    "Disclaimer: The Financial Market Insight is protected by federal and international copyright laws. Vann "
    "Equity Management is the publisher of the newsletter and owner of all rights therein and retains property "
    "rights to the newsletter. The Financial Market Insight may not be forwarded, copied, downloaded, stored in "
    "a retrieval system, or otherwise reproduced or used in any form or by any means without express written "
    "permission from Vann Equity Management. The information contained in Financial Market Insight is not "
    "necessarily complete, and its accuracy is not guaranteed. Neither the information contained in Financial "
    "Market Insight, nor any opinion expressed in it, constitutes a solicitation for the purchase of any future "
    "or security referred to in the Newsletter. The Newsletter is strictly an informational publication and "
    "does not provide individual, customized investment or trading advice. READERS SHOULD VERIFY ALL CLAIMS AND "
    "COMPLETE THEIR OWN RESEARCH AND CONSULT A REGISTERED FINANCIAL PROFESSIONAL BEFORE INVESTING IN ANY "
    "INVESTMENTS MENTIONED IN THE PUBLICATION. INVESTING IN SECURITIES, OPTIONS, AND FUTURES IS SPECULATIVE AND "
    "CARRIES A HIGH DEGREE OF RISK, AND SUBSCRIBERS MAY LOSE MONEY TRADING AND INVESTING IN SUCH INVESTMENTS."
)

record_8 = {
    "record_id": "Insight 001",
    "post_title": "Did Markets Pass or Fail the Three Tests?",
    "status": "Published",
    "date_created": "7/20/2026",
    "publish_date": "7/20/2026",
    "archive_date": "TBD",

    "platforms": INSIGHT_WEBSITE_PLATFORM,
    "content_category": "Financial Market Insight",
    "post_type": "Financial Market Insight Newsletter",
    "author": "Vann Equity Management",
    "compliance_reviewer": "Aaron Vann",
    "approval_date": "7/20/2026",
    "published_by": "Eric Capo",
    "published_url": "https://www.vannequitymanagement.com/insights/did-markets-pass-or-fail-the-three-tests.html",
    "screenshot_saved": "Yes",
    "archive_folder": "TBD",

    "media_filenames": (
        "insights-hero-2026-07-20.jpg, insights-hero-2026-07-20.webp, insights-hero-2026-07-20-mobile.jpg, "
        "fmi-2026-07-20-sp500.png/.webp, fmi-2026-07-20-inflation.png/.webp, fmi-2026-07-20-oil-metals.png/.webp"
    ),
    "screenshot_path": os.path.join(OUT_DIR, "images", "insight-001.png"),

    "caption_paragraphs": [
        "Highlights",
        "Did Markets Pass or Fail the Three Tests?",
        "Economic Cheat Sheet: Important Growth Updates",
        "Evolution of the AI Trade: ROCs, SOCs and SaaS",
        "Are Bad IBM Results a Warning for Broader Tech?",
        "What Is the Copper-Gold Ratio Telling Us?",
        "Summary",
        "Our investment committee's three market tests came back mixed: AI infrastructure earnings from ASML and Taiwan Semiconductor raised new questions about spending sustainability, even as inflation data and Fed Chair Warsh's testimony both came in favorably. Also inside: the AI trade's new three-way split (ROCs, SOCs, and SaaS), what IBM's historic one-day selloff means for tech spending broadly, and what the copper-gold ratio is signaling about the economy.",
        "Full body content copied verbatim from the source PDF (assets/docs/VEM-Financial-Market-Insight-2026-07-20.pdf) per the financial-market-insight skill's hard rule -- see that PDF and the published URL above for the complete text of Stocks, the Three Tests, Economic Data, Commodities & Currencies, the AI Trade section, IBM's Warning, and the Copper-Gold Ratio section.",
    ],

    "disclosure": FMI_DISCLOSURE,

    "sources": [
        "Source PDF: assets/docs/VEM-Financial-Market-Insight-2026-07-20.pdf (Vann Equity Management's own "
        "research newsletter -- body text and all chart/figure images copied verbatim/extracted directly "
        "from this document, not external news sources).",
        "S&P 500 technical chart, inflation infographic, and oil/metals infographic: extracted directly "
        "from the source PDF above via high-DPI render + crop (pixel-for-pixel from the original, not "
        "recreated) -- credited in-article to 'Factset and Vann Equity Management Research Team.'",
    ],

    "approval_log": [
        ("Draft Completed", "Vann Equity Management", "7/20/2026"),
        ("Compliance Review", "Aaron Vann", "7/20/2026"),
        ("Approved", "Aaron Vann", "7/20/2026"),
        ("Published", "Eric Capo", "7/20/2026"),
    ],

    "revision_history": [
        ("1", "7/20/2026", "Marketing Record created at time of publish -- first record in the Insight sequence"),
    ],

    "notes": (
        "First Marketing Record under the new 'Insight NNN' numbering sequence, kept separate from the "
        "Blog NNN sequence per the multi-channel convention documented at the top of this file (Financial "
        "Market Insight is a distinct content type/channel from the blog). Body text and all three chart "
        "images are copied/extracted verbatim from the firm's own source PDF rather than built from external "
        "news commentary, so this record's Supporting Documentation section cites that internal PDF instead "
        "of external article URLs -- there is no compliance gap here, just a different sourcing convention "
        "for proprietary firm research versus market-commentary blog posts. Published By reflects Eric Capo's "
        "explicit go-ahead to merge/push live and confirmation that CCO sign-off (Aaron Vann) was already in "
        "hand at that time."
    ),
}

if __name__ == "__main__":
    for rec in (record_1, record_2, record_3, record_4, record_5, record_6, record_7, record_8):
        doc = build_record(rec)
        prefix = rec["record_id"]
        path = os.path.join(
            OUT_DIR,
            prefix + " - " + rec["post_title"][:55].replace(":", "").replace("/", "-") + ".docx",
        )
        doc.save(path)
        print("Wrote:", path)
