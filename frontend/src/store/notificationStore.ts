import { create } from 'zustand';
import { Notification, NotificationType } from '../types';
import { api } from '../services/apiClient';

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  activeFilter: 'All' | NotificationType;
  
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  setActiveFilter: (filter: 'All' | NotificationType) => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  isLoading: false,
  activeFilter: 'All',

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const notifications = await api.notifications.getAll();
      set({ notifications, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
  
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },
  
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },
  
  deleteNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  
  setActiveFilter: (filter) => {
    set({ activeFilter: filter });
  },
  
  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  },
}));
