import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scroll, Heart, MessageCircle, Sparkles, Info, Instagram } from 'lucide-react';
import { DonationPrompt } from './DonationPrompt';
import { Link } from 'react-router-dom';

export function WelcomePage({ onGetStarted }: { onGetStarted: () => void }) {
  const [showDonation, setShowDonation] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-32 h-32 mx-auto mb-8"
          >
            <img
              src="https://media.tenor.com/QOqscQMNKLYAAAAM/little-krishna-krishna.gif"
              alt="Lord Krishna Animation"
              className="w-full h-full object-cover rounded-full border-4 border-purple-200 dark:border-purple-800"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -inset-2 border-4 border-purple-400/30 dark:border-purple-600/30 rounded-full"
            />
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            Welcome to <span className="text-purple-600 dark:text-purple-400">Sakha</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your spiritual companion on the path of enlightenment, guided by the timeless wisdom of Bhagavad Gita
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors duration-200"
            >
              Begin Your Journey
              <Sparkles className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDonation(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-2 border-purple-600 dark:border-purple-400 px-8 py-4 rounded-full text-lg font-medium transition-colors duration-200"
            >
              Support Us
              <Heart className="w-5 h-5" />
            </motion.button>

            <Link
              to="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-8 py-4 rounded-full text-lg font-medium transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              About Us
              <Info className="w-5 h-5" />
            </Link>
          </div>

          <div className="mt-4">
            <a
              href="https://www.instagram.com/atharv_hatwar/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-pink-500 hover:text-pink-600 transition-colors text-lg"
            >
              <Instagram className="w-6 h-6" />
              Follow Creator on Instagram
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mt-24"
        >
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-6">
              <Scroll className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Ancient Wisdom
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Access the profound teachings of Bhagavad Gita, explained in a way that resonates with modern life
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Personal Guidance
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Receive personalized spiritual guidance tailored to your journey and questions
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Interactive Conversations
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Engage in meaningful discussions about spirituality, dharma, and life's deeper questions
            </p>
          </div>
        </motion.div>

        <AnimatePresence>
          {showDonation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <DonationPrompt onClose={() => setShowDonation(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}