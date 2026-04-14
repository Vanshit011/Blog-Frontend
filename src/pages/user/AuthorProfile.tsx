import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicProfile, getAuthorBlogs } from '../../services/api';
import { UserCircle, Calendar, BookOpen, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../../common/Navbar';
import BlogCard from '../../common/BlogCard';
import LoadingSpinner from '../../common/LoadingSpinner';
import type { Blog } from '../../shared/constants/types';

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

  const fetchAuthorData = useCallback(async () => {
    if (!identifier) return;
    try {
      setLoading(true);
      const [profileRes, blogsRes] = await Promise.all([
        getPublicProfile(identifier),
        getAuthorBlogs(identifier)
      ]);
      setAuthor(profileRes.data);
      setBlogs(blogsRes.data.data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to load author profile');
    } finally {
      setLoading(false);
    }
  }, [identifier]);

  useEffect(() => {
    fetchAuthorData();
  }, [fetchAuthorData]);

  if (loading) return <LoadingSpinner />;
  if (!author) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Navbar />
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
          <UserCircle className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Author not found</h2>
        <Link to="/home" className="text-indigo-600 font-semibold hover:underline flex items-center justify-center gap-1">
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
                  {author.display_name || `${author.first_name} ${author.last_name}`}
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
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  Joined {new Date(author.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  {blogs.length} Published Articles
                </div>
              </div>
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
            <p className="text-gray-500 text-lg">This author hasn't published any articles yet.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AuthorProfile;
