"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  UtensilsCrossed,
  XCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
} from "lucide-react";

const MyOrders = () => {
  const { isAuthenticated, getToken, user, authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    // Wait for auth context to finish loading
    if (authLoading) {
      return;
    }

    // Check authentication - verify both token and user state
    const token = getToken();
    const isAuth = !!user || !!token;

    if (!isAuth) {
      router.push("/login");
      return;
    }

    // Fetch orders once authenticated
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const token = getToken();

      // Ensure we have a token before making the request
      if (!token) {
        console.error("No token available");
        setError("Please login to view your orders.");
        router.push("/login");
        return;
      }

      const response = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      // If unauthorized, redirect to login
      if (response.status === 401) {
        console.error("Unauthorized:", data.message);
        setError("Session expired. Please login again.");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      if (!response.ok) {
        console.error("API error:", data);
        setError(data.message || "Failed to fetch orders. Please try again.");
        return;
      }

      if (data.success) {
        setOrders(data.data || []);
        if (data.data && data.data.length === 0) {
          // No orders found, but this is not an error
          setError("");
        }
      } else {
        setError(data.message || "Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case "preparing":
        return <UtensilsCrossed className="w-4 h-4 text-orange-600" />;
      case "ready":
        return <Package className="w-4 h-4 text-purple-600" />;
      case "out_for_delivery":
        return <Truck className="w-4 h-4 text-indigo-600" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-orange-100 text-orange-800",
      ready: "bg-purple-100 text-purple-800",
      out_for_delivery: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[statusLower] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") return true;
    return order.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-extrabold text-orange-600 mb-6 text-center">
            My Orders
          </h2>
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-extrabold text-orange-600 mb-6 text-center">
            My Orders
          </h2>
          <div className="text-center py-10 text-red-600 font-medium">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-orange-600 mb-6 text-center">
          My Orders
        </h2>

        {/* Status Filters */}
        <div className="mb-6 flex flex-wrap gap-3 justify-center">
          {["all", "pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filterStatus === status
                  ? "bg-orange-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status === "all" ? "All" : getStatusText(status)}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-md mt-2">
              {filterStatus === "all"
                ? "You haven't placed any orders yet. Start ordering from our delicious menu!"
                : `No orders with status "${getStatusText(filterStatus)}"`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleExpand(order._id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-gray-800">
                      Order #{order.orderNumber}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold text-orange-600">
                      ${(order.finalAmount || order.totalAmount || 0).toFixed(2)}
                    </span>
                    {expandedOrder === order._id ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </div>

                {expandedOrder === order._id && (
                  <div className="p-6 border-t border-gray-200 bg-white">
                    {/* Order Date */}
                    <div className="mb-4 pb-4 border-b">
                      <p className="text-sm text-gray-600">
                        Placed on: {new Date(order.createdAt).toLocaleString()}
                      </p>
                      {order.estimatedDeliveryTime && (
                        <p className="text-sm text-gray-600 mt-1">
                          Estimated Delivery: {new Date(order.estimatedDeliveryTime).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Order Items */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                          <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                          <span>Order Items</span>
                        </h3>
                        <div className="space-y-3">
                          {order.items?.map((item, itemIndex) => {
                            const isUrl =
                              item.product?.image &&
                              typeof item.product.image === "string" &&
                              item.product.image.startsWith("http");
                            const isEmoji =
                              item.product?.image &&
                              typeof item.product.image === "string" &&
                              item.product.image.length <= 5;

                            return (
                              <div
                                key={itemIndex}
                                className="flex items-center space-x-4 bg-gray-50 p-3 rounded-md"
                              >
                                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-lg bg-white shadow-sm">
                                  {isUrl ? (
                                    <img
                                      src={item.product.image}
                                      alt={item.product.name}
                                      className="w-full h-full object-cover rounded-lg"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.nextSibling.style.display = "flex";
                                      }}
                                    />
                                  ) : null}
                                  <div className={`text-3xl ${isUrl ? "hidden" : ""}`}>
                                    {isEmoji ? item.product.image : "🍪"}
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">
                                    {item.product?.name || "Unknown Product"}
                                  </h4>
                                  <p className="text-gray-600 text-sm">
                                    Quantity: {item.quantity} × ${(item.price || 0).toFixed(2)}
                                  </p>
                                  {item.specialInstructions && (
                                    <p className="text-sm text-gray-500 mt-1">
                                      Note: {item.specialInstructions}
                                    </p>
                                  )}
                                </div>
                                <span className="font-semibold text-gray-800">
                                  ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Delivery Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                          <MapPin className="w-5 h-5 text-orange-500" />
                          <span>Delivery Information</span>
                        </h3>
                        <div className="space-y-2 text-gray-700 text-sm">
                          {order.deliveryAddress && (
                            <div>
                              <p className="font-medium mb-1">Address:</p>
                              <p className="text-gray-600">
                                {order.deliveryAddress.street}
                                <br />
                                {order.deliveryAddress.city}, {order.deliveryAddress.state}{" "}
                                {order.deliveryAddress.zipCode}
                              </p>
                            </div>
                          )}
                          {order.contactInfo && (
                            <div className="mt-3">
                              <p className="font-medium mb-1">Contact:</p>
                              <p className="text-gray-600">
                                {order.contactInfo.phone && `Phone: ${order.contactInfo.phone}`}
                                <br />
                                {order.contactInfo.email && `Email: ${order.contactInfo.email}`}
                              </p>
                            </div>
                          )}
                          {order.specialInstructions && (
                            <div className="mt-3">
                              <p className="font-medium mb-1">Special Instructions:</p>
                              <p className="text-gray-600">{order.specialInstructions}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-gray-700 text-sm">
                          <span>Subtotal:</span>
                          <span>${(order.totalAmount || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-700 text-sm">
                          <span>Delivery Fee:</span>
                          <span>
                            {(order.deliveryFee || 0) === 0
                              ? "Free"
                              : `$${(order.deliveryFee || 0).toFixed(2)}`}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-700 text-sm">
                          <span>Tax:</span>
                          <span>${(order.tax || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2 mt-2">
                          <span>Total:</span>
                          <span className="text-orange-600">
                            ${(order.finalAmount || order.totalAmount || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

