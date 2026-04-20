import mongoose from "mongoose";

const courseEnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    courseName: { type: String, required: true },
    fee: { type: String, default: "" },
    mode: { type: String, enum: ["Online", "Offline", "Hybrid"], default: "Online" },
    batch: { type: String, default: "" },
    type: {
      type: String,
      enum: ["enquiry", "demo", "enrollment", "counsellor"],
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "enrolled", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

export const CourseEnquiry = mongoose.model("CourseEnquiry", courseEnquirySchema);
