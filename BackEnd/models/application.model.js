
// // import mongoose from "mongoose";


// const applicationSchema = new mongoose.Schema(
//   {
//     job: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Job",
//       required: true,
//     },
//     applicant: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//      applicantName: { type: String },
//     applicantEmail: { type: String },
//     applicantPhone: { type: String },
//     applicantProfile: { type: Object }, 
//     resume: { type: String }, // yaha resume ka URL ya filename save hoga
//     status: {
//       type: String,
//       enum: ["Pending", "Shortlisted", "Rejected"],
//       default: "Pending",
//     },
//   },
   
//   { timestamps: true }
  
// );
// // const Application = mongoose.model("Application", applicationSchema);
// // export default Application;

// export const Application = mongoose.model("Application", applicationSchema);

