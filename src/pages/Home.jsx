import React from 'react'
import { Link } from 'react-router-dom'
import { Cookie, Clock, Truck, MessageCircle, Star } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: <Cookie className="h-8 w-8 text-cookie-600" />,
      title: "Fresh Baked Cookies",
      description: "Handcrafted cookies made with premium ingredients and baked fresh daily."
    },
    {
      icon: <Clock className="h-8 w-8 text-primary-600" />,
      title: "Quick Ordering",
      description: "Order in seconds with our intuitive mobile app and get your cookies fast."
    },
    {
      icon: <Truck className="h-8 w-8 text-green-600" />,
      title: "Fast Delivery",
      description: "Same-day delivery available for orders placed before 2 PM."
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-blue-600" />,
      title: "WhatsApp Integration",
      description: "Track your order and get updates directly on WhatsApp."
    }
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      rating: 5,
      comment: "Best cookies I've ever had! The ordering process was so smooth."
    },
    {
      name: "Mike R.",
      rating: 5,
      comment: "Love getting order updates on WhatsApp. Great service!"
    },
    {
      name: "Emma L.",
      rating: 5,
      comment: "Fresh, delicious cookies delivered right to my door. Highly recommend!"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cookie-50 to-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Cookie className="h-20 w-20 text-cookie-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-cookie-600">Cookie Barrel</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Order delicious, fresh-baked cookies with our digital ordering system. 
            Get real-time updates via WhatsApp and enjoy the convenience of modern technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="btn-primary text-lg px-8 py-3">
              Order Now
            </Link>
            <Link to="/register" className="btn-secondary text-lg px-8 py-3">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Cookie Barrel?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine traditional cookie recipes with modern technology to deliver the best experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it - hear from our satisfied customers!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <p className="font-semibold text-gray-900">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Order Delicious Cookies?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who love our digital ordering experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg">
              Browse Menu
            </Link>
            <Link to="/register" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
