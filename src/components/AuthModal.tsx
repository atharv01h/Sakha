import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Key, Loader2, ArrowRight, Wand2 } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import toast from 'react-hot-toast';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type AuthView = 'signIn' | 'signUp' | 'magicLink' | 'forgotPassword' | 'updateEmail' | 'updatePassword';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { 
    signUp, 
    signIn, 
    signInWithMagicLink,
    resetPassword,
    updateEmail,
    updatePassword,
    isLoading,
    user 
  } = useAuthStore();

  const [view, setView] = useState<AuthView>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setView('signIn');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      switch (view) {
        case 'signUp':
          if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
          }
          await signUp(email, password);
          resetForm();
          onClose();
          break;

        case 'signIn':
          await signIn(email, password);
          resetForm();
          onClose();
          break;

        case 'magicLink':
          await signInWithMagicLink(email);
          resetForm();
          onClose();
          break;

        case 'forgotPassword':
          await resetPassword(email);
          resetForm();
          onClose();
          break;

        case 'updateEmail':
          await updateEmail(email);
          resetForm();
          onClose();
          break;

        case 'updatePassword':
          if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
          }
          await updatePassword(password);
          resetForm();
          onClose();
          break;
      }
    } catch (error) {
      console.error('Auth Error:', error);
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const getTitle = () => {
    switch (view) {
      case 'signUp': return 'Create Account';
      case 'signIn': return 'Welcome Back';
      case 'magicLink': return 'Magic Link Sign In';
      case 'forgotPassword': return 'Reset Password';
      case 'updateEmail': return 'Update Email';
      case 'updatePassword': return 'Update Password';
      default: return '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md relative shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4">
              <div className="bg-purple-100 dark:bg-purple-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                {view === 'magicLink' ? (
                  <Wand2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                ) : (
                  <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {getTitle()}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {(view === 'signIn' || view === 'signUp' || view === 'updatePassword') && (
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>
              )}

              {(view === 'signUp' || view === 'updatePassword') && (
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {getTitle()}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="space-y-2 text-center text-sm">
                {view === 'signIn' && (
                  <>
                    <p className="text-gray-600 dark:text-gray-400">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setView('signUp')}
                        className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                      >
                        Sign Up
                      </button>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <button
                        type="button"
                        onClick={() => setView('forgotPassword')}
                        className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                      >
                        Forgot Password?
                      </button>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <button
                        type="button"
                        onClick={() => setView('magicLink')}
                        className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                      >
                        Sign in with Magic Link
                      </button>
                    </p>
                  </>
                )}

                {view !== 'signIn' && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <button
                      type="button"
                      onClick={() => setView('signIn')}
                      className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                    >
                      Back to Sign In
                    </button>
                  </p>
                )}

                {user && (
                  <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400">
                      <button
                        type="button"
                        onClick={() => setView('updateEmail')}
                        className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                      >
                        Update Email
                      </button>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <button
                        type="button"
                        onClick={() => setView('updatePassword')}
                        className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                      >
                        Update Password
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}