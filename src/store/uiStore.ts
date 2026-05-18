import { create } from 'zustand';
import type { AppNotification } from '../data/mock/notificationsData';
import { initialNotifications } from '../data/mock/notificationsData';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

interface UIState {
  sidebarOpen: boolean;
  activeModal: string | null;
  showTour: boolean;
  showDoctorExport: boolean;
  chatOpen: boolean;
  chatHistory: ChatMessage[];
  theme: 'light' | 'dark' | 'system';
  notifications: AppNotification[];
  notifOpen: boolean;
  unreadCount: number;
  setSidebarOpen: (open: boolean) => void;
  setActiveModal: (modal: string | null) => void;
  setShowTour: (show: boolean) => void;
  setShowDoctorExport: (show: boolean) => void;
  setChatOpen: (open: boolean) => void;
  addChatMessage: (role: 'user' | 'ai', text: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setNotifOpen: (open: boolean) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeModal: null,
  showTour: true,
  showDoctorExport: false,
  chatOpen: false,
  chatHistory: [],
  theme: 'light',
  notifications: initialNotifications,
  notifOpen: false,
  unreadCount: initialNotifications.filter((n) => !n.read).length,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  setShowTour: (show) => set({ showTour: show }),
  setShowDoctorExport: (show) => set({ showDoctorExport: show }),
  setChatOpen: (open) => set({ chatOpen: open }),
  addChatMessage: (role, text) =>
    set((state) => ({
      chatHistory: [
        ...state.chatHistory,
        { id: Date.now().toString(), role, text },
      ],
    })),
  setTheme: (theme) => {
    set({ theme });
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  },
  setNotifOpen: (open) => set({ notifOpen: open }),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  markRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    }),
}));
