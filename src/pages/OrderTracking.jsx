import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  Truck,
  MessageCircle,
  Phone,
  MapPin,
  Package,
  ChefHat,
  Check,
} from "lucide-react";

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order") || "DEMO123";
  const [currentStep, setCurrentStep] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState("25-30 minutes");

  // Mock order data
  const order = {
    number: orderNumber,
    items: [
      { name: "Chocolate Chip Cookies", quantity: 2, price: 2.99, emoji: "🍪" },
      {
        name: "Gluten-Free Almond Cookies",
        quantity: 1,
        price: 3.99,
        emoji: "🥜",
      },
    ],
    total: 9.97,
    status: "preparing",
    createdAt: new Date().toLocaleString(),
    estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toLocaleString(),
    deliveryAddress: "123 Main Street, Apt 4B, New York, NY 10001",
  };

  const steps = [
    {
      id: "ordered",
      title: "Order Confirmed",
      description: "Your order has been received",
      icon: <Check className="h-6 w-6" />,
      color: "green",
      completed: true,
    },
    {
      id: "preparing",
      title: "Preparing Your Order",
      description: "Our chefs are baking your treats",
      icon: <ChefHat className="h-6 w-6" />,
      color: "orange",
      completed: currentStep >= 1,
    },
    {
      id: "ready",
      title: "Ready for Delivery",
      description: "Your order is packed and ready",
      icon: <Package className="h-6 w-6" />,
      color: "blue",
      completed: currentStep >= 2,
    },
    {
      id: "delivered",
      title: "On the Way",
      description: "Your order is being delivered",
      icon: <Truck className="h-6 w-6" />,
      color: "purple",
      completed: currentStep >= 3,
    },
  ];

  useEffect(() => {
    // Simulate order progress
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 3) {
          return prev + 1;
        }
        return prev;
      });
    }, 10000); // Update every 10 seconds for demo

    return () => clearInterval(timer);
  }, []);

  const handleWhatsAppContact = () => {
    const message = `Hi! I have a question about my order #${orderNumber}`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCall = () => {
    window.open("tel:+1234567890", "_blank");
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-orange-50/50 via-white to-red-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-orange-600 to-red-600 p-4 rounded-full shadow-xl">
                <Package className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Track Your <span className="gradient-text">Order</span>
          </h1>
          <p className="text-xl text-gray-600 mb-2">Order Number</p>
          <div className="inline-flex items-center px-6 py-3 bg-white border-2 border-orange-200 rounded-xl shadow-lg">
            <span className="text-2xl font-bold text-orange-600">
              #{orderNumber}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Progress - Main Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Timeline */}
            <div className="glass rounded-3xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Order Progress
              </h2>

              {/* Progress Bar */}
              <div className="mb-10">
                <div className="relative">
                  <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-gradient-to-r from-orange-600 to-red-600 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${(currentStep / (steps.length - 1)) * 100}%`,
                      }}
                    ></div>
                  </div>

                  <div className="relative flex justify-between">
                    {steps.map((step, index) => (
                      <div key={step.id} className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                            step.completed
                              ? "bg-gradient-to-r from-orange-600 to-red-600 text-white scale-110"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          {step.icon}
                        </div>
                        <div className="mt-3 text-center max-w-[100px]">
                          <p
                            className={`text-xs font-semibold ${
                              step.completed ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {step.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Current Status Details */}
              <div className="space-y-4">
                {steps.map(
                  (step, index) =>
                    step.completed && (
                      <div
                        key={step.id}
                        className={`p-5 rounded-2xl border-l-4 ${
                          index === currentStep
                            ? "bg-gradient-to-r from-orange-50 to-red-50 border-orange-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              index === currentStep
                                ? "bg-gradient-to-r from-orange-600 to-red-600 text-white"
                                : "bg-white text-gray-600"
                            }`}
                          >
                            {step.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">
                              {step.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {step.description}
                            </p>

                            {/* Step-specific messages */}
                            {step.id === "preparing" && currentStep >= 1 && (
                              <div className="mt-3 p-3 bg-white rounded-lg border border-orange-200">
                                <p className="text-sm text-gray-700 flex items-center">
                                  <span className="text-2xl mr-2">👨‍🍳</span>
                                  Your treats are being freshly baked! Estimated
                                  time:{" "}
                                  <strong className="ml-1 text-orange-600">
                                    {estimatedTime}
                                  </strong>
                                </p>
                              </div>
                            )}

                            {step.id === "ready" && currentStep >= 2 && (
                              <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                                <p className="text-sm text-gray-700 flex items-center">
                                  <span className="text-2xl mr-2">✅</span>
                                  Perfect! Your order is ready and will be on
                                  its way shortly.
                                </p>
                              </div>
                            )}

                            {step.id === "delivered" && currentStep >= 3 && (
                              <div className="mt-3 p-3 bg-white rounded-lg border border-purple-200">
                                <p className="text-sm text-gray-700 flex items-center">
                                  <span className="text-2xl mr-2">🚚</span>
                                  Your order is on the way! Expected arrival in
                                  10-15 minutes.
                                </p>
                              </div>
                            )}
                          </div>
                          {index === currentStep && (
                            <div className="animate-pulse">
                              <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>

            {/* Order Details */}
            <div className="glass rounded-3xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Details
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                  <span className="text-gray-700 font-medium">
                    Order Number
                  </span>
                  <span className="font-bold text-orange-600">
                    #{order.number}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-700 font-medium">Order Date</span>
                  <span className="font-semibold text-gray-900">
                    {order.createdAt}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-700 font-medium">
                    Estimated Delivery
                  </span>
                  <span className="font-semibold text-gray-900">
                    {order.estimatedDelivery}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl">
                  <span className="text-gray-700 font-medium">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-gray-700 font-medium block mb-1">
                        Delivery Address
                      </span>
                      <span className="text-gray-600 text-sm">
                        {order.deliveryAddress}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Items */}
            <div className="glass rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
                <Package className="h-5 w-5 mr-2 text-orange-600" />
                Order Items
              </h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-3xl">{item.emoji}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact & Support */}
            <div className="glass rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-5">
                Need Help?
              </h3>

              <div className="space-y-3">
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Chat on WhatsApp</span>
                </button>

                <button
                  onClick={handleCall}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Phone className="h-5 w-5" />
                  <span>Call Us</span>
                </button>
              </div>

              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-2 text-blue-700 mb-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-bold">
                    WhatsApp Updates Active
                  </span>
                </div>
                <p className="text-xs text-blue-600">
                  You'll receive real-time updates about your order progress
                  directly on WhatsApp! 📱
                </p>
              </div>
            </div>

            {/* Store Information */}
            <div className="glass rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-5">
                Store Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      Location
                    </p>
                    <p className="text-xs text-gray-600">
                      123 Cookie Street, Bakery City
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Clock className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Hours</p>
                    <p className="text-xs text-gray-600">
                      Open: 8 AM - 8 PM Daily
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      Contact
                    </p>
                    <p className="text-xs text-gray-600">+1 (234) 567-8900</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
