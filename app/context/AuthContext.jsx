"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and user data
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    // Clear any conflicting sessions from other auth systems
    if (token && userData) {
      // If we have Next.js auth data, clear React Router auth
      localStorage.removeItem("cookieBarrelToken");
    } else {
      // If no Next.js auth, clear our data (React Router has the session)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Clear any existing sessions to prevent conflicts
        localStorage.removeItem("cookieBarrelToken");
        // Don't clear token/user here yet - we'll set them below

        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Login failed. Please try again." };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        // Clear any existing sessions to prevent conflicts
        localStorage.removeItem("cookieBarrelToken");
        // Don't clear token/user here yet - we'll set them below

        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: "Registration failed. Please try again.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    // Clear all sessions to prevent conflicts
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cookieBarrelToken");
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    getToken,
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
