//src/components/shopping-view/header.jsx
import { LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import { clearCart } from "@/store/shop/cart-slice"
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import bagIcon from "../../assets/bag.png";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function ShoppingHeader() {
  const { isAuthenticated, user, isAdmin } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    navigate("/auth/login");
  };

  const handleLogin = () => {
    navigate("/auth/login");
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
      navigate("/auth/login", { state: { from: "/shop/home" } });
    } else {
      setOpenCartSheet(true);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchCartItems());
    }else{
      dispatch(clearCart());
    }
  }, [dispatch, isAuthenticated, user?.id]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* ---- Left: Logo ---- */}
        <Link to="/shop/home" className="flex items-center gap-2">
          <img src={bagIcon} className="h-[4.85rem] w-[4.85rem]" alt="icon" />
          <span className="font-extrabold text-2xl">ShopVerse</span>
        </Link>

        {/* ---- Mobile Menu ---- */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <div
              className="flex items-center gap-2 mt-4 cursor-pointer"
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart ({cartItems?.items?.length || 0})</span>
            </div>

            <div className="mt-4 border-t pt-4 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    Hi, {user?.userName || "User"}
                  </span>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="w-full"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button onClick={handleLogin} className="w-full">
                  Log In
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* ---- Desktop Menu ---- */}
        <div className="hidden lg:flex items-center gap-6">
          <MenuItems />

          {/* ---- Cart Button ---- */}
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={handleCartClick}
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
              {cartItems.items?.length || 0}
            </span>
          </Button>

          {/* ---- Auth Section ---- */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="bg-black">
                  <AvatarFallback className="bg-black text-white font-extrabold">
                    {user?.userName?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" className="w-56">
                <DropdownMenuLabel>
                  Logged in as {user?.userName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/shop/account")}>
                  <UserCog className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>

                {/* ✅ ADMIN ONLY */}
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
                      <UserCog className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleLogin} className="px-4 py-2">
              Log In
            </Button>
          )}
        </div>
      </div>

      {/* ---- Cart Sheet (Shared) ---- */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems?.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>
    </header>
  );
}

export default ShoppingHeader;
