import { db } from "@/lib/db";

export async function getReminderRecipients() {
  const users = await db.user.findMany({
    include: {
      ratings: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  });

  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return users
    .filter((user) => {
      const last = user.ratings[0]?.createdAt?.getTime() ?? 0;
      return last < cutoff;
    })
    .map((u) => u.email);
}
