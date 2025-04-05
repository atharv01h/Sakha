import React from 'react';
import { motion } from 'framer-motion';
import { Book, Heart, MessageCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
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
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            About <span className="text-purple-600 dark:text-purple-400">Sakha</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your spiritual companion powered by divine wisdom and modern technology
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-6">
                <Book className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Divine Wisdom
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access the timeless teachings of Bhagavad Gita through modern conversations
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Personal Guidance
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get personalized spiritual guidance in your preferred language
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Community Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Join a growing community of spiritual seekers on their journey
              </p>
            </div>
          </div>

          <div className="mt-16 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Contact Us
            </h2>
            <div className="flex items-center justify-center gap-4">
              <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <a
                href="mailto:support@sakhachat.fun"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
              >
                support@sakhachat.fun
              </a>
            </div>
          </div>

          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors duration-200"
            >
              Start Your Journey
              <MessageCircle className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}