import { useEffect, useState, useCallback } from 'react';
import { getMyFollowing } from '../../services/api';
import { UserCircle, X, Users, UserMinus, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useFollowingStore } from '../../hooks/useFollowingStore';
import * as Dialog from '@radix-ui/react-dialog';
import { Link } from 'react-router-dom';

interface FollowedAuthor {
  id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  username: string;
  followed_at: string;
}

const FollowingModal = () => {
  const { isOpen, onClose } = useFollowingStore();
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState<FollowedAuthor[]>([]);

  const isAuthenticated = !!localStorage.getItem('access_token');

  const fetchFollowing = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMyFollowing();
      setFollowing(response.data.following || []);
    } catch {
      toast.error('Failed to load following list');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchFollowing();
    }
  }, [isOpen, fetchFollowing, isAuthenticated]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[80vh] flex flex-col bg-white rounded-[2rem] shadow-2xl z-[101] border border-indigo-50 animate-in zoom-in-95 duration-300 outline-none overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-xl font-black text-gray-900 leading-none">
                  Following
                </Dialog.Title>
                <Dialog.Description className="text-gray-500 mt-1 text-xs font-semibold">
                  Authors you're currently following
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-all outline-none">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {!isAuthenticated ? (
              <div className="py-12 px-6 flex flex-col items-center justify-center text-center h-full">
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-6 transform hover:scale-110 transition-transform duration-500">
                  <Lock className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                  Members Only Access
                </h3>
                <p className="text-gray-500 mb-8 max-w-[280px] leading-relaxed font-medium">
                  Sign in to see who you're following and manage your reading list.
                </p>
                <Link
                  to="/login"
                  onClick={onClose}
                  className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:bg-indigo-700 transition-all transform hover:-translate-y-1 text-center"
                >
                  Sign In to View
                </Link>
                <p className="mt-6 text-sm text-gray-400 font-semibold">
                  New here?{' '}
                  <Link
                    to="/register"
                    onClick={onClose}
                    className="text-indigo-600 hover:underline"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            ) : loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="text-sm font-bold text-gray-400">
                  Loading authors...
                </p>
              </div>
            ) : following.length > 0 ? (
              <div className="space-y-2">
                {following.map((author) => (
                  <div
                    key={author.id}
                    className="group flex items-center justify-between p-4 rounded-3xl border border-transparent hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-400 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        <UserCircle className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 leading-none mb-1 group-hover:text-indigo-600 transition-colors">
                          {author.display_name ||
                            `${author.first_name} ${author.last_name}`}
                        </h4>
                        <p className="text-xs text-gray-400 font-semibold italic">
                          @{author.username}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4">
                  <UserMinus className="w-8 h-8 text-gray-200" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Not following anyone yet
                </h3>
                <p className="text-gray-400 text-sm max-w-[200px] mx-auto">
                  Find interesting authors to follow and see their latest
                  articles here.
                </p>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50/50 border-t border-gray-50">
            <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">
              Total Following: {following.length}
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default FollowingModal;
