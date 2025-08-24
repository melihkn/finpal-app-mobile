// src/api/authApi.ts
import { useAuth } from "@/state/auth.store";
import { ENV } from "@/utils/env";
import axios from "axios";

export const authApi = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,
});

const getToken = () => useAuth.getState().token;

// Attach token
authApi.interceptors.request.use((config) => {
  try {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  } catch (error) {
    // Optionally, handle/log error here
    return config;
  }
});

// Optional: 401 handling (logout or refresh)
authApi.interceptors.response.use(
  r => r,
  async (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      // if you have refresh tokens, call refresh here; otherwise logout
      useAuth.getState().logout();
    }
    return Promise.reject(err);
  }
);


const loginUser = async (email: string, password: string) => {
    try {
        const response = await authApi.post("/auth/login", { "email": email, "password": password });
        return response.data;
    } catch (error) {
        // Optionally, handle/log error here
        throw error;
    }
};


const registerUser = async (email: string, password: string, username: string) => {
    try {
        const response = await authApi.post("/auth/register", { "email": email, "password": password, "username": username });
        return response.data;
    } catch (error) {
        // Optionally, handle/log error here
        throw error;
    }
};

export const authRepo = {
    login: loginUser,
    register: registerUser,
};
