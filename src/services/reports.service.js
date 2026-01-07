import { supabase } from "../config/supabase.js";

export const getMonthlySummary = async (gym_id, month) => {
  // month = "YYYY-MM"
  const start = `${month}-01`;
  const end = new Date(
    Number(month.split("-")[0]),
    Number(month.split("-")[1]), // next month
    0
  )
    .toISOString()
    .split("T")[0];

  /* ---------------- Payments ---------------- */
  const { data: payments = [] } = await supabase
    .from("payments")
    .select("amount")
    .eq("gym_id", gym_id)
    .gte("payment_date", start)
    .lte("payment_date", end);

  const total_collection = payments.reduce((sum, p) => sum + p.amount, 0);

  const payments_count = payments.length;

  /* ---------------- Members ---------------- */
  const { data: members = [] } = await supabase
    .from("members")
    .select("status")
    .eq("gym_id", gym_id);

  const total_members = members.length;
  const active_members = members.filter((m) => m.status === "active").length;
  const expired_members = members.filter((m) => m.status === "expired").length;

  /* ---------------- Derived metrics ---------------- */
  const avg_per_active_member =
    active_members > 0 ? Math.round(total_collection / active_members) : 0;

  const retention_rate =
    total_members > 0 ? Math.round((active_members / total_members) * 100) : 0;

  /* ---------------- Final response ---------------- */
  return {
    month,
    total_collection,
    payments_count,

    total_members,
    active_members,
    expired_members,

    avg_per_active_member,
    retention_rate,
  };
};
