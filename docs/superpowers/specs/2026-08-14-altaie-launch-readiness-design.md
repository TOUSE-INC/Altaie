# Altaie Launch-Readiness Design

## Context

Altaie is a polished Washington executive-mobility launch candidate with three distinct surfaces:

- a public marketing and service-request experience;
- a client portal prototype;
- an owner command-center prototype.

The current public Vercel production deployment still simulates live inventory, payment selection, and immediate booking confirmation. The newer draft branch replaces that path with an honest service request, but its tests and lint checks fail, its portal and owner routes have no access control, and its operational database and notification configuration has not been verified end to end.

## Goal

Produce a trustworthy launch candidate that can be promoted without representing demo data as live operations. A visitor must be able to understand the service and submit a request; internal product demonstrations must be access-controlled; every push must pass build, lint, and behavioral tests.

## Scope of This Release Gate

This release gate will:

1. preserve the premium Altaie visual system and the mobile-first private-beta overhaul;
2. make the booking path an explicit request for desk confirmation, never an instant reservation or payment event;
3. protect `/portal` and `/owner` with production credentials and fail closed when credentials are absent;
4. replace stale source-string tests with HTTP-level behavioral checks against a production build;
5. remove current React lint failures;
6. add GitHub CI, an environment-variable contract, and an explicit promotion checklist;
7. verify the protected Vercel preview before any production promotion.

## Out of Scope

This pass will not invent real-time fleet inventory, payment processing, chauffeur dispatch, customer authentication, or legal/regulatory clearance. The portal and owner command center remain product demonstrations until those systems exist. No custom domain will be attached solely because the software builds.

## Approaches Considered

### 1. Promote the current overhaul immediately

Fastest, but it would preserve failing quality checks and unauthenticated demo dashboards. A green Vercel build alone is insufficient evidence of release readiness.

### 2. Build the complete transportation operating system before releasing anything

Architecturally pure, but too broad for a single reliable release. It would delay the useful public acquisition surface while mixing booking, dispatch, payments, identity, and compliance into one change.

### 3. Establish a trustworthy launch boundary first — selected

Release a truthful request flow and protected demonstrations, then build real operations behind stable interfaces. This creates forward motion without presenting simulated capabilities as live.

## Architecture

### Public acquisition surface

The marketing routes remain public. `/book` collects itinerary, vehicle preference, contact details, and consent. It posts to `/api/leads`. The UI describes all displayed prices as pilot estimates and renders success only after the API returns a successful persisted-request response.

### Lead intake boundary

`POST /api/leads` remains the only public write boundary. It validates request type, contact details, consent, and required trip fields before touching storage. Neon/Postgres persists the lead; Resend notification remains optional. Missing storage returns a service-unavailable response instead of manufacturing success.

### Protected product demonstrations

Next.js 16 `proxy.js` protects `/portal`, `/portal/*`, `/owner`, and `/owner/*` with HTTP Basic credentials supplied only through server environment variables.

- Correct credentials: continue to the requested route.
- Incorrect or missing authorization header: return `401` with a Basic-auth challenge.
- Missing server credentials: return `404`, preventing accidental exposure after a misconfigured deployment.
- Responses include `Cache-Control: no-store` and `X-Robots-Tag: noindex, nofollow`.

This is a release gate, not the final customer identity system. Real customer accounts will later replace it without changing the route boundary.

### Continuous quality gate

GitHub Actions will use Node.js 22, run `npm ci`, lint, build, and behavioral tests on pull requests and pushes to `main`. Vercel remains the deployment system; GitHub CI establishes whether a deployment is eligible for promotion.

## Behavioral Verification

The test suite will start the built Next.js application and verify observable behavior:

- the public home page renders;
- `/book` describes a private-beta request and does not claim immediate confirmation;
- protected routes reject unauthenticated requests and allow valid credentials;
- malformed lead submissions receive a validation error without requiring a database;
- the server shuts down cleanly after the suite.

The release is not considered ready unless lint, tests, and the production build all exit successfully.

## Release Criteria

Technical promotion requires all of the following:

- GitHub CI green;
- Vercel preview `READY` on the exact candidate commit;
- protected routes verified from outside the local environment;
- one controlled preview request proves UI → API → database → response;
- production environment variables are present without exposing their values;
- no unresolved runtime error cluster appears after verification.

Business launch additionally requires the existing trademark, licensing, insurance, partner-authority, DFHV, WMATC, privacy, and terms review. Software readiness does not imply legal clearance.

## Follow-On Product Phases

1. Replace Basic authentication with customer and operator identities plus role-based authorization.
2. Replace demonstration movements with persisted rides, travelers, partners, and dispatch events.
3. Add operator assignment, pricing approval, payment authorization, and audit trails.
4. Add observability, service-level targets, incident workflows, and compliance evidence.
5. Attach `altaie.app` only when technical and business launch gates are both satisfied.
