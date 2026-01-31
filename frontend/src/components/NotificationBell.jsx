import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import { Bell, X, Check, Briefcase, Users, FileText, Star } from "lucide-react";

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { notifications, unreadCount, markAsRead, markAllAsRead, loadNotifications } = useNotifications();

  useEffect(() => {
    if (user) {
      console.log('🔔 Loading notifications for user:', user._id, 'role:', user.role);
      loadNotifications();
    }
  }, [user, loadNotifications]);

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const getNotificationTypeIcon = (type) => {
    const iconMap = {
      'application-submitted': <FileText className="w-4 h-4 text-blue-600" />,
      'application-status-changed': <FileText className="w-4 h-4 text-green-600" />,
      'application-shortlisted': <Star className="w-4 h-4 text-yellow-600" />,
      'application-rejected': <FileText className="w-4 h-4 text-red-600" />,
      'job-recommendation': <Briefcase className="w-4 h-4 text-purple-600" />,
      'job-posted': <Briefcase className="w-4 h-4 text-green-600" />,
      'similar-candidates': <Users className="w-4 h-4 text-blue-600" />,
      'profile-viewed': <Users className="w-4 h-4 text-indigo-600" />,
      'plan-expiry': <Bell className="w-4 h-4 text-orange-600" />,
      'welcome': <Bell className="w-4 h-4 text-green-600" />
    };
    return iconMap[type] || <Bell className="w-4 h-4 text-gray-600" />;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Panel */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20 flex flex-col" style={{maxHeight: '500px'}}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/notifications"
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  View All
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500 text-sm">No notifications yet</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {user?.role === 'recruiter' 
                      ? "You'll see updates about applications and job posts here" 
                      : "You'll see job matches and application updates here"
                    }
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        if (!notification.isRead) {
                          handleMarkAsRead(notification._id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200">
                            {getNotificationTypeIcon(notification.type)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium text-gray-900 line-clamp-1 ${
                                !notification.isRead ? 'font-semibold' : ''
                              }`}>
                                {notification.title}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-gray-400">
                                  {getTimeAgo(notification.createdAt)}
                                </span>
                                {notification.priority === 'high' && (
                                  <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">
                                    High
                                  </span>
                                )}
                                {notification.priority === 'urgent' && (
                                  <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                                    Urgent
                                  </span>
                                )}
                              </div>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Always visible */}
            <div className="flex-shrink-0 p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              {notifications.length > 0 && (
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>Showing {notifications.length} notifications</span>
                </div>
              )}
              <Link
                to="/notifications"
                className="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-1"
                onClick={() => setIsOpen(false)}
              >
                View All Notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;
