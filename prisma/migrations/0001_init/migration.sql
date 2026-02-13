-- Prisma baseline migration for Var Nöjd
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "email" TEXT NOT NULL UNIQUE,
  "emailDomain" TEXT NOT NULL,
  "handle" TEXT NOT NULL UNIQUE,
  "isAdmin" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE "Company" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "name" TEXT NOT NULL,
  "domain" TEXT NOT NULL UNIQUE,
  "logoUrl" TEXT
);
CREATE INDEX "Company_name_idx" ON "Company"("name");

CREATE TABLE "Rating" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "ratingMonth" TIMESTAMPTZ NOT NULL,
  "score" INTEGER NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "companyId" TEXT NOT NULL REFERENCES "Company"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "Rating_user_company_month_unique" ON "Rating"("userId", "companyId", "ratingMonth");
CREATE INDEX "Rating_company_month_idx" ON "Rating"("companyId", "ratingMonth");

CREATE TABLE "OneThing" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "ratingMonth" TIMESTAMPTZ NOT NULL,
  "text" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "companyId" TEXT NOT NULL REFERENCES "Company"("id") ON DELETE CASCADE
);
CREATE INDEX "OneThing_company_month_created_idx" ON "OneThing"("companyId", "ratingMonth", "createdAt");

CREATE TABLE "CompanyMonth" (
  "id" TEXT PRIMARY KEY,
  "companyId" TEXT NOT NULL REFERENCES "Company"("id") ON DELETE CASCADE,
  "month" TIMESTAMPTZ NOT NULL,
  "avgScore" DOUBLE PRECISION NOT NULL,
  "ratings" INTEGER NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX "CompanyMonth_company_month_unique" ON "CompanyMonth"("companyId", "month");
CREATE INDEX "CompanyMonth_month_idx" ON "CompanyMonth"("month");

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);
