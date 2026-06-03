import { parseJobDescription } from "../services/jdParser.service.js";
import { generateJobEmbedding } from "../services/jobEmbedding.service.js";
import { matchCandidatesForJob } from "../services/candidateMatching.service.js";
import { enqueueJobMatching } from "../services/jobMatchingQueue.service.js";
// import isAuthenticated from "../../../../middlewares/isAuthenticated.js";
import JobMatch from "../../../models/jobMatch.model.js";
import { Job } from "../../../../models/job.model.js";

export const parseJDController = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job description is required"
      });
    }

    const parsedData = await parseJobDescription(jobDescription);
    
    return res.status(200).json({
      success: true,
      data: parsedData
    });
  } catch (error) {
    console.error("Error parsing job description:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to parse job description",
      error: error.message
    });
  }
};

export const matchCandidatesController = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { topK = 20, scoreThreshold = 0.3 } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required"
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    const jobData = {
      jobId: job._id.toString(),
      title: job.title || "",
      description: job.description || "",
      skills: job.skills || [],
      experience: job.experience || "",
      location: job.location || "",
      designation: job.designation || "",
      seniority: job.seniority || ""
    };

    const matchJob = await enqueueJobMatching(jobData, {
      topK: parseInt(topK),
      scoreThreshold: parseFloat(scoreThreshold)
    });

    return res.status(202).json({
      success: true,
      message: "Candidate matching job queued successfully",
      jobId: matchJob.id
    });
  } catch (error) {
    console.error("Error matching candidates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to start candidate matching",
      error: error.message
    });
  }
};

export const getJobMatchesController = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 20, sortBy = "totalScore" } = req.query;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required"
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    
    switch (sortBy) {
      case "semanticScore":
        sortOptions.semanticScore = -1;
        break;
      case "skillScore":
        sortOptions.skillScore = -1;
        break;
      case "totalScore":
      default:
        sortOptions.totalScore = -1;
        break;
    }

    const matches = await JobMatch.find({ jobId })
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('candidateId', 'fullName email skills experience location designation')
      .lean();

    const total = await JobMatch.countDocuments({ jobId });

    return res.status(200).json({
      success: true,
      data: {
        matches,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error("Error fetching job matches:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job matches",
      error: error.message
    });
  }
};

export const getJobMatchStatsController = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required"
      });
    }

    const stats = await JobMatch.aggregate([
      { $match: { jobId: jobId } },
      {
        $group: {
          _id: null,
          totalMatches: { $sum: 1 },
          avgSemanticScore: { $avg: "$semanticScore" },
          avgSkillScore: { $avg: "$skillScore" },
          avgTotalScore: { $avg: "$totalScore" },
          highScoreMatches: {
            $sum: { $cond: [{ $gte: ["$totalScore", 0.8] }, 1, 0] }
          },
          mediumScoreMatches: {
            $sum: { $cond: [{ $and: [{ $gte: ["$totalScore", 0.6] }, { $lt: ["$totalScore", 0.8] }] }, 1, 0] }
          },
          lowScoreMatches: {
            $sum: { $cond: [{ $lt: ["$totalScore", 0.6] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalMatches: 0,
      avgSemanticScore: 0,
      avgSkillScore: 0,
      avgTotalScore: 0,
      highScoreMatches: 0,
      mediumScoreMatches: 0,
      lowScoreMatches: 0
    };

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error fetching job match stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job match stats",
      error: error.message
    });
  }
};
