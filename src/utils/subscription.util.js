export const calculateSubscriptionEndDate = (startDate, billingCycle) => {
  const start = new Date(startDate);

  if (billingCycle === "MONTHLY") {
    start.setMonth(start.getMonth() + 1);
  }

  if (billingCycle === "YEARLY") {
    start.setFullYear(start.getFullYear() + 1);
  }

  return start.toISOString().split("T")[0]; // YYYY-MM-DD
};
