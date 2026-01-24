import mongoose from "mongoose";
const candidateSubscriptionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "CandidateData",
    },
    planName: {
      type: String,
      enum: ["Basic", "Standard", "Premium"],
      required: true,
    },
    creditBoost: {
      type: Number,
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
      default: function () {
        // return new Date(Date.now() + 5 * 60 * 1000); // Current time + 5 minutes
        return new Date(new Date().setMonth(new Date().getMonth() + 1));
      },
    },

    // expiryDate: {
    //   type: Date,
    //   required: true,
    //   default: function () {
    //     // Automatically set to one month after purchase
    //     return new Date(new Date().setMonth(new Date().getMonth() + 1));
    //   },
    // },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Hold", "Active", "Expired"],
      required: true,
      default: "Hold",
    },
    razorpayOrderId: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    paymentDetails: {
      // To capture additional Razorpay payment information
      paymentId: { type: String },
      signature: { type: String },
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

// Helper method to update status
candidateSubscriptionSchema.methods.checkValidity = async function () {
  const now = new Date();
  if (this.expiryDate < now) {
    // Expire the subscription
    this.status = "Expired";
    await this.save();

    // Update the company's maxPostJobs to 0
    const company = await mongoose.model("Company").findById(this.company);
    if (company) {
      company.creditedForCandidates = 0;
      await company.save();
    }

    return true; // ✅ Return true if expired
  }
  return false; // ✅ Return false if still active
};

export const CandidateSubscription = mongoose.model(
  "CandidateSubscription",
  candidateSubscriptionSchema
);
