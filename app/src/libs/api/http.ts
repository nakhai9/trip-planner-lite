import { ApiResponse } from "@/types/api";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

/**
 * Base Config
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

/**
 * Request Interceptor
 */
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

/**
 * Response Interceptor
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    const message =
      (error.response?.data as any)?.message || error.message || undefined;

    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(message);
  },
);

/**
 * Base request handler
 */
async function handleRequest<T, D = unknown>(
  config: AxiosRequestConfig<D>,
): Promise<T> {
  const response = await axiosInstance.request<ApiResponse<T>>(config);
  return response.data.data;
}

export const HttpClient = {
  get: async <T>(
    url: string,
    query?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return handleRequest<T>({
      ...config,
      method: "GET",
      url,
      params: query,
    });
  },

  post: async <T, D = unknown>(
    url: string,
    payload?: D,
    query?: Record<string, any>,
    config?: AxiosRequestConfig<D>,
  ): Promise<T> => {
    return handleRequest<T, D>({
      ...config,
      method: "POST",
      url,
      data: payload,
      params: query,
    });
  },

  update: async <T, D = unknown>(
    url: string,
    payload?: D,
    query?: Record<string, any>,
    config?: AxiosRequestConfig<D>,
  ): Promise<T> => {
    return handleRequest<T, D>({
      ...config,
      method: "PUT",
      url,
      data: payload,
      params: query,
    });
  },

  delete: async <T>(
    url: string,
    query?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return handleRequest<T>({
      ...config,
      method: "DELETE",
      url,
      params: query,
    });
  },
};
