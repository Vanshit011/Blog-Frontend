import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogByID, getComments } from '../../services/api';
import { User as UserIcon, Calendar, Share2, Clock } from 'lucide-react';
import type { Blog, Comment } from '../../shared/constants/types';
import { calculateReadTime } from '../../shared/utils';
import LoadingSpinner from '../../common/LoadingSpinner';
import Navbar from '../../common/Navbar';
import { toast } from 'sonner';
import CommentsSection from '../../components/blog/CommentsSection';
import LikeSection from '../../components/blog/LikeSection';

const BlogDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState<Comment[]>([]);

  const token = localStorage.getItem('access_token');
  const isAuthenticated = !!token;

  const getCurrentUserId = (): string | null => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub ?? payload.id ?? null;
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleAuthRequired = () => {
    toast.info('Please sign in to interact with this post.');
    navigate('/login');
  };

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [blogRes, commentsRes] = await Promise.all([
          getBlogByID(id),
          getComments(id),
        ]);

        setBlog(blogRes.data);

        const raw = commentsRes.data;
        setComments(Array.isArray(raw) ? raw : (raw?.data ?? []));
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  return (
    <div className="bg-white min-h-screen">
      <Navbar showBack />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <LoadingSpinner className="flex justify-center items-center h-64" />
        ) : !blog ? (
          <div className="text-center py-20 text-gray-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Blog not found
            </h2>
          </div>
        ) : (
          <>
            <article>
              <header className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold mb-6">{blog.title}</h1>

                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(
                      blog.created_at || Date.now()
                    ).toLocaleDateString()}
                  </div>

                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {calculateReadTime(blog.content)}
                  </div>

                  {blog.author && (
                    <div className="flex items-center">
                      <UserIcon className="w-4 h-4 mr-2" />
                      {blog.author.first_name} {blog.author.last_name}
                    </div>
                  )}

                  <button onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                </div>
              </header>

              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </article>
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center gap-4">
              <LikeSection
                blogId={blog.id}
                userId={currentUserId}
                token={token}
              />
            </div>

            <CommentsSection
              blogId={blog.id}
              initialComments={comments}
              currentUserId={currentUserId}
              isAuthenticated={isAuthenticated}
              onAuthRequired={handleAuthRequired}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default BlogDetails;
