import * as service from "../services/dashboard.service.js";

export const getSummary = async (req, res, next) => {
  try {
    const data = await service.getDashboardSummary(req.user.gym_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
