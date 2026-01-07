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

    // 🔑 FETCH PROFILE (THIS WAS MISSING)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("gym_id, role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.gym_id) {
      return res.status(403).json({
        error: "Profile or gym not configured for this user",
      });
    }

    // ✅ ATTACH FULL CONTEXT
    req.user = {
      id: user.id,
      role: profile.role,
      gym_id: profile.gym_id, // 🔥 NEVER undefined now
    };

    next();
  } catch (err) {
    next(err);
  }
};
