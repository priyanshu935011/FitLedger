import { supabase } from "../config/supabase.js";

export const getDashboardSummary = async (gym_id) => {
  const today = new Date().toISOString().split("T")[0];
  const next7Days = new Date(Date.now() + 7 * 86400000)
    .toISOString()
    .split("T")[0];

  const [
    todayCollection,
    todayAttendance,
    activeMembers,
    expiredMembers,
    expiringSoon,
    recentPayments,
    todayCheckIns,
  ] = await Promise.all([
    supabase.rpc("today_collection", { g_id: gym_id }),
    supabase.rpc("today_attendance", { g_id: gym_id }),
    supabase
      .from("members")
      .select("*", { count: "exact" })
      .eq("gym_id", gym_id)
      .eq("status", "active"),
    supabase
      .from("members")
      .select("*", { count: "exact" })
      .eq("gym_id", gym_id)
      .lt("membership_end", today),
    supabase
      .from("members")
      .select("*", { count: "exact" })
      .eq("gym_id", gym_id)
      .gte("membership_end", today)
      .lte("membership_end", next7Days),
    supabase
      .from("payments")
      .select("*, members(full_name)")
      .eq("gym_id", gym_id)
      .eq("payment_date", today)
      .limit(3),
    supabase
      .from("attendance")
      .select("*, members(full_name)")
      .eq("gym_id", gym_id)
      .eq("check_in_date", today),
  ]);

  return {
    todayCollection: todayCollection.data ?? 0,
    todayAttendance: todayAttendance.data ?? 0,
    activeMembers: activeMembers.count,
    expiredMembers: expiredMembers.count,
    expiringSoon: expiringSoon.count,
    recentPayments: recentPayments.data,
    todayCheckIns: todayCheckIns.data,
  };
};
