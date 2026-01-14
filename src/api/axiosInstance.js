import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔒 GLOBAL AUTH FAILURE HANDLING
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const currentPath = window.location.pathname;

    // ❗ Ignore auth bootstrap failures
    if (error.config?.url?.includes("/api/auth/check-auth")) {
      return Promise.reject(error);
    }

    if (status === 401) {
      if (!currentPath.startsWith("/auth")) {
        window.location.replace("/auth/login");
      }
    }

    // if (status === 403) {
    //   // 🚫 Prevent redirect loop
    //   if (currentPath !== "/unauth-page") {
    //     window.location.replace("/unauth-page");
    //   }
    // }

    return Promise.reject(error);
  }
);


export default axiosInstance;
