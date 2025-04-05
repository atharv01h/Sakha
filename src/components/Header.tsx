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
      <div className="max-w-screen-xl mx-auto px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
          
          {/* Logo and title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <MessageCircle className="w-5 h-5 text-purple-600" />
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white flex items-center gap-1">
              Sakha
              <span className="text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-300">
                by Atharv Hatwar
              </span>
            </h1>
          </div>

          {/* Instagram link */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 w-full sm:w-auto order-3 sm:order-none">
            <a
              href="https://www.instagram.com/atharv_hatwar/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-pink-500 hover:text-pink-600 transition-colors text-sm"
            >
              <Instagram className="w-4 h-4" />
              <span className="hidden sm:inline">Follow Creator</span>
            </a>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 sm:gap-3 ml-auto">
            <button
              onClick={toggleTheme}
              className="p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              )}
            </button>

            {user ? (
              <button
                onClick={onSignOut}
                className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 text-sm"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 text-sm"
              >
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
