# Altaie.app

Private launch MVP for Altaie, Washington’s executive mobility desk.

## Product shape

- Multi-page marketing site for executive assistants, law firms, government-affairs teams, associations, embassies, and corporate travelers
- Advance-reserved airport, point-to-point, hourly, roadshow, and event transportation positioning
- Ride, corporate-account, and operating-partner lead flows
- Cloudflare D1 persistence with duplicate suppression, rate limiting, a honeypot, and 12-month cleanup
- Optional Resend operational notifications
- Optional Moovs booking portal iframe; the concierge request flow remains active until it is configured
- Private Sites deployment until brand, legal, booking, partner, and operating-readiness gates are complete

## Local setup

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
npm run lint
npm test
```

Copy `.env.example` to `.env.local` only when credentials are available. Do not put secrets in `.openai/hosting.json`.

## Production configuration

- `NEXT_PUBLIC_SITE_URL=https://altaie.app`
- `NEXT_PUBLIC_MOOVS_PORTAL_URL` — Moovs widget/iframe URL
- `RESEND_API_KEY` — optional until operational email is connected
- `OPS_NOTIFICATION_EMAIL`
- `LEAD_FROM_EMAIL`
- `RATE_LIMIT_SALT`

The production site must not be made public until counsel clears the Altaie name, policies, licensing model, partner authorities, insurance requirements, and applicable DFHV/WMATC obligations.
