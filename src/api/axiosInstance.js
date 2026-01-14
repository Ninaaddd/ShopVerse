import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.response.use(
  res => res,
  err => {
    const status = err?.response?.status;
    const url = err?.config?.url;
    const currentPath = window.location.pathname;

    // ⛔ DO NOT redirect for auth bootstrap - let React handle it
    if (url?.includes("/api/auth/check-auth")) {
      return Promise.reject(err);
    }

    // ⛔ DO NOT redirect for admin access check - let React handle it
    if (url?.includes("/api/auth/check-admin")) {
      return Promise.reject(err);
    }

    // ⛔ DO NOT redirect if already on auth pages or unauth page
    if (
      currentPath.startsWith("/auth/") || 
      currentPath === "/unauth-page"
    ) {
      return Promise.reject(err);
    }

    // Handle 401 - Unauthorized (authentication required)
    if (status === 401) {
      // Only redirect if the API call was for a protected resource
      const protectedEndpoints = [
        "/api/shop/cart",
        "/api/shop/order",
        "/api/shop/address",
        "/api/admin",
      ];

      const isProtectedEndpoint = protectedEndpoints.some(endpoint => 
        url?.includes(endpoint)
      );

      if (isProtectedEndpoint) {
        window.location.replace("/auth/login");
      }
    }

    // Handle 403 - Forbidden (admin access required)
    // Only redirect to unauth if not already there and trying to access admin routes
    if (status === 403 && currentPath.startsWith("/admin")) {
      window.location.replace("/unauth-page");
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;