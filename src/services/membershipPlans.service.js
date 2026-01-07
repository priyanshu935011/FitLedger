import { supabase } from "../config/supabase.js";

export const getPlans = async (gym_id) => {
  const { data, error } = await supabase
    .from("membership_plans")
    .select("*")
    .eq("gym_id", gym_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const createPlan = async (gym_id, payload) => {
  const { data, error } = await supabase
    .from("membership_plans")
    .insert([{ ...payload, gym_id }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePlan = async (gym_id, id, payload) => {
  const { data, error } = await supabase
    .from("membership_plans")
    .update(payload)
    .eq("gym_id", gym_id)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePlan = async (gym_id, id) => {
  const { error } = await supabase
    .from("membership_plans")
    .delete()
    .eq("gym_id", gym_id)
    .eq("id", id);

  if (error) throw error;
};
