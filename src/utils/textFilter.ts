const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_REGEX = /\+?\d[\d\s().-]{7,}\d/g;

const PROFANE_WORDS = ["fuck", "shit", "bitch", "asshole"];

export function cleanOneThing(input: string): string {
  const clipped = input.slice(0, 280);

  const withoutPii = clipped
    .replace(EMAIL_REGEX, "[redacted-email]")
    .replace(PHONE_REGEX, "[redacted-phone]");

  return PROFANE_WORDS.reduce((acc, word) => {
    const pattern = new RegExp(`\\b${word}\\b`, "gi");
    return acc.replace(pattern, "XXXX");
  }, withoutPii).trim();
}
