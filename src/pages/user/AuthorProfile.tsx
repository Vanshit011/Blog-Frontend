import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getPublicProfile,
  getAuthorBlogs,
  followAuthor,
  unfollowAuthor,
  getFollowStats,
} from '../../services/api';
import {
  UserCircle,
  Calendar,
  BookOpen,
  ChevronRight,
  UserPlus,
  UserMinus,
  Users,
  Lock,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../../common/Navbar';
import BlogCard from '../../common/BlogCard';
import LoadingSpinner from '../../common/LoadingSpinner';
import type { Blog, FollowStats } from '../../shared/constants/types';
import * as Dialog from '@radix-ui/react-dialog';
import { useAuthStore } from '../../hooks/useAuthStore';

interface AuthorData {
  id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  username: string;
  about: string;
  created_at: string;
}

const AuthorProfile = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const [author, setAuthor] = useState<AuthorData | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<FollowStats>({
    followersCount: 0,
    followingCount: 0,
    isFollowing: false,
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);

  const { token, isAuthenticated } = useAuthStore();

  const currentUserId = useMemo(() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub ?? payload.id ?? null;
    } catch {
      return null;
    }
  }, [token]);

  const isOwnProfile = author?.id === currentUserId;

  const fetchAuthorData = useCallback(async () => {
    if (!identifier) return;
    try {
      setLoading(true);
      const [profileRes, blogsRes] = await Promise.all([
        getPublicProfile(identifier),
        getAuthorBlogs(identifier),
      ]);

      const authorData = profileRes.data;
      setAuthor(authorData);
      setBlogs(blogsRes.data.data);

      const statsRes = await getFollowStats(authorData.id);
      setStats(statsRes.data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err.response?.data?.message || 'Failed to load author profile'
      );
    } finally {
      setLoading(false);
    }
  }, [identifier]);

  useEffect(() => {
    fetchAuthorData();
  }, [fetchAuthorData, token, isAuthenticated]);

  const handleFollowToggle = async () => {
    if (!token) {
      toast.info('Please log in to follow authors');
      return;
    }
    if (!author) return;

    try {
      setActionLoading(true);
      if (stats.isFollowing) {
        await unfollowAuthor(author.id);
        setStats((prev) => ({
          ...prev,
          isFollowing: false,
          followersCount: Math.max(0, prev.followersCount - 1),
        }));
        toast.success(`Unfollowed ${author.display_name || author.first_name}`);
      } else {
        await followAuthor(author.id);
        setStats((prev) => ({
          ...prev,
          isFollowing: true,
          followersCount: prev.followersCount + 1,
        }));
        toast.success(`Following ${author.display_name || author.first_name}`);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!author)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Navbar />
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
            <UserCircle className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Author not found</h2>
          <Link
            to="/home"
            className="text-indigo-600 font-semibold hover:underline flex items-center justify-center gap-1"
          >
            Return Home <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-indigo-50 rounded-3xl flex items-center justify-center border-4 border-white shadow-xl shadow-indigo-100">
                <UserCircle className="w-20 h-20 md:w-24 md:h-24 text-indigo-400" />
              </div>
            </div>

            <div className="flex-1 space-y-6 pt-4">
              <div>
                <h1 className="text-4xl font-black text-gray-900 mb-2">
                  {author.display_name ||
                    `${author.first_name} ${author.last_name}`}
                </h1>
                <p className="text-indigo-600 font-bold tracking-wide flex items-center justify-center md:justify-start gap-2">
                  @{author.username}
                </p>
              </div>

              {author.about && (
                <p className="max-w-2xl text-lg text-gray-600 leading-relaxed italic">
                  "{author.about}"
                </p>
              )}

              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-semibold text-gray-500">
                <div
                  onClick={() => setIsFollowersModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group/stat"
                >
                  <Users className="w-5 h-5 text-indigo-500 group-hover/stat:scale-110 transition-transform" />
                  <span className="text-gray-900 font-bold">
                    {stats.followersCount}
                  </span>
                  <span className="text-gray-500">Followers</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  Joined{' '}
                  {new Date(author.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  {blogs.length} Published Articles
                </div>
              </div>

              {!isOwnProfile && (
                <div className="pt-2">
                  <button
                    onClick={handleFollowToggle}
                    disabled={actionLoading}
                    className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold transition-all duration-300 transform active:scale-95 shadow-xl ${
                      stats.isFollowing
                        ? 'bg-white text-gray-700 border-2 border-gray-100 hover:border-red-100 hover:text-red-600 shadow-gray-200/20'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200/50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {actionLoading ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : stats.isFollowing ? (
                      <>
                        <UserMinus className="w-5 h-5" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        Follow
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Author's Blogs */}
      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black text-gray-900">Latest Articles</h2>
        </div>

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-500 text-lg">
              This author hasn't published any articles yet.
            </p>
          </div>
        )}
      </main>

      {/* Followers Lock Modal */}
      <Dialog.Root
        open={isFollowersModalOpen}
        onOpenChange={setIsFollowersModalOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl z-[101] border border-indigo-50 animate-in zoom-in-95 duration-300 outline-none overflow-hidden p-10 text-center">
            <button
              onClick={() => setIsFollowersModalOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {!token ? (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-8 transform hover:scale-110 transition-transform duration-500">
                  <Lock className="w-10 h-10" />
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
                  Members Only Access
                </h3>

                <p className="text-gray-500 mb-10 text-lg leading-relaxed">
                  Sign in to see who is following this author and connect with
                  the community.
                </p>

                <Link
                  to="/login"
                  className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:bg-indigo-700 transition-all transform hover:-translate-y-1 text-center text-lg"
                >
                  Sign In to View
                </Link>

                <p className="mt-6 text-sm text-gray-400 font-semibold">
                  New here?{' '}
                  <Link
                    to="/register"
                    className="text-indigo-600 hover:underline"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center py-10">
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-8">
                  <Users className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  Following List
                </h3>
                <p className="text-gray-500 font-medium">
                  Coming soon for members!
                </p>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default AuthorProfile;
