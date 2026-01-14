import * as service from "../services/payment.service.js";

export const createPayment = async (req, res, next) => {
  try {
    const payment = await service.createPayment(req.user.gym_id, req.body);
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
};

export const getRecentPayments = async (req, res, next) => {
  try {
    const payments = await service.getRecentPayments(req.user.gym_id);
    res.json(payments);
  } catch (err) {
    next(err);
  }
};
export const delParticularPayment = async (req, res) => {
  const { id } = req.params;
  try {
    const payments = await service.getParticularPayment(id);
    res.json(payments);
  } catch (err) {
    throw err;
  }
};
