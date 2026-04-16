import { create } from 'zustand';

interface FollowingStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useFollowingStore = create<FollowingStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
