import * as service from "../services/member.service.js";

export const createMember = async (req, res) => {
  try {
    const member = await service.createMember(req.user.gym_id, req.body);
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMembers = async (req, res) => {
  const members = await service.getMembers(req.user.gym_id);
  res.json(members);
};

export const getMemberById = async (req, res) => {
  const member = await service.getMemberById(req.user.gym_id, req.params.id);
  res.json(member);
};

export const updateMember = async (req, res) => {
  const member = await service.updateMember(
    req.user.gym_id,
    req.params.id,
    req.body
  );
  res.json(member);
};

export const deleteMember = async (req, res) => {
  await service.deleteMember(req.user.gym_id, req.params.id);
  res.status(204).send();
};
