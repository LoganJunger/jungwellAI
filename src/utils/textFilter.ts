const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_REGEX = /\+?\d[\d\s().-]{7,}\d/g;

const BLOCKED = new Set([
  "fuck","shit","ass","bitch","damn","dick","piss","crap",
  "bastard","slut","whore","cunt","asshole","bullshit","dumbass",
]);

function maskProfanity(text: string): string {
  return text
    .split(/\b/)
    .map((w) => (BLOCKED.has(w.toLowerCase()) ? "X".repeat(w.length) : w))
    .join("");
}

export function cleanOneThing(input: string) {
  const clipped = input.slice(0, 280);
  const sanitized = clipped
    .replace(EMAIL_REGEX, "[redacted-email]")
    .replace(PHONE_REGEX, "[redacted-phone]");
  return maskProfanity(sanitized).trim();
}
