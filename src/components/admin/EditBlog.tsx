import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getBlogByID, updateBlog, generateContent } from '../../services/api';
import { AxiosError } from 'axios';
import Sidebar from './sidebar';
import Header from '../../common/Header';
import LoadingSpinner from '../../common/LoadingSpinner';
import FormInput from '../../common/FormInput';
import type { ErrorResponse } from '../../shared/constants/types';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';
import type { EditBlogForm } from '../../shared/constants/types';

const EditBlog = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditBlogForm>();

  const coverImage = watch('coverImage');
  const title = watch('title');
  const content = watch('content');
  const [isGenerating, setIsGenerating] = useState(false);
  const [keywords, setKeywords] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (id) {
          const response = await getBlogByID(id);
          const blog = response.data;
          reset({
            title: blog.title,
            content: blog.content,
            slug: blog.slug,
            coverImage: blog.coverImage || '',
          });
        }
      } catch (err) {
        const axiosError = err as AxiosError<ErrorResponse>;
        setError(
          axiosError.response?.data?.message || 'Failed to load blog post'
        );
      } finally {
        setInitialLoading(false);
      }
    };
    fetchBlog();
  }, [id, reset]);

  const handleGenerateAI = async () => {
    if (!title) {
      toast.error('Please enter a title first to generate content.');
      return;
    }

    if (
      content &&
      !window.confirm(
        'This will overwrite your current content. Do you want to proceed?'
      )
    ) {
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generateContent(title, keywords);
      const generatedContent = response.data.content;
      setValue('content', generatedContent);
      toast.success('Content generated successfully!');
    } catch (err) {
      console.error('Failed to generate content', err);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data: EditBlogForm) => {
    setLoading(true);
    setError('');

    try {
      if (id) {
        await updateBlog(
          id,
          data.title,
          data.content,
          data.slug,
          data.coverImage
        );
        toast.success('Blog updated successfully!');
        navigate('/admin/blog');
      }
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(
        axiosError.response?.data?.message || 'Failed to update blog post'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex flex-col justify-center">
            <LoadingSpinner className="p-8 w-full flex justify-center items-center" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 w-full p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Edit Blog Post
            </h2>

            {error && (
              <div className="mb-6 text-red-600 bg-red-50 border border-red-200 p-4 rounded-lg flex items-center shadow-sm">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="mb-8 p-6 bg-indigo-50 border border-indigo-100 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-indigo-600" size={20} />
                <h3 className="font-bold text-indigo-900 text-lg">
                  AI Content Generator
                </h3>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter keywords (e.g. tech, future, nodejs)"
                    className="w-full border-gray-200 border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isGenerating || !title}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                >
                  {isGenerating ? (
                    'Generating...'
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Generate Content
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-indigo-500 mt-3 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                Enter keywords to guide the AI for more specific results.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Title"
                  id="title"
                  {...register('title', { required: 'Title is required' })}
                  error={errors.title?.message}
                />

                <FormInput
                  label="Slug"
                  id="slug"
                  placeholder="e.g., my-awesome-post"
                  {...register('slug', { required: 'Slug is required' })}
                  error={errors.slug?.message}
                />
              </div>

              <div>
                <FormInput
                  label="Cover Image URL"
                  id="coverImage"
                  placeholder="https://images.unsplash.com/..."
                  {...register('coverImage')}
                  error={errors.coverImage?.message}
                />
                {coverImage && (
                  <div className="mt-4 relative group overflow-hidden rounded-xl border border-gray-100 shadow-sm aspect-video max-h-48">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://placehold.co/600x400?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  {...register('content', { required: 'Content is required' })}
                  rows={10}
                  className={`w-full px-4 py-3 text-gray-900 border rounded-lg focus:ring-2 focus:border-transparent transition-all outline-none shadow-sm ${
                    errors.content
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500'
                  }`}
                />
                {errors.content && (
                  <span className="text-red-500 text-sm mt-1 inline-block">
                    {errors.content.message}
                  </span>
                )}
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {loading ? 'Saving...' : 'Update Post'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/blog')}
                  className="bg-white border border-gray-300 text-gray-700 font-medium py-2.5 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditBlog;
