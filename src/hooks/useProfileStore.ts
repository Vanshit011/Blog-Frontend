import { create } from 'zustand';

interface ProfileStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
