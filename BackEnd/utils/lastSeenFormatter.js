/**
 * Format last seen time similar to Instagram/WhatsApp
 * @param {Date} lastActiveAt - The last active timestamp
 * @returns {string} Formatted last seen string
 */
export const formatLastSeen = (lastActiveAt) => {
  if (!lastActiveAt) return "Never";
  
  const now = new Date();
  const lastSeen = new Date(lastActiveAt);
  const diffInMs = now - lastSeen;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Online if last seen within 2 minutes
  if (diffInMinutes < 2) {
    return "Online";
  }
  
  // Less than 1 hour - show minutes
  if (diffInMinutes < 60) {
    return `Last seen ${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Less than 24 hours - show hours
  if (diffInHours < 24) {
    return `Last seen ${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Less than 7 days - show days
  if (diffInDays < 7) {
    return `Last seen ${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  // More than 7 days - show date
  const options = { 
    month: 'short', 
    day: 'numeric',
    year: lastSeen.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  };
  
  return `Last seen ${lastSeen.toLocaleDateString('en-US', options)}`;
};

/**
 * Check if user is currently online (last seen within 2 minutes)
 * @param {Date} lastActiveAt - The last active timestamp
 * @returns {boolean} True if user is online
 */
export const isUserOnline = (lastActiveAt) => {
  if (!lastActiveAt) return false;
  
  const now = new Date();
  const lastSeen = new Date(lastActiveAt);
  const diffInMs = now - lastSeen;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  
  return diffInMinutes < 2;
};
