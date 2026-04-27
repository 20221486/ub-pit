import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            currentUser: null,
            loginSession: (user) => set({ currentUser: user }),
            logoutSession: () => set({ currentUser: null }),
            updateSessionProfile: (data) => set((state) => ({
                currentUser: state.currentUser ? { ...state.currentUser, ...data } : null
            }))
        }),
        {
            name: 'auth-storage'
        }
    )
);
