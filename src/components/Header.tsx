import { Moon, Sun, MessageCircle, LogIn, LogOut, Instagram } from 'lucide-react';
import { useThemeStore } from '../store/theme';
import { useAuthStore } from '../store/auth';
import { motion } from 'framer-motion';

type HeaderProps = {
  onAuthClick: () => void;
  onSignOut: () => void;
};

export function Header({ onAuthClick, onSignOut }: HeaderProps) {
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 w-full bg-white dark:bg-gray-900 shadow-md z-50"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Sakha</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 order-last sm:order-none w-full sm:w-auto justify-center mt-2 sm:mt-0">
            <a
              href="https://www.instagram.com/atharv_hatwar/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-pink-500 hover:text-pink-600 transition-colors"
            >
              <Instagram className="w-5 h-5" />
              <span className="text-sm hidden sm:inline">Follow Creator</span>
            </a>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              by Atharv Hatwar
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            {user ? (
              <button
                onClick={onSignOut}
                className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              >
                <LogIn className="w-5 h-5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}