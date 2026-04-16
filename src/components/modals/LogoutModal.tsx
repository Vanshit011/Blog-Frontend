import { useState } from 'react';
import { LogOut, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useLogoutStore } from '../../hooks/useLogoutStore';
import * as Dialog from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router-dom';

const LogoutModal = () => {
  const { isOpen, onClose } = useLogoutStore();
  const { logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    try {
      logout();
      toast.success('Signed out successfully');
      onClose();
      navigate('/home');
    } catch {
      toast.error('Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && !isLoggingOut && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[101] border border-red-50 animate-in zoom-in-95 duration-300 outline-none">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <Dialog.Close asChild>
                <button 
                  disabled={isLoggingOut}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all outline-none disabled:opacity-30"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="mb-8">
              <Dialog.Title className="text-2xl font-black text-gray-900 leading-none">
                Sign Out?
              </Dialog.Title>
              <Dialog.Description className="text-gray-500 mt-3 text-base">
                Are you sure you want to sign out of your account? You'll need to sign in again to access your profile and write blogs.
              </Dialog.Description>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Dialog.Close asChild>
                <button
                  disabled={isLoggingOut}
                  className="flex-1 px-6 py-4 font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-2xl transition-all disabled:opacity-50"
                >
                  Stay Logged In
                </button>
              </Dialog.Close>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all shadow-lg shadow-red-100 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoggingOut ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                ) : (
                  <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
                {isLoggingOut ? 'Signing out...' : 'Sign Out Now'}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default LogoutModal;
