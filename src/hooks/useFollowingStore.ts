import { create } from 'zustand';

interface FollowedAuthor {
  id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  username: string;
  followed_at: string;
}

interface FollowingStore {
  isOpen: boolean;
  following: FollowedAuthor[];
  onOpen: () => void;
  onClose: () => void;
  setFollowing: (following: FollowedAuthor[]) => void;
}

export const useFollowingStore = create<FollowingStore>((set) => ({
  isOpen: false,
  following: [],
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setFollowing: (following) => set({ following }),
}));
