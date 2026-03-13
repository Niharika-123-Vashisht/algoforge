import axios from "axios";
import { getAccessToken } from "../utils/token.js";
import { triggerLogout } from "../utils/authEvents.js";
import { handleApiError } from "../utils/error.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
  timeout: 20000
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      triggerLogout("unauthorized");
    }
    return handleApiError(error);
  }
);

export default api;
