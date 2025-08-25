import React, { useState, useRef, useEffect } from 'react';
import { useMessages } from '../../context/MessageContext';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { 
  Send, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Reply, 
  User,
  Phone,
  Video,
  Info,
  Mic,
  Paperclip,
  Smile,
  Image,
  FileText,
  Camera
} from 'lucide-react';

const ChatInterface = () => {
  const { 
    activeConversation, 
    messages, 
    sendMessage, 
    sendTypingIndicator,
    deleteMessage,
    editMessage,
    typingUsers,
    onlineUsers,
    loading,
    hasMoreMessages,
    fetchMessages
  } = useMessages();
  
  const { user } = useSelector(store => store.auth);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when conversation changes
  useEffect(() => {
    if (activeConversation) {
      inputRef.current?.focus();
    }
  }, [activeConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeConversation) return;

    try {
      await sendMessage(
        activeConversation.participant._id, 
        newMessage.trim(),
        'text',
        replyingTo?._id
      );
      setNewMessage('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    // Send typing indicator
    sendTypingIndicator(true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(false);
    }, 1000);
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload logic here
      console.log('File selected:', file);
      setShowAttachmentMenu(false);
    }
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      // Stop recording logic here
      console.log('Stopped recording');
    } else {
      setIsRecording(true);
      // Start recording logic here
      console.log('Started recording');
    }
  };

  const commonEmojis = ['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '👎', '❤️', '🔥', '💯', '🎉'];

  const handleEditMessage = async (messageId) => {
    if (!editContent.trim()) return;
    
    try {
      await editMessage(messageId, editContent.trim());
      setEditingMessage(null);
      setEditContent('');
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(messageId);
      } catch (error) {
        console.error('Failed to delete message:', error);
      }
    }
    setShowDropdown(null);
  };

  const startEdit = (message) => {
    setEditingMessage(message._id);
    setEditContent(message.content);
    setShowDropdown(null);
  };

  const startReply = (message) => {
    setReplyingTo(message);
    setShowDropdown(null);
    inputRef.current?.focus();
  };

  const isTyping = activeConversation && typingUsers[activeConversation.participant._id];
  const isOnline = activeConversation && onlineUsers.has(activeConversation.participant._id);

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
          <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {activeConversation.participant?.profilePhoto ? (
                <img
                  src={activeConversation.participant.profilePhoto}
                  alt={activeConversation.participant.fullname}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">
                {activeConversation.participant?.fullname || 'Unknown User'}
              </h3>
              <p className="text-sm text-gray-500">
                {isOnline ? 'Online' : 'Offline'}
                {isTyping && ' • typing...'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {hasMoreMessages && (
              <div className="text-center">
                <button
                  onClick={() => fetchMessages(activeConversation._id, Math.ceil(messages.length / 50) + 1)}
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  Load more messages
                </button>
              </div>
            )}
            
            {messages.map((message) => {
              const isOwn = message.sender._id === user._id;
              const isEditing = editingMessage === message._id;
              
              return (
                <div key={message._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                    {/* Reply indicator */}
                    {message.replyTo && (
                      <div className="mb-1 p-2 bg-gray-100 rounded text-xs text-gray-600 border-l-2 border-blue-500">
                        <p className="font-medium">{message.replyTo.sender?.fullname}</p>
                        <p className="truncate">{message.replyTo.content}</p>
                      </div>
                    )}
                    
                    <div className={`relative group ${isOwn ? 'ml-auto' : 'mr-auto'}`}>
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          isOwn
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full px-2 py-1 text-sm bg-white text-gray-900 border rounded"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleEditMessage(message._id);
                                }
                              }}
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditMessage(message._id)}
                                className="text-xs px-2 py-1 bg-blue-500 text-white rounded"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingMessage(null)}
                                className="text-xs px-2 py-1 bg-gray-500 text-white rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm">{message.content}</p>
                            {message.isEdited && (
                              <p className="text-xs opacity-75 mt-1">(edited)</p>
                            )}
                          </>
                        )}
                      </div>
                      
                      {/* Message actions */}
                      {isOwn && !isEditing && (
                        <div className="absolute top-0 right-0 transform translate-x-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="relative">
                            <button
                              onClick={() => setShowDropdown(showDropdown === message._id ? null : message._id)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {showDropdown === message._id && (
                              <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                <button
                                  onClick={() => startReply(message)}
                                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Reply className="w-4 h-4 mr-2" />
                                  Reply
                                </button>
                                <button
                                  onClick={() => startEdit(message)}
                                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteMessage(message._id)}
                                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {!isOwn && !isEditing && (
                        <div className="absolute top-0 left-0 transform -translate-x-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startReply(message)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Reply className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply indicator */}
      {replyingTo && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-blue-600 font-medium">
                Replying to {replyingTo.sender.fullname}
              </p>
              <p className="text-sm text-gray-600 truncate">{replyingTo.content}</p>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-blue-500 hover:text-blue-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          {/* Attachment Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            {showAttachmentMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Document
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Photo
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Camera
                  </button>
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept="*/*"
            />
          </div>

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type a message..."
              className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="1"
              style={{ minHeight: '40px', maxHeight: '120px' }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            
            {/* Emoji Button */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <Smile className="w-5 h-5" />
              </button>
              
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">Frequently used</div>
                    <div className="grid grid-cols-6 gap-2">
                      {commonEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => handleEmojiSelect(emoji)}
                          className="text-xl hover:bg-gray-100 rounded p-1 transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Voice/Send Button */}
          {newMessage.trim() ? (
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleVoiceRecord}
              className={`p-2 rounded-lg transition-colors ${
                isRecording 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
