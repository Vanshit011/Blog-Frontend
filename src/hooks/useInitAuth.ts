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
        }
      }
    };

    if (initialized) {
      fetchUser();
    }
  }, [isAuthenticated, token, setUser, initialized]);
};
