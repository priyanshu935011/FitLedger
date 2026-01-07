import { supabase } from "../config/supabase.js";

export const signup = async (req, res) => {
  const { email, password, role } = req.body;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) return res.status(400).json({ error: error.message });

  await supabase.from("profiles").insert({
    id: data.user.id,
    role,
  });

  res.json({ success: true });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: error.message });

  res.json({
    accessToken: data.session.access_token,
    user: data.user,
  });
};
export const me = async (req, res) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", req.user.id)
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.json({
    id: req.user.id,
    email: req.user.email,
    role: data.role,
  });
};
export const validateToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ valid: false });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ valid: false });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ valid: false });
    }

    return res.json({
      valid: true,
      userId: data.user.id,
    });
  } catch (err) {
    return res.status(401).json({ valid: false });
  }
};
