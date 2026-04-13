import React from 'react';
import { LayoutDashboard, LogOut, ArrowLeft, PenLine } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  showBack?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showBack }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    navigate('/home');
    window.location.reload();
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
              onClick={() => navigate('/home')}
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
