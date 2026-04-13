import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogByID } from '../../services/api';
import { AxiosError } from 'axios';
import type { ErrorResponse, Blog } from '../../shared/constants/types';
import LoadingSpinner from '../../common/LoadingSpinner';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
            <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
            <p className="text-gray-500 mb-4">Slug: {blog.slug}</p>
            <div className="prose max-w-none">{blog.content}</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogDetail;
