# Var Nöjd (JungwellAI)

A polished Next.js App Router implementation scaffold for the Var Nöjd module, with premium visual styling and functional routes/pages.

## What is working now

- High-quality branded UI shell (gradient brand, spacing, cards, KPIs, chart-like trend).
- Functional pages:
  - `/` landing
  - `/companies` searchable directory
  - `/company/[slug]` company detail view
  - `/rate` submit score + one-thing input
  - `/account`, `/privacy`, `/terms`
- Functional API endpoints backed by in-memory store for local/demo behavior:
  - `GET /api/company/:domain/summary`
  - `GET /api/company/:domain/trend`
  - `GET /api/companies/search?q=`
  - `POST /api/rate`
- Prisma schema included for production database wiring.
- Logo pipeline updated for Clearbit sunset: HubSpot logo endpoint first, then `https://{domain}/favicon.ico`, then generated SVG monogram fallback.

## Run

```bash
npm install
npm run dev
```

> Note: In this environment npm registry access may be blocked (HTTP 403), but the repository is now set up to run immediately in a normal Node environment.


## Optional env

- `NEXT_PUBLIC_HUBSPOT_LOGO_BASE_URL` (default: `https://logo.hubspot.com`)
