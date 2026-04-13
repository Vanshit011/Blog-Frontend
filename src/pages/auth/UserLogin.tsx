import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { userLogin, getGoogleUserLoginUrl } from '../../services/api';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../common/ErrorMessage';
import FormInput from '../../common/FormInput';
import { decodeJWT } from '../../shared/utils';

const UserLogin = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
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
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/home');
    }
  }, [navigate]);

  const onSubmit = (data: Record<string, string>) => {
    userLogin(data.email, data.password)
      .then((response) => {
        if (response.data.access_token) {
          const token = response.data.access_token;
          localStorage.setItem('access_token', token);
          const decoded = decodeJWT(token);
          if (decoded?.role) {
            localStorage.setItem('user_role', decoded.role);
          }
          navigate('/home');
        }
      })
      .catch((error) => {
        setApiError(
          error.response?.data?.message ||
            error.message ||
            'Login failed. Please try again.'
        );
      });
  };

  const handleGoogleLogin = () => {
    window.location.href = getGoogleUserLoginUrl();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-indigo-50 rounded-full">
            <LogIn className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter your details
          </p>
        </div>

        <ErrorMessage message={apiError || ''} />

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormInput
              label="Email Address"
              id="email"
              type="email"
              ringClassName="focus:ring-indigo-500"
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message as string}
            />
            <FormInput
              label="Password"
              id="password"
              type="password"
              ringClassName="focus:ring-indigo-500"
              {...register('password', { required: 'Password is required' })}
              error={errors.password?.message as string}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-lg shadow-indigo-200"
          >
            Sign In
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-sm"
        >
          <img
            className="w-5 h-5 mr-3"
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
          />
          Sign in with Google
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a
            href="/signup"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
