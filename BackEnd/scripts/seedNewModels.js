import "dotenv/config";
import mongoose from "mongoose";

import { User } from "../models/user.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import { Company } from "../models/company.model.js";
import { Application } from "../models/application.model.js";
import Job from "../models/job.model.js";

import Department from "../models/department.model.js";
import Interview from "../models/interview.model.js";
import Offer from "../models/offer.model.js";
import Employee from "../models/employee.model.js";
import StageHistory from "../models/stageHistory.model.js";

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/great_hire_db");
  console.log("MongoDB connected — seeding new models...");

  // Find any existing user/recruiter/company/job/application to link against.
  // This script does not create these — it expects at least one of each to already exist
  // (e.g. from your test recruiter/company/job setup earlier).
  const user = await User.findOne();
  const recruiter = await Recruiter.findOne();
  const company = await Company.findOne();
  const job = await Job.findOne();
  const application = await Application.findOne();

  if (!user || !recruiter || !company || !job || !application) {
    console.error("Missing prerequisite data. Make sure at least one User, Recruiter, Company, Job, and Application already exist before running this seed script.");
    process.exit(1);
  }

  // 1. Department
  const department = await Department.create({
    name: "Engineering",
    code: "ENG",
  });
  console.log("Created Department:", department._id);

  // Link the job to this department, since Job.model.js now has a department ref
  job.department = department._id;
  await job.save();
  console.log("Linked Job to Department");

  // 2. Interview
  const interview = await Interview.create({
    application: application._id,
    scheduledDate: new Date(),
    interviewer: user._id,
    mode: "video",
    status: "Scheduled",
    zoomLink: "https://zoom.us/j/example",
  });
  console.log("Created Interview:", interview._id);

  // 3. Offer
  const offer = await Offer.create({
    application: application._id,
    offerDate: new Date(),
    salaryOffered: 600000,
    status: "Sent",
    docusignLink: "https://docusign.example.com/offer/example",
  });
  console.log("Created Offer:", offer._id);

  // 4. Employee
  const employee = await Employee.create({
    user: user._id,
    employeeId: "EMP-0001",
    department: department._id,
    position: "Software Engineer",
    joiningDate: new Date(),
    employmentStatus: "Active",
  });
  console.log("Created Employee:", employee._id);

  // 5. StageHistory
  const stageHistory = await StageHistory.create({
    application: application._id,
    fromStage: "Application",
    toStage: "Screening",
    changedBy: user._id,
  });
  console.log("Created StageHistory:", stageHistory._id);

  console.log("\nSeed complete — one of each new model created successfully.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});