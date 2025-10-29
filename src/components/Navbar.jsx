import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  ShoppingCart,
  User,
  Menu as MenuIcon,
  X,
  Cookie,
  LogOut,
  Package,
  Home as HomeIcon,
  UtensilsCrossed,
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Ensure user menu is closed when location changes
  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={`navbar navbar-glass ${
        scrolled ? "shadow-xl" : "shadow-md"
      } transition-all duration-300`}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 transition-opacity rounded-full opacity-50 bg-gradient-to-r from-orange-600 to-red-600 blur-lg group-hover:opacity-75"></div>
              <div className="relative p-2 transition-transform duration-300 rounded-full shadow-lg bg-gradient-to-r from-orange-600 to-red-600 group-hover:scale-110">
                <Cookie className="text-white h-7 w-7" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
                Cookie Barrel
              </span>
              <div className="text-xs font-medium text-gray-500">
                Premium Baked Goods
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-1 md:flex">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                isActive("/")
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/menu"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                isActive("/menu")
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Menu</span>
            </Link>
            <Link
              to="/track-order"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                isActive("/track-order")
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Track Order</span>
            </Link>
            {user?.isAdmin && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive("/admin")
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right side - Cart, User, Login */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-3 text-gray-700 transition-all duration-200 hover:bg-orange-50 hover:text-orange-600 rounded-xl group"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute flex items-center justify-center w-6 h-6 text-xs font-bold text-white transition-transform rounded-full shadow-lg -top-1 -right-1 bg-gradient-to-r from-orange-600 to-red-600 group-hover:scale-110">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center px-4 py-2 space-x-3 transition-all duration-200 rounded-xl hover:bg-orange-50 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 font-bold text-white transition-transform rounded-full shadow-lg bg-gradient-to-r from-orange-600 to-red-600 group-hover:scale-110">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500">My Account</div>
                  </div>
                </button>

                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    ></div>
                    <div className="absolute right-0 z-50 w-56 py-2 mt-3 border border-gray-200 shadow-2xl bg-white/95 backdrop-blur-xl rounded-2xl">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        to="/track-order"
                        className="flex items-center px-4 py-3 space-x-3 text-sm text-gray-700 transition-colors hover:bg-orange-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="w-4 h-4" />
                        <span>My Orders</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 space-x-3 text-sm text-left text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="items-center hidden space-x-3 md:flex">
                <Link
                  to="/login"
                  className="px-5 py-2 font-medium text-gray-700 transition-all duration-200 rounded-lg hover:text-orange-600 hover:bg-orange-50"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 transition-all duration-200 md:hidden hover:bg-orange-50 hover:text-orange-600 rounded-xl"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="pb-4 md:hidden">
            <div className="p-4 pt-4 mt-4 space-y-2 border border-gray-100 bg-white/50 backdrop-blur-sm rounded-2xl">
              <Link
                to="/"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive("/")
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-700 hover:bg-orange-50"
                }`}
              >
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link
                to="/menu"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive("/menu")
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-700 hover:bg-orange-50"
                }`}
              >
                <UtensilsCrossed className="w-5 h-5" />
                <span>Menu</span>
              </Link>
              <Link
                to="/track-order"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive("/track-order")
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-700 hover:bg-orange-50"
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Track Order</span>
              </Link>
              {user?.isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive("/admin")
                      ? "bg-orange-100 text-orange-600"
                      : "text-gray-700 hover:bg-orange-50"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Admin</span>
                </Link>
              )}

              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="flex items-center px-4 py-3 space-x-3 font-medium text-gray-700 transition-all rounded-xl hover:bg-orange-50"
                  >
                    <User className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center px-4 py-3 space-x-3 font-semibold text-white shadow-lg rounded-xl bg-gradient-to-r from-orange-600 to-red-600"
                  >
                    <User className="w-5 h-5" />
                    <span>Sign Up</span>
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 space-x-3 font-medium text-red-600 transition-all rounded-xl hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
