import { useEffect } from 'react';
import { useAuthStore } from './useAuthStore';
import { getMyProfile } from '../services/api';

export const useInitAuth = () => {
  const { token, isAuthenticated, setUser, initialized } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated && token) {
        try {
          const response = await getMyProfile();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // If profile fetch fails, we might want to logout if it's a 401
          // but for now we'll just log it.
        }
      }
    };

    if (initialized) {
      fetchUser();
    }
  }, [isAuthenticated, token, setUser, initialized]);
};
