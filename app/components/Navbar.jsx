"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ShoppingCart, User, Menu as MenuIcon, X, Cookie } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const router = useRouter();

  // Simplified admin detection
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          const isAdmin = user.role === "admin" || user.role === "manager";
          setIsAdminLoggedIn(isAdmin);
        } catch (error) {
          setIsAdminLoggedIn(false);
        }
      } else {
        setIsAdminLoggedIn(false);
      }
    };

    checkAdminStatus();
    // Check every 2 seconds instead of 1 second to reduce load
    const interval = setInterval(checkAdminStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  // Use user from AuthContext or fallback to localStorage
  const displayUser =
    user ||
    (() => {
      try {
        const userData = localStorage.getItem("user");
        return userData ? JSON.parse(userData) : null;
      } catch {
        return null;
      }
    })();

  // Ensure user menu is closed on mount and when user changes
  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const cartItemCount = getCartItemsCount();

  return (
    <nav
      className={`${
        isAdminLoggedIn
          ? "bg-gradient-to-r from-orange-600 to-orange-700 shadow-lg"
          : "bg-white shadow-md"
      } fixed top-0 left-0 right-0 z-50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Cookie
              className={`h-8 w-8 ${
                isAdminLoggedIn ? "text-white" : "text-cookie-600"
              }`}
            />
            <span
              className={`text-xl font-bold ${
                isAdminLoggedIn ? "text-white" : "text-gray-900"
              }`}
            >
              Cookie Barrel
            </span>
            {isAdminLoggedIn && (
              <span className="ml-2 px-2 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
                ADMIN
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`${
                isAdminLoggedIn
                  ? "text-white hover:text-orange-200"
                  : "text-gray-700 hover:text-orange-600"
              } transition-colors font-medium`}
            >
              Home
            </Link>
            <Link
              href="/menu"
              className={`${
                isAdminLoggedIn
                  ? "text-white hover:text-orange-200"
                  : "text-gray-700 hover:text-orange-600"
              } transition-colors font-medium`}
            >
              Menu
            </Link>
            <Link
              href="/track-order"
              className={`${
                isAdminLoggedIn
                  ? "text-white hover:text-orange-200"
                  : "text-gray-700 hover:text-orange-600"
              } transition-colors font-medium`}
            >
              Track Order
            </Link>
            {!isAdminLoggedIn && !user && (
              <Link
                href="/manager-login"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
              >
                Admin Login
              </Link>
            )}
            {isAdminLoggedIn && (
              <Link
                href="/admin-dashboard"
                className="text-white hover:text-orange-200 transition-colors font-medium"
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Right side - Cart, User, Login */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              href="/cart"
              className={`relative p-2 ${
                isAdminLoggedIn
                  ? "text-white hover:text-orange-200"
                  : "text-gray-700 hover:text-orange-600"
              } transition-colors`}
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 ${
                    isAdminLoggedIn
                      ? "bg-white text-orange-600"
                      : "bg-orange-600 text-white"
                  } text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold`}
                >
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {displayUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center space-x-2 ${
                    isAdminLoggedIn
                      ? "text-white hover:text-orange-200"
                      : "text-gray-700 hover:text-orange-600"
                  } transition-colors ${
                    isAdminLoggedIn ? "bg-white/10" : "bg-gray-50"
                  } px-3 py-2 rounded-lg hover:bg-white/20`}
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block font-medium">
                    {displayUser.name}
                  </span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {displayUser.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {displayUser.email}
                        </p>
                        {displayUser.role === "admin" && (
                          <span className="inline-block mt-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                            Administrator
                          </span>
                        )}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg
                          className="inline w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : isAdminLoggedIn ? null : !displayUser && !isAdminLoggedIn ? ( // Show nothing when admin is logged in (white navbar user menu not needed)
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-orange-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            ) : null}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 ${
                isAdminLoggedIn
                  ? "text-white hover:text-orange-200"
                  : "text-gray-700 hover:text-orange-600"
              } transition-colors`}
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
          <div className="md:hidden">
            <div
              className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${
                isAdminLoggedIn ? "bg-orange-600/95" : "bg-white"
              } border-t`}
            >
              <Link
                href="/"
                className={`block px-3 py-2 ${
                  isAdminLoggedIn
                    ? "text-white hover:text-orange-200"
                    : "text-gray-700 hover:text-orange-600"
                } transition-colors font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/menu"
                className={`block px-3 py-2 ${
                  isAdminLoggedIn
                    ? "text-white hover:text-orange-200"
                    : "text-gray-700 hover:text-orange-600"
                } transition-colors font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Menu
              </Link>
              <Link
                href="/track-order"
                className={`block px-3 py-2 ${
                  isAdminLoggedIn
                    ? "text-white hover:text-orange-200"
                    : "text-gray-700 hover:text-orange-600"
                } transition-colors font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Track Order
              </Link>
              {!isAdminLoggedIn && !user && (
                <Link
                  href="/manager-login"
                  className="block px-3 py-2 bg-orange-600 text-white hover:bg-orange-700 transition-colors font-semibold rounded-lg mx-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Login
                </Link>
              )}
              {isAdminLoggedIn && (
                <Link
                  href="/admin-dashboard"
                  className={`block px-3 py-2 ${
                    isAdminLoggedIn
                      ? "text-white hover:text-orange-200"
                      : "text-gray-700 hover:text-orange-600"
                  } transition-colors font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              {!displayUser && !isAdminLoggedIn && (
                <>
                  <Link
                    href="/login"
                    className={`block px-3 py-2 ${
                      isAdminLoggedIn
                        ? "text-white hover:text-orange-200"
                        : "text-gray-700 hover:text-orange-600"
                    } transition-colors font-medium`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 bg-orange-600 text-white hover:bg-orange-700 transition-colors font-semibold rounded-lg mx-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
