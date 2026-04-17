import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { getMyProfile, updateProfile } from '../../services/api';
import { UserCircle, Save } from 'lucide-react';
import { toast } from 'sonner';
import FormInput from '../../common/FormInput';
import Navbar from '../../common/Navbar';
import LoadingSpinner from '../../common/LoadingSpinner';

interface ProfileFormData {
  first_name: string;
  last_name: string;
  display_name: string;
  user_name: string;
  about: string;
}

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userId, setUserId] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>();

  const fetchProfile = useCallback(async () => {
    try {
      const response = await getMyProfile();
      const userData = response.data;
      setUserId(userData.id);
      reset({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        display_name: userData.display_name || '',
        user_name: userData.user_name || '',
        about: userData.about || '',
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onSubmit = async (data: ProfileFormData) => {
    setUpdating(true);
    try {
      await updateProfile(userId, data);
      toast.success('Profile updated successfully');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-indigo-50 overflow-hidden">
          {/* Header Section */}
          <div className="relative h-48 bg-gradient-to-r from-indigo-600 to-violet-600">
            <div className="absolute -bottom-16 left-8 p-1 bg-white rounded-3xl shadow-lg">
              <div className="w-32 h-32 bg-indigo-50 rounded-2xl flex items-center justify-center border-4 border-white">
                <UserCircle className="w-20 h-20 text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="pt-20 pb-12 px-8">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  Your Profile
                </h1>
                <p className="text-gray-500 mt-1">
                  Manage your public information and personal details.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="First Name"
                  id="first_name"
                  {...register('first_name', {
                    required: 'First name is required',
                  })}
                  error={errors.first_name?.message}
                  placeholder="John"
                  className="space-y-2"
                />

                <FormInput
                  label="Last Name"
                  id="last_name"
                  {...register('last_name', {
                    required: 'Last name is required',
                  })}
                  error={errors.last_name?.message}
                  placeholder="Doe"
                  className="space-y-2"
                />

                <FormInput
                  label="Username"
                  id="user_name"
                  {...register('user_name', {
                    required: 'Username is required',
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message:
                        'Username can only contain letters, numbers, and underscores',
                    },
                  })}
                  error={errors.user_name?.message}
                  placeholder="johndoe"
                  className="space-y-2"
                />

                <FormInput
                  label="Display Name"
                  id="display_name"
                  {...register('display_name')}
                  placeholder="John D."
                  className="space-y-2"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="about"
                  className="block text-sm font-semibold text-gray-700"
                >
                  About
                </label>
                <textarea
                  id="about"
                  {...register('about')}
                  rows={4}
                  className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                  placeholder="Write a short bio about yourself..."
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {updating ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                  ) : (
                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                  {updating ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
