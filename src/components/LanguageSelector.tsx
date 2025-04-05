import { motion } from 'framer-motion';
import { useChatStore } from '../store/chat';

export function LanguageSelector() {
  const { language, setLanguage } = useChatStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center gap-2 mb-4"
    >
      {(['hinglish', 'english', 'marathi'] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            language === lang
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-purple-100 dark:hover:bg-gray-700'
          }`}
        >
          {lang.charAt(0).toUpperCase() + lang.slice(1)}
        </button>
      ))}
    </motion.div>
  );
}