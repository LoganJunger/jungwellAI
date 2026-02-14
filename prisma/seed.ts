/**
 * Seed bootstrap companies from seed/var_nojd_seed_companies.csv.
 *
 * This script intentionally avoids external CSV dependencies so it can run in restricted environments.
 */
import fs from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "seed", "var_nojd_seed_companies.csv");

if (!fs.existsSync(file)) {
  console.error(`Missing seed file at ${file}`);
  process.exit(1);
}

const rows = fs
  .readFileSync(file, "utf8")
  .split(/\r?\n/)
  .filter(Boolean)
  .slice(1)
  .map((line) => {
    const [name, domain, logoUrl] = line.split(",");
    return {
      name: name?.trim(),
      domain: domain?.trim().toLowerCase(),
      logoUrl: logoUrl?.trim() || null
    };
  })
  .filter((row) => row.name && row.domain);

console.log(`Parsed ${rows.length} rows from seed CSV.`);
console.log("Connect Prisma and upsert Company records in this script.");
