# Fahad Hamid Field Notes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a crawlable, niche Washington executive-mobility journal with three Fahad Hamid articles, an author profile, accurate metadata, and Google-supported structured data.

**Architecture:** Store the launch articles in one typed server-side content module and render them through a static Next.js App Router hub, dynamic article route, and author route. Centralize canonical identity in `lib/site.ts`; derive metadata, JSON-LD, related content, and sitemap entries from the same article records so visible content and machine-readable content cannot drift.

**Tech Stack:** Next.js 16 App Router, React 19 server components, TypeScript, CSS, Node test runner, JSON-LD.

## Global Constraints

- Production canonical origin is `https://www.altaiedc.com`, with `NEXT_PUBLIC_SITE_URL` accepted as an override.
- The visible and structured-data author name is exactly `Fahad Hamid`.
- Do not invent credentials, years of experience, awards, licenses, education, or social profiles.
- Do not add `FAQPage`, `llms.txt`, thin location pages, or keyword-variant pages.
- Structured data must match visible content and use ISO 8601 dates with timezone information.
- Reuse the existing monochrome Altaie design system and Fahad campaign photography.

---

### Task 1: Lock the public editorial contract with rendered-route tests

**Files:**
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: production Next server test harness already defined in the file.
- Produces: a failing contract for `/journal`, `/journal/fahad-hamid`, three article routes, JSON-LD, canonical metadata, and sitemap discovery.

- [ ] **Step 1: Add a failing journal test**

Add a test that fetches these paths:

```js
const articlePaths = [
  "/journal/dca-iad-bwi-ground-risk",
  "/journal/fbo-to-boardroom-chauffeur-brief",
  "/journal/hourly-chauffeur-washington-board-day",
];
```

Assert 200 responses; `Fahad Hamid`; the author profile link; `BlogPosting`; `BreadcrumbList`; `datePublished`; canonical links; visible source notes; and absence of `FAQPage`.

- [ ] **Step 2: Add author, hub, homepage, and sitemap assertions**

Assert that `/journal/fahad-hamid` contains `ProfilePage` and all article links, `/journal` and `/` expose crawlable journal links, and `/sitemap.xml` includes every path under the production origin.

- [ ] **Step 3: Run the rendered test against the current build**

Run: `node --test tests/rendered-html.test.mjs`

Expected: FAIL because `/journal` returns 404.

- [ ] **Step 4: Commit the red test**

```bash
git add tests/rendered-html.test.mjs
git commit -m "test: define Fahad Field Notes contract"
```

### Task 2: Add canonical site identity and typed editorial content

**Files:**
- Create: `lib/site.ts`
- Create: `app/journal/articles.ts`

**Interfaces:**
- Produces: `SITE_URL`, `organizationId`, `authorUrl`, `ArticleRecord`, `articles`, `getArticle(slug)`, and `articlePaths`.

- [ ] **Step 1: Create stable site identity**

Implement:

```ts
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const SITE_URL = configuredSiteUrl || "https://www.altaiedc.com";
export const organizationId = `${SITE_URL}/#organization`;
export const authorUrl = `${SITE_URL}/journal/fahad-hamid`;
```

- [ ] **Step 2: Define the article record types**

Use discriminated content blocks for paragraphs, lists, decision tables, movement briefs, and source lists. Include one exact `datePublished` and `dateModified` string per article.

- [ ] **Step 3: Write the three complete article records**

Write all visible copy, source links, service links, and related article IDs in the content module. Clearly label sample itineraries and briefs as illustrative.

- [ ] **Step 4: Run lint on the new modules**

Run: `npx eslint lib/site.ts app/journal/articles.ts`

Expected: exit 0.

- [ ] **Step 5: Commit the content model**

```bash
git add lib/site.ts app/journal/articles.ts
git commit -m "content: add Fahad Field Notes library"
```

### Task 3: Build the journal hub, author profile, and article renderer

**Files:**
- Create: `app/journal/layout.tsx`
- Create: `app/journal/page.tsx`
- Create: `app/journal/fahad-hamid/page.tsx`
- Create: `app/journal/[slug]/page.tsx`
- Create: `app/journal/journal.css`

**Interfaces:**
- Consumes: article and site exports from Tasks 2.
- Produces: statically generated journal routes and visible editorial UI.

- [ ] **Step 1: Add the route layout and stylesheet import**

Create a server layout that imports `journal.css` and returns `children` unchanged.

- [ ] **Step 2: Build the journal index**

Render a featured article, supporting cards, visible published dates, descriptive image alt text, Fahad profile link, and service links. Export canonical metadata for `/journal`.

- [ ] **Step 3: Build the author profile**

Render Fahad’s portrait, bounded biography, editorial method, article list, and `ProfilePage` JSON-LD whose `mainEntity` is a `Person` named `Fahad Hamid`.

- [ ] **Step 4: Build static article routing and metadata**

Implement `generateStaticParams`, `generateMetadata`, and `notFound()` for unknown slugs. Metadata includes canonical, article Open Graph fields, published/modified times, author, and representative campaign image.

- [ ] **Step 5: Render the article body and JSON-LD**

Render every content-block type as semantic HTML. Emit `BlogPosting` and `BreadcrumbList` in one JSON-LD `@graph`, with the author URL pointing to the profile page and the publisher pointing to the organization ID.

- [ ] **Step 6: Style the responsive editorial system**

Use the existing tokens, typefaces, one-pixel rules, black/ivory fields, and square geometry. Keep prose at a readable measure; make tables scroll safely on small screens; maintain visible focus states.

- [ ] **Step 7: Run lint and build**

Run: `npm run lint && npm run build`

Expected: both commands exit 0 and the route list includes the journal hub, author page, and three static article paths.

- [ ] **Step 8: Commit the journal routes**

```bash
git add app/journal
git commit -m "feat: build Fahad Field Notes journal"
```

### Task 4: Connect discovery, canonical schema, and sitemap

**Files:**
- Modify: `app/components/SiteChrome.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `app/sitemap.ts`

**Interfaces:**
- Consumes: `articles`, `SITE_URL`, and `organizationId`.
- Produces: sitewide journal discovery and stable crawler signals.

- [ ] **Step 1: Add Field Notes to primary and footer navigation**

Add a text link to `/journal` in the desktop/mobile navigation and Explore footer column.

- [ ] **Step 2: Add a homepage editorial module**

Render the three article links with title, category, and concise deck between the metrics and final CTA. Use semantic `<article>` elements and normal links.

- [ ] **Step 3: Correct homepage organization identity**

Replace the old hard-coded `https://altaie.app` URL with `SITE_URL`, add the stable organization `@id`, and include the crawlable logo URL.

- [ ] **Step 4: Add stable sitemap entries**

Use a fixed modification date for existing static routes and article record dates for the journal routes. Include `/journal`, `/journal/fahad-hamid`, and every article path.

- [ ] **Step 5: Run the rendered-route test**

Run: `npm run build && node --test tests/rendered-html.test.mjs`

Expected: all rendered-route tests pass, including the new journal contract.

- [ ] **Step 6: Commit discovery and sitemap work**

```bash
git add app/components/SiteChrome.tsx app/page.tsx app/globals.css app/sitemap.ts
git commit -m "feat: surface Field Notes across Altaie"
```

### Task 5: Verify the full feature and production artifact

**Files:**
- Modify: `design-qa.md`
- Create: `docs/design-qa/fahad-field-notes-*.jpg`

**Interfaces:**
- Consumes: built application and production deployment.
- Produces: automated, visual, schema, and deployment evidence.

- [ ] **Step 1: Run the full check**

Run: `npm run check`

Expected: lint, unit tests, production build, and rendered-route tests all pass with zero failures.

- [ ] **Step 2: Inspect structured data in rendered HTML**

Parse each JSON-LD script from one article and the author page with `JSON.parse`. Assert the expected types and stable canonical IDs.

- [ ] **Step 3: Verify journal UI in the cloud browser**

Open the hub, first article, and author page at desktop and mobile widths. Check hero crops, reading measure, source links, table overflow, keyboard focus, console errors, and 404 behavior for an unknown slug.

- [ ] **Step 4: Record QA evidence**

Save screenshots under `docs/design-qa/` and append the tested routes, viewports, structured-data results, and final pass/fail line to `design-qa.md`.

- [ ] **Step 5: Review the complete diff**

Run: `git diff --check && git status -sb && git diff --stat`

Expected: no whitespace errors and only Field Notes files/changes are present.

- [ ] **Step 6: Commit QA evidence**

```bash
git add design-qa.md docs/design-qa
git commit -m "test: verify Fahad Field Notes experience"
```

### Task 6: Publish through GitHub and Vercel

**Files:**
- No source files added.

**Interfaces:**
- Produces: merged GitHub pull request and READY production deployment on `www.altaiedc.com`.

- [ ] **Step 1: Confirm publish scope and authentication**

Run `git status -sb`, inspect the branch log, then check `gh --version` and `gh auth status` without exposing credentials.

- [ ] **Step 2: Push and open a pull request**

Push `agent/fahad-field-notes`, open a PR targeting `main`, and include the editorial, schema, testing, and design-verification summary.

- [ ] **Step 3: Merge after checks**

Confirm required checks, mark the PR ready if needed, and merge it to `main`.

- [ ] **Step 4: Verify the Vercel deployment**

Confirm the deployment built from the merge commit reaches `READY`, the custom domain serves the new routes, and runtime errors for `/journal*` are empty.

- [ ] **Step 5: Verify production discovery**

Fetch the public journal, one article, author profile, and sitemap; confirm 200 status, canonical custom-domain URLs, JSON-LD types, and visible article links.

