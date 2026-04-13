import { useState, useEffect } from 'react';
import { getAllBlogs } from '../../services/api';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import type { Blog } from '../../shared/constants/types';
import BlogCard from '../../common/BlogCard';

const PublicBlogView = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await getAllBlogs(page, limit, search);
        setBlogs(response.data.data || []);
        if (response.data.meta) {
          setTotalPages(response.data.meta.lastPage);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchBlogs();
    }, 500);

    return () => clearTimeout(timer);
  }, [page, limit, search]);

  return (
    <div className="bg-[#fafbff] min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="w-full max-w-xl relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search for articles, topics, or authors..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-xl shadow-gray-100/50 transition-all text-gray-900 text-lg placeholder:text-gray-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl h-[400px] animate-pulse border border-gray-100"
              />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[40px] shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-6">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No results match your search
            </h3>
            <p className="text-gray-500">
              Try adjusting your keywords or filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 mb-20 transition-all duration-500">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => {
                    setPage(page - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-600 hover:bg-indigo-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all duration-300 shadow-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => {
                      setPage(i + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-12 h-12 rounded-2xl font-bold transition-all duration-300 ${
                      page === i + 1
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => {
                    setPage(page + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-600 hover:bg-indigo-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all duration-300 shadow-sm"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PublicBlogView;
