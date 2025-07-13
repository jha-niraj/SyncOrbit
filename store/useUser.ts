import { create } from 'zustand';
import { User } from '@prisma/client';

interface UserState {
    user: Partial<User> | null;
    isLoading: boolean;
    error: string | null;
    setUser: (user: Partial<User> | null) => void;
    updateUser: (updates: Partial<User>) => Promise<void>;
    updateProfileImage: (imageUrl: string) => Promise<void>;
}

export const useUser = create<UserState>((set, get) => ({
    user: null,
    isLoading: false,
    error: null,
    setUser: (user) => set({ user }),
    updateUser: async (updates) => {
        try {
            set({ isLoading: true, error: null });
            const response = await fetch('/api/user/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            const updatedUser = await response.json();
            set({ user: { ...get().user, ...updatedUser } });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to update user' });
        } finally {
            set({ isLoading: false });
        }
    },
    updateProfileImage: async (imageUrl) => {
        try {
            set({ isLoading: true, error: null });
            const response = await fetch('/api/user/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageUrl })
            });

            if (!response.ok) {
                throw new Error('Failed to update profile image');
            }

            const updatedUser = await response.json();
            set({ user: { ...get().user, image: updatedUser.image } });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to update profile image' });
        } finally {
            set({ isLoading: false });
        }
    }
})); 