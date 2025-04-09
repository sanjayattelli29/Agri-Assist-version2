
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface FloatingChatButtonProps {
  position?: 'bottom-right' | 'bottom-left';
  bgColor?: string;
  hoverBgColor?: string;
}

const FloatingChatButton = ({
  position = 'bottom-right',
  bgColor = 'bg-green-600',
  hoverBgColor = 'hover:bg-green-700',
}: FloatingChatButtonProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleClick = () => {
    navigate('/chatbot');
  };

  const positionClasses = {
    'bottom-right': 'right-6',
    'bottom-left': 'left-6'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed bottom-16 ${positionClasses[position]} z-50`}
    >
      <button
        onClick={handleClick}
        className={`flex items-center justify-center ${bgColor} ${hoverBgColor} text-white rounded-full p-3 shadow-lg transition-colors`}
        aria-label="Chat with us"
      >
        <MessageCircle className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'}`} />
        {!isMobile && (
          <span className="ml-2 mr-1">Chat with Us</span>
        )}
      </button>
    </motion.div>
  );
};

export default FloatingChatButton;
