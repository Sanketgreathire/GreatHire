import { ingestionEventPublisherService } from "../src/modules/events/services/ingestionEventPublisher.service.js";
import { v4 as uuidv4 } from 'uuid';

export const importCsv = async (req, res) => {
  try {
    const jobId = uuidv4();
    const { file } = req;
    
    if (!file) {
      return res.status(400).json({ 
        success: false, 
        message: "No CSV file provided" 
      });
    }

    // Parse CSV and publish events
    const candidates = parseCsvData(file.buffer);
    
    for (const candidate of candidates) {
      await ingestionEventPublisherService.publishCandidateDiscovery(
        candidate,
        'csv',
        { correlationId: jobId }
      );
    }

    res.status(200).json({
      success: true,
      message: "CSV import started",
      jobId,
      candidatesCount: candidates.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "CSV import failed",
      error: error.message
    });
  }
};

export const importGithub = async (req, res) => {
  try {
    const jobId = uuidv4();
    const { usernames } = req.body;
    
    if (!usernames || !Array.isArray(usernames)) {
      return res.status(400).json({ 
        success: false, 
        message: "GitHub usernames array required" 
      });
    }

    for (const username of usernames) {
      await ingestionEventPublisherService.publishCandidateDiscovery(
        { github: { username } },
        'github',
        { correlationId: jobId }
      );
    }

    res.status(200).json({
      success: true,
      message: "GitHub import started",
      jobId,
      usernamesCount: usernames.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "GitHub import failed",
      error: error.message
    });
  }
};

export const getJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Mock job status - would integrate with job tracking system
    const jobStatus = {
      jobId,
      status: "completed",
      progress: 100,
      createdAt: new Date(),
      completedAt: new Date(),
      candidatesProcessed: 10,
      candidatesFailed: 0
    };

    res.status(200).json({
      success: true,
      data: jobStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get job status",
      error: error.message
    });
  }
};

export const listJobs = async (req, res) => {
  try {
    // Mock jobs list - would integrate with job tracking system
    const jobs = [
      {
        jobId: uuidv4(),
        type: "csv",
        status: "completed",
        createdAt: new Date(),
        candidatesCount: 50
      },
      {
        jobId: uuidv4(),
        type: "github",
        status: "processing",
        createdAt: new Date(),
        candidatesCount: 25
      }
    ];

    res.status(200).json({
      success: true,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to list jobs",
      error: error.message
    });
  }
};

function parseCsvData(buffer) {
  // Mock CSV parsing - would use proper CSV parser
  return [
    {
      name: "John Doe",
      email: "john@example.com",
      experience: [],
      skills: []
    }
  ];
}
