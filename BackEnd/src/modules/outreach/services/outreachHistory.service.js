import OutreachHistory from "../../../models/outreachHistory.model.js";

export async function saveOutreachRecord(outreachData) {
  try {
    const {
      recruiterId,
      candidateId,
      jobId,
      outreachType,
      tone,
      generatedContent,
      templateId,
      customInstructions,
      aiAvailable
    } = outreachData;

    const outreachRecord = new OutreachHistory({
      recruiterId,
      candidateId,
      jobId,
      outreachType,
      tone,
      generatedContent: {
        message: generatedContent.message,
        subject: generatedContent.subject,
        personalizationScore: generatedContent.personalizationScore || 0,
        matchedSkills: generatedContent.matchedSkills || [],
        candidateInsights: generatedContent.candidateInsights || [],
        aiGenerated: aiAvailable || false
      },
      templateId,
      customInstructions,
      metadata: {
        generationTime: generatedContent.generationTime || 0,
        personalizationTime: generatedContent.personalizationTime || 0,
        candidateContext: generatedContent.candidateContext || {},
        jobContext: generatedContent.jobContext || {},
        recruiterContext: generatedContent.recruiterContext || {}
      }
    });

    await outreachRecord.save();
    return outreachRecord;
  } catch (error) {
    console.error("Error saving outreach record:", error);
    throw new Error(`Failed to save outreach record: ${error.message}`);
  }
}

export async function getOutreachHistory(recruiterId, options = {}) {
  try {
    const result = await OutreachHistory.getOutreachHistory(recruiterId, options);
    return result;
  } catch (error) {
    console.error("Error getting outreach history:", error);
    throw new Error(`Failed to get outreach history: ${error.message}`);
  }
}

export async function getOutreachStatistics(recruiterId, timeRange = '30d') {
  try {
    const stats = await OutreachHistory.getOutreachStatistics(recruiterId, timeRange);
    return stats;
  } catch (error) {
    console.error("Error getting outreach statistics:", error);
    throw new Error(`Failed to get outreach statistics: ${error.message}`);
  }
}

export async function updateOutreachStatus(outreachId, status, additionalData = {}) {
  try {
    const outreach = await OutreachHistory.findById(outreachId);
    if (!outreach) {
      throw new Error("Outreach record not found");
    }

    await outreach.updateSendStatus(status, additionalData);
    return outreach;
  } catch (error) {
    console.error("Error updating outreach status:", error);
    throw new Error(`Failed to update outreach status: ${error.message}`);
  }
}

export async function updateDeliveryStatus(outreachId, status, additionalData = {}) {
  try {
    const outreach = await OutreachHistory.findById(outreachId);
    if (!outreach) {
      throw new Error("Outreach record not found");
    }

    await outreach.updateDeliveryStatus(status, additionalData);
    return outreach;
  } catch (error) {
    console.error("Error updating delivery status:", error);
    throw new Error(`Failed to update delivery status: ${error.message}`);
  }
}

export async function updateOutreachPerformance(outreachId, performanceData) {
  try {
    const outreach = await OutreachHistory.findById(outreachId);
    if (!outreach) {
      throw new Error("Outreach record not found");
    }

    await outreach.updatePerformance(performanceData);
    return outreach;
  } catch (error) {
    console.error("Error updating outreach performance:", error);
    throw new Error(`Failed to update outreach performance: ${error.message}`);
  }
}

export async function getTopPerformingOutreach(recruiterId, limit = 10) {
  try {
    const topOutreach = await OutreachHistory.getTopPerformingOutreach(recruiterId, limit);
    return topOutreach;
  } catch (error) {
    console.error("Error getting top performing outreach:", error);
    throw new Error(`Failed to get top performing outreach: ${error.message}`);
  }
}

export async function getOutreachTrends(recruiterId, timeRange = '30d') {
  try {
    const trends = await OutreachHistory.getOutreachTrends(recruiterId, timeRange);
    return trends;
  } catch (error) {
    console.error("Error getting outreach trends:", error);
    throw new Error(`Failed to get outreach trends: ${error.message}`);
  }
}

export async function archiveOutreach(outreachId) {
  try {
    const outreach = await OutreachHistory.findById(outreachId);
    if (!outreach) {
      throw new Error("Outreach record not found");
    }

    await outreach.archive();
    return outreach;
  } catch (error) {
    console.error("Error archiving outreach:", error);
    throw new Error(`Failed to archive outreach: ${error.message}`);
  }
}

export async function getOutreachById(outreachId, recruiterId) {
  try {
    const outreach = await OutreachHistory.findOne({
      _id: outreachId,
      recruiterId,
      isActive: true
    })
    .populate('candidateId', 'fullName email currentCompany skills')
    .populate('jobId', 'title company')
    .populate('templateId', 'name')
    .lean();

    if (!outreach) {
      throw new Error("Outreach record not found");
    }

    return outreach;
  } catch (error) {
    console.error("Error getting outreach by ID:", error);
    throw new Error(`Failed to get outreach: ${error.message}`);
  }
}

export async function getOutreachByCandidate(recruiterId, candidateId, limit = 10) {
  try {
    const outreach = await OutreachHistory.find({
      recruiterId,
      candidateId,
      isActive: true
    })
    .populate('jobId', 'title company')
    .populate('templateId', 'name')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

    return outreach;
  } catch (error) {
    console.error("Error getting outreach by candidate:", error);
    throw new Error(`Failed to get outreach by candidate: ${error.message}`);
  }
}

export async function bulkUpdateOutreachStatus(outreachIds, status, additionalData = {}) {
  try {
    const updateData = {
      "sendRecord.status": status
    };

    if (status === "sent") {
      updateData["sendRecord.sentAt"] = new Date();
    } else if (status === "scheduled") {
      updateData["sendRecord.scheduledAt"] = additionalData.scheduledAt || new Date();
    }

    if (additionalData.subject) updateData["sendRecord.subject"] = additionalData.subject;
    if (additionalData.message) updateData["sendRecord.message"] = additionalData.message;
    if (additionalData.sendMethod) updateData["sendRecord.sendMethod"] = additionalData.sendMethod;

    const result = await OutreachHistory.updateMany(
      { _id: { $in: outreachIds } },
      { $set: updateData }
    );

    return {
      success: true,
      updatedCount: result.modifiedCount
    };
  } catch (error) {
    console.error("Error bulk updating outreach status:", error);
    throw new Error(`Failed to bulk update outreach status: ${error.message}`);
  }
}

export async function getOutreachMetrics(recruiterId, timeRange = '30d') {
  try {
    const stats = await OutreachHistory.getOutreachStatistics(recruiterId, timeRange);
    const trends = await OutreachHistory.getOutreachTrends(recruiterId, timeRange);
    const topPerforming = await OutreachHistory.getTopPerformingOutreach(recruiterId, 5);

    return {
      statistics: stats,
      trends,
      topPerforming,
      timeRange
    };
  } catch (error) {
    console.error("Error getting outreach metrics:", error);
    throw new Error(`Failed to get outreach metrics: ${error.message}`);
  }
}
