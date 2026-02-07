// import mongoose from "mongoose";
// const jobSubscriptionSchema = new mongoose.Schema(
//   {
//     type: {
//       type: String,
//       default: "JobPosting",
//     },
//     planName: {
//       type: String,
//       enum: ["1 x Premium Job", "5 x Premium Jobs", "10 x Premium Jobs"],
//       required: true,
//     },
//     creditedForJobs: {
//       type: Number,
//       required: true,
//     },
//     creditedForCandidates: {
//       type: Number,
//       required: true,
//     },
//     purchaseDate: {
//       type: Date,
//       required: true,
//       default: Date.now,
//     },
//     expiryDate: {
//       type: Date,
//       required: true,
//       default: function () {
//         // Automatically set to one month after purchase
//         return new Date(new Date().setMonth(new Date().getMonth() + 1));
//       },
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["Hold", "Active", "Expired"],
//       required: true,
//       default: "Hold",
//     },
//     razorpayOrderId: { type: String, required: true },
//     paymentStatus: {
//       type: String,
//       enum: ["created", "paid", "failed"],
//       default: "created",
//     },
//     paymentDetails: {
//       // To capture additional Razorpay payment information
//       paymentId: { type: String },
//       signature: { type: String },
//     },
//     company: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Company",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// // Helper method to update status
// jobSubscriptionSchema.methods.checkValidity = async function () {
//   const now = new Date();
//   if (this.expiryDate < now ) {
//     // Expire the subscription
//     console.log()
//     this.status = "Expired";
//     await this.save();

//     // Update the company's maxPostJobs to 0
//     const company = await mongoose.model("Company").findById(this.company);
//     if (company) {
//       company.maxJobPosts = 0;
//       await company.save();
//     }
//     return true;
//   }
//   return false;
// };

// export const JobSubscription = mongoose.model(
//   "JobSubscription",
//   jobSubscriptionSchema
// );


import mongoose from "mongoose";

const jobSubscriptionSchema = new mongoose.Schema(
  {
    planName: String,
    creditedForJobs: Number,
    creditedForCandidates: Number,
    price: Number,
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    status: {
      type: String,
      enum: ["Hold", "Active", "Expired"],
      default: "Hold",
    },
    paymentStatus: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    razorpayOrderId: { 
      type: String, 
      required: true 
    },
    paymentDetails: {
      paymentId: { type: String },
      signature: { type: String },
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

jobSubscriptionSchema.methods.checkValidity = async function () {
  const now = new Date();
  console.log(`  checkValidity called for ${this._id}: expiryDate=${this.expiryDate}, now=${now}, status=${this.status}`);
  
  if (this.expiryDate < now && this.status !== "Expired") {
    console.log(`  ✅ Expiring subscription ${this._id}`);
    
    // Use updateOne to bypass validation for old records
    await mongoose.model("JobSubscription").updateOne(
      { _id: this._id },
      { $set: { status: "Expired" } }
    );
    this.status = "Expired";

    const company = await mongoose.model("Company").findById(this.company);
    if (company) {
      console.log(`  ✅ Resetting company ${company.companyName} to free plan`);
      // Reset to free plan credits after paid plan expires
      company.creditedForJobs = 1000; // 2 free job posts
      company.creditedForCandidates = 5; // 5 free candidate views
      company.maxJobPosts = 0;
      company.lastFreePlanRenewal = new Date(); // Reset renewal date
      await company.save();
    }
    return true;
  }
  return false;
};

export const JobSubscription = mongoose.model(
  "JobSubscription",
  jobSubscriptionSchema
);
