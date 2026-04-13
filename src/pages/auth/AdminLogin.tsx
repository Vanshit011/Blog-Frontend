import { useEffect } from 'react';
import { getGoogleAdminLoginUrl } from '../../services/api';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { decodeJWT } from '../../shared/utils';

const AdminLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('access_token', token);
      const decoded = decodeJWT(token);
      if (decoded?.role) {
        localStorage.setItem('user_role', decoded.role);
      }
      console.log('Admin Login successful via Google');
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleGoogleLogin = () => {
    window.location.href = getGoogleAdminLoginUrl();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-50 rounded-full">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">Access your dashboard</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm"
        >
          <img
            className="w-5 h-5 mr-3"
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
