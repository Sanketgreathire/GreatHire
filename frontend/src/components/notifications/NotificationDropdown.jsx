import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Bell, X } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const notificationContext = useNotifications();
  const {
    notifications = [],
    unreadCount = 0,
    markAsRead,
    markAllAsRead,
    loadNotifications
  } = notificationContext || {};

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && user && loadNotifications) {
      setLoading(true);
      loadNotifications().finally(() => setLoading(false));
    }
  }, [isOpen, user, loadNotifications]);

  const handleMarkAsRead = useCallback(
    async (id) => {
      if (!markAsRead) return;
      await markAsRead(id);
    },
    [markAsRead]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    if (!markAllAsRead) return;
    setLoading(true);
    await markAllAsRead();
    setLoading(false);
  }, [markAllAsRead]);

  const handleNotificationClick = async (notification) => {
    if (!notification) return;

    if (!notification.isRead) {
      await handleMarkAsRead(notification._id);
    }

    if (
      notification.type === 'application-submitted' &&
      notification.metadata?.applicationId
    ) {
      setIsOpen(false);
      const jobId = notification.relatedEntity;
      const candidateId = notification.sender;

      navigate(`/recruiter/dashboard/applications/${jobId}/${candidateId}`);
    }
  };

  const getTimeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const d = new Date(date);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (!user) return null;

  const displayNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 dark:bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="
            absolute right-0 mt-2 
            w-90
            sm:w-80 
            max-sm:fixed max-sm:left-2 max-sm:right-2 max-sm:top-16
            bg-white dark:bg-gray-800
            rounded-lg 
            max-sm:rounded-xl 
            shadow-xl dark:shadow-2xl
            border border-gray-200 dark:border-gray-700
            z-50 
            flex flex-col 
            max-h-[450px] 
            max-sm:max-h-[75vh]
            overflow-hidden
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div
            className="
              overflow-y-auto 
              max-h-[300px] 
              max-sm:max-h-[45vh]
              relative
            "
          >
            {loading ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                Loading notifications...
              </div>
            ) : displayNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400 dark:text-gray-500">
                No notifications yet
              </div>
            ) : (
              displayNotifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer 
                    hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                    ${!notification.isRead
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400'
                        : ''
                    }`}
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getTimeAgo(notification.createdAt)}
                  </p>
                </div>
              ))
            )}

            {/* Scroll Hint Line */}
            {displayNotifications.length > 2 && (
              <div className="sticky bottom-0 h-1 bg-blue-500 dark:bg-blue-400 opacity-80" />
            )}
          </div>

          {/* Footer */}
          {displayNotifications.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/notifications');
                }}
                className="w-full text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;