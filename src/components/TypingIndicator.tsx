import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-2xl rounded-tl-none max-w-[100px]">
      <motion.div
        className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.3 }}
      />
      <motion.div
        className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.4 }}
      />
    </div>
  );
}