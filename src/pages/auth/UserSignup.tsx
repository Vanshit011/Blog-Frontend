import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { userSignup, getGoogleUserLoginUrl } from '../../services/api';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../common/ErrorMessage';
import FormInput from '../../common/FormInput';

const UserSignup = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigation = useNavigate();

  const onSubmit = (data: Record<string, string>) => {
    userSignup(data.email, data.password, data.firstName, data.lastName)
      .then((response) => {
        console.log('Signup successful:', response.data);
        navigation('/login');
      })
      .catch((error) => {
        setApiError(
          error.response?.data?.message ||
            error.message ||
            'Signup failed. Please try again.'
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
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-emerald-50 rounded-full">
            <UserPlus className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">Join our community today</p>
        </div>

        <ErrorMessage message={apiError || ''} />

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                id="firstName"
                type="text"
                ringClassName="focus:ring-emerald-500"
                {...register('firstName', {
                  required: 'First Name is required',
                })}
                error={errors.firstName?.message as string}
              />
              <FormInput
                label="Last Name"
                id="lastName"
                type="text"
                ringClassName="focus:ring-emerald-500"
                {...register('lastName', {
                  required: 'Last Name is required',
                })}
                error={errors.lastName?.message as string}
              />
            </div>
            <FormInput
              label="Email Address"
              id="email"
              type="email"
              ringClassName="focus:ring-emerald-500"
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message as string}
            />
            <FormInput
              label="Password"
              id="password"
              type="password"
              ringClassName="focus:ring-emerald-500"
              {...register('password', { required: 'Password is required' })}
              error={errors.password?.message as string}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors shadow-lg shadow-emerald-200"
          >
            Create Account
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or sign up with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-sm"
        >
          <img
            className="w-5 h-5 mr-3"
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
          />
          Sign up with Google
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a
            href="/login"
            className="font-semibold text-emerald-600 hover:text-emerald-500"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
