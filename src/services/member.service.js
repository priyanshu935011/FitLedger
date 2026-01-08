import { supabase } from "../config/supabase.js";
import { createPayment } from "./payment.service.js";

export const createMember = async (gym_id, data) => {
  const { data: member, error } = await supabase
    .from("members")
    .insert([{ ...data, gym_id }])
    .select()
    .single();
  if (member) {
    const payload = {
      member_id: member.member_id,
      amount: member.amount,
      payment_mode: data.mode,
      purpose: "Subscription Started",
    };
    await createPayment(gym_id, payload);
  }
  if (error) throw error;
  return member;
};

export const getMembers = async (gym_id) => {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("gym_id", gym_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getMemberById = async (gym_id, id) => {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("gym_id", gym_id)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const updateMember = async (gym_id, id, updates) => {
  const { data, error } = await supabase
    .from("members")
    .update(updates)
    .eq("gym_id", gym_id)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteMember = async (gym_id, id) => {
  const { error } = await supabase
    .from("members")
    .delete()
    .eq("gym_id", gym_id)
    .eq("id", id);

  if (error) throw error;
};
