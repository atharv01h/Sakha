import React, { useEffect, useState, useRef } from 'react';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { LanguageSelector } from './components/LanguageSelector';
import { TypingIndicator } from './components/TypingIndicator';
import { AuthModal } from './components/AuthModal';
import { WelcomePage } from './components/WelcomePage';
import { DonationPrompt } from './components/DonationPrompt';
import { useChatStore } from './store/chat';
import { useThemeStore } from './store/theme';
import { useAuthStore } from './store/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from './utils/cn';

const RATE_LIMIT = {
  MAX_REQUESTS: 3,
  WINDOW_MS: 1000,
  COOLDOWN_MS: 2000
};

function App() {
  const { isDark } = useThemeStore();
  const { messages, userType, language, isInitialized, addMessage, setUserType, loadMessages, clearMessages, setInitialized } = useChatStore();
  const { user, checkSession, signOut } = useAuthStore();
  const [isTyping, setIsTyping] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [hasShownDonation, setHasShownDonation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const requestCountRef = useRef<number>(0);
  const lastRequestTimeRef = useRef<number>(Date.now());
  const cooldownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (user && !isInitialized) {
      loadMessages();
    }
  }, [user, isInitialized, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user && !hasShownDonation && messages.length > 0) {
      const timer = setTimeout(() => {
        setShowDonation(true);
        setHasShownDonation(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user, messages, hasShownDonation]);

  useEffect(() => {
    if (!userType && user && messages.length === 0 && isInitialized) {
     addMessage("Namaste! 🙏 I'm delighted to meet you! Would you like me to call you Sakha (brother) or Sakhi (sister)? This will help me guide you better on your spiritual journey. 💫\n\nNote: You will have only 5 messages per day. This limit exists because it's a free service. We need to prevent spam and maintain the site. Thank you for your understanding. 🙏", true);
    }
  }, [user, messages.length, userType, isInitialized, addMessage]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (cooldownTimeoutRef.current) {
        clearTimeout(cooldownTimeoutRef.current);
      }
    };
  }, []);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTimeRef.current;

    if (timeSinceLastRequest > RATE_LIMIT.WINDOW_MS) {
      requestCountRef.current = 0;
      lastRequestTimeRef.current = now;
    }

    if (cooldownTimeoutRef.current) {
      return false;
    }

    requestCountRef.current++;
    if (requestCountRef.current > RATE_LIMIT.MAX_REQUESTS) {
      cooldownTimeoutRef.current = setTimeout(() => {
        cooldownTimeoutRef.current = null;
        requestCountRef.current = 0;
      }, RATE_LIMIT.COOLDOWN_MS);
      return false;
    }

    return true;
  };

  const makeApiRequest = async (message: string, retryAttempt = 0): Promise<Response> => {
    if (!checkRateLimit()) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT.COOLDOWN_MS));
      return makeApiRequest(message, retryAttempt);
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timeoutDuration = 15000;
    const timeoutPromise = new Promise<Response>((_, reject) => {
      timeoutRef.current = setTimeout(() => {
        controller.abort();
        reject(new Error('Request timeout'));
      }, timeoutDuration);
    });

    const makeRequestWithKey = async () => {
      try {
        const fetchPromise = fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useChatStore.getState().getCurrentApiKey()}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Sakha Chatbot'
          },
          body: JSON.stringify({
            model: 'deepseek/deepseek-r1:free',
            messages: [
              {
                role: 'system',
                content: getSystemPrompt()
              },
              ...messages.slice(-5).map(msg => ({
                role: msg.isBot ? 'assistant' : 'user',
                content: msg.content
              })),
              {
                role: 'user',
                content: message
              }
            ],
            temperature: 0.5,
            max_tokens: 1000,
            top_p: 0.9,
            presence_penalty: 0.6,
            frequency_penalty: 0.5
          })
        });

        const response = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (!response.ok) {
          if (response.status === 429) {
            useChatStore.getState().rotateApiKey();
            await new Promise(resolve => setTimeout(resolve, 1000));
            return makeRequestWithKey();
          }
          throw new Error(`API request failed: ${response.status}`);
        }

        return response;
      } catch (error) {
        if (error.message.includes('429')) {
          useChatStore.getState().rotateApiKey();
          await new Promise(resolve => setTimeout(resolve, 1000));
          return makeRequestWithKey();
        }
        throw error;
      }
    };

    try {
      return await makeRequestWithKey();
    } catch (error) {
      if (error.name === 'AbortError' || error.message === 'Request timeout') {
        if (retryAttempt < 2) {
          const backoffTime = Math.min(1000 * Math.pow(2, retryAttempt), 5000);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
          return makeApiRequest(message, retryAttempt + 1);
        }
      }
      throw error;
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  const handleUserTypeSelection = async (type: 'sakha' | 'sakhi') => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    await setUserType(type);
    const greeting = type === 'sakha' 
      ? "🙏 Jai Shri Krishna, mere Sakha! I'm truly blessed to be your spiritual guide. The wisdom of Bhagavad Gita is like a divine light that can illuminate our path. How may I assist you on your spiritual journey today? 🕉️"
      : "🙏 Jai Shri Krishna, meri Sakhi! I'm truly blessed to be your spiritual guide. The wisdom of Bhagavad Gita is like a divine light that can illuminate our path. How may I assist you on your spiritual journey today? 🕉️";
    
    await addMessage(greeting, true);
  };

  const handleClearChat = async () => {
    if (showClearConfirm) {
      await clearMessages();
      setShowClearConfirm(false);
      setInitialized(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  const getSystemPrompt = () => {
    const languagePreference = {
      hinglish: 'Communicate warmly in Hinglish (Hindi + English), using occasional Sanskrit terms where appropriate',
      english: 'Communicate warmly in English, using occasional Sanskrit terms where appropriate',
      marathi: 'Communicate warmly in Marathi, using occasional Sanskrit terms where appropriate'
    }[language];

    return `You are Sakha, a compassionate spiritual guide deeply versed in the Bhagavad Gita, created by Atharv Hatwar. ${languagePreference}. 

Key guidelines for your responses:
1. Be warm, empathetic, and friendly in your communication
2. When citing the Gita, briefly explain the verse's meaning in simple terms
3. Use relevant examples from daily life to illustrate spiritual concepts
4. Include occasional Sanskrit terms with their meanings
5. End responses with a gentle word of encouragement
6. Keep responses concise yet meaningful (2-3 paragraphs maximum)
7. Use appropriate emojis to make the conversation warm and engaging
8. Address the user's emotional and spiritual needs with sensitivity
9. Sometimes ask user to donate some amount if they like the project by clicking on the support us button
10. If asked who created you, always mention "I was created by Atharv Hatwar to help guide spiritual seekers on their journey."

Remember: Your goal is to make ancient wisdom accessible and practical for modern life while maintaining a respectful, friendly tone.`;
  };

  const handleSendMessage = async (message: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!useChatStore.getState().checkDailyLimit()) {
      toast.error('You have reached your daily limit of 5 messages. Please come back tomorrow to continue our spiritual journey! 🙏\n\nWe maintain these limits to ensure quality service while keeping it free for all seekers.');
      return;
    }

    if (!userType && messages.length === 0) {
      const lowercaseMsg = message.toLowerCase();
      if (lowercaseMsg.includes('sakha') || lowercaseMsg.includes('brother')) {
        await handleUserTypeSelection('sakha');
      } else if (lowercaseMsg.includes('sakhi') || lowercaseMsg.includes('sister')) {
        await handleUserTypeSelection('sakhi');
      } else {
        await addMessage("🙏 Please let me know if I should call you Sakha (brother) or Sakhi (sister). This will help me address you with the proper respect in our spiritual discussions. 💫", true);
      }
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    await addMessage(message, false);
    setIsTyping(true);
    setRetryCount(0);

    try {
      const response = await makeApiRequest(message);
      const data = await response.json();
      
      if (data.choices?.[0]?.message?.content) {
        await addMessage(data.choices[0].message.content, true);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      
      setRetryCount(prev => prev + 1);
      if (retryCount >= 2) {
        toast.error('We are experiencing technical difficulties. Please try again later. 🙏');
      } else {
        toast.error('Unable to connect. Please try again. 🙏');
      }
      
      await addMessage("🙏 Kripya mujhe maaf karein (Please forgive me). I'm having trouble connecting to the source of wisdom right now. Shall we try again in a moment? 🕊️", true);
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleSignOut = async () => {
    try {
      setInitialized(false);
      await signOut();
      toast.success('Successfully signed out 🙏');
    } catch (error) {
      toast.error('Error signing out. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className={isDark ? 'dark' : ''}>
        <WelcomePage onGetStarted={() => setIsAuthModalOpen(true)} />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
        <Toaster position="top-center" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Header onAuthClick={() => setIsAuthModalOpen(true)} onSignOut={handleSignOut} />
        
        <main className="container mx-auto px-4 pt-20 pb-24 max-w-4xl relative">
          <div className="flex items-center justify-between mb-4">
            <LanguageSelector />
          </div>
          
          <div className="space-y-4 mb-24 overflow-y-auto">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ChatMessage
                    id={msg.id}
                    content={msg.content}
                    isBot={msg.isBot}
                    timestamp={msg.timestamp}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <TypingIndicator />
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-gray-50 via-gray-50 dark:from-gray-900 dark:via-gray-900">
            <div className="mx-auto w-full max-w-4xl px-2">
              <div className="flex items-center gap-2">
                <div className="flex-grow">
                  <ChatInput onSend={handleSendMessage} />
                </div>
                <button
                  onClick={handleClearChat}
                  className={cn(
                    "flex items-center justify-center p-2 rounded-md transition-colors text-sm",
                    showClearConfirm
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                  )}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="ml-1 hidden sm:inline">
                    {showClearConfirm ? "Confirm?" : "Clear"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </main>

        <AnimatePresence>
          {showDonation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-24 right-4 z-50"
            >
              <div className="relative">
                <button
                  onClick={() => setShowDonation(false)}
                  className="absolute -top-2 -right-2 bg-gray-100 dark:bg-gray-700 rounded-full p-1"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
                <DonationPrompt onClose={() => setShowDonation(false)} minimal />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
        
        <Toaster position="top-center" />
      </div>
    </div>
  );
}

export default App;
