import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { FailedJob } from "./models/failedJob.model.js";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/great_hire_db";
await mongoose.connect(uri);

const jobs = await FailedJob.find().sort({ createdAt: -1 }).limit(5);
console.log(JSON.stringify(jobs, null, 2));
process.exit(0);