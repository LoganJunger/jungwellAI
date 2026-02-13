import { supaAdmin } from "@/lib/supabaseAdmin";

export async function getReminderRecipients() {
  const { data: users, error } = await supaAdmin
    .from("User")
    .select("id, email, Rating(createdAt)")
    .order("createdAt", { foreignTable: "Rating", ascending: false });

  if (error) throw error;

  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return users
    .filter((user: any) => {
      const ratings = user.Rating || [];
      const last = ratings[0]?.createdAt ? new Date(ratings[0].createdAt).getTime() : 0;
      return last < cutoff;
    })
    .map((u: any) => u.email);
}
