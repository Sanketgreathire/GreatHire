import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useMessages } from '../../context/MessageContext';

const MessageNotificationBadge = ({ className = "" }) => {
  const { conversations } = useMessages();
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    const unreadCount = conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
    setTotalUnread(unreadCount);
  }, [conversations]);

  return (
    <div className={`relative ${className}`}>
      <MessageCircle className="w-6 h-6" />
      {totalUnread > 0 && (
        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[18px] h-[18px]">
          {totalUnread > 99 ? '99+' : totalUnread}
        </span>
      )}
    </div>
  );
};

export default MessageNotificationBadge;
