import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice"; // adjust path if needed

function ShoppingHeader() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-gray-100 shadow">
      <Link to="/shop/home" className="text-2xl font-bold text-gray-800">
        ShopVerse
      </Link>

      <nav className="flex items-center gap-6">
        <Link to="/shop/listing" className="hover:underline">
          Products
        </Link>
        <Link to="/shop/search" className="hover:underline">
          Search
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/shop/account" className="hover:underline">
              Hi, {user?.name || "User"}
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/auth/login"
            className="px-4 py-1 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Log In
          </Link>
        )}
      </nav>
    </header>
  );
}

export default ShoppingHeader;
