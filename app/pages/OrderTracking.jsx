"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated, getToken } = useAuth();

  const statusConfig = {
    pending: { color: "text-yellow-600", bg: "bg-yellow-100", icon: Clock },
    confirmed: { color: "text-blue-600", bg: "bg-blue-100", icon: CheckCircle },
    preparing: { color: "text-orange-600", bg: "bg-orange-100", icon: Package },
    ready: { color: "text-green-600", bg: "bg-green-100", icon: CheckCircle },
    out_for_delivery: {
      color: "text-purple-600",
      bg: "bg-purple-100",
      icon: Truck,
    },
    delivered: {
      color: "text-green-600",
      bg: "bg-green-100",
      icon: CheckCircle,
    },
    cancelled: { color: "text-red-600", bg: "bg-red-100", icon: XCircle },
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const token = getToken();
      const headers = {
        "Content-Type": "application/json",
      };
      
      // Add authorization header if user is authenticated
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // Try to fetch order - if not authenticated, show message to login
      const response = await fetch(
        `/api/orders?orderNumber=${encodeURIComponent(orderNumber.trim().toUpperCase())}`,
        { headers }
      );

      const data = await response.json();

      if (response.status === 401) {
        setError("Please login to track your orders. You can only track your own orders.");
        return;
      }

      if (data.success && data.data && data.data.length > 0) {
        setOrder(data.data[0]);
      } else {
        setError("Order not found. Please check your order number and make sure you're logged in with the account that placed the order.");
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      setError("Failed to fetch order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusText = (status) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Track Your Order
          </h1>
          <p className="text-xl text-gray-600">
            Enter your order number to track the status of your order
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-md mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Enter order number (e.g., CB000001)"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !orderNumber.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Searching..." : "Track"}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Order Header */}
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order #{order.orderNumber}
                  </h2>
                  <p className="text-gray-600">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      statusConfig[order.status]?.color
                    } ${statusConfig[order.status]?.bg}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items
              </h3>
              <div className="space-y-3">
                {order.items.map((item, index) => {
                  const isUrl = item.product?.image && typeof item.product.image === "string" && item.product.image.startsWith("http");
                  const isEmoji = item.product?.image && typeof item.product.image === "string" && item.product.image.length <= 5;
                  
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                        {isUrl ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
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
                          {item.product?.name || "Product"}
                        </h4>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                        {item.specialInstructions && (
                          <p className="text-sm text-gray-500">
                            Note: {item.specialInstructions}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${(order.totalAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>
                    {(order.deliveryFee || 0) === 0
                      ? "Free"
                      : `$${(order.deliveryFee || 0).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(order.tax || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>${(order.finalAmount || order.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="px-6 py-4 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delivery Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Delivery Address
                  </h4>
                  <p className="text-gray-600">
                    {order.deliveryAddress.street}
                    <br />
                    {order.deliveryAddress.city}, {order.deliveryAddress.state}{" "}
                    {order.deliveryAddress.zipCode}
                    <br />
                    {order.deliveryAddress.country}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Contact Information
                  </h4>
                  <p className="text-gray-600">
                    {order.contactInfo.phone}
                    <br />
                    {order.contactInfo.email}
                  </p>
                </div>
              </div>
              {order.specialInstructions && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Special Instructions
                  </h4>
                  <p className="text-gray-600">{order.specialInstructions}</p>
                </div>
              )}
            </div>

            {/* Estimated Delivery */}
            {order.estimatedDeliveryTime && (
              <div className="px-6 py-4 bg-blue-50 border-t">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-blue-800 font-medium">
                    Estimated Delivery:{" "}
                    {formatDate(order.estimatedDeliveryTime)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Having trouble finding your order?{" "}
            <a
              href="mailto:support@cookiebarrel.com"
              className="text-primary-600 hover:text-primary-500"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;

