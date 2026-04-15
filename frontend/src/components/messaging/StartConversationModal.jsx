import React, { useState, useEffect } from 'react';
import { X, Search, User, Briefcase } from 'lucide-react';
import { useMessages } from '../../context/MessageContext';
import { useSelector } from 'react-redux';
import axios from 'axios';

const StartConversationModal = ({ isOpen, onClose }) => {
  const { startConversation } = useMessages();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = users.filter(user =>
        user.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [users, searchQuery]);

  const { user: currentUser } = useSelector(store => store.auth);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Fetch users based on current user's role
      const response = await axios.get('/api/v1/user/all-users', {
        withCredentials: true,
      });
      
      // Filter users based on role compatibility
      let filteredUsers = response.data.users || [];
      
      if (currentUser?.role === 'student') {
        // Job seekers can only message recruiters
        filteredUsers = filteredUsers.filter(user => user.role === 'recruiter');
      } else if (currentUser?.role === 'recruiter') {
        // Recruiters can only message job seekers (students)
        filteredUsers = filteredUsers.filter(user => user.role === 'student');
      }
      
      // Exclude current user from the list
      filteredUsers = filteredUsers.filter(user => user._id !== currentUser?._id);
      
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = async (userId) => {
    try {
      await startConversation(userId);
      onClose();
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 dark:bg-gray-400">
      <div className="bg-white rounded-lg w-full max-w-md mx-4  ">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 ">
          <h3 className="text-lg font-semibold text-gray-900">Start New Conversation</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-200 ">
          <div className="mb-3 ">
            <button
              onClick={() => window.open('https://www.meta.com/help/', '_blank')}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Ask Meta Support
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center p-8 text-gray-500 ">
              <User className="w-12 h-12 mx-auto mb-2 text-gray-300 " />
              <p>No {currentUser?.role === 'student' ? 'recruiters' : 'job seekers'} found</p>
              <p className="text-xs mt-1 text-gray-400 ">
                {currentUser?.role === 'student' 
                  ? 'You can only message recruiters' 
                  : 'You can only message job seekers'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleStartConversation(user._id)}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.fullname}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {user.fullname}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      <div className="flex items-center mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          <Briefcase className="w-3 h-3 mr-1" />
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartConversationModal;
