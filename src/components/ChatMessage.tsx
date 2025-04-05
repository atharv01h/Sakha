import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { Heart, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DonationPrompt } from './DonationPrompt';
import { useChatStore } from '../store/chat';

type ChatMessageProps = {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
};

export function ChatMessage({ id, content, isBot, timestamp }: ChatMessageProps) {
  const [showDonation, setShowDonation] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deleteMessage } = useChatStore();

  const handleDelete = async () => {
    if (showDeleteConfirm) {
      await deleteMessage(id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const messageVariants = {
    initial: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={messageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        layout
        className={cn(
          "flex w-full mb-4 px-2 sm:px-0",
          isBot ? "justify-start" : "justify-end"
        )}
      >
        <motion.div
          className={cn(
            "max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2 relative group",
            isBot
              ? "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white rounded-tl-none"
              : "bg-purple-600 text-white rounded-tr-none"
          )}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <p className="text-sm md:text-base whitespace-pre-wrap">{content}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs opacity-70">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <div className="flex items-center gap-2">
              {isBot ? (
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setShowDonation(true)}
                  className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  <Heart className="w-3 h-3" />
                  Support Us
                </motion.button>
              ) : (
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleDelete}
                  className={cn(
                    "flex items-center gap-1 text-xs transition-colors",
                    showDeleteConfirm 
                      ? "text-red-500 hover:text-red-600" 
                      : "text-gray-400 hover:text-gray-500 opacity-0 group-hover:opacity-100"
                  )}
                >
                  <Trash2 className="w-3 h-3" />
                  {showDeleteConfirm ? 'Confirm Delete?' : 'Delete'}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showDonation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full relative"
            >
              <DonationPrompt onClose={() => setShowDonation(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}