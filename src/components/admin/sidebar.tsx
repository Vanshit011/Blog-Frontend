import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Users } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Blogs', path: '/admin/blog', icon: <FileText size={20} /> },
    { name: 'Followers', path: '/admin/followers', icon: <Users size={20} /> },
    {
      name: 'Categories',
      path: '/admin/categories',
      icon: <Users size={20} />,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col flex-shrink-0 h-full shadow-sm">
      <div className="px-4 py-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
          Admin Panel
        </h2>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/admin/blog' &&
                location.pathname.startsWith(item.path));
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path!)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium text-sm ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 text-left'
                }`}
              >
                <span
                  className={`${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`}
                >
                  {item.icon}
                </span>
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
