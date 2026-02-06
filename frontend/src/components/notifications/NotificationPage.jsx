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

  // Priority badge color
  const getPriorityClasses = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-amber-100 text-amber-700';
    }
  };

  // Auth guard
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium">Please log in</h3>
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
      'application-submitted': <FileText className="w-5 h-5 text-blue-600" />,
      'application-status-changed': <FileText className="w-5 h-5 text-green-600" />,
      'application-shortlisted': <Star className="w-5 h-5 text-yellow-600" />,
      'application-rejected': <FileText className="w-5 h-5 text-red-600" />,
      'job-recommendation': <Briefcase className="w-5 h-5 text-purple-600" />,
      'job-posted': <Briefcase className="w-5 h-5 text-green-600" />,
      'similar-candidates': <Users className="w-5 h-5 text-blue-600" />,
      'profile-viewed': <Users className="w-5 h-5 text-indigo-600" />,
      welcome: <Bell className="w-5 h-5 text-green-600" />
    };
    return map[type] || <Bell className="w-5 h-5 text-gray-600" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bell className="w-8 h-8 text-blue-600" />
              Notifications
            </h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Search + Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notifications..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>

        {/* Notification List */}
        <div className="bg-white rounded-lg shadow-sm border divide-y">
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => {
                if (!notification.isRead) markAsRead(notification._id);
                setSelectedNotification(notification);
              }}
              className={`group p-6 cursor-pointer hover:bg-gray-50 ${
                !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center">
                  {getNotificationTypeIcon(notification.type)}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold">{notification.title}</h3>
                  <p className="text-gray-600 mt-1">{notification.message}</p>

                  <div className="mt-2 text-sm text-gray-500 flex gap-4">
                    <span>{getTimeAgo(notification.createdAt)}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getPriorityClasses(
                        notification.priority || 'medium'
                      )}`}
                    >
                      {notification.priority || 'medium'}
                    </span>
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification._id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-red-100 text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* ✅ Mark as Read (ONLY for unread) */}
                {!notification.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-1 p-2 rounded-full hover:bg-green-100 text-green-600 transition"
                  >
                    <Check className="w-4 h-4" />
                    <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      Mark as read
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedNotification(null)}
          />

          <div className="relative bg-white w-full max-w-xl mx-4 rounded-xl shadow-xl p-6">
            <button
              onClick={() => setSelectedNotification(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X />
            </button>

            <div className="flex gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                {getNotificationTypeIcon(selectedNotification.type)}
              </div>

              <div>
                <h2 className="text-xl font-bold">{selectedNotification.title}</h2>
                <p className="text-sm text-gray-500">
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

            <p className="text-gray-700 leading-relaxed">
              {selectedNotification.message}
            </p>

            <button
              onClick={() => {
                deleteNotification(selectedNotification._id);
                setSelectedNotification(null);
              }}
              className="mt-6 flex items-center gap-2 text-red-600 hover:text-red-700"
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
