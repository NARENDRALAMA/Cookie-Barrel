import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Clock, CheckCircle, Truck, MessageCircle, Phone, MapPin } from 'lucide-react'

const OrderTracking = () => {
  const [searchParams] = useSearchParams()
  const orderNumber = searchParams.get('order') || 'DEMO123'
  const [currentStep, setCurrentStep] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState('25-30 minutes')

  // Mock order data
  const order = {
    number: orderNumber,
    items: [
      { name: 'Chocolate Chip Cookies', quantity: 2, price: 2.99 },
      { name: 'Gluten-Free Almond Cookies', quantity: 1, price: 3.99 }
    ],
    total: 9.97,
    status: 'preparing',
    createdAt: new Date().toLocaleString(),
    estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toLocaleString()
  }

  const steps = [
    {
      id: 'ordered',
      title: 'Order Placed',
      description: 'Your order has been received',
      icon: <CheckCircle className="h-6 w-6" />,
      completed: true
    },
    {
      id: 'preparing',
      title: 'Preparing',
      description: 'Your cookies are being baked',
      icon: <Clock className="h-6 w-6" />,
      completed: currentStep >= 1
    },
    {
      id: 'ready',
      title: 'Ready',
      description: 'Your order is ready for pickup/delivery',
      icon: <CheckCircle className="h-6 w-6" />,
      completed: currentStep >= 2
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Enjoy your delicious cookies!',
      icon: <Truck className="h-6 w-6" />,
      completed: currentStep >= 3
    }
  ]

  useEffect(() => {
    // Simulate order progress
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 3) {
          return prev + 1
        }
        return prev
      })
    }, 10000) // Update every 10 seconds for demo

    return () => clearInterval(timer)
  }, [])

  const handleWhatsAppContact = () => {
    const message = `Hi! I have a question about my order #${orderNumber}`
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleCall = () => {
    window.open('tel:+1234567890', '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Order #{orderNumber}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Progress */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Progress</h2>
              
              {/* Progress Steps */}
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-4">
                    {/* Step Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.icon}
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        step.completed ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-sm ${
                        step.completed ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                      
                      {/* Step-specific details */}
                      {step.id === 'preparing' && currentStep >= 1 && (
                        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            🍪 Your cookies are in the oven! Estimated time: {estimatedTime}
                          </p>
                        </div>
                      )}
                      
                      {step.id === 'ready' && currentStep >= 2 && (
                        <div className="mt-2 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-700">
                            ✅ Your order is ready! You can pick it up or we'll deliver it soon.
                          </p>
                        </div>
                      )}
                      
                      {step.id === 'delivered' && currentStep >= 3 && (
                        <div className="mt-2 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-700">
                            🎉 Enjoy your delicious cookies! Thank you for choosing Cookie Barrel.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Step Status */}
                    <div className="flex-shrink-0">
                      {step.completed ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details */}
            <div className="card mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{order.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">{order.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <span className="font-medium">{order.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-lg text-primary-600">${order.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Order Items */}
            <div className="card mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-500 text-sm ml-2">x{item.quantity}</span>
                    </div>
                    <span className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact & Support */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat on WhatsApp</span>
                </button>
                
                <button
                  onClick={handleCall}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Us</span>
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-700 mb-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">WhatsApp Updates</span>
                </div>
                <p className="text-xs text-blue-600">
                  You'll receive real-time updates about your order directly on WhatsApp!
                </p>
              </div>
            </div>

            {/* Store Information */}
            <div className="card mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Store Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">123 Cookie Street, Bakery City</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Open: 8 AM - 8 PM</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">+1 (234) 567-8900</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderTracking
