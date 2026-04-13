import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogByID } from '../../services/api';
import { AxiosError } from 'axios';
import type { ErrorResponse, Blog } from '../../shared/constants/types';
import LoadingSpinner from '../../common/LoadingSpinner';
import { toast } from 'sonner';
import { Share2 } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (id) {
          const response = await getBlogByID(id);
          setBlog(response.data);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || 'Failed to fetch blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading)
    return (
      <LoadingSpinner className="p-12 w-full flex justify-center items-center h-screen" />
    );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-8">
        {blog && (
          <div className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{blog.title}</h1>
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer font-medium"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Link
              </button>
            </div>
            <p className="text-gray-500 mb-6">Slug: {blog.slug}</p>
            <div 
              className="prose max-w-none prose-indigo"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogDetail;
