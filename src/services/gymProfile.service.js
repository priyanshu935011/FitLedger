import { supabase } from "../config/supabase.js";

/* GET OWNER PROFILE */
export async function getOwnerGymProfile(gym_id) {
  const data = await getPublicGym(gym_id);
  // if (error) throw error;
  return data;
}

export async function updateGym(data) {
  /* ---------------- UPDATE GYM CORE ---------------- */
  const { error: gymError } = await supabase
    .from("gyms")
    .update({
      name: data.name,
      description: data.description,
      owner_phone: data.owner_phone,
      owner_email: data.owner_email,
      city: data.city,
      logo_url: data.logo_url,
      cover_image_url: data.cover_image_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.id);

  if (gymError) throw gymError;

  /* ---------------- OPERATING HOURS ---------------- */
  if (data.gym_operating_hours) {
    await supabase.from("gym_operating_hours").delete().eq("gym_id", data.id);

    if (data.gym_operating_hours.length > 0) {
      const { error } = await supabase.from("gym_operating_hours").insert(
        data.gym_operating_hours.map((h) => ({
          gym_id: data.id,
          day_range: h.day_range,
          open_time: h.open_time,
          close_time: h.close_time,
        }))
      );

      if (error) throw error;
    }
  }

  /* ---------------- MEMBERSHIP PLANS ---------------- */
  if (data.membership_plans) {
    await supabase.from("gym_membership_plans").delete().eq("gym_id", data.id);

    if (data.membership_plans.length > 0) {
      const { error } = await supabase.from("gym_membership_plans").insert(
        data.membership_plans.map((p) => ({
          gym_id: data.id,
          name: p.name,
          price: p.price,
          duration_months: p.duration_months,
          is_popular: p.is_popular ?? false,
          discount_label: p.discount_label ?? null,
        }))
      );

      if (error) throw error;
    }
  }

  /* ---------------- FACILITIES ---------------- */
  if (data.gym_facilities) {
    await supabase.from("gym_facilities").delete().eq("gym_id", data.id);

    if (data.gym_facilities.length > 0) {
      const { error } = await supabase.from("gym_facilities").insert(
        data.gym_facilities.map((f) => ({
          gym_id: data.id,
          name: f,
        }))
      );

      if (error) throw error;
    }
  }

  /* ---------------- PHOTOS ---------------- */
  if (data.gym_photos) {
    await supabase.from("gym_photos").delete().eq("gym_id", data.id);

    if (data.gym_photos.length > 0) {
      const { error } = await supabase.from("gym_photos").insert(
        data.gym_photos.map((p, index) => ({
          gym_id: data.id,
          image_url: p.image_url,
          is_cover: p.is_cover ?? false,
        }))
      );

      if (error) throw error;
    }
  }

  return { success: true };
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
