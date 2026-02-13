# Var Nöjd (Jungwell.ai Workbench module)

Track CS team happiness and act on what improves it.

## Required environment variables

```bash
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
RESEND_API_KEY=
PRIVACY_FLOOR=3
CRON_SECRET=some-long-random
ADMIN_EMAILS=logan@jungwell.com

SITE_NAME=Var Nöjd
SCORE_NAME=V Score
WORKBENCH_TAGLINE=A Jungwell.ai Workbench module
JUNGWELL_URL=https://jungwell.com

PRIMARY_START=#FF5C5C
PRIMARY_END=#F28C13
TEXT_DARK=#111111
BG_LIGHT=#F7F7F7
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Supabase setup steps

1. Create a Supabase project.
2. Enable Auth providers:
   - Google OAuth
   - Email magic link
3. Configure redirect URLs to your local/dev URLs.
4. Use `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.
5. In your login flow, enforce blocked personal domains (`gmail.com`, `yahoo.com`, `outlook.com`, `hotmail.com`, `live.com`, `icloud.com`).

## Prisma migrate + seed

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

CSV seed file lives at:

- `seed/var_nojd_seed_companies.csv`

## Dev run

```bash
npm run dev
```

App routes included:

- `/`
- `/companies`
- `/company/[slug]`
- `/rate`
- `/account`
- `/login`
- `/admin`
- `/terms`
- `/privacy`

## Cron scheduling notes

Use your scheduler (Replit Cron, GitHub Actions, etc.) to run:

- `GET /api/cron/rollup` with header `X-CRON-SECRET: $CRON_SECRET`
- `GET /api/cron/remind` with header `X-CRON-SECRET: $CRON_SECRET`

Suggested schedule:

- `rollup`: every 5 minutes
- `remind`: daily at 09:00 UTC

## Local run steps (exact)

```bash
git checkout var-nojd/scaffold
cp .env.example .env.local # or create manually with vars above
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

If package install is blocked in your environment, run the exact commands above on your local machine with internet access.
