import axios from "axios";
import { auth } from "./firebase";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Firebase JWT automatically to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const message =
        error.response.data?.error ||
        error.response.data?.message ||
        "An error occurred";
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response
      throw new Error(
        "No response from server. Please check if the backend is running."
      );
    } else {
      // Something else happened
      throw new Error(error.message);
    }
  }
);

export default api;
