import React from 'react';
import { User, Calendar, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Blog } from '../shared/constants/types';
import { stripHtml, calculateReadTime } from '../shared/utils';

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const contentSnippet = stripHtml(blog.content).substring(0, 150) + '...';
  const readTime = calculateReadTime(blog.content);

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 flex flex-col h-full transform hover:-translate-y-2">
      <Link to={`/blog/${blog.id}`} className="flex flex-col h-full">
        <div className="relative h-56 overflow-hidden bg-gray-50">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {blog.coverImage ? (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              No Image
            </div>
          )}
        </div>

        <div className="p-8 flex flex-col flex-grow">
          <div className="flex items-center space-x-4 mb-6 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            <span className="px-3 py-1 bg-indigo-50 rounded-full">Article</span>
            <div className="flex items-center text-gray-400">
              <Calendar className="w-4 h-4 mr-1.5" />
              {blog.created_at
                ? new Date(blog.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                : 'New'}
            </div>
            <div className="flex items-center text-gray-400 border-l border-gray-100 pl-4">
              <Clock className="w-4 h-4 mr-1.5" />
              {readTime}
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2 leading-tight">
            {blog.title}
          </h3>

          <p className="text-gray-500 mb-8 line-clamp-3 leading-relaxed">
            {contentSnippet}
          </p>

          <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
            {blog.author && (
              <Link 
                to={`/author/${blog.author.username || blog.author.id}`}
                className="flex items-center hover:opacity-80 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mr-3 border border-indigo-100 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-300">
                  <User className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                    {blog.author.first_name} {blog.author.last_name}
                  </p>
                  <p className="text-xs text-gray-400">Author</p>
                </div>
              </Link>
            )}

            <div className="flex items-center text-indigo-600 font-bold text-sm tracking-wide group/btn">
              <span className="mr-2 group-hover/btn:mr-3 transition-all duration-300">
                Read More
              </span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
