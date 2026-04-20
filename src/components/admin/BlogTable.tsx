import {
  Edit2,
  Trash2,
  Share2,
  MoreVertical,
  ExternalLink,
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { Blog } from '../../shared/constants/types';
import { calculateReadTime } from '../../shared/utils';
import { useState } from 'react';
import ConfirmDialog from '../ui/ConfirmDialog';
import { toast } from 'sonner';

interface BlogTableProps {
  blogs: Blog[];
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string) => void;
}

const BlogTable = ({ blogs, onDelete, onEdit }: BlogTableProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteId);
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const copyShareLink = (id: string) => {
    const url = `${window.location.origin}/blog/${id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Metrics
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {blogs.map((blog) => (
              <tr
                key={blog.id}
                className="group hover:bg-gray-50/80 transition-all duration-200"
              >
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="relative w-24 h-16 rounded-2xl overflow-hidden shadow-inner bg-gray-100 border border-gray-100">
                    <img
                      src={
                        blog.cover_image ||
                        'https://placehold.co/400x300?text=No+Image'
                      }
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col max-w-xs md:max-w-sm lg:max-w-md">
                    <span className="text-sm font-black text-gray-900 line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors">
                      {blog.title}
                    </span>
                    <span className="text-xs font-bold text-gray-400 font-mono">
                      /{blog.slug}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                      {calculateReadTime(blog.content)}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">
                      {blog.created_at
                        ? new Date(blog.created_at).toLocaleDateString(
                            undefined,
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )
                        : 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      blog.status === 'PUBLISHED'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-2 ${blog.status === 'PUBLISHED' ? 'bg-green-500' : 'bg-amber-500'}`}
                    />
                    {blog.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right whitespace-nowrap">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all outline-none">
                        <MoreVertical size={20} />
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="min-w-[180px] bg-white rounded-2xl p-2 shadow-2xl border border-gray-100 z-[110] animate-in fade-in zoom-in-95 duration-200 outline-none"
                        sideOffset={5}
                        align="end"
                      >
                        <DropdownMenu.Item
                          onClick={() => onEdit(blog.id)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl cursor-pointer outline-none transition-all"
                        >
                          <Edit2 size={16} />
                          Edit Post
                        </DropdownMenu.Item>

                        {blog.status === 'PUBLISHED' && (
                          <DropdownMenu.Item
                            onClick={() => copyShareLink(blog.id)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl cursor-pointer outline-none transition-all"
                          >
                            <Share2 size={16} />
                            Share Link
                          </DropdownMenu.Item>
                        )}

                        <DropdownMenu.Item
                          onClick={() =>
                            window.open(`/blog/${blog.id}`, '_blank')
                          }
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl cursor-pointer outline-none transition-all"
                        >
                          <ExternalLink size={16} />
                          Preview
                        </DropdownMenu.Item>

                        <DropdownMenu.Separator className="h-px bg-gray-100 my-1" />

                        <DropdownMenu.Item
                          onClick={() => setDeleteId(blog.id)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl cursor-pointer outline-none transition-all"
                        >
                          <Trash2 size={16} />
                          Delete Post
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone and will permanently remove the data."
        onConfirm={handleDeleteConfirm}
        confirmText={isDeleting ? 'Deleting...' : 'Delete Permanently'}
      />
    </div>
  );
};

export default BlogTable;
