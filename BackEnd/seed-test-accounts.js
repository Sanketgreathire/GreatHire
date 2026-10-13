import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "./models/user.model.js";
import { Recruiter } from "./models/recruiter.model.js";
import { Company } from "./models/company.model.js";

const DEFAULT_PASSWORD = "GreatHire@123";

const JOBSEEKERS = [
  {
    fullname: "Sravan Pilla",
    email: "sravanpilla1809@gmail.com",
    phoneNumber: "9876501809",
    skills: ["React.js", "Node.js", "JavaScript", "MongoDB", "Express.js"],
    qualification: "B.Tech Computer Science",
  },
  {
    fullname: "GreatHire Candidate",
    email: "greathire849@gmail.com",
    phoneNumber: "9876500849",
    skills: ["Python", "Machine Learning", "FastAPI", "PostgreSQL"],
    qualification: "MCA",
  },
  {
    fullname: "Sravan Pilla 2",
    email: "sravanpilla2@gmail.com",
    phoneNumber: "9876500002",
    skills: ["Full Stack Development", "Java", "Spring Boot", "React.js"],
    qualification: "B.Tech Information Technology",
  },
];

const RECRUITER_DATA = {
  fullname: "Tanmai Babde",
  email: "tanmai@babde.tech",
  phoneNumber: "9876509999",
  password: "GreatHire@123",
  position: "Talent Acquisition Head",
  companyName: "Babde Tech",
};

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB successfully!\n");

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const hashedRecruiterPass = await bcrypt.hash(RECRUITER_DATA.password, 10);

  // 1. Seed Jobseekers
  console.log("=== Seeding Job Seekers ===");
  for (const j of JOBSEEKERS) {
    const existing = await User.findOne({ "emailId.email": j.email.toLowerCase() });
    if (existing) {
      existing.fullname = j.fullname;
      existing.password = hashedPassword;
      existing.emailId.isVerified = true;
      existing.role = "student";
      await existing.save({ validateBeforeSave: false });
      console.log(`✅ Updated existing jobseeker: ${j.email} (Password: ${DEFAULT_PASSWORD})`);
    } else {
      const newUser = new User({
        fullname: j.fullname,
        emailId: {
          email: j.email.toLowerCase(),
          isVerified: true,
        },
        phoneNumber: {
          number: j.phoneNumber,
          isVerified: true,
        },
        password: hashedPassword,
        role: "student",
        profile: {
          skills: j.skills,
          qualification: j.qualification,
          bio: "Passionate software engineer looking for exciting opportunities.",
        },
        address: {
          city: "Hyderabad",
          state: "Telangana",
          country: "India",
        },
        isFirstLogin: false,
      });
      await newUser.save({ validateBeforeSave: false });
      console.log(`✅ Created new jobseeker: ${j.email} (Password: ${DEFAULT_PASSWORD})`);
    }
  }

  // 2. Seed Recruiter: tanmai@babde.tech
  console.log("\n=== Seeding Recruiter tanmai@babde.tech ===");
  let recruiter = await Recruiter.findOne({ "emailId.email": RECRUITER_DATA.email.toLowerCase() });

  if (recruiter) {
    recruiter.fullname = RECRUITER_DATA.fullname;
    recruiter.password = hashedRecruiterPass;
    recruiter.emailId.isVerified = true;
    recruiter.position = RECRUITER_DATA.position;
    recruiter.isCompanyCreated = true;
    recruiter.isActive = true;
    await recruiter.save({ validateBeforeSave: false });
    console.log(`✅ Updated existing recruiter: ${RECRUITER_DATA.email}`);
  } else {
    recruiter = new Recruiter({
      fullname: RECRUITER_DATA.fullname,
      emailId: {
        email: RECRUITER_DATA.email.toLowerCase(),
        isVerified: true,
      },
      phoneNumber: {
        number: RECRUITER_DATA.phoneNumber,
        isVerified: true,
      },
      password: hashedRecruiterPass,
      role: "recruiter",
      position: RECRUITER_DATA.position,
      isCompanyCreated: true,
      isActive: true,
      isFirstLogin: false,
    });
    await recruiter.save({ validateBeforeSave: false });
    console.log(`✅ Created new recruiter: ${RECRUITER_DATA.email}`);
  }

  // Ensure Company exists for this recruiter
  let company = await Company.findOne({
    $or: [{ userId: recruiter._id }, { email: RECRUITER_DATA.email.toLowerCase() }],
  });
  if (!company) {
    company = new Company({
      companyName: RECRUITER_DATA.companyName,
      companyWebsite: "https://babde.tech",
      industry: "Technology",
      email: RECRUITER_DATA.email.toLowerCase(),
      phone: RECRUITER_DATA.phoneNumber,
      address: {
        city: "Hyderabad",
        state: "Telangana",
        country: "India",
      },
      userId: recruiter._id,
      recruiterId: recruiter._id,
    });
    await company.save({ validateBeforeSave: false });
    console.log(`✅ Created company "${RECRUITER_DATA.companyName}" linked to recruiter.`);
  } else {
    company.userId = recruiter._id;
    company.recruiterId = recruiter._id;
    await company.save({ validateBeforeSave: false });
    console.log(`✅ Linked existing company to recruiter.`);
  }

  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("  All accounts successfully created and verified!");
  console.log("═══════════════════════════════════════════════════════════════");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
