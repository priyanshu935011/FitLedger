import { supabase } from "../config/supabase.js";
export const adminOnly = async (req, res, next) => {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", req.user.id)
    .single();

  if (data.role !== "ADMIN") return res.sendStatus(403);
  next();
};
