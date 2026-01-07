import { supabase } from "../config/supabase.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("gym_id, role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.role) {
      return res.status(403).json({
        error: "Profile not configured for this user",
      });
    }

    // 🔑 ONLY members require gym
    if (profile.role !== "ADMIN" && !profile.gym_id) {
      return res.status(403).json({
        error: "Gym not configured for this user",
      });
    }

    // Attach context
    req.user = {
      id: user.id,
      role: profile.role,
      gym_id: profile.gym_id || null, // admin → null
    };

    next();
  } catch (err) {
    next(err);
  }
};
