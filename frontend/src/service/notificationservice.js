
import API from "../utils/api";

// Fetch all notifications
export const fetchNotifications = async () => {
  const res = await API.get("/notifications");
  return res.data.notifications || [];
};

// Get unread notification count
export const getUnreadCount = async () => {
  const res = await API.get("/notifications/unread-count");
  return res.data.count || 0;
};

// Mark one as read
export const markAsRead = async (id) => {
  const res = await API.put(`/notifications/${id}/read`);
  return res.data;
};

// Mark all as read
export const markAllAsRead = async () => {
  const res = await API.put("/notifications/mark-all-read");
  return res.data;
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
