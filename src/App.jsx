import { Route, Routes, Navigate } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth, checkAdminAccess } from "./store/auth-slice";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PaypalCancelPage from "./pages/shopping-view/paypal-cancel";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";

function App() {
  const { user, isAuthenticated, isLoading, isAdmin, isAdminLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const res = await dispatch(checkAuth()).unwrap();
        // ✅ Only check admin access if user is authenticated
        if (res.success && res.user) {
          // Call checkAdminAccess but don't block on 403
          dispatch(checkAdminAccess()).catch(() => {
            // User is not admin, that's fine - just continue
          });
        }
      } catch {
        // unauthenticated is OK
      }
    };
    bootstrap();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="relative flex items-center justify-center">
          {/* Spinner ring */}
          <div className="absolute h-24 w-24 animate-pulse rounded-full border-4 border-gray-300 border-t-black animate-spin" />

          {/* Center image from public folder */}
          <img
            src="/bag.ico"
            alt="Loading"
            className="h-24 w-24 object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* Redirect root to /shop/home */}
        <Route path="/" element={<Navigate to="/shop/home" replace />} />

        {/* Auth Routes - redirect to /shop/home if already authenticated */}
        <Route
          path="/auth"
          element={
            <CheckAuth 
              isAuthenticated={isAuthenticated} 
              isLoading={isLoading} 
              user={user}
            >
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* Admin Routes - protected */}
        <Route
          path="/admin"
          element={
            <CheckAuth 
              isAuthenticated={isAuthenticated} 
              isLoading={isLoading} 
              isAdmin={isAdmin} 
              isAdminLoading={isAdminLoading}
              user={user}
            >
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>

        {/* Shopping Routes - public with specific protected routes */}
        <Route path="/shop" element={<ShoppingLayout />}>
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="search" element={<SearchProducts />} />
          
          {/* Protected shopping routes */}
          <Route
            path="checkout"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ShoppingCheckout />
              </CheckAuth>
            }
          />
          <Route
            path="account"
            element={
              <CheckAuth 
                isAuthenticated={isAuthenticated} 
                isLoading={isLoading} 
                user={user}
              >
                <ShoppingAccount />
              </CheckAuth>
            }
          />
          
          {/* Payment routes */}
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="paypal-cancel" element={<PaypalCancelPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
        </Route>

        {/* Unauthorized page */}
        <Route path="/unauth-page" element={<UnauthPage />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;