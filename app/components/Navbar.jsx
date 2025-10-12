"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
  const { getCartItemsCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  const cartItemCount = getCartItemsCount();

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
  }, [pathname]);

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <nav
      className={`navbar navbar-glass ${
        scrolled ? "shadow-xl" : "shadow-md"
      } transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-orange-600 to-red-600 p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Cookie className="h-7 w-7 text-white" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Cookie Barrel
              </span>
              <div className="text-xs text-gray-500 font-medium">
                Premium Baked Goods
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                isActive("/")
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              <HomeIcon className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/menu"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                isActive("/menu")
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              <UtensilsCrossed className="h-4 w-4" />
              <span>Menu</span>
            </Link>
            <Link
              href="/track-order"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                isActive("/track-order")
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Track Order</span>
            </Link>
            {user?.role === "admin" && (
              <Link
                href="/admin"
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
              href="/cart"
              className="relative p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all duration-200 group"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-orange-50 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
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
                    <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl py-2 z-50 border border-gray-200">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/track-order"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-5 py-2 text-gray-700 hover:text-orange-600 font-medium rounded-lg hover:bg-orange-50 transition-all duration-200"
                >
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="pt-4 space-y-2 bg-white/50 backdrop-blur-sm rounded-2xl p-4 mt-4 border border-gray-100">
              <Link
                href="/"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive("/")
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-700 hover:bg-orange-50"
                }`}
              >
                <HomeIcon className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link
                href="/menu"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive("/menu")
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-700 hover:bg-orange-50"
                }`}
              >
                <UtensilsCrossed className="h-5 w-5" />
                <span>Menu</span>
              </Link>
              <Link
                href="/track-order"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive("/track-order")
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-700 hover:bg-orange-50"
                }`}
              >
                <Package className="h-5 w-5" />
                <span>Track Order</span>
              </Link>
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive("/admin")
                      ? "bg-orange-100 text-orange-600"
                      : "text-gray-700 hover:bg-orange-50"
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>Admin</span>
                </Link>
              )}

              {!user ? (
                <>
                  <Link
                    href="/login"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 font-medium transition-all"
                  >
                    <User className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold shadow-lg"
                  >
                    <User className="h-5 w-5" />
                    <span>Sign Up</span>
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-all"
                >
                  <LogOut className="h-5 w-5" />
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
