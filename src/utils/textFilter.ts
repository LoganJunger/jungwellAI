import BadWordsFilter from "bad-words";

const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_REGEX = /\+?\d[\d\s().-]{7,}\d/g;

export function cleanOneThing(input: string) {
  const filter = new BadWordsFilter();
  const clipped = input.slice(0, 280);
  const sanitized = clipped.replace(EMAIL_REGEX, "[redacted-email]").replace(PHONE_REGEX, "[redacted-phone]");
  const profaneMasked = filter.clean(sanitized);
  return profaneMasked.replace(/\*/g, "X").trim();
}
