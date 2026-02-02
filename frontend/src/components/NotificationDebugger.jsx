import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNotifications } from '../context/NotificationContext';
import axios from 'axios';

const NotificationDebugger = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { notifications, unreadCount, loadNotifications, socket } = useNotifications();

  const testNotificationAPI = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/v1/notifications/test', {}, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setTestResult('✅ Test notification created successfully!');
        // Reload notifications to see the new one
        setTimeout(() => {
          loadNotifications();
        }, 1000);
      } else {
        setTestResult('❌ Failed to create test notification');
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkSocketConnection = () => {
    if (socket) {
      setTestResult(`🔌 Socket connected: ${socket.connected ? 'Yes' : 'No'}`);
    } else {
      setTestResult('❌ Socket not initialized');
    }
  };

  const reloadNotifications = () => {
    loadNotifications();
    setTestResult('🔄 Notifications reloaded');
  };

  // Only show for recruiters and in development
  if (!user || user.role !== 'recruiter' || process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="text-sm font-bold mb-2">🔧 Notification Debugger</h3>
      
      <div className="space-y-2 text-xs">
        <div>
          <strong>User:</strong> {user.fullname} ({user.role})
        </div>
        <div>
          <strong>Notifications:</strong> {notifications.length}
        </div>
        <div>
          <strong>Unread:</strong> {unreadCount}
        </div>
        <div>
          <strong>Socket:</strong> {socket ? (socket.connected ? '🟢 Connected' : '🔴 Disconnected') : '❌ Not initialized'}
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <button
          onClick={testNotificationAPI}
          disabled={loading}
          className="w-full text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Notification API'}
        </button>
        
        <button
          onClick={checkSocketConnection}
          className="w-full text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
        >
          Check Socket
        </button>
        
        <button
          onClick={reloadNotifications}
          className="w-full text-xs bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
        >
          Reload Notifications
        </button>
      </div>

      {testResult && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
          {testResult}
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500">
        Recent notifications:
        {notifications.slice(0, 3).map(n => (
          <div key={n._id} className="truncate">
            • {n.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDebugger;