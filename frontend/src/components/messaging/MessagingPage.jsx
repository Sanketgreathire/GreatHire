import React, { useState } from 'react';
import { MessageProvider } from '../../context/MessageContext';
import ConversationList from './ConversationList';
import ChatInterface from './ChatInterface';
import { useMessages } from '../../context/MessageContext';

const MessagingContent = () => {
  const { setActiveConversation } = useMessages();

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
  };

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-400">
      {/* Sidebar - Conversation List */}
      <div className="w-1/3 min-w-[300px] max-w-[400px] dark:bg-gray-400">
        <ConversationList onSelectConversation={handleSelectConversation} />
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  );
};

const MessagingPage = () => {
  return (
    <MessageProvider>
      <MessagingContent />
    </MessageProvider>
  );
};

export default MessagingPage;
