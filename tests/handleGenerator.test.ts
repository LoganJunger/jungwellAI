import { describe, expect, test } from "vitest";
import { generateHandle } from "@/utils/handleGenerator";

describe("generateHandle", () => {
  test("returns adjective-animal-#### format", () => {
    const handle = generateHandle();
    expect(handle).toMatch(/^[a-z]+-[a-z]+-\d{4}$/);
  });

  test("avoids existing collisions", () => {
    const existing = new Set<string>();
    for (let i = 0; i < 30; i += 1) {
      existing.add(generateHandle(existing));
    }
    expect(existing.size).toBe(30);
  });
});
