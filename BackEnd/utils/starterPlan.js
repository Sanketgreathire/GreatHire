export const STARTER_UNLIMITED_JOBS_MONTHS = 6;

export const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

export const starterUnlimitedJobsUntilDate = (from = new Date()) =>
  addMonths(from, STARTER_UNLIMITED_JOBS_MONTHS);

export const isStarterCompany = (company) => {
  if (!company) return false;
  const plan = company.plan || "FREE";
  return plan === "FREE" && !company.hasSubscription;
};

export const hasStarterUnlimitedJobs = (company) => {
  if (!isStarterCompany(company)) return false;
  const until = company.starterUnlimitedJobsUntil
    ? new Date(company.starterUnlimitedJobsUntil)
    : null;
  if (until) return new Date() < until;
  // Field not persisted yet (existing companies): grant the 6-month window.
  return true;
};
