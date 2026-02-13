import { describe, expect, test } from "vitest";
import { cleanOneThing } from "@/utils/textFilter";

describe("cleanOneThing", () => {
  test("redacts email and phone", () => {
    const output = cleanOneThing("Email me at test@acme.com or +1 (202) 555-0101");
    expect(output).not.toContain("test@acme.com");
    expect(output).not.toContain("555-0101");
  });

  test("masks profanity with X", () => {
    const output = cleanOneThing("this is shit");
    expect(output).toContain("XXXX");
  });
});
