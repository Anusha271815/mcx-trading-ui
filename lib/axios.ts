import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // later: attach token here
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error
    if (!error.response) {
      console.error("Network error. Please check your connection.");
      return Promise.reject({
        message: "Network error. Please try again.",
      });
    }

    const { status, data } = error.response;

    // Auth errors
    if (status === 401) {
      console.error("Unauthorized. Please login again.");
    }

    if (status === 403) {
      console.error("Access denied.");
    }

    if (status >= 500) {
      console.error("Server error. Try again later.");
    }

    return Promise.reject({
      status,
      message: data?.message || "Something went wrong",
    });
  }
);

export default api;

