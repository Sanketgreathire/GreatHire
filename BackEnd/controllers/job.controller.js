import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { Company } from "../models/company.model.js";
import { JobSubscription } from "../models/jobSubscription.model.js";
import { isUserAssociated } from "./company.controller.js";
import { Admin } from "../models/admin/admin.model.js";
import { check, validationResult } from "express-validator";
import { BlacklistedCompany } from "../models/blacklistedCompany.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import axios from "axios";

// postjob by recruiter
export const postJob = [
  check("title").notEmpty().withMessage("Title is required"),
  check("details").notEmpty().withMessage("Details are required"),
  check("experience").notEmpty().withMessage("Experience is required"),
  check("salary").notEmpty().withMessage("Salary is required"),
  check("jobType").notEmpty().withMessage("Job type is required"),
  check("location").notEmpty().withMessage("Location is required"),
  check("numberOfOpening").notEmpty().withMessage("Number of openings is required"),
  check("duration").notEmpty().withMessage("Duration is required"),
  check("companyId").notEmpty().withMessage("Company ID is required"),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        companyName,
        urgentHiring,
        title,
        details,
        skills,
        qualifications,
        benefits,
        responsibilities,
        experience,
        salary,
        jobType,
        workPlaceFlexibility,
        location,
        numberOfOpening,
        respondTime,
        duration,
        anyAmount,
        companyId,
      } = req.body;

      const userId = req.id;

      const company = await Company.findById(companyId);

      if (company.maxJobPosts === 0) {
        return res.status(400).json({
          success: false,
          message: "Company needs job plans",
        });
      }

      const splitSkills = (typeof skills === 'string') ? skills.split(",").map(s => s.trim()) : [];
      const splitQualifications = (typeof qualifications === 'string') ? qualifications.split("\n").map(q => q.trim()) : [];
      const splitBenefits = (typeof benefits === 'string') ? benefits.split("\n").map(b => b.trim()) : [];
      const splitResponsibilities = (typeof responsibilities === 'string') ? responsibilities.split("\n").map(r => r.trim()) : [];

      if (anyAmount === "Yes") {
        const blacklistedData = {
          companyName: company.companyName,
          email: company.email,
          adminEmail: company.adminEmail,
          CIN: company.CIN,
        };

        const existingBlacklist = await BlacklistedCompany.findOne({ CIN: company.CIN });

        if (!existingBlacklist) {
          await BlacklistedCompany.create(blacklistedData);
        }

        await Recruiter.updateOne(
          { _id: userId },
          { $set: { isActive: false, isBlocked: true } }
        );

        return res.status(403).json({
          success: false,
          message: "Your company has been blacklisted. Please contact the admin.",
        });
      }

      const newJob = new Job({
        jobDetails: {
          companyName,
          urgentHiring,
          title,
          details,
          skills: splitSkills,
          benefits: splitBenefits,
          qualifications: splitQualifications,
          responsibilities: splitResponsibilities,
          salary,
          experience,
          jobType,
          workPlaceFlexibility,
          location,
          numberOfOpening,
          respondTime,
          duration,
          anyAmount,
          isActive: true,
        },
        created_by: userId,
        company: companyId,
      });

      await newJob.save();

      if (company.maxJobPosts > 0) {
        const updatedCompany = await Company.findOneAndUpdate(
          { _id: company._id },
          { $inc: { maxJobPosts: -1 } },
          { new: true }
        );

        if (updatedCompany && updatedCompany.maxJobPosts === 0) {
          const activeSubscription = await JobSubscription.findOne({
            company: company._id,
            status: "Active",
          });

          if (activeSubscription && activeSubscription.planName !== "Free") {
            activeSubscription.status = "Expired";
            await activeSubscription.save();
          }
        }
      }

      return res.status(201).json({
        success: true,
        message: "Job posted successfully.",
      });
    } catch (error) {
      console.error("Error posting job:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
];

// Implement getExternalJobsFromFindwork
export const getExternalJobsFromFindwork = async (req, res) => {
  try {
    // Fetch jobs data from Findwork API
    const response = await axios.get('https://findwork.dev/api/jobs/?search=remote');
    
    // Return the fetched data in response
    return res.status(200).json({
      success: true,
      jobs: response.data,
    });
  } catch (error) {
    console.error("Error fetching external jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching external jobs from Findwork.",
    });
  }
};

// Other functions like getAllJobs, getJobById, etc.
export const getAllJobs = async (req, res) => { /* ... */ };
export const getJobById = async (req, res) => { /* ... */ };
export const deleteJobById = async (req, res) => { /* ... */ };
export const updateJob = async (req, res) => { /* ... */ };
export const bookmarkJob = async (req, res) => { /* ... */ };
export const getJobByRecruiterId = async (req, res) => { /* ... */ };
export const toggleActive = async (req, res) => { /* ... */ };
export const getJobByCompanyId = async (req, res) => { /* ... */ };
export const getJobsStatistics = async (req, res) => { /* ... */ };
