import { supabase } from "../config/supabase.js";
export const member = (req, res, next) => {
  if (req.user.role !== "MEMBER") {
    return res.sendStatus(403);
  }
  next();
};
