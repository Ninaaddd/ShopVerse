import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, isAdmin, isLoading, children }) {
  const location = useLocation();
  const path = location.pathname;

  if(isLoading){
    return null;
  }

  // 1️⃣ Not logged in → login
  if (!isAuthenticated) {
    if (path.startsWith("/auth")) {
      return <>{children}</>;
    }
    return <Navigate to="/auth/login" replace />;
  }

  // 2️⃣ Logged in users should not see auth pages
  if (path.startsWith("/auth")) {
    return <Navigate to="/shop/home" replace />;
  }

  // 3️⃣ 🚫 BLOCK non-admin users from admin routes
  if (path.startsWith("/admin") && !isAdmin) {
    return <Navigate to="/unauth-page" replace />;
  }

  // 4️⃣ ✅ Admin landing redirect (UX)
  if (path === "/shop/home" && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;
