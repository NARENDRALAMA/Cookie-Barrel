"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ManagerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", { email });
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      // Check if login was successful - be more lenient with response checking
      if (data.token) {
        console.log("Login successful! Token received, user:", data.user);
        // Check if user is manager or admin
        if (
          data.user &&
          (data.user.role === "manager" || data.user.role === "admin")
        ) {
          console.log("User role is admin/manager, storing credentials...");
          // Clear any existing user sessions to prevent conflicts
          localStorage.removeItem("cookieBarrelToken");

          // Store token and user data
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          console.log("Redirecting to admin dashboard...");
          // Redirect to manager dashboard
          router.push("/admin-dashboard");
        } else {
          console.log("Access denied - user role:", data.user?.role);
          setError(
            "Access denied. This login is for admins only. Your role is: " +
              (data.user?.role || "customer")
          );
        }
      } else {
        // Show detailed error message
        const errorMsg =
          data.message ||
          data.errors?.[0]?.msg ||
          "Login failed. Please check your credentials.";
        setError(errorMsg);
        console.log("Login failed, full response:", data);
      }
    } catch (err) {
      setError(
        `An error occurred: ${err.message}. Please check your connection and try again.`
      );
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-orange-100 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Sign in to access the admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg font-semibold">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="admin@cookiebarrel.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "⏳ Signing in..." : "🔐 Sign In to Dashboard"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Forgot your password?{" "}
            <a href="#" className="text-orange-600 hover:text-orange-700">
              Contact Admin
            </a>
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 mb-2">
            Note: Admin accounts are pre-configured and cannot be
            self-registered.
          </p>
          <a
            href="/login"
            className="text-sm text-gray-600 hover:text-orange-600"
          >
            ← Back to Customer Login
          </a>
        </div>
      </div>
    </div>
  );
}
