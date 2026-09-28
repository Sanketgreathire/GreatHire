import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/ApiEndPoint';

const LastSeenStatus = ({ 
  userId, 
  showOnlineIndicator = true, 
  className = "",
  isOnlineFromContext = null // Accept online status from parent context
}) => {
  const [lastSeen, setLastSeen] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(false);   // ← changed default to false

  useEffect(() => {
    // ✅ TEMPORARILY DISABLED — backend /last-seen endpoint not implemented yet
    // Re-enable after backend adds GET /api/v1/user/last-seen/:id
    // ────────────────────────────────────────────────────────────
    // const fetchLastSeen = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await axios.get(
    //       `${USER_API_END_POINT}/last-seen/${userId}`,
    //       { withCredentials: true }
    //     );
    //     if (response.data.success) {
    //       setLastSeen(response.data.user.lastSeen);
    //       if (isOnlineFromContext !== null) {
    //         setIsOnline(isOnlineFromContext);
    //       } else {
    //         setIsOnline(response.data.user.isOnline);
    //       }
    //     }
    //   } catch (error) {
    //     console.error('Error fetching last seen:', error);
    //     setLastSeen('Unknown');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    //
    // if (userId) {
    //   fetchLastSeen();
    //   const interval = setInterval(fetchLastSeen, 30000);
    //   return () => clearInterval(interval);
    // }
    // ────────────────────────────────────────────────────────────
  }, [userId]);

  // Update online status from context (socket-provided)
  useEffect(() => {
    if (isOnlineFromContext !== null) {
      setIsOnline(isOnlineFromContext);
    }
  }, [isOnlineFromContext]);

  // Don't render anything if no userId
  if (!userId) return null;

  // No loading state — socket gives online status instantly
  if (loading) {
    return (
      <div className={`text-xs text-gray-500 ${className}`}>
        Loading...
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 text-xs ${className}`}>
      {showOnlineIndicator && isOnline && (
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      )}
      {isOnline ? (
        <span className="text-green-600 font-medium">Online</span>
      ) : (
        <span className="text-gray-500">{lastSeen || 'Offline'}</span>
      )}
    </div>
  );
};

export default LastSeenStatus;