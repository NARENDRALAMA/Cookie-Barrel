"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Trash2, Plus, Minus, ShoppingBag, X } from "lucide-react";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } =
    useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    deliveryAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    contactInfo: {
      phone: "",
      email: user?.email || "",
    },
    paymentMethod: "cash",
    specialInstructions: "",
  });

  const subtotal = getCartTotal();
  const deliveryFee = subtotal >= 50 ? 0 : 5;
  const tax = subtotal * 0.1;
  const finalTotal = subtotal + deliveryFee + tax;

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    setShowCheckoutModal(true);
  };

  const handlePlaceOrder = async () => {
    setIsCheckingOut(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            specialInstructions: item.specialInstructions,
          })),
          deliveryAddress: orderDetails.deliveryAddress,
          contactInfo: {
            ...orderDetails.contactInfo,
            email: orderDetails.contactInfo.email || user?.email,
          },
          paymentMethod: orderDetails.paymentMethod,
          specialInstructions: orderDetails.specialInstructions,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Order placed successfully! 🎉");
        clearCart();
        setShowCheckoutModal(false);
        router.push("/track-order");
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some delicious items to get started!
          </p>
          <button onClick={() => router.push("/menu")} className="btn-primary">
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="card flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-gray-600">${item.price}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                💰 Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">
                    Subtotal (
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                    items)
                  </span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Delivery Fee</span>
                  <span
                    className={`font-semibold ${
                      deliveryFee === 0 ? "text-green-600" : ""
                    }`}
                  >
                    {deliveryFee === 0
                      ? "FREE 🎉"
                      : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Tax (10%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t-2 border-amber-300 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-amber-600">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-shadow"
              >
                {isCheckingOut ? "Processing..." : "🛒 Proceed to Checkout"}
              </button>

              {subtotal < 50 && subtotal > 0 && (
                <p className="text-sm text-amber-700 mt-3 text-center bg-amber-100 p-2 rounded">
                  💡 Add ${(50 - subtotal).toFixed(2)} more for free delivery!
                </p>
              )}

              {deliveryFee === 0 && (
                <p className="text-sm text-green-600 mt-3 text-center font-semibold">
                  ✅ You've unlocked free delivery!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Checkout Modal */}
        {showCheckoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Complete Your Order
                  </h2>
                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Order Summary in Modal */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-semibold">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span className="font-semibold">
                        {deliveryFee === 0
                          ? "FREE"
                          : `$${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-amber-600">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Delivery Address</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={orderDetails.deliveryAddress.street}
                      onChange={(e) =>
                        setOrderDetails({
                          ...orderDetails,
                          deliveryAddress: {
                            ...orderDetails.deliveryAddress,
                            street: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="City"
                        value={orderDetails.deliveryAddress.city}
                        onChange={(e) =>
                          setOrderDetails({
                            ...orderDetails,
                            deliveryAddress: {
                              ...orderDetails.deliveryAddress,
                              city: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={orderDetails.deliveryAddress.state}
                        onChange={(e) =>
                          setOrderDetails({
                            ...orderDetails,
                            deliveryAddress: {
                              ...orderDetails.deliveryAddress,
                              state: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={orderDetails.deliveryAddress.zipCode}
                      onChange={(e) =>
                        setOrderDetails({
                          ...orderDetails,
                          deliveryAddress: {
                            ...orderDetails.deliveryAddress,
                            zipCode: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={orderDetails.contactInfo.phone}
                      onChange={(e) =>
                        setOrderDetails({
                          ...orderDetails,
                          contactInfo: {
                            ...orderDetails.contactInfo,
                            phone: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={orderDetails.contactInfo.email}
                      onChange={(e) =>
                        setOrderDetails({
                          ...orderDetails,
                          contactInfo: {
                            ...orderDetails.contactInfo,
                            email: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Payment Method</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={orderDetails.paymentMethod === "cash"}
                        onChange={(e) =>
                          setOrderDetails({
                            ...orderDetails,
                            paymentMethod: e.target.value,
                          })
                        }
                        className="text-amber-600"
                      />
                      <span>💵 Cash on Delivery</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={orderDetails.paymentMethod === "card"}
                        onChange={(e) =>
                          setOrderDetails({
                            ...orderDetails,
                            paymentMethod: e.target.value,
                          })
                        }
                        className="text-amber-600"
                      />
                      <span>💳 Card on Delivery</span>
                    </label>
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">
                    Special Instructions (Optional)
                  </h3>
                  <textarea
                    placeholder="Any special requests for your order?"
                    value={orderDetails.specialInstructions}
                    onChange={(e) =>
                      setOrderDetails({
                        ...orderDetails,
                        specialInstructions: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows="3"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={
                      isCheckingOut ||
                      !orderDetails.deliveryAddress.street ||
                      !orderDetails.deliveryAddress.city ||
                      !orderDetails.deliveryAddress.state ||
                      !orderDetails.deliveryAddress.zipCode ||
                      !orderDetails.contactInfo.phone
                    }
                    className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCheckingOut
                      ? "Placing Order..."
                      : `Place Order - $${finalTotal.toFixed(2)}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
