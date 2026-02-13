import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const file = path.join(process.cwd(), "seed", "var_nojd_seed_companies.csv");
  const raw = fs.readFileSync(file, "utf8");
  const rows = parse(raw, { columns: true, skip_empty_lines: true }) as Array<{ name: string; domain: string; logo_url?: string }>;

  for (const row of rows) {
    const domain = row.domain.trim().toLowerCase();
    await prisma.company.upsert({
      where: { domain },
      update: { name: row.name.trim(), logoUrl: row.logo_url?.trim() || null },
      create: { name: row.name.trim(), domain, logoUrl: row.logo_url?.trim() || null }
    });
  }

  console.log(`Seeded ${rows.length} companies.`);
}

main().finally(async () => prisma.$disconnect());
