import { create } from 'zustand';
import { User, UserState } from '../types';
import { fetchUser } from '../lib/api';

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchCurrentUser: async (discordId: string) => {
    set({ isLoading: true, error: null });
    try {
      const userData = await fetchUser(discordId);
      set({ user: userData, isLoading: false });
    } catch (err: any) {
      console.error('Failed to fetch user:', err);
      set({
        user: null,
        error: err.message || 'Failed to load user data.',
        isLoading: false,
      });
    }
  },

  clearUser: () => {
    set({ user: null, isLoading: false, error: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userId');
    }
  },

  setUser: (user: User | null) => {
    set({ user, isLoading: false, error: null });
  },
}));
