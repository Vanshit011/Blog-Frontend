import { useState } from 'react';
import { createCategory } from '../../services/api';
import { toast } from 'sonner';
import Sidebar from './sidebar';
import Header from '../../common/Header';
import { FolderPlus } from 'lucide-react';

const CreateCategory = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCategory(name);
      toast.success('Category created successfully!');
      setName('');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto flex items-start justify-center">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
            <div className="p-8 border-b border-gray-50 flex items-center gap-4 bg-gradient-to-r from-indigo-50/50 to-white">
              <div className="p-3.5 bg-indigo-100 text-indigo-600 rounded-2xl shadow-inner">
                <FolderPlus size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Create Category</h2>
                <p className="text-sm text-gray-500 mt-1 font-medium">Add a new category to organize your blog posts.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Category Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Technology, Lifestyle, AI..."
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all shadow-sm"
                  required
                />
              </div>
              
              <div className="pt-2 border-t border-gray-50">
                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="w-full px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg shadow-indigo-200 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? 'Creating...' : (
                    <>
                      <FolderPlus size={20} />
                      Create Category
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateCategory;
