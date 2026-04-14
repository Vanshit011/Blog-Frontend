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
export const getAllBlogs = (page: number, limit: number, search: string) => {
  return API.get('/blog/all', {
    params: { page, limit, search },
  });
};

// User Profile & Author Blogs
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
  return API.get(`/user/${authorId}/blogs`, {
    params: { page, limit, search },
  });
};

export default API;
