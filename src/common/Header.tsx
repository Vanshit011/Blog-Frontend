import { ShieldCheck, LogOut, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../hooks/useProfileStore';
import NotificationBell from '../components/notifications/NotificationBell';
import { useLogoutStore } from '../hooks/useLogoutStore';
import { useAuthStore } from '../hooks/useAuthStore';

const Header = () => {
  const navigate = useNavigate();
  const { onOpen: onOpenProfile } = useProfileStore();
  const { onOpen: onOpenLogout } = useLogoutStore();
  const { user } = useAuthStore();

  const handleLogout = () => {
    onOpenLogout();
  };

  return (
    <div>
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate('/admin/blog')}
            >
              <ShieldCheck className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-all" />
              <span className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                Admin Portal Blog
              </span>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <button
                onClick={onOpenProfile}
                className="inline-flex items-center pl-1.5 pr-4 py-1.5 border border-transparent text-sm font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                <div className="w-8 h-8 rounded-md overflow-hidden bg-slate-200 flex items-center justify-center mr-2">
                  {user?.profile_picture ? (
                    <img 
                      src={user.profile_picture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
