import React, { useState } from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import { useMessages } from '../../context/MessageContext';
import StartConversationModal from './StartConversationModal';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const QuickMessageButton = ({ recipientId, recipientName, className = "" }) => {
  const { startConversation } = useMessages();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth);

  const handleQuickMessage = async () => {
    // Check if user is authenticated
    if (!user) {
      navigate('/login');
      return;
    }

    if (recipientId) {
      try {
        await startConversation(recipientId);
        navigate('/messages');
      } catch (error) {
        console.error('Failed to start conversation:', error);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleQuickMessage}
        className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        {recipientName ? `Message ${recipientName}` : 'New Message'}
      </button>

      <StartConversationModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
};

export default QuickMessageButton;
