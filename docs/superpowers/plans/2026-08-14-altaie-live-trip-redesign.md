# Altaie Live Trip Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Altaie’s `/book` experience around selected design option 2: a truthful, itinerary-led private-beta journey with a simulated assigned chauffeur, an accurate interactive Washington map, live ETA states, fleet exploration, and the existing request flow.

**Architecture:** Keep the existing Next.js App Router application and its public request API. Add a client-side experience shell that defaults to the selected simulated itinerary, embeds the existing request flow without duplicating its backend contract, and isolates deterministic trip-status behavior in a small tested module. Render the route with MapLibre and public CARTO light tiles, and use Phosphor icons plus the repository’s existing chauffeur and fleet imagery.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS, MapLibre GL JS, Phosphor Icons, Node test runner.

## Global Constraints

- The selected visual truth is `/workspace/scratch/4bcbeb9d754c/generated_images/exec-edaed68a-1e5a-48fd-b766-140294c78680.png`.
- The demo must say `Private beta`, `Demo itinerary`, or `Simulated live data`; it must not imply a real chauffeur assignment.
- Preserve the existing `/api/leads` request contract and keep the existing request flow available from `/book`.
- Use existing Altaie imagery for Marcus Reed and the fleet; do not create CSS art, handcrafted SVGs, emoji icons, or placeholder images.
- The primary mobile target is 393 CSS pixels wide; the experience must also remain usable on desktop.
- No new routes, authentication system, database schema, payment flow, or real dispatch integration.

---

### Task 1: Deterministic Trip Simulator Contract

**Files:**
- Create: `app/book/trip-simulator.mjs`
- Create: `app/book/trip-simulator.d.ts`
- Create: `tests/trip-simulator.unit.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `TRIP_STAGES`, `getTripSnapshot(stageIndex, elapsedSeconds)`, and `advanceTripStage(stageIndex)`.
- Consumes: no application state or browser APIs.

- [ ] **Step 1: Write the failing unit tests**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { advanceTripStage, getTripSnapshot, TRIP_STAGES } from "../app/book/trip-simulator.mjs";

test("assigned demo starts twenty minutes before pickup", () => {
  assert.equal(TRIP_STAGES[3].id, "assigned");
  assert.deepEqual(getTripSnapshot(3, 0), {
    stageIndex: 3,
    stageId: "assigned",
    headline: "Your chauffeur is assigned.",
    etaMinutes: 20,
    nextEvent: "Pickup",
  });
});

test("elapsed demo time lowers ETA without going below one minute", () => {
  assert.equal(getTripSnapshot(4, 125).etaMinutes, 9);
  assert.equal(getTripSnapshot(4, 9999).etaMinutes, 1);
});

test("advance clamps at complete", () => {
  assert.equal(advanceTripStage(3), 4);
  assert.equal(advanceTripStage(TRIP_STAGES.length - 1), TRIP_STAGES.length - 1);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/trip-simulator.unit.test.mjs`
Expected: FAIL because `app/book/trip-simulator.mjs` does not exist.

- [ ] **Step 3: Implement the minimal simulator**

```js
export const TRIP_STAGES = [
  { id: "requested", label: "Requested", headline: "Your request is with the desk.", eta: 45, nextEvent: "Desk review" },
  { id: "reviewed", label: "Reviewed", headline: "Your itinerary is reviewed.", eta: 35, nextEvent: "Confirmation" },
  { id: "confirmed", label: "Confirmed", headline: "Your trip is confirmed.", eta: 28, nextEvent: "Assignment" },
  { id: "assigned", label: "Assigned", headline: "Your chauffeur is assigned.", eta: 20, nextEvent: "Pickup" },
  { id: "en-route", label: "En route", headline: "Your chauffeur is approaching.", eta: 12, nextEvent: "Pickup" },
  { id: "complete", label: "Complete", headline: "Your movement is complete.", eta: 1, nextEvent: "Arrival" },
];

export function getTripSnapshot(stageIndex, elapsedSeconds = 0) {
  const safeIndex = Math.min(Math.max(stageIndex, 0), TRIP_STAGES.length - 1);
  const stage = TRIP_STAGES[safeIndex];
  return {
    stageIndex: safeIndex,
    stageId: stage.id,
    headline: stage.headline,
    etaMinutes: Math.max(1, stage.eta - Math.floor(elapsedSeconds / 60)),
    nextEvent: stage.nextEvent,
  };
}

export function advanceTripStage(stageIndex) {
  return Math.min(stageIndex + 1, TRIP_STAGES.length - 1);
}
```

- [ ] **Step 4: Add declarations and the unit script**

Add exact types for the exported functions in `trip-simulator.d.ts`, add `test:unit` to `package.json`, and prepend it to the existing `test` script.

- [ ] **Step 5: Run the unit test and verify GREEN**

Run: `npm run test:unit`
Expected: 3 tests pass, 0 fail.

- [ ] **Step 6: Commit**

```bash
git add app/book/trip-simulator.mjs app/book/trip-simulator.d.ts tests/trip-simulator.unit.test.mjs package.json
git commit -m "test live trip simulator"
```

### Task 2: Selected Itinerary and Live Map Experience

**Files:**
- Create: `app/book/AltaieTripExperience.tsx`
- Create: `app/book/TripMap.tsx`
- Create: `app/book/experience.css`
- Modify: `app/book/page.tsx`
- Modify: `tests/rendered-html.test.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: `TRIP_STAGES`, `getTripSnapshot`, `advanceTripStage`, and the existing `DirectBooking` component.
- Produces: the default `/book` simulated itinerary and its `itinerary`, `live`, and `request` views.

- [ ] **Step 1: Add the failing rendered-HTML expectations**

```js
assert.match(bookingHtml, /Demo itinerary/i);
assert.match(bookingHtml, /Your chauffeur is assigned\./i);
assert.match(bookingHtml, /View live trip/i);
assert.match(bookingHtml, /Simulated live data/i);
assert.doesNotMatch(bookingHtml, /real-time dispatch|live vehicle location/i);
```

- [ ] **Step 2: Run the public surface test and verify RED**

Run: `npm test`
Expected: FAIL because the new selected itinerary is not rendered.

- [ ] **Step 3: Install the visual runtime dependencies**

Run: `npm install maplibre-gl @phosphor-icons/react --cache /tmp/altaie-npm-cache --no-audit --no-fund`
Expected: `package.json` and `package-lock.json` include both dependencies.

- [ ] **Step 4: Build the real map component**

Create `TripMap.tsx` as a client-only MapLibre map using CARTO light raster tiles, the Hay-Adams and DCA coordinates, a route GeoJSON line, two endpoint markers, map controls, and visible OpenStreetMap/CARTO attribution. Accept `stageIndex` so the vehicle marker can move through the simulated route.

- [ ] **Step 5: Build the selected itinerary view**

Create `AltaieTripExperience.tsx` with:

- `PRIVATE BETA · DEMO ITINERARY` and `SIMULATED LIVE DATA` disclosure
- the exact selected headline hierarchy and 20-minute pickup card
- six-stage request timeline
- accurate Washington route map
- trip manifest for Fri, Aug 14, 2026, Hay-Adams → DCA, two passengers, AA 2147
- Marcus Reed and Cadillac Escalade ESV using repository images
- `View live trip`, `Message the desk`, and `Request a ride` controls
- live status mode with a ticking demo ETA and a manual `Advance demo` control
- existing `DirectBooking` rendered when request mode is selected

- [ ] **Step 6: Match the selected visual in CSS**

Use `experience.css` for Newsreader/Manrope typography, off-white paper, one-pixel black rules, editorial spacing, square controls, responsive desktop framing, mobile 393px composition, visible focus states, reduced-motion behavior, and bottom safe-area padding.

- [ ] **Step 7: Wire the `/book` page**

Render `AltaieTripExperience`, import MapLibre and experience CSS, and retain the existing page metadata.

- [ ] **Step 8: Run tests and verify GREEN**

Run: `npm test`
Expected: unit tests and all rendered HTTP tests pass.

- [ ] **Step 9: Commit**

```bash
git add app/book/AltaieTripExperience.tsx app/book/TripMap.tsx app/book/experience.css app/book/page.tsx tests/rendered-html.test.mjs package.json package-lock.json
git commit -m "build Altaie live trip experience"
```

### Task 3: Fleet and Core Interaction Completion

**Files:**
- Modify: `app/book/AltaieTripExperience.tsx`
- Modify: `app/book/experience.css`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: existing vehicle imagery and `DirectBooking`.
- Produces: keyboard-accessible fleet drawer, desk panel, and stable primary navigation between itinerary, live trip, fleet, and request states.

- [ ] **Step 1: Add failing public markers**

Add assertions for `Fleet availability`, `Cadillac Escalade ESV`, `Mercedes-Maybach S-Class`, and `Request a ride`.

- [ ] **Step 2: Run the public surface test and verify RED**

Run: `npm test`
Expected: FAIL because `Fleet availability` is not yet in the initial HTML.

- [ ] **Step 3: Implement the fleet and desk panels**

Add an accessible in-page fleet section with Executive Sedan, Cadillac Escalade ESV, and Mercedes-Maybach S-Class; reuse `/brand/principal-movement.png`, `/images/owner/chauffeur-escalade.jpg`, and `/images/owner/maybach-arrival.jpg`. Add an in-page desk panel with `/contact` navigation and close controls. Keep every demo-only control labeled as simulated.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm test`
Expected: all unit and HTTP tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/book/AltaieTripExperience.tsx app/book/experience.css tests/rendered-html.test.mjs
git commit -m "complete Altaie fleet interactions"
```

### Task 4: Browser Verification and Blocking Design QA

**Files:**
- Create: `design-qa.md`
- Create: `tmp/design-qa/altaie-book-mobile.png`
- Create: `tmp/design-qa/altaie-book-desktop.png`
- Modify: implementation files only if QA finds P0/P1/P2 issues.

**Interfaces:**
- Consumes: selected source image and local `/book` render.
- Produces: browser evidence and `design-qa.md` with `final result: passed`.

- [ ] **Step 1: Start the local Next.js preview**

Run: `npm run dev -- --hostname 0.0.0.0 --port 4173`
Expected: local server starts and `/book` loads through the Work Mode cloud browser.

- [ ] **Step 2: Verify the primary interactions in the cloud browser**

Test `View live trip`, `Advance demo`, fleet disclosure, desk panel, request mode, mobile navigation, browser console, and network errors.

- [ ] **Step 3: Capture equivalent visual evidence**

Capture `/book` at a 393px mobile viewport and a desktop viewport. Combine the selected source image and the mobile implementation screenshot into one comparison image before judging.

- [ ] **Step 4: Write `design-qa.md`**

Record source path, implementation paths, viewports, dimensions, state, browser checks, typography, spacing, colors, imagery, copy, findings, fixes, comparison history, and `final result: blocked` until no P0/P1/P2 findings remain.

- [ ] **Step 5: Fix and recapture until passed**

Apply every P0/P1/P2 fix, rerun the affected tests, recapture at the same state and viewport, update the comparison, and end with `final result: passed`.

- [ ] **Step 6: Commit**

```bash
git add app/book design-qa.md
git commit -m "polish Altaie selected design"
```

### Task 5: Release Verification, GitHub, and Vercel Production

**Files:**
- No planned code changes after the release gate.

**Interfaces:**
- Consumes: the verified feature branch.
- Produces: a GitHub commit on `main` and a READY Vercel production deployment for the same commit.

- [ ] **Step 1: Run the full release gate**

Run: `npm run check`
Expected: lint passes, optimized build succeeds, all unit and HTTP tests pass with zero failures.

- [ ] **Step 2: Inspect the final diff and repository state**

Run: `git status -sb && git diff origin/main...HEAD --stat && git log --oneline origin/main..HEAD`
Expected: only the intended book experience, dependencies, tests, plan, and QA report are present.

- [ ] **Step 3: Publish to GitHub**

Push `agent/altaie-live-trip`, create a pull request if required by branch protection, merge to `main`, and verify the resulting main commit and GitHub checks.

- [ ] **Step 4: Deploy production through Vercel**

Deploy or confirm the Git-integrated production deployment for the merged commit, verify status `READY`, and confirm the custom production domain serves the new `/book` experience.

- [ ] **Step 5: Verify production end to end**

Open production `/book`, test the itinerary-to-live-to-request path, check browser console and runtime errors, and confirm the existing `/api/leads` dependency limitation remains truthfully handled if Neon is still unconfigured.

