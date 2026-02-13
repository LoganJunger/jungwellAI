export function ratingUniqueKey(userId: string, companyId: string, ratingMonthIso: string) {
  return `${userId}:${companyId}:${ratingMonthIso}`;
}
