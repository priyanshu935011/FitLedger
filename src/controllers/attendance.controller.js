import * as service from "../services/attendance.service.js";

export const checkIn = async (req, res, next) => {
  try {
    const data = await service.checkIn(req.user.gym_id, req.body.member_id);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

export const getTodayAttendance = async (req, res, next) => {
  try {
    const data = await service.getTodayAttendance(req.user.gym_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
