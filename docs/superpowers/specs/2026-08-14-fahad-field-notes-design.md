# Fahad Hamid Field Notes Design

## Purpose

Add a focused editorial layer to Altaie that earns discovery by answering high-intent Washington executive-mobility questions with original operating judgment. The section will be called **Field Notes**, and every launch article will carry a visible Fahad Hamid byline linked to a dedicated author profile.

The work must improve the site for human readers first. It must not create thin location pages, keyword-variant pages, a synthetic FAQ farm, `llms.txt`, or unsupported claims about an “AI ranking” advantage.

## Audience and outcome

The primary reader is an executive assistant, chief of staff, corporate travel manager, private aviation coordinator, or principal comparing how to move through Washington. A successful visit should let that reader make or brief a real transportation decision without needing a second generic article.

The business outcome is qualified discovery for Altaie’s core service lines: airport transfers, hourly assignments, private aviation handoffs, and corporate movement.

## Editorial launch set

### 1. DCA or IAD? Choose the Washington airport by ground risk

- Search intent: airport selection for a Washington executive itinerary.
- Original value: a decision framework based on the first hard appointment, curb handoff, bags, and the day’s final geography instead of airfare alone.
- Public-source support: the official passenger-meeting guidance for DCA and IAD.
- Conversion path: airport service and ride request.

### 2. FBO to boardroom: the private aviation chauffeur brief that prevents a missed handoff

- Search intent: private aviation ground transportation and FBO chauffeur coordination in Washington.
- Original value: a handoff brief organized around handler/FBO, tail number, passenger-release trigger, access confirmation, contact hierarchy, bags, vehicle, and first hard door time.
- Safety boundary: facility access is described as handler-specific and must be confirmed; the article will not claim universal airside access.
- Conversion path: corporate movement and ride request.

### 3. The six-stop Washington day: when hourly chauffeur service beats separate rides

- Search intent: choosing hourly chauffeur service for a Washington board day, roadshow, or multi-stop principal itinerary.
- Original value: a decision matrix based on uncertainty and continuity rather than trip count alone, plus an illustrative movement sheet.
- Conversion path: hourly service and ride request.

## Content model

Each article has one canonical data record containing:

- slug, title, description, category, answer-first summary, published/modified dates, reading time, hero image, and alt text;
- key takeaways;
- structured sections composed from paragraphs, bullet lists, a comparison table, a labeled illustrative movement brief, and source links;
- internal service links and related-article links.

The record is the single source for the journal hub, article route, metadata, sitemap, and structured data. Missing slugs return the Next.js 404 state.

## Page architecture

### `/journal`

An editorial index with a restrained hero, a featured article, two supporting cards, a compact author module, and links to the relevant service pages. The page uses semantic headings and real text links.

### `/journal/[slug]`

The article template renders:

1. visible breadcrumbs;
2. category, H1, answer-first deck, author/date/read time;
3. high-resolution campaign image;
4. “Decision in brief” summary;
5. an on-page section navigation;
6. article sections, visible comparison tables or briefs, and source notes;
7. linked Fahad Hamid author card;
8. related Field Notes and ride-request CTA.

### `/journal/fahad-hamid`

A profile page whose primary focus is Fahad Hamid. It uses only verified site context: Fahad is an Altaie chauffeur and Field Notes author covering airport arrivals, private aviation handoffs, and assistant-led Washington itineraries. It will not invent years of experience, awards, licenses, education, or social profiles.

## Visual direction

Extend Altaie’s current monochrome editorial system: Newsreader display type, Manrope body type, hard one-pixel rules, square corners, ivory fields, black service bands, and the existing Fahad Hamid campaign photography. Article body width stays narrow enough for comfortable reading while decision tables and side notes use the wider grid.

The three launch images are reused from the campaign and rendered as crawlable `<img>` content through `next/image`, with descriptive alt text. No new visual language is introduced.

## Search and AI-discovery implementation

Google’s August 2026 guidance says AI Overviews and AI Mode use the same foundational Search requirements and do not require special schema or AI text files. The implementation therefore focuses on:

- server-rendered, crawlable text;
- descriptive titles and meta descriptions;
- one stable canonical URL per page;
- real internal links from the header, footer, hub, articles, and homepage;
- stable sitemap `lastModified` values instead of generating a new timestamp on every request;
- visible author, publication date, modification date, and editorial method;
- concise answer-first summaries that help readers, not keyword-stuffed “AI chunks”;
- original decision frameworks and clearly labeled illustrative examples;
- relevant, high-resolution images with accurate alt text.

No `FAQPage` markup will be added. Google removed its FAQ rich-result documentation in 2026, and the launch pages do not need unsupported markup to be understandable.

## Structured data

### Article pages

Each article emits one JSON-LD graph with:

- `BlogPosting` including `headline`, `description`, `image`, `datePublished`, `dateModified`, `mainEntityOfPage`, `author`, and `publisher`;
- a `Person` reference pointing to the Fahad profile URL;
- an `Organization` publisher reference pointing to Altaie’s stable organization ID;
- `BreadcrumbList` matching the visible breadcrumb trail.

### Author page

The author page emits `ProfilePage` with a `Person` main entity, portrait, role, affiliation, description, and `hasPart` references to the visible articles.

### Homepage

The existing organization markup is corrected to use `https://www.altaiedc.com`, a stable `@id`, and a crawlable logo URL. It remains on the homepage rather than being duplicated across every route.

Structured data must describe visible page content exactly. It is eligibility and entity-understanding data, not a ranking guarantee.

## Canonical domain and dates

The production canonical origin is fixed at `https://www.altaiedc.com` in the shared site-configuration module so deployment environment drift cannot rewrite public identity. Launch publication timestamps use `2026-08-14T02:00:00-04:00`; modified timestamps initially match publication.

## Editorial method

The profile page explains that Field Notes use AI-assisted research and copyediting, the public sources linked in each article, and Altaie’s published service standards. The language does not claim that an AI system independently verified operational facts. Each article directs readers to reconfirm current airport or facility instructions before travel.

## Testing and verification

Rendered-route tests must prove:

- the journal hub, profile, and all three article URLs return 200;
- every article shows the exact Fahad Hamid byline and links to his profile;
- every article has a canonical, `BlogPosting`, `BreadcrumbList`, ISO dates, publisher, and visible source links;
- the author page has `ProfilePage` and all three article links;
- the hub and homepage expose crawlable links to the journal;
- the sitemap includes the hub, profile, and all article URLs with stable dates;
- no `FAQPage` or `llms.txt` implementation is introduced.

After automated checks, verify the journal hub, one article, the author page, sitemap, metadata, images, responsive layout, links, and production deployment in the cloud browser.

## Primary guidance used

- Google Search Central, “Google’s Guide to Optimizing for Generative AI Features on Google Search” — https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google Search Central, “AI features and your website” — https://developers.google.com/search/docs/appearance/ai-features
- Google Search Central, “Creating helpful, reliable, people-first content” — https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Search Central, “Article structured data” — https://developers.google.com/search/docs/appearance/structured-data/article
- Google Search Central, “Profile page structured data” — https://developers.google.com/search/docs/appearance/structured-data/profile-page
- Google Search Central, “Breadcrumb structured data” — https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- Google Search Central, “General structured data guidelines” — https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Schema.org 30.0 — https://schema.org/version/latest
