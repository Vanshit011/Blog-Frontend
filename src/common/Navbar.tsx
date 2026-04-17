import React from 'react';
import {
  LayoutDashboard,
  LogOut,
  ArrowLeft,
  PenLine,
  UserCircle,
  Users,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';
import { useProfileStore } from '../hooks/useProfileStore';
import { useFollowingStore } from '../hooks/useFollowingStore';
import { useLogoutStore } from '../hooks/useLogoutStore';

import NotificationBell from '../components/notifications/NotificationBell';

interface NavbarProps {
  showBack?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showBack }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { onOpen } = useProfileStore();
  const { onOpen: onOpenFollowing } = useFollowingStore();
  const { onOpen: onOpenLogout } = useLogoutStore();
  const { isAuthenticated: isLoggedIn, userRole, user } = useAuthStore();
  const isAdmin = userRole === 'admin';

  const handleLogoClick = () => {
    if (isAdmin) {
      navigate('/admin/blog');
    } else {
      navigate('/home');
    }
  };

  const handleLogout = () => {
    onOpenLogout();
  };

  const isDetailsPage = location.pathname.startsWith('/blog/');

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo & Back button section */}
          <div className="flex items-center gap-6">
            {(showBack || isDetailsPage) && (
              <button
                onClick={() => navigate('/home')}
                className="group flex items-center justify-center w-11 h-11 rounded-2xl bg-gray-50 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 border border-gray-100"
                title="Back to home"
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </button>
            )}

            <div
              onClick={handleLogoClick}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-300">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tightest group-hover:text-indigo-600 transition-colors">
                <span className="text-indigo-600 group-hover:text-gray-900 transition-colors">
                  Blog
                </span>
              </span>
            </div>
          </div>

          {/* Action section */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <NotificationBell />
                <button
                  onClick={onOpenFollowing}
                  className="flex items-center px-4 py-3 rounded-2xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 group"
                >
                  <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Following</span>
                </button>
                <button
                  onClick={onOpen}
                  className="flex items-center px-1.5 py-1.5 rounded-2xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-indigo-50 flex items-center justify-center mr-2 border-2 border-transparent group-hover:border-indigo-100 transition-all">
                    {user?.profile_picture ? (
                      <img 
                        src={user.profile_picture} 
                        alt="Profile" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <UserCircle className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                    )}
                  </div>
                  <span className="font-semibold pr-2">Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 rounded-2xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-300 group"
                >
                  <LogOut className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  <span className="font-semibold">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 text-sm font-bold text-gray-600 hover:text-indigo-600 transition-all hover:bg-gray-50 rounded-2xl"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate('/admin/login')}
                  className="flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all shadow-md shadow-indigo-100 group"
                >
                  <PenLine className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Become a Writer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
