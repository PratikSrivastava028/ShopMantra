import { create } from 'zustand';
import { Message } from '../types';
import { io, Socket } from 'socket.io-client';
import { useCartStore } from './cartStore';
import { useAuthStore } from './authStore';

interface ChatState {
  messages: Message[];
  conversations: { id: string; title: string; date: string }[];
  activeConversationId: string;
  isAiTyping: boolean;
  isOpen: boolean;
  connectSocket: () => void;
  disconnectSocket: () => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  sendMessage: (content: string) => Promise<void>;
  startNewChat: () => void;
  selectConversation: (id: string) => void;
  clearHistory: () => void;
}

const DEFAULT_CONVERSATIONS = [
  { id: 'chat-1', title: 'Shopping with AI Buddy', date: 'Just now' }
];

const DEFAULT_MESSAGES: Message[] = [
  {
    id: 'msg-welcome',
    sender: 'ai',
    content: 'Hi! I am your **ShopMantra AI Buddy**. I can help you find products, compare options, explain specifications, or add items directly to your cart using simple conversational language. \n\nTry asking me something like:\n* *"Find me a gaming laptop under ₹80,000"* \n* *"I need a black office shirt"* \n* *"Add a wireless mouse and keyboard to my cart"*',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
];

let socketClient: Socket | null = null;

export const useChatStore = create<ChatState>((set, get) => ({
  messages: DEFAULT_MESSAGES,
  conversations: DEFAULT_CONVERSATIONS,
  activeConversationId: 'chat-1',
  isAiTyping: false,
  isOpen: false,

  connectSocket: () => {
    if (socketClient && socketClient.connected) return;

    // Establish WebSocket connection through Vite proxy routing
    socketClient = io({
      path: '/api/socket/socket.io/',
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socketClient.on('connect', () => {
      console.log('AI Buddy Socket connected successfully.');
    });

    socketClient.on('message', (content: string) => {
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      set((state) => ({
        messages: [...state.messages, aiMessage],
        isAiTyping: false,
      }));

      // Automatically trigger a cart refresh in case AI Buddy called 'addProductToCart' tool
      const productsStore = (window as any)._shopmantra_products || [];
      useCartStore.getState().fetchCart(productsStore);
    });

    socketClient.on('connect_error', (error) => {
      console.warn('AI Buddy socket connection failed:', error.message);
      set({ isAiTyping: false });
    });

    socketClient.on('disconnect', () => {
      console.log('AI Buddy Socket disconnected.');
    });
  },

  disconnectSocket: () => {
    if (socketClient) {
      socketClient.disconnect();
      socketClient = null;
    }
  },

  toggleOpen: () => {
    const nextOpen = !get().isOpen;
    if (nextOpen) {
      const { isAuthenticated } = useAuthStore.getState();
      if (!isAuthenticated) {
        window.location.href = '/login';
        return;
      }
      get().connectSocket();
    }
    set({ isOpen: nextOpen });
  },

  setOpen: (open) => {
    if (open) {
      const { isAuthenticated } = useAuthStore.getState();
      if (!isAuthenticated) {
        window.location.href = '/login';
        return;
      }
      get().connectSocket();
    }
    set({ isOpen: open });
  },
  
  sendMessage: async (content) => {
    if (!content.trim()) return;
    
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    set((state) => ({
      messages: [...state.messages, userMessage],
      isAiTyping: true
    }));

    // Make sure socket is active
    get().connectSocket();
    
    if (socketClient && socketClient.connected) {
      socketClient.emit('message', content);
    } else {
      console.warn('Socket connection inactive, attempting reconnect...');
      setTimeout(() => {
        if (socketClient && socketClient.connected) {
          socketClient.emit('message', content);
        } else {
          // If socket completely offline, provide helpful warning message
          const errorMessage: Message = {
            id: `msg-${Date.now()}-err`,
            sender: 'ai',
            content: 'The AI Buddy service is currently offline or establishing a secure database connection. Please try again in a few moments.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          set((state) => ({
            messages: [...state.messages, errorMessage],
            isAiTyping: false
          }));
        }
      }, 1000);
    }
  },
  
  startNewChat: () => {
    const newId = `chat-${Date.now()}`;
    const newConversations = [
      { id: newId, title: 'New Conversation', date: 'Just now' },
      ...get().conversations
    ];
    set({
      conversations: newConversations,
      activeConversationId: newId,
      messages: DEFAULT_MESSAGES
    });
  },
  
  selectConversation: (id) => {
    set({ activeConversationId: id });
    // Keep standard welcome or history
    set({ messages: DEFAULT_MESSAGES });
  },
  
  clearHistory: () => {
    set({ messages: DEFAULT_MESSAGES, conversations: [] });
  }
}));
