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
- Logo pipeline updated for Clearbit sunset: tokenized logo API endpoint (`img.logo.dev` by default) first, then a generic Web 2.0-style startup logo fallback SVG.

## Run

```bash
npm install
npm run dev
```

> Note: In this environment npm registry access may be blocked (HTTP 403), but the repository is now set up to run immediately in a normal Node environment.


## Optional env

- `NEXT_PUBLIC_LOGO_API_BASE_URL` (default: `https://img.logo.dev`)
- `NEXT_PUBLIC_LOGO_API_HOST` (default: `img.logo.dev`)
- `NEXT_PUBLIC_LOGO_PUBLISHABLE_KEY` (publishable/browser-safe key)
- `LOGO_SECRET_KEY` (server-only; never commit real values)


## Security note

If a real API secret key is ever shared in chat or accidentally exposed, rotate it immediately in your provider dashboard and store the replacement only in secure runtime environment variables.
