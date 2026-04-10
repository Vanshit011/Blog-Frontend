import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlogPost } from '../../services/api';
import { AxiosError } from 'axios';
import Sidebar from './sidebar';
import Header from '../../common/Header';
import type { ErrorResponse } from '../../shared/constants/types';
import ErrorMessage from '../../common/ErrorMessage';
import FormInput from '../../common/FormInput';

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slug: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createBlogPost(formData.title, formData.content, formData.slug);
      alert('Blog created successfully!');
      navigate('/admin/blog');
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      setError(
        axiosError.response?.data?.message || 'Failed to create blog post'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 w-full p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Create New Blog Post
            </h2>

            <ErrorMessage message={error} />

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="Title"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
              />

              <FormInput
                label="Slug"
                id="slug"
                name="slug"
                required
                placeholder="e.g., my-awesome-post"
                value={formData.slug}
                onChange={handleChange}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  name="content"
                  required
                  rows={8}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  value={formData.content}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {loading ? 'Creating...' : 'Create Post'}
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

export default CreateBlog;
