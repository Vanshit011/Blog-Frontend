import axios, { type AxiosInstance } from "axios";

const API: AxiosInstance = axios.create({
  baseURL: (import.meta as ImportMeta).env.VITE_API || "http://localhost:3001",
  withCredentials: true,
});

// Admin Auth
export const getGoogleAdminLoginUrl = () => {
    // console.log("Admin Google Login URL:", `${API.defaults.baseURL}/auth/admin/google/login`);
  return `${API.defaults.baseURL}/auth/admin/google/login`;
};

// User Auth
export const userLogin = (email: string, password: string) => {
  return API.post("/auth/user/login", { email, password });
};

export const userSignup = (email: string, password: string, firstName: string, lastName: string) => {
  return API.post("/auth/user/signup", { email, password, firstName, lastName });
};

export const getGoogleUserLoginUrl = () => {
  return `${API.defaults.baseURL}/auth/user/google/login`;
};

export default API;
