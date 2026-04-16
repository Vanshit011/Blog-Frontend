import { create } from 'zustand';

interface LogoutStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useLogoutStore = create<LogoutStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
