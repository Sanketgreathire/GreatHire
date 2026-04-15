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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLastSeen = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${USER_API_END_POINT}/last-seen/${userId}`,
          { withCredentials: true }
        );
        
        if (response.data.success) {
          setLastSeen(response.data.user.lastSeen);
          // Use context online status if provided, otherwise use API response
          if (isOnlineFromContext !== null) {
            setIsOnline(isOnlineFromContext);
          } else {
            setIsOnline(response.data.user.isOnline);
          }
        }
      } catch (error) {
        console.error('Error fetching last seen:', error);
        setLastSeen('Unknown');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchLastSeen();
      
      // Update every 30 seconds for real-time feel
      const interval = setInterval(fetchLastSeen, 30000);
      return () => clearInterval(interval);
    }
  }, [userId, isOnlineFromContext]);

  // Update online status when context changes
  useEffect(() => {
    if (isOnlineFromContext !== null) {
      setIsOnline(isOnlineFromContext);
    }
  }, [isOnlineFromContext]);

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
      <span className={isOnline ? 'text-green-600 font-medium' : 'text-gray-500'}>
        {lastSeen}
      </span>
    </div>
  );
};

export default LastSeenStatus;
