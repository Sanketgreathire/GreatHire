
import { useEffect, useState } from "react";
import { fetchNotifications, markAsRead, markAllAsRead } from "../service/notificationservice";
import { Bell } from "lucide-react"; // icon library

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    loadNotifications();
  };

  const handleMarkAll = async () => {
    await markAllAsRead();
    loadNotifications();
  };

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow rounded-2xl">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5" /> Notifications
        </h2>
        <button
          onClick={handleMarkAll}
          className="text-sm text-blue-600 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className={`p-3 rounded-lg border ${
                notif.isRead ? "bg-gray-100" : "bg-blue-50 border-blue-300"
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{notif.title}</p>
                  <p className="text-sm text-gray-600">{notif.message}</p>
                </div>
                {!notif.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notif._id)}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(notif.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;

