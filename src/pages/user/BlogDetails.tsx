import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getBlogByID,
  getComments,
  getRecommendedBlogs,
} from '../../services/api';
import { User as UserIcon, Calendar, Share2, Clock } from 'lucide-react';
import type { Blog, Comment } from '../../shared/constants/types';
import { calculateReadTime, stripHtml } from '../../shared/utils';
import LoadingSpinner from '../../common/LoadingSpinner';
import Navbar from '../../common/Navbar';
import { toast } from 'sonner';
import CommentsSection from '../../components/blog/CommentsSection';
import LikeSection from '../../components/blog/LikeSection';

import { useAuthStore } from '../../hooks/useAuthStore';
import BlogCard from '../../common/BlogCard';

const BlogDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [recommendedBlogs, setRecommendedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState<Comment[]>([]);

  const { token, isAuthenticated } = useAuthStore();

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

  const extractCategoryId = (blogData: Blog): string | undefined => {
    if (blogData.categoryId) return blogData.categoryId;
    if (blogData.category?.id) return blogData.category.id;

    const rawBlog = blogData as Blog & {
      category_id?: string;
      category?: { id?: string };
    };

    return rawBlog.category_id || rawBlog.category?.id;
  };

  const normalizeRecommendedBlogs = (payload: unknown): Blog[] => {
    if (Array.isArray(payload)) return payload as Blog[];

    if (payload && typeof payload === 'object') {
      const record = payload as { data?: unknown };
      if (Array.isArray(record.data)) return record.data as Blog[];
    }

    return [];
  };

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const blogRes = await getBlogByID(id);
        const blogData = blogRes.data as Blog;
        setBlog(blogData);

        try {
          const recommendedRes = await getRecommendedBlogs(
            extractCategoryId(blogData)
          );
          const blogs = normalizeRecommendedBlogs(recommendedRes.data).filter(
            (recommendedBlog) => recommendedBlog.id !== id
          );
          setRecommendedBlogs(blogs);
        } catch (err) {
          console.error('Error fetching recommended blogs:', err);
          setRecommendedBlogs([]);
        }

        if (isAuthenticated) {
          try {
            const commentsRes = await getComments(id);
            const raw = commentsRes.data;
            setComments(Array.isArray(raw) ? raw : (raw?.data ?? []));
          } catch (err) {
            console.error('Error fetching comments:', err);
          }
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        setRecommendedBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id, isAuthenticated]);

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
                    <div
                      className="flex items-center cursor-pointer hover:text-indigo-600 transition-colors"
                      onClick={() => navigate(`/author/${blog.author?.id}`)}
                    >
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

              {/* {isAuthenticated ? (
                <div
                  className="prose prose-indigo max-w-none prose-lg text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              ) : (
                <div className="relative">
                 
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent flex flex-col items-center justify-end pb-1 mt-110">
                    <div className="bg-white rounded-[2rem] p-10 text-center border border-gray-100 shadow-2xl shadow-indigo-100/50 max-w-lg w-full relative group/cta">
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />

                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 mb-8 transform group-hover/cta:scale-110 transition-transform duration-500">
                        <Lock className="w-10 h-10" />
                      </div>

                      <h3 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Login to Read Full Article
                      </h3>

                      <p className="text-gray-500 mb-10 text-lg leading-relaxed">
                        Join our community to access this story and many more
                        insightful articles.
                      </p>

                      <Link
                        to="/login"
                        className="inline-flex items-center justify-center w-full px-8 py-5 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-1"
                      >
                        Sign In to Continue
                      </Link>

                      <p className="mt-6 text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link
                          to="/register"
                          className="text-indigo-600 font-bold hover:underline"
                        >
                          Create one
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              )} */}
              <div
                className="prose prose-indigo max-w-none prose-lg text-gray-700 leading-relaxed overflow-hidden max-h-[200px] mb-50 select-none pointer-events-none"
                dangerouslySetInnerHTML={{
                  __html: stripHtml(blog.content).substring(0, 300) + '...',
                }}
              />
            </article>
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center gap-4">
              <LikeSection
                blogId={blog.id}
                userId={currentUserId}
                token={token}
                initialLikes={blog.likeCount}
                initialIsLiked={blog.isLiked}
              />
            </div>

            <CommentsSection
              blogId={blog.id}
              initialComments={comments}
              currentUserId={currentUserId}
              isAuthenticated={isAuthenticated}
              onAuthRequired={handleAuthRequired}
            />

            {recommendedBlogs.length > 0 && (
              <section className="mt-16 border-t border-gray-100 pt-12">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Recommended Blogs
                  </h2>
                  <p className="mt-2 text-gray-500">
                    Related articles you may want to read next.
                  </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  {recommendedBlogs.slice(0, 4).map((recommendedBlog) => (
                    <BlogCard key={recommendedBlog.id} blog={recommendedBlog} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default BlogDetails;
