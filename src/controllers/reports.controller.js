import * as service from "../services/reports.service.js";

export const getMonthlySummary = async (req, res, next) => {
  try {
    const { month } = req.query; // YYYY-MM
    const data = await service.getMonthlySummary(req.user.gym_id, month);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
