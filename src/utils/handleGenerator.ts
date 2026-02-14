const ADJECTIVES = ["bright", "steady", "brave", "kind", "calm", "keen"];
const ANIMALS = ["otter", "falcon", "lynx", "orca", "panda", "heron"];

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomSuffix() {
  return Math.floor(1000 + Math.random() * 9000);
}

export function generateHandle(existing = new Set<string>()): string {
  for (let i = 0; i < 100; i += 1) {
    const candidate = `${randomItem(ADJECTIVES)}-${randomItem(ANIMALS)}-${randomSuffix()}`;
    if (!existing.has(candidate)) {
      return candidate;
    }
  }
  throw new Error("Unable to generate a unique handle after 100 attempts.");
}
