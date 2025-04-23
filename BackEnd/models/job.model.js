import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    jobDetails: {
      companyName: {
        type: String,
        required: true,
      },
      urgentHiring: {
        type: String,
        required: true, // Corrected to Boolean, true/false
        default: "No",
      },
      title: {
        type: String,
        required: true,
      },
      details: {
        type: String,
        required: true,
      },

      skills: [
        {
          type: String,
        },
      ],
      qualifications: [
        {
          type: String, // take by user speratated by new line use ich text area
        },
      ],
      benefits: [
        {
          type: String, // take by user speratated by new line use rich text area
        },
      ],

      responsibilities: [
        {
          type: String, // take by user speratated by new line use ich text area
        },
      ],

      experience: {
        type: String, // Assuming it's a number but stored as string
        required: true,
      },
      salary: {
        type: String, // Use String if the salary includes a range
        required: true,
      },
      jobType: {
        type: String,
        required: true,
      },
      workPlaceFlexibility:{
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },

      numberOfOpening: {
        type: String, // Assuming this is a numberOfOpening
        required: true,
      },
      respondTime: {
        type: String,
        required: true,
      },

      duration: {
        type: String, // If it's a text field (e.g., "Monday to Friday")
        required: true,
      },
      anyAmount:{
        type: String,
        required: true,
      },
      isActive: {
        type: Boolean, // Assuming this is a number but stored as string
        default:true,
      },
    }, 
    saveJob: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    hiddenJob: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    application: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
export default Job;