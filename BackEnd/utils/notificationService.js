import Notification from "../models/notification.model.js";
import { getIO } from "./socket.js";

class NotificationService {
  constructor() {
    this.io = null;
  }

  setIO(ioInstance) {
    this.io = ioInstance;
  }

  // Create and emit notification
  async createAndEmit(notificationData) {
    try {
      const notification = new Notification(notificationData);
      await notification.save();

      // Emit to specific user room
      if (this.io) {
        this.io.to(`user_${notificationData.recipient}`).emit('newNotification', notification);
      }

      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  // Job Seeker Notifications
  async notifyApplicationSubmitted(applicationData) {
    const { applicantId, jobId, jobTitle, companyName, recruiterId } = applicationData;

    // Notify recruiter about new application
    await this.createAndEmit({
      recipient: recruiterId,
      recipientModel: 'Recruiter',
      sender: applicantId,
      senderModel: 'User',
      type: 'application-submitted',
      title: 'New Job Application',
      message: `A candidate has applied for ${jobTitle}`,
      relatedEntity: jobId,
      relatedEntityModel: 'Job',
      priority: 'high',
      actionUrl: `/recruiter/applications/${jobId}`,
      metadata: { jobTitle, companyName, applicationId: applicationData.applicationId }
    });

    // Confirm to job seeker
    await this.createAndEmit({
      recipient: applicantId,
      recipientModel: 'User',
      type: 'application-submitted',
      title: 'Application Submitted Successfully',
      message: `Your application for ${jobTitle} at ${companyName} has been submitted`,
      relatedEntity: jobId,
      relatedEntityModel: 'Job',
      priority: 'medium',
      actionUrl: `/jobs/${jobId}`,
      metadata: { jobTitle, companyName, status: 'submitted' }
    });
  }

  async notifyApplicationStatusChanged(statusData) {
    const { applicantId, jobId, jobTitle, companyName, status, recruiterId } = statusData;
    
    let title, message, priority;
    
    switch (status) {
      case 'Shortlisted':
        title = '🎉 Application Shortlisted!';
        message = `Great news! You've been shortlisted for ${jobTitle} at ${companyName}`;
        priority = 'high';
        break;
      case 'Rejected':
        title = 'Application Update';
        message = `Thank you for your interest in ${jobTitle} at ${companyName}. We've decided to move forward with other candidates.`;
        priority = 'medium';
        break;
      default:
        title = 'Application Status Updated';
        message = `Your application status for ${jobTitle} has been updated to ${status}`;
        priority = 'medium';
    }

    await this.createAndEmit({
      recipient: applicantId,
      recipientModel: 'User',
      sender: recruiterId,
      senderModel: 'Recruiter',
      type: 'application-status-changed',
      title,
      message,
      relatedEntity: jobId,
      relatedEntityModel: 'Job',
      priority,
      actionUrl: `/applications/${jobId}`,
      metadata: { jobTitle, companyName, status, previousStatus: statusData.previousStatus }
    });
  }

  async notifyJobMatch(matchData) {
    const { userId, jobId, jobTitle, companyName, matchScore, location, salary } = matchData;

    await this.createAndEmit({
      recipient: userId,
      recipientModel: 'User',
      type: 'job-recommendation',
      title: 'New Job Match Found!',
      message: `${jobTitle} at ${companyName} matches your profile (${matchScore}% match)`,
      relatedEntity: jobId,
      relatedEntityModel: 'Job',
      priority: 'medium',
      actionUrl: `/jobs/${jobId}`,
      metadata: { jobTitle, companyName, matchScore, location, salary }
    });
  }

  // Recruiter Notifications
  async notifyNewJobPosted(jobData) {
    const { recruiterId, jobId, jobTitle, companyName } = jobData;

    await this.createAndEmit({
      recipient: recruiterId,
      recipientModel: 'Recruiter',
      type: 'job-posted',
      title: 'Job Posted Successfully',
      message: `Your job posting "${jobTitle}" is now live and visible to candidates`,
      relatedEntity: jobId,
      relatedEntityModel: 'Job',
      priority: 'medium',
      actionUrl: `/recruiter/jobs/${jobId}`,
      metadata: { jobTitle, companyName, status: 'active' }
    });
  }

  async notifyProfileViewed(viewData) {
    const { viewedUserId, viewerId, viewerName, viewerCompany, viewerType } = viewData;

    await this.createAndEmit({
      recipient: viewedUserId,
      recipientModel: 'User',
      sender: viewerId,
      senderModel: viewerType === 'recruiter' ? 'Recruiter' : 'User',
      type: 'profile-viewed',
      title: 'Profile Viewed',
      message: `${viewerName} from ${viewerCompany} viewed your profile`,
      priority: 'low',
      actionUrl: `/profile`,
      metadata: { viewerName, viewerCompany, viewerType }
    });
  }

  async notifySimilarCandidates(candidateData) {
    const { recruiterId, jobId, jobTitle, candidateCount, skills } = candidateData;

    await this.createAndEmit({
      recipient: recruiterId,
      recipientModel: 'Recruiter',
      type: 'similar-candidates',
      title: 'Similar Candidates Available',
      message: `${candidateCount} candidates with ${skills.join(', ')} skills are available for ${jobTitle}`,
      relatedEntity: jobId,
      relatedEntityModel: 'Job',
      priority: 'low',
      actionUrl: `/recruiter/candidates?job=${jobId}`,
      metadata: { jobTitle, candidateCount, skills }
    });
  }

  // System Notifications
  async notifyWelcome(userData) {
    const { userId, userType, name } = userData;

    await this.createAndEmit({
      recipient: userId,
      recipientModel: userType === 'recruiter' ? 'Recruiter' : 'User',
      type: 'welcome',
      title: `Welcome to GreatHire, ${name}!`,
      message: userType === 'recruiter' 
        ? 'Start posting jobs and find the perfect candidates for your company'
        : 'Discover amazing job opportunities and take your career to the next level',
      priority: 'medium',
      actionUrl: userType === 'recruiter' ? '/recruiter/dashboard' : '/jobs',
      metadata: { userType, isWelcome: true }
    });
  }

  async notifyPlanExpiry(planData) {
    const { userId, userType, planType, expiryDate, daysLeft } = planData;

    const urgency = daysLeft <= 3 ? 'urgent' : daysLeft <= 7 ? 'high' : 'medium';
    
    await this.createAndEmit({
      recipient: userId,
      recipientModel: userType === 'recruiter' ? 'Recruiter' : userType === 'company' ? 'Company' : 'User',
      type: 'plan-expiry',
      title: `${planType} Plan Expiring Soon`,
      message: `Your ${planType} plan expires in ${daysLeft} days. Renew now to continue enjoying premium features.`,
      priority: urgency,
      actionUrl: '/billing/renew',
      metadata: { planType, expiryDate, daysLeft }
    });
  }

  // Bulk notification for job recommendations
  async bulkNotifyJobRecommendations(recommendations) {
    const notifications = recommendations.map(rec => ({
      recipient: rec.userId,
      recipientModel: 'User',
      type: 'job-recommendation',
      title: 'New Jobs Recommended for You',
      message: `${rec.jobCount} new jobs match your profile and preferences`,
      priority: 'low',
      actionUrl: '/jobs/recommended',
      metadata: { jobCount: rec.jobCount, categories: rec.categories }
    }));

    try {
      await Notification.insertMany(notifications);
      
      // Emit to all users
      if (this.io) {
        recommendations.forEach(rec => {
          this.io.to(`user_${rec.userId}`).emit('newNotification', {
            type: 'job-recommendation',
            title: 'New Jobs Recommended for You',
            message: `${rec.jobCount} new jobs match your profile`,
            count: rec.jobCount
          });
        });
      }
    } catch (error) {
      console.error("Error sending bulk notifications:", error);
    }
  }

  // Mark notifications as read
  async markAsRead(notificationIds, userId) {
    try {
      await Notification.updateMany(
        { _id: { $in: notificationIds }, recipient: userId },
        { isRead: true, readAt: new Date() }
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  }

  // Get unread count
  async getUnreadCount(userId, userType) {
    try {
      const recipientModel = userType === 'recruiter' ? 'Recruiter' : 'User';
      return await Notification.countDocuments({
        recipient: userId,
        recipientModel,
        isRead: false
      });
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
