import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogByID } from '../../services/api';
import { User as UserIcon, Calendar } from 'lucide-react';
import type { Blog } from '../../shared/constants/types';
import LoadingSpinner from '../../common/LoadingSpinner';
import Navbar from '../../common/Navbar';

const BlogDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      try {
        const response = await getBlogByID(id);
        setBlog(response.data);
      } catch (error) {
        console.error('Error fetching blog details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
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
            <p>
              The article you are looking for does not exist or has been
              removed.
            </p>
          </div>
        ) : (
          <article>
            <header className="mb-10 text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                {blog.title}
              </h1>

              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(blog.created_at || Date.now()).toLocaleDateString(
                    'en-US',
                    {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    }
                  )}
                </div>
                {blog.author && (
                  <div className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-2" />
                    <span>
                      {blog.author.first_name} {blog.author.last_name}
                    </span>
                  </div>
                )}
              </div>
            </header>

            <div className="prose prose-lg prose-indigo mx-auto text-gray-800 break-words whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>
        )}
      </main>
    </div>
  );
};

export default BlogDetails;
