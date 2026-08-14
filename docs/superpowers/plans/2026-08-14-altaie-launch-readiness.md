# Altaie Launch-Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing Altaie private-beta overhaul into a truthful, access-controlled, continuously tested launch candidate.

**Architecture:** Keep the public acquisition and lead-intake flow intact, add a fail-closed Next.js proxy around demonstration dashboards, and verify the product through HTTP-level tests against a production build. GitHub Actions becomes the promotion gate; Vercel remains the deployment target.

**Tech Stack:** Next.js 16 App Router, React 19, Node.js 22, Node test runner, Neon/Drizzle, Vercel, GitHub Actions.

## Global Constraints

- Preserve the premium Altaie visual system and existing mobile-first overhaul.
- Do not claim live inventory, confirmed vehicles, charged payments, or completed bookings.
- `/portal` and `/owner` must fail closed when access credentials are absent.
- Do not add a new authentication vendor in this release gate.
- Do not expose environment-variable values in tests, logs, commits, or deployment output.
- Do not attach `altaie.app` until both technical and business launch gates are satisfied.

---

### Task 1: Behavioral release tests

**Files:**
- Replace: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: built Next.js application and the existing public routes.
- Produces: HTTP-level release assertions used locally and in CI.

- [ ] **Step 1: Replace source-string assertions with a production-server harness**

Use `node:test` hooks, spawn `node_modules/next/dist/bin/next start` on an available loopback port, and provide test-only `ALTAIE_DASHBOARD_USERNAME` and `ALTAIE_DASHBOARD_PASSWORD` values to the child process.

- [ ] **Step 2: Add failing access-control tests**

Assert that unauthenticated `/owner` and `/portal` requests return `401`, the response advertises a Basic challenge, and a valid Basic header returns `200`.

- [ ] **Step 3: Add public-flow tests**

Assert that `/` returns `200`, `/book` contains `Altaie private beta`, `/book` does not contain `You&apos;re booked`, and malformed JSON-compatible lead input returns `400` with a validation error.

- [ ] **Step 4: Run the test and verify RED**

Run: `npm test`

Expected: build succeeds, then the dashboard test fails because the current routes return `200` without credentials.

### Task 2: Fail-closed dashboard protection

**Files:**
- Create: `proxy.js`

**Interfaces:**
- Consumes: `ALTAIE_DASHBOARD_USERNAME`, `ALTAIE_DASHBOARD_PASSWORD`, request path, and Authorization header.
- Produces: Next.js proxy responses for `/owner/:path*` and `/portal/:path*`.

- [ ] **Step 1: Implement the smallest proxy that satisfies the failing tests**

Export `proxy(request)`. Return `404` when either server credential is absent, `401` with `WWW-Authenticate: Basic realm="Altaie private beta"` for missing or wrong credentials, and `NextResponse.next()` for valid credentials.

- [ ] **Step 2: Scope the proxy**

Export `config = { matcher: ["/owner/:path*", "/portal/:path*"] }` as required by the Next.js 16 file convention.

- [ ] **Step 3: Prevent caching and indexing of denied responses**

Set `Cache-Control: no-store` and `X-Robots-Tag: noindex, nofollow` on `401` and `404` responses.

- [ ] **Step 4: Run `npm test` and verify GREEN for access behavior**

Expected: both protected routes challenge unauthorized requests and render for valid credentials.

### Task 3: React correctness and truthful date handling

**Files:**
- Modify: `app/book/DirectBooking.tsx`
- Modify: `app/portal/AdvancedMobilePortal.tsx`

**Interfaces:**
- Consumes: browser date input and user-selected itinerary data.
- Produces: lint-clean request forms without render-time clock calls.

- [ ] **Step 1: Confirm the current lint failures**

Run: `npm run lint`

Expected: `react-hooks/set-state-in-effect` in `DirectBooking.tsx` and `react-hooks/purity` in `AdvancedMobilePortal.tsx`.

- [ ] **Step 2: Move the booking minimum-date update to the date input DOM boundary**

Use a date-input ref. In the existing effect, assign the formatted current date to the input element's `min` property instead of synchronously setting React state.

- [ ] **Step 3: Require an explicit portal pickup date**

Replace the render-time `Date.now()` default with controlled empty date state and a required date input. The request payload must use the selected value.

- [ ] **Step 4: Remove the unused portal component**

Delete the unused `Rides` function or wire it into the active tab. Prefer deletion because the active ride experience already exists elsewhere.

- [ ] **Step 5: Run lint and tests**

Expected: zero lint errors or warnings; all behavioral tests pass.

### Task 4: CI and environment contract

**Files:**
- Create: `.github/workflows/quality.yml`
- Create: `.env.example`
- Modify: `.gitignore`
- Modify: `package.json`
- Modify: `README.md`

**Interfaces:**
- Consumes: repository pushes and pull requests.
- Produces: reproducible Node.js 22 quality checks and documented deployment configuration.

- [ ] **Step 1: Add a single local quality command**

Add `"check": "npm run lint && npm test"` to `package.json`.

- [ ] **Step 2: Add GitHub Actions**

On pull requests and pushes to `main`, check out the repository, install Node.js 22 with npm caching, run `npm ci`, and run `npm run check`.

- [ ] **Step 3: Add the environment template**

Document the public site URL, database, Moovs, Resend, notification, rate-limit, and dashboard-access variables with empty values only.

Add `!.env.example` after the `.env*` rule in `.gitignore` so the empty template is intentionally tracked while all credential-bearing environment files remain ignored.

- [ ] **Step 4: Update the README**

Describe the protected demonstration routes, `npm run check`, the fail-closed credential behavior, and the technical/business promotion gates.

### Task 5: Full local verification and review

**Files:**
- Inspect all modified files.

**Interfaces:**
- Consumes: completed release candidate.
- Produces: evidence for publication.

- [ ] **Step 1: Run `npm run check`**

Expected: lint exits `0`; build exits `0`; all tests pass.

- [ ] **Step 2: Run a fresh production build**

Run: `npm run build`

Expected: all 17 routes compile and TypeScript exits without errors.

- [ ] **Step 3: Review the git diff and React/Next.js boundaries**

Confirm no secret values, unrelated changes, unsafe client/server imports, render-time side effects, or unauthenticated dashboard paths were introduced.

### Task 6: Publish and verify the Vercel candidate

**Files:**
- Commit the intended repository changes only.

**Interfaces:**
- Consumes: green local candidate.
- Produces: updated GitHub PR and Vercel preview deployment.

- [ ] **Step 1: Confirm GitHub authentication and branch scope**

Run `gh --version`, `gh auth status`, `git status -sb`, and `git diff --check`.

- [ ] **Step 2: Commit and push the existing overhaul branch**

Commit message: `Harden Altaie launch candidate`

Push: `git push -u origin agent/private-beta-product-overhaul`

- [ ] **Step 3: Update PR #1 with validation evidence**

Include protected-route behavior, test counts, lint status, build status, and remaining operational/legal gates.

- [ ] **Step 4: Wait for Vercel and GitHub checks**

Require the exact candidate SHA to report a ready Vercel deployment and successful quality checks.

- [ ] **Step 5: Walk the preview request flow**

Verify browser render, `POST /api/leads`, storage response, protected routes, and Vercel runtime errors. Stop at the first broken boundary.

- [ ] **Step 6: Promote only if every release criterion is evidenced**

If database persistence, route protection, checks, and legal release authority are all confirmed, merge PR #1 and verify the resulting production deployment. Otherwise leave the candidate in protected preview and report the exact external blocker.
