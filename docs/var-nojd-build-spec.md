# Var Nöjd Build Spec (Implementation Notes)

## Scope in this commit

This repository now contains a starter code scaffold aligned with the provided Var Nöjd product requirements:

- Prisma schema for core entities
- Starter API routes for summary, trend, search, and rate
- Text safety utilities (PII stripping + profanity masking)
- Anonymous handle generator
- Seed script template and dataset drop location
- Brand constants and landing page copy starter

## Next implementation milestones

1. Add Next.js dependencies and full app scaffold when npm registry access is available.
2. Wire Supabase auth with workspace domain restrictions.
3. Replace API placeholders with Prisma-backed logic and RLS-aware reads.
4. Add cron endpoints and reminder email integration.
5. Build admin panel for moderation and company merge flows.
6. Add tests for text filter, handle generation, rate limit, and rate endpoint.

## Environment

Use the provided variable set in `.env`:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `RESEND_API_KEY`
- `PRIVACY_FLOOR`
- `CRON_SECRET`
- `ADMIN_EMAILS`

Brand:

- `PRIMARY_START=#FF5C5C`
- `PRIMARY_END=#F28C13`
- `TEXT_DARK=#111111`
- `BG_LIGHT=#F7F7F7`
