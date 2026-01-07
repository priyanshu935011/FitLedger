import { supabase } from "../config/supabase.js";
export const listPlans = async (_, res) => {
  const { data } = await supabase
    .from("plans")
    .select("*")
    .eq("is_active", true);

  res.json(data);
};
export const updatePlan = async (req, res) => {
  const { id } = req.params;

  await supabase.from("plans").update(req.body).eq("id", id);

  res.json({ success: true });
};
