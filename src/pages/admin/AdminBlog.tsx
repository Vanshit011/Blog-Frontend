import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/sidebar';
import Header from '../../common/Header';
import { getAdminBlogs, deleteBlog } from '../../services/api';
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
} from 'lucide-react';
import type { Blog } from '../../shared/constants/types';
import LoadingSpinner from '../../common/LoadingSpinner';
import { toast } from 'sonner';

import { useDebounce } from '../../hooks/useDebounce';
import BlogTable from '../../components/admin/BlogTable';

const AdminBlog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, [page, debouncedSearch]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await getAdminBlogs(page, limit, debouncedSearch);
      setBlogs(response.data.data);
      setTotalPages(response.data.meta.lastPage);
    } catch (error) {
      console.error('Failed to fetch blogs', error);
      toast.error('Failed to load blog posts.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBlog(id);
      toast.success('Blog post deleted successfully');
      fetchBlogs();
    } catch (error) {
      console.error('Failed to delete blog', error);
      toast.error('Failed to delete blog post.');
      throw error; // Propagate to component to handle loading state
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 w-full p-6 md:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
                    <LayoutGrid size={24} />
                  </div>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">Blog Repository</h1>
                </div>
                <p className="text-gray-500 font-medium">Manage, edit, and publish your content across the platform.</p>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80 group">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search by title..."
                    className="w-full pl-12 pr-4 py-3.5 bg-white border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-2xl shadow-sm transition-all outline-none"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>

                <button
                  onClick={() => navigate('/admin/blog/create')}
                  className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-700 flex items-center gap-2 shrink-0 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                >
                  <Plus size={20} />
                  New Post
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-sm">
                <LoadingSpinner className="w-12 h-12 text-indigo-600" />
                <p className="mt-4 text-gray-400 font-bold">Synchronizing content...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <LayoutGrid className="text-gray-200 w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">No blogs found</h3>
                <p className="text-gray-500 font-medium max-w-xs mx-auto mb-8">
                  {search ? `We couldn't find anything matching "${search}"` : "You haven't created any blog posts yet. Start by creating your first masterpiece!"}
                </p>
                {!search && (
                   <button
                   onClick={() => navigate('/admin/blog/create')}
                   className="text-indigo-600 font-black hover:underline"
                 >
                   Create your first post →
                 </button>
                )}
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <BlogTable 
                  blogs={blogs} 
                  onDelete={handleDelete}
                  onEdit={(id) => navigate(`/admin/blog/edit/${id}`)}
                />

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-2">
                  <p className="text-sm font-bold text-gray-400">
                    Showing <span className="text-gray-900">{blogs.length}</span> posts on page <span className="text-indigo-600">{page}</span> of <span className="text-gray-900">{totalPages}</span>
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="p-3 bg-white border border-gray-100 rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm hover:shadow text-gray-600"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
                          page === i + 1 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                            : 'bg-white text-gray-400 hover:text-indigo-600 hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        {i + 1}
                      </button>
                    )).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))}

                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="p-3 bg-white border border-gray-100 rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm hover:shadow text-gray-600"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminBlog;

