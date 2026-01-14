import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, isAdmin, isLoading, isAdminLoading, children }) {
  const location = useLocation();
  const { pathname } = location;

  // ✅ If on /auth routes and already authenticated, redirect to shop
  if (pathname.startsWith("/auth") && isAuthenticated) {
    return <Navigate to="/shop/home" replace />;
  }

  // 🔐 Admin routes - require authentication AND admin role
  if (pathname.startsWith("/admin")) {
    // Still loading initial auth
    if (isLoading) {
      return null;
    }

    // Not authenticated at all
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace state={{ from: pathname }} />;
    }

    // Authenticated but still checking admin status
    if (isAdminLoading) {
      return null;
    }

    // Authenticated but not admin
    if (!isAdmin) {
      // Use replace and clear history to prevent back button issues
      return <Navigate to="/unauth-page" replace />;
    }
  }

  // 🔐 Protected shopping routes - require authentication only
  if (
    pathname.startsWith("/shop/account") ||
    pathname.startsWith("/shop/checkout")
  ) {
    if (isLoading) {
      return null;
    }

    if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace state={{ from: pathname }} />;
    }
  }

  return children;
}

export default CheckAuth;