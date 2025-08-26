// src/api/authApi.ts
import { ENV } from "@/utils/env";
import axios from "axios";

export const authApi = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" }
});


const loginUser = async (email: string, password: string) => {
    try {
        const response :any= await authApi.post("/auth/login", { "email": email, "password": password });
            if (response?.error) {
        console.log("Validation error:", response.error);
    }

      if (response?.data) {
        console.log("Login successful:", response.data);
      }
      return response.data;
    } catch (error: any) {
        // Optionally, handle/log error here
        console.log("iOS login error ->", {
          message: error?.message,
          code: error?.code,
          status: error?.response?.status,
          data: error?.response?.data,
          url: error?.config?.baseURL + error?.config?.url,
        });

        throw error;
    }
};


const registerUser = async (email: string, password: string, firstname: string, lastname: string) => {
  try {
    const response :any = await authApi.post("/auth/register", {
      email,
      password,
      "firstName": firstname,
      "lastName": lastname,
    });

    if (response?.error) {
      console.log("Validation error:", response.error);
    }

    if (response?.data !== null) {
      console.log("Registration successful:", response.data);
    }

    return response.data;
  } catch (error: any) {
    // See real cause
    console.log("Register Axios error:", {
      message: error?.message,
      code: error?.code,
      status: error?.response?.status,
      data: error?.response?.data,
      url: error?.config?.baseURL + error?.config?.url,
    });
    throw error;
  }
};

export const authRepo = {
    login: loginUser,
    register: registerUser,
};
