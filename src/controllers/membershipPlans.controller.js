import * as service from "../services/membershipPlans.service.js";

export const getPlans = async (req, res, next) => {
  try {
    const plans = await service.getPlans(req.user.gym_id);
    res.json(plans);
  } catch (err) {
    next(err);
  }
};

export const createPlan = async (req, res, next) => {
  try {
    const plan = await service.createPlan(req.user.gym_id, req.body);
    res.status(201).json(plan);
  } catch (err) {
    next(err);
  }
};

export const updatePlan = async (req, res, next) => {
  try {
    const plan = await service.updatePlan(
      req.user.gym_id,
      req.params.id,
      req.body
    );
    res.json(plan);
  } catch (err) {
    next(err);
  }
};

export const deletePlan = async (req, res, next) => {
  try {
    await service.deletePlan(req.user.gym_id, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
