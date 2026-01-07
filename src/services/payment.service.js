import { supabase } from "../config/supabase.js";

export const createPayment = async (gym_id, payload) => {
  const { data, error } = await supabase
    .from("payments")
    .insert([{ ...payload, gym_id }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getRecentPayments = async (gym_id) => {
  const { data, error } = await supabase
    .from("payments")
    .select("*, members(full_name)")
    .eq("gym_id", gym_id)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw error;
  return data;
};
