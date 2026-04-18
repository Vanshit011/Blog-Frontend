import axios, { type AxiosInstance } from 'axios';
import type { Author } from '../shared/constants/types';

const API: AxiosInstance = axios.create({
  baseURL: (import.meta as ImportMeta).env.VITE_API || 'http://localhost:3001',
  // withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Admin Auth
export const getGoogleAdminLoginUrl = () => {
  return `${API.defaults.baseURL}/auth/admin/google/login`;
};

// User Auth
export const userLogin = (email: string, password: string) => {
  return API.post('/auth/user/login', { email, password });
};

export const userSignup = (
  email: string,
  password: string,
  first_name: string,
  last_name: string
) => {
  return API.post('/auth/user/signup', {
    email,
    password,
    first_name,
    last_name,
  });
};

export const getGoogleUserLoginUrl = () => {
  return `${API.defaults.baseURL}/auth/user/google/login`;
};

//admin Blog Management
export const createBlogPost = (
  title: string,
  content: string,
  slug: string,
  coverImage?: string,
  status?: string
) => {
  return API.post('/blog/create', { title, content, slug, coverImage, status });
};

export const generateContent = (title: string, keywords?: string) => {
  return API.post('/blog/generate-content', { title, keywords });
};

export const getAdminBlogs = (page: number, limit: number, search: string) => {
  return API.get(`/blog/my-blogs`, {
    params: { page, limit, search },
  });
};

export const getBlogByID = (id: string) => {
  return API.get(`/blog/${id}`, {});
};

export const updateBlog = (
  id: string,
  title?: string,
  content?: string,
  slug?: string,
  coverImage?: string,
  status?: string
) => {
  return API.patch(`/blog/${id}`, { title, content, slug, coverImage, status });
};

export const deleteBlog = (id: string) => {
  return API.delete(`/blog/${id}`, {});
};

//user Blog Management
export const getAllBlogs = (
  page: number,
  limit: number,
  search: string,
  categoryId?: string
) => {
  return API.get('/blog/all', {
    params: { page, limit, search, category_id: categoryId },
  });
};

export const getRecommendedBlogs = (categoryId?: string) => {
  return API.get('/blog/recommend', {
    params: categoryId ? { categoryId } : undefined,
  });
};

//category
export const createCategory = (name: string) => {
  return API.post('/category', { name });
};

export const getCategories = () => {
  return API.get('/category');
};

// User Profile & Author Blogs

export const uploadProfileImage = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post('/user/upload', formData);
};

export const getMyProfile = () => {
  return API.get('/user/profile');
};

export const updateProfile = (id: string, data: Partial<Author>) => {
  return API.patch(`/user/profile/${id}`, data);
};

export const getPublicProfile = (identifier: string) => {
  return API.get(`/user/${identifier}`);
};

export const getAuthorBlogs = (
  authorId: string,
  page: number = 1,
  limit: number = 10,
  search: string = ''
) => {
  return API.get(`/blog/author/${authorId}`, {
    params: { page, limit, search },
  });
};

// Notification Management
export const getMyNotifications = () => {
  return API.get('/notifications');
};

export const markNotificationAsRead = (id: string) => {
  return API.patch(`/notifications/${id}/read`);
};

// Comment Management
export const getComments = (blogId: string) => {
  return API.get(`/comment/blog/${blogId}`);
};

export const addComment = (blogId: string, content: string) => {
  return API.post(`/comment/${blogId}`, { content });
};

export const deleteComment = (commentId: string) => {
  return API.delete(`/comment/${commentId}`);
};

// Like Management
export const getLikes = (blogId: string) => {
  return API.get(`/like/blog/${blogId}/likes`);
};

export const likeBlog = (blogId: string) => {
  return API.post(`/like/${blogId}`);
};

export const unlikeBlog = (blogId: string) => {
  return API.delete(`/like/${blogId}`);
};

// Follow Management
export const followAuthor = (authorId: string) => {
  return API.post(`/follow/${authorId}`);
};

export const unfollowAuthor = (authorId: string) => {
  return API.delete(`/follow/${authorId}`);
};

export const getFollowStats = (authorId: string) => {
  return API.get(`/follow/stats/${authorId}`);
};

export const getMyFollowing = () => {
  return API.get('/follow/my/following');
};

//admin

export const adminGetMyFollowers = () => {
  return API.get('/follow/admin/my/followers');
};

export default API;
