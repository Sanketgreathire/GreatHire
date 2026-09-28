import { useState, useEffect } from 'react';
import { useMessages } from '../../context/MessageContext';
import { formatDistanceToNow } from 'date-fns';
import { Search, MessageCircle, User } from 'lucide-react';
import LastSeenStatus from '@/components/shared/LastSeenStatus';
/* eslint-disable react/prop-types */

const ConversationList = ({ onSelectConversation }) => {
  const {
    conversations,
    activeConversation,
    loading,
    onlineUsers
  } = useMessages();

  // ✅ Total unread
  const totalUnread = conversations.reduce(
    (sum, c) => sum + (c.unreadCount || 0),
    0
  );

  // ✅ Modal state for the info popup
  const [showInfoModal, setShowInfoModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState([]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = conversations.filter(conv =>
        conv.participant?.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.participant?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [conversations, searchQuery]);

  const validConversations = filteredConversations.filter(
    (conv) => conv?.participant?._id
  );

  const invalidCount = filteredConversations.length - validConversations.length;

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const truncateMessage = (message, maxLength = 50) => {
    if (!message) return '';
    return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message;
  };

  const isUserOnline = (id) => {
    if (!id) return false;
    return onlineUsers?.has?.(id) || false;
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2 flex-wrap">
          <MessageCircle className="w-5 h-5" />
          <span>Messages</span>

          {/* ✅ Clickable pill — opens info modal */}
          <button
            onClick={() => setShowInfoModal(true)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 text-[10px] font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors cursor-pointer"
            title="Click to learn more"
          >
            📧 Message recorded
          </button>

          {totalUnread > 0 && (
            <span className="ml-auto inline-flex items-center justify-center min-w-[22px] h-[22px] px-2 text-xs font-bold text-white bg-red-500 rounded-full">
              {totalUnread > 99 ? "99+" : totalUnread}
            </span>
          )}
        </h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading && conversations.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : validConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <MessageCircle className="w-12 h-12 mb-2 text-gray-300 dark:text-gray-700" />
            <p className="text-sm dark:text-gray-400">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
            {!searchQuery && (
              <p className="text-xs mt-1 dark:text-gray-500">
                Start a conversation to get started
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {invalidCount > 0 && (
              <div className="p-2 text-xs text-amber-700 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
                {invalidCount} conversation{invalidCount > 1 ? 's' : ''} hidden — missing participant data
              </div>
            )}

            {validConversations.map((conversation) => {
              const partnerId = conversation.participant?._id;
              const isOnline = isUserOnline(partnerId);
              const isActive = activeConversation?._id === conversation._id;
              const hasUnread = conversation.unreadCount > 0;

              return (
                <div
                  key={conversation._id}
                  onClick={() => onSelectConversation(conversation)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-r-2 border-blue-500'
                      : hasUnread
                        ? 'bg-gray-50 dark:bg-gray-700/30'
                        : ''
                    }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative flex-shrink-0">
                      {conversation.participant?.profilePhoto ? (
                        <img
                          src={conversation.participant.profilePhoto}
                          alt={conversation.participant.fullname || 'User'}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </div>
                      )}

                      {isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3
                          className={`text-sm truncate ${hasUnread
                              ? 'font-bold text-gray-900 dark:text-white'
                              : 'font-medium text-gray-900 dark:text-gray-100'
                            }`}
                        >
                          {conversation.participant?.fullname || 'Unknown User'}
                        </h3>

                        <span
                          className={`text-xs flex-shrink-0 ${hasUnread
                              ? 'text-red-500 font-semibold'
                              : 'text-gray-500 dark:text-gray-400'
                            }`}
                        >
                          {formatLastMessageTime(conversation.lastMessageTime)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-sm truncate ${hasUnread
                              ? 'font-semibold text-gray-900 dark:text-white'
                              : 'text-gray-600 dark:text-gray-400'
                            }`}
                        >
                          {conversation.lastMessage?.content
                            ? truncateMessage(conversation.lastMessage.content)
                            : 'No messages yet'}
                        </p>

                        {hasUnread && (
                          <span className="flex-shrink-0 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                          </span>
                        )}
                      </div>

                      <div className="mt-1">
                        <LastSeenStatus
                          userId={partnerId}
                          showOnlineIndicator={true}
                          className="text-xs"
                          isOnlineFromContext={isOnline}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/*  Full-screen info modal — opens on pill click */}
      {showInfoModal && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowInfoModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Content */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                <span className="text-3xl">📧</span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Message Recorded
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Your message has been <strong>saved to GreatHires system</strong>.
                GreatHire can view your messages for <strong>compliance, quality,
                and platform safety</strong> purposes.
              </p>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-5 w-full">
                <p className="text-xs text-amber-800 dark:text-amber-300 text-left">
                  <strong>💡 Note:</strong> Messages are stored securely and used
                  only to maintain trust and improve our hiring services.
                </p>
              </div>

              <button
                onClick={() => setShowInfoModal(false)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationList;