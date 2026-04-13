import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlogPost } from '../../services/api';
import { AxiosError } from 'axios';
import Sidebar from './sidebar';
import Header from '../../common/Header';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import type { ErrorResponse } from '../../shared/constants/types';

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slug: '',
    coverImage: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-indigo-600 underline' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-lg max-w-full h-auto' },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class:
          'prose prose-indigo max-w-none focus:outline-none min-h-[400px] p-5 border-t border-gray-200',
      },
    },
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  const addImage = () => {
    const url = window.prompt('Enter Image URL');
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  };

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run();
  }, [editor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createBlogPost(
        formData.title,
        formData.content,
        formData.slug,
        formData.coverImage
      );
      navigate('/admin/blog');
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.message || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  const MenuBar = () => {
    if (!editor) return null;
    const btn =
      'px-2 py-1 text-xs font-semibold rounded border transition-colors ';
    const active = 'bg-indigo-600 text-white border-indigo-600';
    const inactive = 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';

    return (
      <div className="flex flex-wrap gap-1.5 p-3 bg-gray-50 rounded-t-lg sticky top-0 z-10 border-b">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${btn} ${editor.isActive('bold') ? active : inactive}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${btn} ${editor.isActive('italic') ? active : inactive}`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${btn} ${editor.isActive('strike') ? active : inactive}`}
        >
          S
        </button>

        <div className="w-[1px] bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`${btn} ${editor.isActive('heading', { level: 1 }) ? active : inactive}`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`${btn} ${editor.isActive('heading', { level: 2 }) ? active : inactive}`}
        >
          H2
        </button>

        <div className="w-[1px] bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`${btn} ${editor.isActive({ textAlign: 'left' }) ? active : inactive}`}
        >
          Left
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`${btn} ${editor.isActive({ textAlign: 'center' }) ? active : inactive}`}
        >
          Center
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`${btn} ${editor.isActive({ textAlign: 'right' }) ? active : inactive}`}
        >
          Right
        </button>

        <div className="w-[1px] bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${btn} ${editor.isActive('bulletList') ? active : inactive}`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={setLink}
          className={`${btn} ${editor.isActive('link') ? active : inactive}`}
        >
          Link
        </button>
        <button
          type="button"
          onClick={addImage}
          className={`${btn} ${inactive}`}
        >
          Image
        </button>

        {/* Actions */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className={`${btn} ${inactive}`}
        >
          Undo
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">Create New Post</h2>
            </div>

            {error && (
              <div className="mx-6 mt-6 text-red-600 bg-red-50 border border-red-200 p-4 rounded-lg flex items-center shadow-sm">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="title"
                    placeholder="Post Title"
                    required
                    className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    name="slug"
                    placeholder="URL-slug"
                    required
                    className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    name="coverImage"
                    placeholder="Cover Image URL (optional)"
                    className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.coverImage}
                    onChange={(e) =>
                      setFormData({ ...formData, coverImage: e.target.value })
                    }
                  />
                  {formData.coverImage && (
                    <div className="relative group overflow-hidden rounded-xl border border-gray-100 shadow-sm aspect-video max-h-48">
                      <img
                        src={formData.coverImage}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://placehold.co/600x400?text=Invalid+Image+URL';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold uppercase tracking-wider">
                          Cover Image Preview
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg">
                <MenuBar />
                <EditorContent editor={editor} />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md active:scale-95"
                >
                  {loading ? 'Publishing...' : 'Publish Post'}
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
