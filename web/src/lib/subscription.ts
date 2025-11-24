import { getSupabaseServiceRoleClient } from "./supabase/server";

export async function updateUserPlan(userId: string | undefined, planName: string | undefined) {
  if (!userId) {
    return;
  }
  const supabase = getSupabaseServiceRoleClient();
  try {
    await supabase.from("user_stats").update({ account_tier: planName || "spark" }).eq("user_id", userId);
  } catch (error) {
    console.error("Failed to update user plan", error);
  }
}



