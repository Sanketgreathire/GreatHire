import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Bell,
  Search,
  Check,
  Briefcase,
  Users,
  FileText,
  Star,
  Trash2,
  X
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationPage = () => {
  const { user } = useSelector((state) => state.auth);

  const {
    notifications,
    markAsRead,
    markAllAsRead,
    loadNotifications,
    deleteNotification
  } = useNotifications();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const getPriorityClasses = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center">
          <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Please log in</h3>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await loadNotifications();
      setLoading(false);
    };
    fetchData();
  }, [loadNotifications]);

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'unread' && !n.isRead) ||
      (filterType === 'read' && n.isRead);

    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getTimeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const getNotificationTypeIcon = (type) => {
    const map = {
      'application-submitted': <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      'application-status-changed': <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />,
      'application-shortlisted': <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
      'application-rejected': <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />,
      'job-recommendation': <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      'job-posted': <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" />,
      'similar-candidates': <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      'profile-viewed': <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      welcome: <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
    };
    return map[type] || <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
              <Bell className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
              Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors w-full sm:w-auto"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Search + Filter */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notifications..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full sm:w-40 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>

        {/* Notification List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No notifications found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter' 
                  : 'You\'re all caught up!'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => {
                  if (!notification.isRead) markAsRead(notification._id);
                  setSelectedNotification(notification);
                }}
                className={`group p-4 sm:p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  !notification.isRead 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400' 
                    : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center shrink-0">
                    {getNotificationTypeIcon(notification.type)}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {notification.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
                      {notification.message}
                    </p>

                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-3">
                      <span>{getTimeAgo(notification.createdAt)}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-medium capitalize ${getPriorityClasses(
                          notification.priority || 'medium'
                        )}`}
                      >
                        {notification.priority || 'medium'}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification._id);
                      }}
                      className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {!notification.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification._id);
                        }}
                        className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedNotification(null)}
          />

          <div className="relative bg-white dark:bg-gray-800 w-full max-w-xl rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedNotification(null)}
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-600">
                {getNotificationTypeIcon(selectedNotification.type)}
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedNotification.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getTimeAgo(selectedNotification.createdAt)}
                </p>
              </div>
            </div>

            <span
              className={`inline-block mb-4 px-3 py-1 rounded-full text-sm font-medium capitalize ${getPriorityClasses(
                selectedNotification.priority || 'medium'
              )}`}
            >
              {selectedNotification.priority || 'medium'}
            </span>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {selectedNotification.message}
            </p>

            <button
              onClick={() => {
                deleteNotification(selectedNotification._id);
                setSelectedNotification(null);
              }}
              className="mt-6 flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;