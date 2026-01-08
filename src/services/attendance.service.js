import { supabase } from "../config/supabase.js";

export const checkIn = async (gym_id, member_id) => {
  const { data, error } = await supabase
    .from("attendance")
    .insert([{ gym_id, member_id }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getTodayAttendance = async (gym_id) => {
  // Current time
  const now = new Date();

  // Get today's date in IST
  const todayIST = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  // Convert IST midnight to UTC timestamp
  const istMidnightUTC = new Date(`${todayIST}T00:00:00+05:30`).toISOString();

  const { data, error } = await supabase
    .from("attendance")
    .select("*, members(full_name)")
    .eq("gym_id", gym_id)
    .gte("check_in_time", istMidnightUTC)
    .order("check_in_time", { ascending: true });

  if (error) throw error;
  return data;
};
