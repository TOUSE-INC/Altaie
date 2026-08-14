# Fahad Hamid Chauffeur Campaign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Fahad Hamid Altaie's consistent demo chauffeur identity and integrate a four-image monochrome campaign across the public and owner experiences.

**Architecture:** Keep the existing Next.js App Router components and CSS layout intact. Add optimized WebP assets under one chauffeur campaign directory, update only consuming image/name references, and protect the user-visible identity contract with rendered HTTP assertions before implementation.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, `next/image`, Node test runner, built-in Image Generation, WebP assets, Vercel Git deployment.

## Global Constraints

- The displayed chauffeur name is exactly `Fahad Hamid`.
- Preserve Altaie's current monochrome visual system, typography, layout, navigation, interactions, and truthful private-beta disclosures.
- Use the supplied Fahad photographs only as identity references; no visible social-media UI, text, logos, or watermarks may remain in final assets.
- Do not change the rider named `Marcus Bell` or the other demo chauffeurs Lena R. and Omar K.
- Do not represent a real reservation, dispatch, owned fleet, or live vehicle position.

---

### Task 1: Lock the chauffeur identity contract

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: server-rendered HTML from `/book` and authenticated `/owner`.
- Produces: a regression test that fails if Fahad is missing or former Marcus chauffeur identities return.

- [ ] **Step 1: Write the failing rendered test**

Add assertions after the booking HTML is normalized:

```js
assert.match(bookingText, /Fahad Hamid/);
assert.doesNotMatch(bookingText, /Marcus Reed/);
```

In the authenticated dashboard loop, read the `/owner` response body and assert:

```js
assert.match(await authenticatedResponse.text(), /Fahad Hamid/);
```

- [ ] **Step 2: Run the test to verify RED**

Run: `node --test tests/rendered-html.test.mjs`

Expected: FAIL because `/book` still renders `Marcus Reed`.

- [ ] **Step 3: Commit the failing contract test**

```bash
git add tests/rendered-html.test.mjs
git commit -m "test Altaie chauffeur identity"
```

### Task 2: Produce and optimize Fahad campaign assets

**Files:**
- Create: `public/images/chauffeurs/fahad-hamid-portrait.webp`
- Create: `public/images/chauffeurs/fahad-hamid-arrival.webp`
- Create: `public/images/chauffeurs/fahad-hamid-airport.webp`
- Create: `public/images/chauffeurs/fahad-hamid-fleet.webp`

**Interfaces:**
- Consumes: the user's seven Fahad reference images and Altaie's current monochrome image treatment.
- Produces: one square portrait, one wide hero, and two 3:2 editorial service images ready for `next/image` or CSS backgrounds.

- [ ] **Step 1: Generate each distinct asset separately**

Use the built-in image generator with identity preservation, labeling every user photo as an identity reference and Altaie's current campaign imagery as style/composition reference only.

- [ ] **Step 2: Inspect every output**

Confirm facial consistency, black suit styling, clean vehicle geometry, usable crops, monochrome treatment, and absence of UI, text, logos, or watermarks.

- [ ] **Step 3: Copy and optimize selected outputs**

Convert the square portrait to 1024×1024 WebP and the campaign images to responsive WebP assets at their generated landscape ratios. Preserve source files outside the public tree; do not overwrite existing Altaie assets.

### Task 3: Replace the chauffeur identity and image references

**Files:**
- Modify: `app/book/AltaieTripExperience.tsx`
- Modify: `app/owner/OwnerDashboard.tsx`
- Modify: `app/portal/AdvancedMobilePortal.tsx`
- Modify: `app/portal/PortalPrototype.tsx`
- Modify: `app/portal/portal.css`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: the four campaign paths created in Task 2.
- Produces: public and owner interfaces that consistently render Fahad Hamid.

- [ ] **Step 1: Update the booking flow**

Replace `Marcus Reed`, the Marcus portrait path, the desk-panel reference, and the live summary name with `Fahad Hamid` and `/images/chauffeurs/fahad-hamid-portrait.webp`. Point the Escalade fleet card to `/images/chauffeurs/fahad-hamid-airport.webp` with its actual dimensions and identity-aware alt text.

- [ ] **Step 2: Update owner operations**

Replace only `Marcus T.` driver records and roster entries with `Fahad Hamid` and the new portrait path. Keep the rider named `Marcus Bell` unchanged. Use the airport image in the owner hero and the fleet image in the Escalade network showcase.

- [ ] **Step 3: Update the public hero**

Point `.home-hero__image` to `/images/chauffeurs/fahad-hamid-arrival.webp`; preserve all existing grayscale, contrast, position, overlay, and responsive behavior.

- [ ] **Step 4: Update the client portal**

Name Fahad on the upcoming movement and replace the former Marcus initials/name with Fahad's portrait and full name in both mobile and desktop ride-detail states.

- [ ] **Step 5: Build and verify GREEN**

Run: `npm run build && node --test tests/rendered-html.test.mjs`

Expected: PASS, including the Fahad identity assertions and dashboard access checks.

- [ ] **Step 6: Run the full check**

Run: `npm run check`

Expected: lint, unit tests, production build, and rendered HTML tests all pass without warnings or failures.

### Task 4: Browser verification and design QA

**Files:**
- Modify: `design-qa.md`
- Create: `docs/design-qa/fahad-campaign-home.jpg`
- Create: `docs/design-qa/fahad-campaign-book.jpg`
- Create: `docs/design-qa/fahad-campaign-owner.jpg`

**Interfaces:**
- Consumes: locally rendered `/`, `/book`, and authenticated `/owner` states.
- Produces: browser-rendered evidence and a passing design-QA report.

- [ ] **Step 1: Start the supported local preview and open it in the cloud browser**

Run: `sites-preview start "$PWD"`

Open the homepage, booking itinerary, live-trip state, and authenticated owner overview in the cloud browser.

- [ ] **Step 2: Test the primary journey**

Verify the itinerary loads, Fahad's portrait/name render, `View live trip` works, demo advancement still works, the desk panel opens/closes, owner navigation works, and all campaign images return successfully.

- [ ] **Step 3: Capture and compare**

Capture desktop and mobile evidence. Combine the generated source assets with the matching rendered crops and compare identity, crop, monochrome treatment, typography, spacing, colors, copy, and image quality.

- [ ] **Step 4: Update the QA report**

Record source paths, implementation screenshots, viewport/state, interactions, console/network checks, iteration history, and `final result: passed` only after no P0/P1/P2 issues remain.

### Task 5: Publish the verified campaign

**Files:**
- Modify: Git branch and deployment state only.

**Interfaces:**
- Consumes: a clean, verified feature branch.
- Produces: a merged GitHub change and READY Vercel production deployment on the Altaie domain.

- [ ] **Step 1: Commit the implementation intentionally**

```bash
git add app/book/AltaieTripExperience.tsx app/owner/OwnerDashboard.tsx app/globals.css public/images/chauffeurs design-qa.md docs/design-qa docs/superpowers
git commit -m "feature Fahad Hamid across Altaie"
```

- [ ] **Step 2: Publish for review**

Create the remote branch, ready-for-review pull request, and wait for the quality and Vercel preview checks to succeed.

- [ ] **Step 3: Merge and verify production**

Merge to `main`, wait for the production deployment to reach `READY`, verify `https://www.altaiedc.com/`, `/book`, and the protected owner surface, and scan production errors.
