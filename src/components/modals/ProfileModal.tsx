import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { getMyProfile, updateProfile } from '../../services/api';
import { UserCircle, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import FormInput from '../../common/FormInput';
import LoadingSpinner from '../../common/LoadingSpinner';
import { useProfileStore } from '../../hooks/useProfileStore';
import * as Dialog from '@radix-ui/react-dialog';

interface ProfileFormData {
  first_name: string;
  last_name: string;
  display_name: string;
  username: string;
  about: string;
}

const ProfileModal = () => {
  const { isOpen, onClose } = useProfileStore();
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
      setLoading(true);
      const response = await getMyProfile();
      const userData = response.data;
      setUserId(userData.id);
      reset({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        display_name: userData.display_name || '',
        username: userData.username || '',
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
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen, fetchProfile]);

  const onSubmit = async (data: ProfileFormData) => {
    setUpdating(true);
    try {
      await updateProfile(userId, data);
      toast.success('Profile updated successfully');
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-[101] border border-indigo-50 animate-in zoom-in-95 duration-300 outline-none">
          {/* Header Section */}
          <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-violet-600">
            <Dialog.Close className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors backdrop-blur-md outline-none">
              <X className="w-5 h-5" />
            </Dialog.Close>
            <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-2xl shadow-lg">
              <div className="w-24 h-24 bg-indigo-50 rounded-xl flex items-center justify-center border-4 border-white">
                <UserCircle className="w-16 h-16 text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="pt-16 pb-10 px-8">
            <div className="mb-8">
              <Dialog.Title className="text-2xl font-black text-gray-900 leading-none">
                Edit Profile
              </Dialog.Title>
              <Dialog.Description className="text-gray-500 mt-2 text-sm">
                Update your public information and metadata.
              </Dialog.Description>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormInput
                    label="First Name"
                    id="first_name"
                    {...register('first_name', {
                      required: 'First name is required',
                    })}
                    error={errors.first_name?.message}
                    placeholder="John"
                  />

                  <FormInput
                    label="Last Name"
                    id="last_name"
                    {...register('last_name', {
                      required: 'Last name is required',
                    })}
                    error={errors.last_name?.message}
                    placeholder="Doe"
                  />

                  <FormInput
                    label="Username"
                    id="username"
                    {...register('username', {
                      required: 'Username is required',
                      pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message: 'Letters, numbers, and underscores only',
                      },
                    })}
                    error={errors.username?.message}
                    placeholder="johndoe"
                  />

                  <FormInput
                    label="Display Name"
                    id="display_name"
                    {...register('display_name')}
                    placeholder="John D."
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
                    rows={3}
                    className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none bg-gray-50/50"
                    placeholder="Write a short bio about yourself..."
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="px-6 py-3 font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {updating ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    ) : (
                      <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ProfileModal;
