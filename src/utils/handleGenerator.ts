import { db } from "@/lib/db";

const ADJECTIVES = ["bright", "steady", "brave", "calm", "keen", "kind", "swift", "wise"];
const ANIMALS = ["otter", "falcon", "lynx", "orca", "panda", "heron", "tiger", "fox"];

const randomItem = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const randomSuffix = () => Math.floor(1000 + Math.random() * 9000);

export function generateHandle(existing = new Set<string>()) {
  for (let i = 0; i < 200; i += 1) {
    const candidate = `${randomItem(ADJECTIVES)}-${randomItem(ANIMALS)}-${randomSuffix()}`;
    if (!existing.has(candidate)) return candidate;
  }
  throw new Error("Unable to generate a unique handle.");
}

export async function generateUniqueHandleFromDb() {
  for (let i = 0; i < 200; i += 1) {
    const candidate = generateHandle();
    const found = await db.user.findUnique({ where: { handle: candidate }, select: { id: true } });
    if (!found) return candidate;
  }
  throw new Error("Unable to generate a unique handle in database.");
}
