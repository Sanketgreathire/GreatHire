// Whether a company's 3-day free trial is currently active.
// Trial unlocks paid-tier limits everywhere EXCEPT AI Sourcing, which stays
// gated on `hasSubscription` alone — see requireSourcingAccess.js.
export const isTrialLive = (company) => {
  return !!(
    company?.trialActive &&
    company?.trialExpiresAt &&
    new Date(company.trialExpiresAt) > new Date()
  );
};
