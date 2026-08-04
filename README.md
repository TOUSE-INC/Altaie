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
npm run db:migrate
```

Copy `.env.example` to `.env.local` only when credentials are available. Do not put secrets in `.openai/hosting.json`.

## Production configuration

- `NEXT_PUBLIC_SITE_URL=https://altaie.app`
- `DATABASE_URL` — injected by the Neon integration in Vercel
- `NEXT_PUBLIC_MOOVS_PORTAL_URL` — Moovs widget/iframe URL
- `RESEND_API_KEY` — optional until operational email is connected
- `OPS_NOTIFICATION_EMAIL`
- `LEAD_FROM_EMAIL`
- `RATE_LIMIT_SALT`

The production site must not be made public until counsel clears the Altaie name, policies, licensing model, partner authorities, insurance requirements, and applicable DFHV/WMATC obligations.

## Vercel deployment

1. Link this directory to the Altaie Vercel project.
2. Add a Neon Postgres resource to that project through Vercel Marketplace.
3. Configure the production environment variables listed above.
4. Run `npm run db:migrate` once against the production database.
5. Deploy a production candidate without assigning the domain, verify it, then promote it to `altaie.app`.
