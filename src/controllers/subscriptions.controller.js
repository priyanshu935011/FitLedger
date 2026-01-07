import { supabase } from "../config/supabase.js";
const PERIOD_MAP = {
  "1month": { months: 1 },
  "3months": { months: 3 },
  "6months": { months: 6 },
  "1year": { years: 1 },
};
export const listSubscriptions = async (_, res) => {
  const { data } = await supabase.from("subscriptions").select(`
      *,
      gyms ( name, city ),
      plans ( name )
    `);

  res.json(data);
};
export const extendSubscription = async (req, res) => {
  try {
    const { gym_id, period } = req.body;

    if (!PERIOD_MAP[period]) {
      return res.status(400).json({ error: "Invalid extension period" });
    }

    // 1. Fetch current subscription end date
    const { data: gym, error: gymError } = await supabase
      .from("gyms")
      .select("subscription_end_date")
      .eq("id", gym_id)
      .single();

    if (gymError || !gym) {
      return res.status(404).json({ error: "Gym not found" });
    }

    const today = new Date();
    const baseDate = new Date(gym.subscription_end_date);
    const startDate = baseDate > today ? baseDate : today;

    // 2. Extend date
    const rule = PERIOD_MAP[period];
    if (rule.months) startDate.setMonth(startDate.getMonth() + rule.months);
    if (rule.years) startDate.setFullYear(startDate.getFullYear() + rule.years);

    const newEndDate = startDate.toISOString().split("T")[0];

    // 3. Persist
    await supabase
      .from("gyms")
      .update({
        subscription_end_date: newEndDate,
        status: "ACTIVE",
      })
      .eq("id", gym_id);

    res.json({
      success: true,
      subscription_end_date: newEndDate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to extend subscription" });
  }
};
