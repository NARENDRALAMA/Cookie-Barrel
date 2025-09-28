import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Plus, Minus, Trash2, MessageCircle, CreditCard, Truck } from 'lucide-react'

const Cart = () => {
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [orderNotes, setOrderNotes] = useState('')

  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === 'welcome10') {
      setDiscount(total * 0.1)
    } else if (promoCode.toLowerCase() === 'student15') {
      setDiscount(total * 0.15)
    } else {
      alert('Invalid promo code')
    }
  }

  const finalTotal = total - discount

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setIsCheckingOut(true)
    
    // Simulate order processing
    setTimeout(() => {
      // Simulate WhatsApp integration
      const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase()
      const whatsappMessage = `🍪 *Cookie Barrel Order Confirmation* 🍪

Order #${orderNumber}
Total: $${finalTotal.toFixed(2)}

Your order has been received and is being prepared!
We'll send updates via WhatsApp.

Thank you for choosing Cookie Barrel! 🎉`

      // In a real app, this would integrate with WhatsApp Business API
      console.log('WhatsApp message:', whatsappMessage)
      
      // Clear cart and redirect to order tracking
      clearCart()
      navigate(`/track-order?order=${orderNumber}`)
    }, 2000)
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any delicious cookies to your cart yet!
            </p>
            <Link to="/menu" className="btn-primary">
              Browse Our Menu
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
              
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="text-4xl">{item.image}</div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">${item.price} each</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
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
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50"
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              {/* WhatsApp Integration Info */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-700">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">WhatsApp Integration</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Get order updates and tracking information directly on WhatsApp!
                </p>
              </div>

              {/* Continue Shopping */}
              <div className="mt-4 text-center">
                <Link to="/menu" className="text-primary-600 hover:text-primary-700 text-sm">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
