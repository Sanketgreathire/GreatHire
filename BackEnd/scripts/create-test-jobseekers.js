import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import connectDB from "../utils/db.js";

const testPassword = "GreatHireTest@2026";
const testUsers = [
  { email: "sravanpilla1809@gmail.com", fullname: "Sravan Test One", phone: "9000001001" },
  { email: "greathire849@gmail.com", fullname: "GreatHire Test User", phone: "9000001002" },
  { email: "sravanpilla2@gmail.com", fullname: "Sravan Test Two", phone: "9000001003" },
];

try {
  await connectDB();
  const password = await bcrypt.hash(testPassword, 10);
  const results = [];

  for (const [index, account] of testUsers.entries()) {
    const existing = await User.findOne({ "emailId.email": account.email }).select("_id");
    if (existing) {
      results.push({ email: account.email, status: "already exists" });
      continue;
    }

    await User.create({
      fullname: account.fullname,
      emailId: { email: account.email, isVerified: true },
      phoneNumber: { number: account.phone, isVerified: true },
      password,
      role: "student",
      isFirstLogin: false,
      referralCode: `TESTJS${Date.now()}${index}`,
      lastActiveAt: new Date(),
    });
    results.push({ email: account.email, status: "created" });
  }

  console.table(results);
} finally {
  await mongoose.connection.close();
}
