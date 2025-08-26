// src/api/client.ts
import { useAuth } from "@/state/auth.store";
import { ENV } from "@/utils/env";
import axios from "axios";

export const creditCardApi = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" }
});

const getToken = () => useAuth.getState().token;

creditCardApi.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


const fetchCreditCards = async () => {
    const response = await creditCardApi.get("/credit-cards");
    return response.data;
};