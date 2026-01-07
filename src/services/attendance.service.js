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
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("attendance")
    .select("*, members(full_name)")
    .eq("gym_id", gym_id)
    .eq("check_in_date", today)
    .order("check_in_time", { ascending: true });

  if (error) throw error;
  return data;
};
