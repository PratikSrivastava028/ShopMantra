import { create } from 'zustand';
import { User } from '../types';
import { api } from '../services/apiClient';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: 'customer' | 'seller') => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const mapBackendUser = (backendUser: any): User => {
  if (!backendUser) return {} as User;
  
  // Map backend 'user' role to frontend 'customer'
  const role = backendUser.role === 'seller' ? 'seller' : 'customer';
  
  // Format standard fullName
  const name = backendUser.fullName 
    ? `${backendUser.fullName.firstName || ''} ${backendUser.fullName.lastName || ''}`.trim()
    : backendUser.username || backendUser.email;
    
  return {
    id: backendUser.id || backendUser._id || '',
    name: name || 'Valued Customer',
    email: backendUser.email || '',
    avatar: role === 'seller' 
      ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: role,
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start in loading state until first check completes
  error: null,

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.auth.getMe();
      if (response && response.user) {
        const mapped = mapBackendUser(response.user);
        set({ user: mapped, isAuthenticated: true, isLoading: false });
        localStorage.setItem('shopmantra_auth', JSON.stringify(mapped));
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
        localStorage.removeItem('shopmantra_auth');
      }
    } catch {
      // Offline or unauthenticated
      set({ user: null, isAuthenticated: false, isLoading: false });
      localStorage.removeItem('shopmantra_auth');
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.auth.login({ email, password });
      if (response && response.user) {
        const mapped = mapBackendUser(response.user);
        set({ user: mapped, isAuthenticated: true, isLoading: false });
        localStorage.setItem('shopmantra_auth', JSON.stringify(mapped));
        return true;
      }
      set({ error: 'Failed to retrieve login session data.', isLoading: false });
      return false;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Invalid email or password';
      set({ error: errMsg, isLoading: false });
      return false;
    }
  },

  signup: async (name, email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      // Split full name into firstName and lastName
      const parts = name.trim().split(/\s+/);
      const firstName = parts[0] || 'User';
      const lastName = parts.slice(1).join(' ') || 'Name';
      
      // Auto generate a unique username from email
      const username = email.split('@')[0] + Math.floor(100 + Math.random() * 900);
      
      // Send backend registration payload
      const backendRole = role === 'seller' ? 'seller' : 'user';
      
      const response = await api.auth.register({
        username,
        email,
        password,
        fullName: {
          firstName,
          lastName,
        },
        role: backendRole,
      });

      if (response && response.user) {
        const mapped = mapBackendUser(response.user);
        set({ user: mapped, isAuthenticated: true, isLoading: false });
        localStorage.setItem('shopmantra_auth', JSON.stringify(mapped));
        return true;
      }
      set({ error: 'Failed to complete registration.', isLoading: false });
      return false;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Email or username already exists';
      set({ error: errMsg, isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await api.auth.logout();
    } catch (e) {
      console.warn('Network issue during logout request.', e);
    }
    localStorage.removeItem('shopmantra_auth');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  clearError: () => set({ error: null }),
}));
