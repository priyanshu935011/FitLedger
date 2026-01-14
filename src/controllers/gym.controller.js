import { supabase } from "../config/supabase.js";
import { sendPasswordSetupEmail } from "../services/email.service.js";

import { calculateSubscriptionEndDate } from "../utils/subscription.util.js";

const PLAN_MAP = {
  1: "STARTER",
  2: "PRO",
  3: "ELITE",
  STARTER: "STARTER",
  PRO: "PRO",
  ELITE: "ELITE",
  starter: "STARTER",
  pro: "PRO",
  elite: "ELITE",
};

export const createGym = async (req, res) => {
  try {
    let {
      name,
      city,
      owner_name,
      owner_email,
      owner_phone,
      plan,
      billing_cycle,
      subscription_start_date,
      password,
    } = req.body;

    // -------------------------------
    // 1. Normalize & validate inputs
    // -------------------------------
    billing_cycle = billing_cycle?.toUpperCase();
    plan = PLAN_MAP[plan];

    if (!billing_cycle || !["MONTHLY", "YEARLY"].includes(billing_cycle)) {
      return res.status(400).json({ error: "Invalid billing cycle" });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    if (!plan) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    // -------------------------------
    // 2. Calculate subscription end date
    // -------------------------------
    const subscription_end_date = calculateSubscriptionEndDate(
      subscription_start_date,
      billing_cycle
    );

    // -------------------------------
    // 3. Create gym
    // -------------------------------
    const { data: gym, error: gymError } = await supabase
      .from("gyms")
      .insert({
        name,
        city,
        owner_name,
        owner_email,
        owner_phone,
        plan,
        billing_cycle,
        subscription_start_date,
        subscription_end_date,
        status: "ACTIVE",
        created_by: req.user.id,
      })
      .select()
      .single();

    if (gymError) {
      console.error(gymError);
      return res.status(400).json({ error: gymError.message });
    }

    // -------------------------------
    // 4. Create auth user
    // -------------------------------
    const { data: authUser, error: authError } =
      await supabase.auth.admin.createUser({
        email: owner_email,
        password,
        email_confirm: true,
      });

    if (authError) {
      console.error(authError);
      return res.status(400).json({ error: "Failed to create auth user" });
    }

    // -------------------------------
    // 5. Create profile
    // -------------------------------
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authUser.user.id,
      role: "MEMBER",
      gym_id: gym.id,
    });

    if (profileError) {
      console.error(profileError);
      return res.status(400).json({ error: "Failed to create profile" });
    }

    // -------------------------------
    // 6. INIT GYM RELATED TABLES ✅
    // -------------------------------

    // 6.1 gym_profiles (1:1)
    await supabase.from("gym_profiles").insert({
      gym_id: gym.id,
      address_line1: "",
      city: city,
    });

    // 6.2 operating hours (defaults)
    await supabase.from("gym_operating_hours").insert([
      {
        gym_id: gym.id,
        day_range: "Monday - Friday",
        open_time: "06:00",
        close_time: "22:00",
      },
      {
        gym_id: gym.id,
        day_range: "Saturday",
        open_time: "07:00",
        close_time: "21:00",
      },
      {
        gym_id: gym.id,
        day_range: "Sunday",
        open_time: "08:00",
        close_time: "14:00",
      },
    ]);

    // ❌ gym_facilities → leave empty
    // ❌ gym_photos → leave empty
    // ❌ gym_membership_plans → leave empty

    // -------------------------------
    // 7. Final response
    // -------------------------------
    return res.json({
      success: true,
      message: "Gym created & initialized successfully",
      gym_id: gym.id,
    });
  } catch (err) {
    console.error("createGym error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const listGyms = async (_, res) => {
  const { data, error } = await supabase
    .from("gyms")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

export const getGymById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("gyms")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: "Gym not found" });
  res.json(data);
};

export const updateGym = async (req, res) => {
  const { id } = req.params;
  let { billing_cycle, subscription_start_date } = req.body;

  const updatePayload = { ...req.body };

  if (billing_cycle && subscription_start_date) {
    billing_cycle = billing_cycle.toUpperCase();

    updatePayload.subscription_end_date = calculateSubscriptionEndDate(
      subscription_start_date,
      billing_cycle
    );

    updatePayload.billing_cycle = billing_cycle;
  }

  const { error } = await supabase
    .from("gyms")
    .update(updatePayload)
    .eq("id", id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ success: true });
};

export const archiveGym = async (req, res) => {
  await supabase
    .from("gyms")
    .update({ is_archived: true })
    .eq("id", req.params.id);

  res.json({ success: true });
};
