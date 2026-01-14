import * as service from "../services/gymProfile.service.js";

/* OWNER: GET */
export async function getOwnerGymProfile(req, res) {
  const ownerId = req.user.gym_id;
  const gym = await service.getOwnerGymProfile(ownerId);
  res.json(gym);
}

/* OWNER: UPDATE */
export async function updateOwnerGymProfile(req, res) {
  const updated = await service.updateGym(req.body);
  res.json(updated);
}

/* PUBLIC */
export async function getPublicGymProfile(req, res) {
  const { slug } = req.params;
  const gym = await service.getPublicGym(slug);

  if (!gym) {
    return res.status(404).json({ error: "Gym not found" });
  }

  res.json(gym);
}

/* PHOTOS */
export async function addGymPhoto(req, res) {
  const ownerId = req.user.gym_id;
  const photo = await service.addPhoto(ownerId, req.body.image_url);
  res.json(photo);
}

export async function deleteGymPhoto(req, res) {
  const ownerId = req.user.gym_id;
  const { id } = req.params;
  await service.deletePhoto(ownerId, id);
  res.json({ success: true });
}
