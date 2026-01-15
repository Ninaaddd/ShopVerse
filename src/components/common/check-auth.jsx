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
    // ✅ Block rendering during ANY loading state
    if (isLoading || isAdminLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    // Not authenticated at all
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace state={{ from: pathname }} />;
    }

    // ✅ Explicitly check isAdmin is true (not just truthy)
    if (isAdmin !== true) {
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