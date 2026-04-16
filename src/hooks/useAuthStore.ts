import { create } from 'zustand';
import { decodeJWT } from '../shared/utils';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'user';
}

interface AuthState {
  token: string | null;
  user: User | null;
  userRole: 'admin' | 'user' | null;
  isAuthenticated: boolean;
  initialized: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('access_token'),
  user: null, 
  userRole: localStorage.getItem('user_role') as 'admin' | 'user' | null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  initialized: false,

  login: (token: string) => {
    const decoded = decodeJWT(token);
    const role = decoded?.role || 'user';
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_role', role);
    set({
      token,
      userRole: role,
      isAuthenticated: true,
      initialized: true,
    });
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    set({
      token: null,
      userRole: null,
      user: null,
      isAuthenticated: false,
      initialized: true,
    });
  },
}));

// Initialize store from localStorage immediately
const token = localStorage.getItem('access_token');
if (token) {
  useAuthStore.setState({
    token,
    userRole: localStorage.getItem('user_role') as 'admin' | 'user' | null,
    isAuthenticated: true,
    initialized: true,
  });
} else {
  useAuthStore.setState({ initialized: true });
}
