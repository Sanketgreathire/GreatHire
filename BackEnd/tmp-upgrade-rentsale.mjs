import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Company } from './models/company.model.js';
import { Recruiter } from './models/recruiter.model.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const company = await Company.findOne({
    $or: [
      { companyName: { $regex: 'rentsale', $options: 'i' } },
      { email: 'swaraj121212@gmail.com' },
      { adminEmail: 'swaraj121212@gmail.com' },
    ]
  });

  if (!company) {
    console.log(JSON.stringify({ success: false, message: 'Company not found' }));
    await mongoose.disconnect();
    process.exit(0);
  }

  // Enterprise — 3 Months plan values (matches the real ₹7,500 / 3-month checkout)
  const update = {
    plan: 'ENTERPRISE',
    hasSubscription: true,
    creditedForJobs: 999999,
    creditedForCandidates: 7500,
    aiSourcingCredits: 750,
    maxJobPosts: '9999999',
    customMaxJobPosts: 0,
    freePlanExpiry: null,
    freeJobsPosted: 0,
    paidPlanFreeJobsPosted: 0,
    paidPlanFreeJobsRenewal: null,
    hasUsedFreePlan: false,
    planJobsPostedThisMonth: 0,
    planMonthStart: new Date(),
  };

  await Company.updateOne({ _id: company._id }, { $set: update });

  const recruiterIds = (company.userId || []).map((u) => u.user).filter(Boolean);
  if (recruiterIds.length) {
    await Recruiter.updateMany(
      { _id: { $in: recruiterIds } },
      { $set: { plan: 'ENTERPRISE', subscriptionStatus: 'ACTIVE' } }
    );
  }

  const refreshed = await Company.findById(company._id).lean();
  console.log(JSON.stringify({
    success: true,
    companyId: String(company._id),
    companyName: refreshed.companyName,
    updatedPlan: refreshed.plan,
    creditedForJobs: refreshed.creditedForJobs,
    creditedForCandidates: refreshed.creditedForCandidates,
    aiSourcingCredits: refreshed.aiSourcingCredits,
    hasSubscription: refreshed.hasSubscription,
  }));

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
