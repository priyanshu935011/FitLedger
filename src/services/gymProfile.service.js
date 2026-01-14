import { supabase } from "../config/supabase.js";

/* GET OWNER PROFILE */
export async function getOwnerGymProfile() {
  const { data, error } = await supabase.rpc("get_owner_gym_profile");
  if (error) throw error;
  return data;
}

/* UPDATE GYM CORE */
export async function updateGym(data) {
  const { error } = await supabase
    .from("gyms")
    .update({
      name: data.name,
      description: data.description,
      contact_phone: data.contact_phone,
      contact_email: data.contact_email,
      city_country: data.city_country,
      logo_url: data.logo_url,
      cover_image_url: data.cover_image_url,
    })
    .eq("id", data.id);

  if (error) throw error;
}

/* FACILITIES */
export async function replaceFacilities(gymId, facilities) {
  await supabase.from("gym_facilities").delete().eq("gym_id", gymId);

  const inserts = facilities.map((f) => ({
    gym_id: gymId,
    name: f,
  }));

  const { error } = await supabase.from("gym_facilities").insert(inserts);
  if (error) throw error;
}

/* OPERATING HOURS */
export async function replaceOperatingHours(gymId, hours) {
  await supabase.from("gym_operating_hours").delete().eq("gym_id", gymId);

  const { error } = await supabase
    .from("gym_operating_hours")
    .insert(hours.map((h) => ({ ...h, gym_id: gymId })));

  if (error) throw error;
}

/* PHOTOS */
export async function addGymPhoto(gymId, url) {
  const { error } = await supabase
    .from("gym_photos")
    .insert({ gym_id: gymId, image_url: url });

  if (error) throw error;
}

export async function deleteGymPhoto(id) {
  const { error } = await supabase.from("gym_photos").delete().eq("id", id);
  if (error) throw error;
}
export async function getPublicGym(slug) {
  const { data, error } = await supabase
    .from("gyms")
    .select(
      `
      *,
      gym_facilities (*),
      gym_operating_hours (*),
      gym_membership_plans (*),
      gym_photos (*)
    `
    )
    .eq("id", slug)
    .eq("status", "ACTIVE")
    .single();

  if (error) throw error;
  return data;
}
