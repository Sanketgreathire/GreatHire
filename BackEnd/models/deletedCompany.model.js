import mongoose from "mongoose";

const deletedCompanySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    adminEmail: {
      type: String,
      required: true,
      unique: true,
    },
    CIN: {
      type: String,
      required: true,
      unique: true,
    },
    reason: {
      type: String,
      default: "Deleted by admin",
    },
    phone: {
        type: String,
    },
    deletedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const deletedCompany = mongoose.model(
  "deletedCompany",
  deletedCompanySchema
);
