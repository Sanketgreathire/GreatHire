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
  X,
  RefreshCw,
  Menu
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import DashboardNavigations from '../../pages/recruiter/DashboardNavigations';

const NotificationPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const isRecruiter = user?.role?.includes('recruiter');

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

  // Fetch notifications when the component mounts or user changes
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);

      try {
        await loadNotifications();
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user, loadNotifications]);

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

  // Show login message if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center">
          <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />

          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Please log in
          </h3>
        </div>
      </div>
    );
  }

  // Filter notifications based on search and selected filter
  const filteredNotifications = notifications.filter((notification) => {
    const title = notification.title || '';
    const message = notification.message || '';

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'unread' && !notification.isRead) ||
      (filterType === 'read' && notification.isRead);

    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // Format notification timestamp
  const getTimeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;

    return `${Math.floor(diff / 86400)} days ago`;
  };

  // Get icon based on notification type
  const getNotificationTypeIcon = (type) => {
    const map = {
      'application-submitted': (
        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      ),
      'application-status-changed': (
        <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
      ),
      'application-shortlisted': (
        <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
      ),
      'application-rejected': (
        <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
      ),
      'job-recommendation': (
        <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      ),
      'job-posted': (
        <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
      ),
      'similar-candidates': (
        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      ),
      'profile-viewed': (
        <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      ),
      welcome: <span className="text-xl">👏</span>
    };

    return (
      map[type] || (
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      )
    );
  };

  // Refresh notifications manually
  const handleRefresh = async () => {
    setLoading(true);

    try {
      await loadNotifications();
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
     {/* Navigation for Recruiters sidebar */}
      {isRecruiter && (
        <DashboardNavigations
          isOpen={isNavigationOpen}
          onOpenChange={setIsNavigationOpen}
          showMenuButton={false}
          overlay
        />
      )}
      <div className="max-w-4xl mx-auto py-8 px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">

          {/* Page title and unread count */}
          <div>
            {isRecruiter && (
              <div className="mb-2">
                <button
                  type="button"
                  onClick={() => setIsNavigationOpen(true)}
                  aria-label="Open recruiter dashboard navigation"
                  aria-expanded={isNavigationOpen}
                  className="rounded-md p-1 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
              <Bell className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
              Notifications
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
              {unreadCount > 0
                ? `${unreadCount} unread notifications`
                : 'All caught up!'}
            </p>
          </div>

          {/* Header action buttons */}
          <div className="flex flex-col sm:flex-row gap-2">

            {/* Refresh button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 w-full sm:w-auto"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              />

              {loading ? 'Refreshing...' : 'Refresh'}
            </button>

            {/* Mark all as read button */}
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
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 flex flex-wrap items-center gap-2 sm:gap-4">

          {/* Search input */}
          <div className="relative w-full sm:flex-1 min-w-0">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500" />

            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notifications..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Notification filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none min-w-0 max-w-full"
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
                  : "You're all caught up!"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => {
                  if (!notification.isRead) {
                    markAsRead(notification._id);
                  }

                  setSelectedNotification(notification);
                }}
                className={`group p-4 sm:p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  !notification.isRead
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400'
                    : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4">

                  {/* Notification icon */}
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center shrink-0">
                    {getNotificationTypeIcon(notification.type)}
                  </div>

                  {/* Notification details */}
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

                  {/* Notification actions */}
                  <div className="flex sm:flex-col gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">

                    {/* Delete notification */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification._id);
                      }}
                      className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 transition-colors"
                      aria-label="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Mark single notification as read */}
                    {!notification.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification._id);
                        }}
                        className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 transition-colors"
                        aria-label="Mark notification as read"
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

      {/* Notification Details Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

          {/* Modal backdrop */}
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedNotification(null)}
          />

          {/* Modal content */}
          <div className="relative bg-white dark:bg-gray-800 w-full max-w-xl rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 max-h-[90vh] overflow-y-auto">

            {/* Close modal button */}
            <button
              onClick={() => setSelectedNotification(null)}
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close notification details"
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

            {/* Delete from modal */}
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