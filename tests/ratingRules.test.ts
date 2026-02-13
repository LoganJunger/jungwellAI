import { describe, expect, test } from "vitest";
import { ratingUniqueKey } from "@/utils/ratingRules";

describe("ratingUniqueKey", () => {
  test("generates stable uniqueness key", () => {
    const key1 = ratingUniqueKey("u1", "c1", "2026-01-01T00:00:00.000Z");
    const key2 = ratingUniqueKey("u1", "c1", "2026-01-01T00:00:00.000Z");
    const key3 = ratingUniqueKey("u1", "c1", "2026-02-01T00:00:00.000Z");
    expect(key1).toBe(key2);
    expect(key1).not.toBe(key3);
  });
});
