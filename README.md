# Altaie.app

Private launch MVP for Altaie, Washington’s executive mobility desk.

## Product shape

- Multi-page marketing site for executive assistants, law firms, government-affairs teams, associations, embassies, and corporate travelers
- Advance-reserved airport, point-to-point, hourly, roadshow, and event transportation positioning
- Ride, corporate-account, and operating-partner lead flows
- Neon Postgres persistence with duplicate suppression, rate limiting, a honeypot, and 12-month cleanup
- Optional Resend operational notifications
- Optional Moovs booking portal iframe; the concierge request flow remains active until it is configured
- Native Next.js deployment on Vercel, with the production domain assigned only after readiness checks pass

## Local setup

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
npm run lint
npm test
npm run check
npm run db:migrate
```

Copy `.env.example` to `.env.local` only when credentials are available. Do not put secrets in `.openai/hosting.json`.

`npm run check` is the release gate used by GitHub Actions. It runs lint, creates an optimized production build, starts that build, and exercises the public request surface plus protected dashboard behavior over HTTP.

## Protected demonstrations

`/portal` and `/owner` contain demonstration data, not live customer or operating records. Both routes require HTTP Basic credentials supplied by `ALTAIE_DASHBOARD_USERNAME` and `ALTAIE_DASHBOARD_PASSWORD`.

- With both values configured, unauthorized visitors receive an authentication challenge.
- With either value missing, both routes return `404` and remain closed.
- Use a long, unique password and provide access only over Vercel HTTPS.

Basic authentication is a private-beta release gate. Replace it with role-based customer and operator identity before either dashboard holds real data.

## Production configuration

- The public canonical origin is fixed in code at `https://www.altaiedc.com` so deployment environment drift cannot rewrite canonicals, schema, sitemap, or robots metadata.
- `DATABASE_URL` or `POSTGRES_URL` — injected by the Neon integration in Vercel
- `NEXT_PUBLIC_MOOVS_PORTAL_URL` — Moovs widget/iframe URL
- `RESEND_API_KEY` — optional until operational email is connected
- `OPS_NOTIFICATION_EMAIL`
- `LEAD_FROM_EMAIL`
- `RATE_LIMIT_SALT`
- `ALTAIE_DASHBOARD_USERNAME`
- `ALTAIE_DASHBOARD_PASSWORD`

Technical promotion requires a green GitHub quality check, a ready Vercel deployment for the same commit, external verification of protected routes, and one controlled request proving API-to-database persistence. The production site must not be launched under the custom domain until counsel also clears the Altaie name, policies, licensing model, partner authorities, insurance requirements, and applicable DFHV/WMATC obligations.

## Vercel deployment

1. Link this directory to the Altaie Vercel project.
2. Add a Neon Postgres resource to that project through Vercel Marketplace.
3. Configure the production environment variables listed above.
4. Run `npm run db:migrate` once against the production database.
5. Deploy a preview candidate, verify the request flow and protected routes, and inspect runtime errors.
6. Promote only after the technical checks and business launch approvals both pass; then verify `www.altaiedc.com`.
