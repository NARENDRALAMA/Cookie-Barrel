import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  CreditCard,
  Truck,
  X,
  MapPin,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Smartphone,
  User,
  Home,
  Package,
} from "lucide-react";

const Cart = () => {
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [orderNotes, setOrderNotes] = useState("");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Checkout form state
  const [checkoutData, setCheckoutData] = useState({
    deliveryType: "delivery", // 'delivery' or 'pickup'
    customerName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postcode: "",
    paymentMethod: "cash", // 'cash' or 'card'
    specialInstructions: "",
    deliveryTime: "asap", // 'asap' or 'scheduled'
  });

  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setDiscount(total * 0.1);
    } else if (promoCode.toLowerCase() === "student15") {
      setDiscount(total * 0.15);
    } else {
      alert("Invalid promo code");
    }
  };

  const finalTotal = total - discount;
  const deliveryFee = checkoutData.deliveryType === "delivery" ? 5.0 : 0;
  const tax = (total - discount + deliveryFee) * 0.1;
  const grandTotal = total - discount + deliveryFee + tax;

  const handleInputChange = (field, value) => {
    setCheckoutData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openCheckoutModal = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowCheckoutModal(true);
  };

  const closeCheckoutModal = () => {
    setShowCheckoutModal(false);
  };

  const validateCheckoutForm = () => {
    const requiredFields = ["customerName", "phone", "email"];
    if (checkoutData.deliveryType === "delivery") {
      requiredFields.push("address", "city", "state", "postcode");
    }

    return requiredFields.every((field) => checkoutData[field].trim() !== "");
  };

  const handlePlaceOrder = async () => {
    if (!validateCheckoutForm()) {
      alert("Please fill in all required fields");
      return;
    }

    setIsCheckingOut(true);

    // Simulate order processing
    setTimeout(() => {
      // Simulate WhatsApp integration
      const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
      const whatsappMessage = `🍪 *Cookie Barrel Order Confirmation* 🍪

Order #${orderNumber}
Customer: ${checkoutData.customerName}
Phone: ${checkoutData.phone}
${
  checkoutData.deliveryType === "delivery"
    ? `Address: ${checkoutData.address}, ${checkoutData.city}, ${checkoutData.state} ${checkoutData.postcode}`
    : "Pickup Order"
}
Payment: ${
        checkoutData.paymentMethod === "cash"
          ? "Cash on Delivery"
          : "Card on Delivery"
      }
Total: $${grandTotal.toFixed(2)}

${cart
  .map(
    (item) =>
      `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(
        2
      )}`
  )
  .join("\n")}

Your order has been received and is being prepared!
We'll send updates via WhatsApp.

Thank you for choosing Cookie Barrel! 🎉`;

      // In a real app, this would integrate with WhatsApp Business API
      console.log("WhatsApp message:", whatsappMessage);

      // Clear cart and redirect to order tracking
      clearCart();
      setShowCheckoutModal(false);
      navigate(`/track-order?order=${orderNumber}`);
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any delicious cookies to your cart
              yet!
            </p>
            <Link to="/menu" className="btn-primary">
              Browse Our Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Shopping Cart
              </h1>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="text-4xl">{item.image}</div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ${item.price} each
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Promo Code */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="input-field flex-1"
                  />
                  <button
                    onClick={handlePromoCode}
                    className="btn-secondary whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Try: WELCOME10 (10% off) or STUDENT15 (15% off)
                </p>
              </div>

              {/* Order Notes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Notes
                </label>
                <textarea
                  placeholder="Special instructions, allergies, etc."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="input-field"
                  rows="3"
                />
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={openCheckoutModal}
                className="w-full btn-primary py-3 text-lg"
              >
                Complete Your Order
              </button>

              {/* WhatsApp Integration Info */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-700">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    WhatsApp Integration
                  </span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Get order updates and tracking information directly on
                  WhatsApp!
                </p>
              </div>

              {/* Continue Shopping */}
              <div className="mt-4 text-center">
                <Link
                  to="/menu"
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Complete Your Order
              </h2>
              <button
                onClick={closeCheckoutModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Order Form */}
                <div className="space-y-6">
                  {/* Delivery Type */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Truck className="h-5 w-5 mr-2 text-orange-600" />
                      Delivery Options
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() =>
                          handleInputChange("deliveryType", "delivery")
                        }
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          checkoutData.deliveryType === "delivery"
                            ? "border-orange-500 bg-orange-50 text-orange-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Truck className="h-6 w-6 mx-auto mb-2" />
                        <div className="font-medium">Delivery</div>
                        <div className="text-sm text-gray-600">$5.00 fee</div>
                      </button>
                      <button
                        onClick={() =>
                          handleInputChange("deliveryType", "pickup")
                        }
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          checkoutData.deliveryType === "pickup"
                            ? "border-orange-500 bg-orange-50 text-orange-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Home className="h-6 w-6 mx-auto mb-2" />
                        <div className="font-medium">Pickup</div>
                        <div className="text-sm text-gray-600">Free</div>
                      </button>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-orange-600" />
                      Customer Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={checkoutData.customerName}
                          onChange={(e) =>
                            handleInputChange("customerName", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Phone className="h-4 w-4 inline mr-1" />
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            value={checkoutData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Mail className="h-4 w-4 inline mr-1" />
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={checkoutData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {checkoutData.deliveryType === "delivery" && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                        Delivery Address
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address *
                          </label>
                          <input
                            type="text"
                            value={checkoutData.address}
                            onChange={(e) =>
                              handleInputChange("address", e.target.value)
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="123 Main Street, Apartment 4B"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              value={checkoutData.city}
                              onChange={(e) =>
                                handleInputChange("city", e.target.value)
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              placeholder="Sydney"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State *
                            </label>
                            <input
                              type="text"
                              value={checkoutData.state}
                              onChange={(e) =>
                                handleInputChange("state", e.target.value)
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              placeholder="NSW"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Postcode *
                            </label>
                            <input
                              type="text"
                              value={checkoutData.postcode}
                              onChange={(e) =>
                                handleInputChange("postcode", e.target.value)
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              placeholder="2000"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-orange-600" />
                      Payment Method
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() =>
                          handleInputChange("paymentMethod", "cash")
                        }
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          checkoutData.paymentMethod === "cash"
                            ? "border-orange-500 bg-orange-50 text-orange-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <DollarSign className="h-6 w-6 mx-auto mb-2" />
                        <div className="font-medium">Cash on Delivery</div>
                        <div className="text-sm text-gray-600">
                          Pay when delivered
                        </div>
                      </button>
                      <button
                        onClick={() =>
                          handleInputChange("paymentMethod", "card")
                        }
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          checkoutData.paymentMethod === "card"
                            ? "border-orange-500 bg-orange-50 text-orange-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <CreditCard className="h-6 w-6 mx-auto mb-2" />
                        <div className="font-medium">Card on Delivery</div>
                        <div className="text-sm text-gray-600">
                          Pay with card when delivered
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-orange-600" />
                      Special Instructions
                    </h3>
                    <textarea
                      value={checkoutData.specialInstructions}
                      onChange={(e) =>
                        handleInputChange("specialInstructions", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      rows="4"
                      placeholder="Any special requests, allergies, or delivery instructions..."
                    />
                  </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-orange-600" />
                    Order Summary
                  </h3>

                  {/* Cart Items */}
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{item.image}</div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-3">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>${grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isCheckingOut}
                    className="w-full bg-orange-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCheckingOut ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Order...
                      </div>
                    ) : (
                      `Place Order - $${grandTotal.toFixed(2)}`
                    )}
                  </button>

                  {/* WhatsApp Integration Info */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-700 mb-2">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        WhatsApp Updates
                      </span>
                    </div>
                    <p className="text-xs text-blue-600">
                      You'll receive order confirmation and tracking updates
                      directly on WhatsApp!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
