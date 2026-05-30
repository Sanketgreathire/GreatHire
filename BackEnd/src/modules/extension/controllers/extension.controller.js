import { captureCandidate } from "../services/extensionCapture.service.js";
import { saveCandidateNotes, getCandidateNotes, updateCandidateNotes, deleteCandidateNotes } from "../services/extensionCapture.service.js";
import { trackRecruiterInteraction } from "../../copilot/services/interactionTracking.service.js";

export const saveCandidateController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const {
      fullName,
      headline,
      bio,
      about,
      location,
      currentCompany,
      company,
      skills,
      socialLinks,
      repositories,
      platform,
      profileUrl,
      recruiterNotes,
      tags,
      sourcePage,
      capturedAt
    } = req.body;

    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: "Full name is required"
      });
    }

    const candidateData = {
      fullName,
      headline,
      bio: bio || about,
      location,
      currentCompany: currentCompany || company,
      skills: skills || [],
      socialLinks: socialLinks || [],
      repositories: repositories || [],
      platform,
      profileUrl,
      recruiterNotes,
      tags: tags || [],
      sourcePage,
      capturedAt: capturedAt || new Date().toISOString(),
      savedByRecruiter: recruiterId
    };

    const result = await captureCandidate(candidateData, recruiterId);

    if (result.success) {
      await trackRecruiterInteraction(recruiterId, result.candidateId, 'viewed', {
        source: 'extension',
        platform,
        profileUrl,
        metadata: {
          capturedAt: candidateData.capturedAt,
          sourcePage: candidateData.sourcePage
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Candidate captured successfully",
      data: result
    });
  } catch (error) {
    console.error("Error in saveCandidateController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to capture candidate",
      error: error.message
    });
  }
};

export const saveNotesController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { candidateId, recruiterNotes, tags } = req.body;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required"
      });
    }

    const result = await saveCandidateNotes(candidateId, recruiterId, {
      recruiterNotes,
      tags
    });

    if (result.success) {
      await trackRecruiterInteraction(recruiterId, candidateId, 'shortlisted', {
        source: 'extension',
        metadata: {
          notesAdded: !!recruiterNotes,
          tagsAdded: tags && tags.length > 0
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notes saved successfully",
      data: result
    });
  } catch (error) {
    console.error("Error in saveNotesController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save notes",
      error: error.message
    });
  }
};

export const getCandidateController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { candidateId } = req.params;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required"
      });
    }

    const result = await getCandidateNotes(candidateId, recruiterId);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error in getCandidateController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get candidate",
      error: error.message
    });
  }
};

export const updateCandidateController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { candidateId } = req.params;
    const { recruiterNotes, tags, ...otherUpdates } = req.body;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required"
      });
    }

    const result = await updateCandidateNotes(candidateId, recruiterId, {
      recruiterNotes,
      tags,
      ...otherUpdates
    });

    await trackRecruiterInteraction(recruiterId, candidateId, 'viewed', {
      source: 'extension',
      metadata: {
        updated: true,
        updateFields: Object.keys(req.body)
      }
    });

    return res.status(200).json({
      success: true,
      message: "Candidate updated successfully",
      data: result
    });
  } catch (error) {
    console.error("Error in updateCandidateController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update candidate",
      error: error.message
    });
  }
};

export const deleteCandidateController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { candidateId } = req.params;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required"
      });
    }

    const result = await deleteCandidateNotes(candidateId, recruiterId);

    await trackRecruiterInteraction(recruiterId, candidateId, 'rejected', {
      source: 'extension',
      metadata: {
        deleted: true
      }
    });

    return res.status(200).json({
      success: true,
      message: "Candidate deleted successfully",
      data: result
    });
  } catch (error) {
    console.error("Error in deleteCandidateController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete candidate",
      error: error.message
    });
  }
};
