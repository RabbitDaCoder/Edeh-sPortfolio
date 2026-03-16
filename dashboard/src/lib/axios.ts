import axios, { AxiosInstance } from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api/v1";
const baseV2URL = baseURL.replace(/\/v1$/, "/v2");

function applyInterceptors(client: AxiosInstance) {
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const url = error.config?.url || "";
        // Don't redirect on login — let the login page handle 401
        if (!url.includes("auth/login")) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    },
  );
}

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

export const apiV2Client: AxiosInstance = axios.create({
  baseURL: baseV2URL,
  timeout: 10000,
});

applyInterceptors(apiClient);
applyInterceptors(apiV2Client);
