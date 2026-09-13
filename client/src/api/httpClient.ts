import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { refreshAccessToken } from "./authApi";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

let refreshPromise: Promise<string> | null = null;

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    const status = error.response?.status;

    const requestUrl = originalRequest?.url ?? "";

    const isRefreshRequest = requestUrl.includes("/auth/refresh");

    const isLoginRequest = requestUrl.includes("/auth/login");

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isRefreshRequest ||
      isLoginRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      window.location.href = "/login";

      return Promise.reject(error);
    }

    try {
      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = refreshAccessToken(refreshToken)
          .then((newAccessToken) => {
            localStorage.setItem("accessToken", newAccessToken);

            return newAccessToken;
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return httpClient(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      window.location.href = "/login";

      return Promise.reject(refreshError);
    }
  },
);

export default httpClient;
