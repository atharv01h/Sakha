import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { persist } from 'zustand/middleware';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

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
  addMessage: (content: string, isBot: boolean) => Promise<void>;
  setUserType: (type: 'sakha' | 'sakhi') => Promise<void>;
  setLanguage: (lang: 'hinglish' | 'english' | 'marathi') => void;
  loadMessages: () => Promise<void>;
  clearMessages: () => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  setInitialized: (value: boolean) => void;
};

export const useChatStore = create(
  persist<ChatStore>(
    (set, get) => ({
      messages: [],
      userType: null,
      language: 'hinglish',
      isInitialized: false,

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

          const newMessage: Message = {
            id: crypto.randomUUID(),
            content,
            isBot,
            timestamp: new Date(),
          };

          set(state => ({
            messages: [...state.messages, newMessage],
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

          set({ messages: [], userType: null });
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
      }),
    }
  )
);