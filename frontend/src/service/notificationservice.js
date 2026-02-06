import API from "../utils/api";

// Fetch all notifications
export const fetchNotifications = async () => {
  try {
    const res = await API.get("/v1/notifications");
    return res.data.notifications || [];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Get unread notification count
export const getUnreadCount = async () => {
  try {
    const res = await API.get("/v1/notifications/unread-count");
    return res.data.count || 0;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    throw error;
  }
};

// Mark one as read
export const markAsRead = async (id) => {
  try {
    const res = await API.put(`/v1/notifications/${id}/read`);
    return res.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Mark all as read
export const markAllAsRead = async () => {
  try {
    const res = await API.put("/v1/notifications/mark-all-read");
    return res.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

// Delete a notification
export const deleteNotification = async (id) => {
  try {
    const res = await API.delete(`/v1/notifications/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

// Get notification icon based on type
export const getNotificationIcon = (type) => {
  const iconMap = {
    'application-submitted': '📝',
    'application-status-changed': '📋',
    'application-shortlisted': '🎉',
    'application-rejected': '📄',
    'new-job-match': '💼',
    'job-recommendation': '🎯',
    'job-posted': '✅',
    'profile-viewed': '👀',
    'plan-expiry': '⚠️',
    'welcome': '👋',
    'system-alert': '🔔',
    'similar-candidates': '👥',
    'company-follow': '🏢'
  };
  return iconMap[type] || '🔔';
};

// Get notification color based on priority
export const getNotificationColor = (priority) => {
  const colorMap = {
    'urgent': 'border-red-500 bg-red-50',
    'high': 'border-orange-500 bg-orange-50',
    'medium': 'border-blue-500 bg-blue-50',
    'low': 'border-gray-300 bg-gray-50'
  };
  return colorMap[priority] || colorMap['medium'];
};
