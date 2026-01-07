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
  // Get current time in IST
  const now = new Date();

  const istOffsetMinutes = 5 * 60 + 30; // IST = UTC + 5:30
  const utcMinutes = now.getTime() + now.getTimezoneOffset() * 60000;
  const istTime = new Date(utcMinutes + istOffsetMinutes * 60000);

  // Format as YYYY-MM-DD
  const todayIST = istTime.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("attendance")
    .select("*, members(full_name)")
    .eq("gym_id", gym_id)
    .eq("check_in_date", todayIST)
    .order("check_in_time", { ascending: true });

  if (error) throw error;
  return data;
};
