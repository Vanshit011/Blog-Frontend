import { LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicBlogView from './PublicBlogView';

const Home = () => {
  const navigate = useNavigate();

  const handleUserSignIn = () => {
    navigate('/login');
  };

  const handleSignin = () => {
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Blog</span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleUserSignIn}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={handleSignin}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Become a Writer
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <PublicBlogView />
      </main>
    </div>
  );
};

export default Home;
