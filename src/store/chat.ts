import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { persist } from 'zustand/middleware';
import { startOfDay, endOfDay } from 'date-fns';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

// API key rotation
const API_KEYS = [
  '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',
  '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',
  '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',
  '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',
  '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',
  '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',
  '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'
];

let currentKeyIndex = 0;

type Message = {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  deletion_warned?: boolean;
};

type SupabaseMessage = {
  id: string;
  content: string;
  is_bot: boolean;
  timestamp: string;
  user_type?: 'sakha' | 'sakhi';
  deletion_warned?: boolean;
};

type ChatStore = {
  messages: Message[];
  userType: 'sakha' | 'sakhi' | null;
  language: 'hinglish' | 'english' | 'marathi';
  isInitialized: boolean;
  dailyMessageCount: number;
  lastMessageDate: string | null;
  addMessage: (content: string, isBot: boolean) => Promise<void>;
  setUserType: (type: 'sakha' | 'sakhi') => Promise<void>;
  setLanguage: (lang: 'hinglish' | 'english' | 'marathi') => void;
  loadMessages: () => Promise<void>;
  clearMessages: () => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  setInitialized: (value: boolean) => void;
  checkDailyLimit: () => boolean;
  getCurrentApiKey: () => string;
  rotateApiKey: () => void;
  resetDailyCount: () => void;
};

export const useChatStore = create(
  persist<ChatStore>(
    (set, get) => ({
      messages: [],
      userType: null,
      language: 'hinglish',
      isInitialized: false,
      dailyMessageCount: 0,
      lastMessageDate: null,

      getCurrentApiKey: () => API_KEYS[currentKeyIndex],

      rotateApiKey: () => {
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
      },

      checkDailyLimit: () => {
        const { dailyMessageCount, lastMessageDate, resetDailyCount } = get();
        
        // Check if we need to reset the count for a new day
        if (lastMessageDate) {
          const lastDate = new Date(lastMessageDate);
          const now = new Date();
          if (lastDate.getDate() !== now.getDate() || 
              lastDate.getMonth() !== now.getMonth() || 
              lastDate.getFullYear() !== now.getFullYear()) {
            resetDailyCount();
            return true;
          }
        }

        return dailyMessageCount < 30;
      },

      resetDailyCount: () => {
        set({ 
          dailyMessageCount: 0,
          lastMessageDate: new Date().toISOString()
        });
      },

      setInitialized: (value: boolean) => set({ isInitialized: value }),

      loadMessages: async () => {
        try {
          const { data: user } = await supabase.auth.getUser();
          if (!user?.user) return;

          // First, check if user type exists in local storage
          const { userType } = get();
          if (!userType) {
            const { data: userTypeData } = await supabase
              .from('messages')
              .select('user_type')
              .eq('user_id', user.user.id)
              .not('user_type', 'is', null)
              .order('timestamp', { ascending: false })
              .limit(1);

            if (userTypeData?.[0]?.user_type) {
              set({ userType: userTypeData[0].user_type as 'sakha' | 'sakhi' });
            }
          }

          // Get today's messages count
          const { data: todayMessages } = await supabase
            .from('messages')
            .select('*')
            .eq('user_id', user.user.id)
            .gte('timestamp', startOfDay(new Date()).toISOString())
            .lte('timestamp', endOfDay(new Date()).toISOString())
            .not('is_bot', 'eq', true);

          set({ 
            dailyMessageCount: todayMessages?.length || 0,
            lastMessageDate: new Date().toISOString()
          });

          const { data: messages } = await supabase
            .from('messages')
            .select('*')
            .eq('user_id', user.user.id)
            .order('timestamp', { ascending: true });

          if (messages?.length) {
            const processedMessages: Message[] = messages.map((msg: SupabaseMessage) => ({
              id: msg.id,
              content: msg.content,
              isBot: msg.is_bot,
              timestamp: new Date(msg.timestamp),
              deletion_warned: msg.deletion_warned,
            }));

            set({ messages: processedMessages });
          }

          set({ isInitialized: true });
        } catch (error) {
          console.error('Error loading messages:', error);
          toast.error('Failed to load messages');
        }
      },

      addMessage: async (content: string, isBot: boolean) => {
        try {
          const { data: user } = await supabase.auth.getUser();
          if (!user?.user) return;

          // Check daily limit for user messages
          if (!isBot && !get().checkDailyLimit()) {
            toast.error('Daily message limit reached. Please come back tomorrow! 🙏');
            return;
          }

          const newMessage: Message = {
            id: crypto.randomUUID(),
            content,
            isBot,
            timestamp: new Date(),
          };

          set(state => ({
            messages: [...state.messages, newMessage],
            dailyMessageCount: isBot ? state.dailyMessageCount : state.dailyMessageCount + 1,
            lastMessageDate: new Date().toISOString()
          }));

          await supabase.from('messages').insert({
            id: newMessage.id,
            user_id: user.user.id,
            content: newMessage.content,
            is_bot: newMessage.isBot,
            timestamp: newMessage.timestamp.toISOString(),
            user_type: get().userType,
          });
        } catch (error) {
          console.error('Error saving message:', error);
          toast.error('Failed to send message');
        }
      },

      setUserType: async (type: 'sakha' | 'sakhi') => {
        try {
          const { data: user } = await supabase.auth.getUser();
          if (!user?.user) return;

          set({ userType: type });

          await supabase.from('messages').insert({
            user_id: user.user.id,
            content: `User type set to ${type}`,
            is_bot: false,
            user_type: type,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Error saving user type:', error);
          toast.error('Failed to set user type');
        }
      },

      setLanguage: (lang: 'hinglish' | 'english' | 'marathi') => {
        set({ language: lang });
      },

      clearMessages: async () => {
        try {
          const { data: user } = await supabase.auth.getUser();
          if (!user?.user) return;

          await supabase
            .from('messages')
            .delete()
            .eq('user_id', user.user.id);

          set({ 
            messages: [], 
            userType: null,
            dailyMessageCount: 0,
            lastMessageDate: new Date().toISOString()
          });
          toast.success('Chat history cleared');
        } catch (error) {
          console.error('Error clearing messages:', error);
          toast.error('Failed to clear chat history');
        }
      },

      deleteMessage: async (messageId: string) => {
        try {
          const { data: user } = await supabase.auth.getUser();
          if (!user?.user) return;

          await supabase
            .from('messages')
            .delete()
            .eq('id', messageId)
            .eq('user_id', user.user.id);

          set(state => ({
            messages: state.messages.filter(msg => msg.id !== messageId),
          }));

          toast.success('Message deleted');
        } catch (error) {
          console.error('Error deleting message:', error);
          toast.error('Failed to delete message');
        }
      },
    }),
    {
      name: 'chat-store',
      partialize: (state) => ({
        userType: state.userType,
        language: state.language,
        dailyMessageCount: state.dailyMessageCount,
        lastMessageDate: state.lastMessageDate,
      }),
    }
  )
);
