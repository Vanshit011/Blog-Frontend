import axios, { type AxiosInstance } from "axios";

const API: AxiosInstance = axios.create({
  baseURL: (import.meta as ImportMeta).env.VITE_API || "http://localhost:3001",
  withCredentials: true,
  paramsSerializer: {
    indexes: null,
  },
});

//admin auth 
export const AdminLogin = (username: string, password: string) => {
  return API.post("/auth/admin/google/login", { username, password });
}
export default API;