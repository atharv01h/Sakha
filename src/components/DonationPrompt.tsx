import React from 'react';
import { motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';

type DonationPromptProps = {
  onClose: () => void;
  minimal?: boolean;
};

export function DonationPrompt({ onClose, minimal = false }: DonationPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl ${minimal ? 'p-4' : 'p-6'}`}
    >
      {!minimal && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full">
          <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Support Sakha
        </h3>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Help us maintain and improve this spiritual companion by making a small contribution.
      </p>

      <div className="space-y-4">
        <div className="text-center">
          <img
            src="https://res.cloudinary.com/dlpauwdui/image/upload/fl_preserve_transparency/v1743579658/my_qr_twnu7d.jpg?_s=public-apps"
            alt="Donation QR Code"
            className="w-48 h-48 mx-auto object-contain"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Press and hold on QR code to save image
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">UPI ID:</p>
          <p className="font-mono text-purple-600 dark:text-purple-400 select-all">
            supportsakha@ybl
          </p>
        </div>

        {!minimal && (
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Your support helps us continue providing spiritual guidance to seekers worldwide 🙏
          </p>
        )}
      </div>
    </motion.div>
  );
}