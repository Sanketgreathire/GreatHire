import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    offerDate: {
      type: Date,
      required: true,
    },
    salaryOffered: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Sent", "Accepted", "Rejected", "Pending"],
      default: "Pending",
    },
    docusignLink: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Offer = mongoose.model("Offer", offerSchema);

export default Offer;