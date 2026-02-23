import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { ApiResponse } from "./api.models";

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
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
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
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return handleRequest<T>({
      ...config,
      method: "GET",
      url,
    });
  },
  post: async <T, D = unknown>(
    url: string,
    payload?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<T> => {
    return handleRequest<T, D>({
      ...config,
      method: "POST",
      url,
      data: payload,
    });
  },
  update: async <T, D = unknown>(
    url: string,
    payload?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<T> => {
    return handleRequest<T, D>({
      ...config,
      method: "PUT",
      url,
      data: payload,
    });
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return handleRequest<T>({
      ...config,
      method: "DELETE",
      url,
    });
  },
};
