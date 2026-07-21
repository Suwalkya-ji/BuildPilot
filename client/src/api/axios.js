import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized & Network Errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = "Network error. Please check your internet connection or backend server.";
    } else if (error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      error.message = error.response.data?.message || "Session expired. Please log in again.";
    } else if (error.response.status >= 500) {
      error.message = error.response.data?.message || "Internal server error. Please try again later.";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
