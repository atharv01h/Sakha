import { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

type ChatInputProps = {
  onSend: (message: string) => void;
};

export function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-white placeholder-gray-400 text-base md:text-lg"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          disabled={!message.trim()}
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>
    </form>
  );
}