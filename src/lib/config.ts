export const appConfig = {
  siteName: process.env.SITE_NAME ?? "Var Nöjd",
  scoreName: process.env.SCORE_NAME ?? "V Score",
  workbenchTagline: process.env.WORKBENCH_TAGLINE ?? "A Jungwell.ai Workbench module",
  jungwellUrl: process.env.JUNGWELL_URL ?? "https://jungwell.com",
  colors: {
    primaryStart: process.env.PRIMARY_START ?? "#FF5C5C",
    primaryEnd: process.env.PRIMARY_END ?? "#F28C13",
    textDark: process.env.TEXT_DARK ?? "#111111",
    bgLight: process.env.BG_LIGHT ?? "#F7F7F7"
  }
};

export const privacyFloor = Number(process.env.PRIVACY_FLOOR ?? 3);
export const blockedDomains = new Set(["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "live.com", "icloud.com"]);
export const adminEmails = new Set((process.env.ADMIN_EMAILS ?? "logan@jungwell.com").split(",").map((v) => v.trim().toLowerCase()));
