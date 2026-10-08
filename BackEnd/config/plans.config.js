// Server-Authoritative Plans Catalog
// Single source of truth for pricing and entitlements

export const RECRUITER_JOB_PLANS = {
  "enterprise-monthly": {
    id: "enterprise-monthly",
    title: "Enterprise — Monthly",
    price: 2999,
    planType: "ENTERPRISE",
    durationMonths: 1,
    creditsForJobs: 999999,
    creditsForCandidates: 2500,
    aiSourcingCredits: 250,
    teamUserLimit: 2,
  },
  "enterprise-3m": {
    id: "enterprise-3m",
    title: "Enterprise — 3 Months",
    price: 7499,
    planType: "ENTERPRISE",
    durationMonths: 3,
    creditsForJobs: 999999,
    creditsForCandidates: 7500,
    aiSourcingCredits: 750,
    teamUserLimit: 3,
  },
  "enterprise-6m": {
    id: "enterprise-6m",
    title: "Enterprise — 6 Months",
    price: 13999,
    planType: "ENTERPRISE",
    durationMonths: 6,
    creditsForJobs: 999999,
    creditsForCandidates: 15000,
    aiSourcingCredits: 1500,
    teamUserLimit: 6,
  },
  "enterprise-1y": {
    id: "enterprise-1y",
    title: "Enterprise — 1 Year",
    price: 26999,
    planType: "ENTERPRISE",
    durationMonths: 12,
    creditsForJobs: 999999,
    creditsForCandidates: 30000,
    aiSourcingCredits: 3000,
    teamUserLimit: 12,
  },
  "growth": {
    id: "growth",
    title: "Growth Plan",
    price: 1999,
    planType: "STANDARD",
    durationMonths: 1,
    creditsForJobs: 5,
    creditsForCandidates: 500,
    aiSourcingCredits: 0,
    teamUserLimit: 1,
  },
  "scale": {
    id: "scale",
    title: "Scale Plan",
    price: 2999,
    planType: "PREMIUM",
    durationMonths: 1,
    creditsForJobs: 10,
    creditsForCandidates: 1500,
    aiSourcingCredits: 0,
    teamUserLimit: 3,
  },
  "pro": {
    id: "pro",
    title: "Pro Plan",
    price: 4999,
    planType: "PRO",
    durationMonths: 1,
    creditsForJobs: 25,
    creditsForCandidates: 5000,
    aiSourcingCredits: 0,
    teamUserLimit: 5,
  },
};

export const CANDIDATE_PLANS = {
  "basic": {
    id: "basic",
    title: "Basic",
    price: 1000,
    creditBoost: 2000,
  },
  "standard": {
    id: "standard",
    title: "Standard",
    price: 4000,
    creditBoost: 10000,
  },
  "premium": {
    id: "premium",
    title: "Premium",
    price: 8000,
    creditBoost: 25000,
  },
};

/**
 * Finds a recruiter job plan by planId, title, or normalized key.
 * Ensures backward compatibility with both new and legacy frontend payloads.
 */
export const findJobPlan = (identifier) => {
  if (!identifier) return null;
  const str = String(identifier).trim().toLowerCase();

  // 1. Direct ID match
  if (RECRUITER_JOB_PLANS[str]) {
    return RECRUITER_JOB_PLANS[str];
  }

  // 2. Title match or alias match
  for (const plan of Object.values(RECRUITER_JOB_PLANS)) {
    if (plan.title.toLowerCase() === str || plan.id.toLowerCase() === str) {
      return plan;
    }
    // Handle fuzzy dash/whitespace variations (e.g., "Enterprise - Monthly" vs "Enterprise — Monthly")
    const cleanPlanTitle = plan.title.replace(/[\u2013\u2014-]/g, "-").toLowerCase();
    const cleanInput = str.replace(/[\u2013\u2014-]/g, "-").toLowerCase();
    if (cleanPlanTitle === cleanInput) {
      return plan;
    }
  }

  return null;
};

/**
 * Finds a candidate plan by name or ID.
 */
export const findCandidatePlan = (identifier) => {
  if (!identifier) return null;
  const str = String(identifier).trim().toLowerCase();

  if (CANDIDATE_PLANS[str]) {
    return CANDIDATE_PLANS[str];
  }

  for (const plan of Object.values(CANDIDATE_PLANS)) {
    if (plan.title.toLowerCase() === str) {
      return plan;
    }
  }

  return null;
};
