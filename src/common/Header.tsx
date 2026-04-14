import { ShieldCheck, LogOut, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../hooks/useProfileStore';

const Header = () => {
  const navigate = useNavigate();
  const { onOpen } = useProfileStore();
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/home');
  };

  return (
    <div>
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Admin Portal Blog
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onOpen}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                <UserCircle className="w-4 h-4 mr-2" />
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
