"use client";

import React from "react";
import Link from "next/link";
import {
  Cookie,
  Clock,
  Truck,
  MessageCircle,
  Star,
  Award,
  Users,
  ChefHat,
  Heart,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: <Cookie className="h-10 w-10 text-orange-600" />,
      title: "Fresh Baked Daily",
      description:
        "Handcrafted with premium ingredients and baked fresh every single day for maximum flavor.",
    },
    {
      icon: <Clock className="h-10 w-10 text-orange-600" />,
      title: "Quick Ordering",
      description:
        "Order in seconds with our intuitive platform. Your favorite treats are just a click away.",
    },
    {
      icon: <Truck className="h-10 w-10 text-orange-600" />,
      title: "Fast Delivery",
      description:
        "Same-day delivery available. We'll bring fresh cookies right to your doorstep.",
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-orange-600" />,
      title: "WhatsApp Updates",
      description:
        "Real-time order tracking and updates delivered straight to your WhatsApp.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Food Blogger",
      rating: 5,
      image: "👩‍💼",
      comment:
        "Absolutely incredible! The best cookies I've ever tasted. The ordering system is seamless and the WhatsApp updates are a game-changer. Highly recommend Cookie Barrel!",
    },
    {
      name: "Michael Rodriguez",
      role: "Coffee Shop Owner",
      rating: 5,
      image: "👨‍💼",
      comment:
        "I order from Cookie Barrel weekly for my café. The quality is consistently outstanding, delivery is always on time, and my customers absolutely love them!",
    },
    {
      name: "Emma Thompson",
      role: "Event Planner",
      rating: 5,
      image: "👩‍🎨",
      comment:
        "Cookie Barrel catered my corporate event and everyone was blown away! Professional service, delicious products, and the digital ordering made everything so easy.",
    },
  ];

  const stats = [
    {
      number: "50K+",
      label: "Happy Customers",
      icon: <Users className="h-8 w-8" />,
    },
    {
      number: "100K+",
      label: "Cookies Baked",
      icon: <Cookie className="h-8 w-8" />,
    },
    {
      number: "4.9★",
      label: "Average Rating",
      icon: <Star className="h-8 w-8" />,
    },
    {
      number: "24/7",
      label: "Support Available",
      icon: <MessageCircle className="h-8 w-8" />,
    },
  ];

  const highlights = [
    { icon: <Award className="h-6 w-6" />, text: "Award-Winning Recipes" },
    { icon: <Shield className="h-6 w-6" />, text: "100% Quality Guaranteed" },
    { icon: <Zap className="h-6 w-6" />, text: "Lightning Fast Service" },
    { icon: <Heart className="h-6 w-6" />, text: "Made with Love" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Modern Design */}
      <section className="hero-gradient relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300 rounded-full blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-red-300 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-fadeIn">
            {/* Decorative Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative bg-white rounded-full p-6 shadow-2xl">
                  <Cookie className="h-20 w-20 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 text-shadow-lg">
              Welcome to <span className="gradient-text">Cookie Barrel</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Experience the perfect blend of traditional baking and modern
              technology. Order premium, fresh-baked cookies with real-time
              WhatsApp updates.
            </p>

            {/* Highlight Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-orange-200"
                >
                  <span className="text-orange-600">{highlight.icon}</span>
                  <span className="font-semibold text-gray-800">
                    {highlight.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/menu"
                className="btn-primary text-lg px-10 py-4 inline-flex items-center space-x-2"
              >
                <Cookie className="h-5 w-5" />
                <span>Order Now</span>
              </Link>
              <Link
                href="/register"
                className="btn-secondary text-lg px-10 py-4 inline-flex items-center space-x-2"
              >
                <Users className="h-5 w-5" />
                <span>Create Account</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex justify-center items-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-blue-600" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-16 md:h-24"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-white"
            ></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white rounded-xl shadow-md">
                    <span className="text-orange-600">{stat.icon}</span>
                  </div>
                </div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section pattern-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="gradient-text">Cookie Barrel?</span>
            </h2>
            <p className="section-subheader">
              We combine artisanal baking traditions with cutting-edge
              technology to deliver an unmatched experience.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card card-hover text-center group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-6">
                  <div className="feature-icon group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Teaser */}
      <section className="section bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="gradient-text">Signature Collection</span>
            </h2>
            <p className="section-subheader">
              Discover our most loved cookies, made fresh daily with premium
              ingredients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                emoji: "🍪",
                name: "Classic Chocolate Chip",
                desc: "Our bestseller with gooey chocolate chunks",
                badge: "Popular",
              },
              {
                emoji: "🥜",
                name: "Peanut Butter Dream",
                desc: "Rich, creamy peanut butter perfection",
                badge: "New",
              },
              {
                emoji: "🍫",
                name: "Double Chocolate Fudge",
                desc: "For the ultimate chocolate lovers",
                badge: "Trending",
              },
            ].map((product, index) => (
              <Link
                key={index}
                href="/menu"
                className="product-card group cursor-pointer hover:shadow-2xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="text-7xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">
                    {product.emoji}
                  </div>
                  <div className="text-center mb-3">
                    <span
                      className={`badge ${
                        product.badge === "Popular"
                          ? "badge-popular"
                          : product.badge === "New"
                          ? "badge-new"
                          : product.badge === "Featured"
                          ? "badge-featured"
                          : "badge-popular"
                      } flex items-center justify-center space-x-1 inline-flex`}
                    >
                      <span>
                        {product.badge === "Popular" ? "🔥" : product.badge === "New" ? "✨" : product.badge === "Featured" ? "⭐" : "🔥"}
                      </span>
                      <span>{product.badge}</span>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    {product.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/menu"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
            >
              <span>View Full Menu</span>
              <TrendingUp className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our <span className="gradient-text">Customers Say</span>
            </h2>
            <p className="section-subheader">
              Join thousands of satisfied customers who love our cookies and
              service!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card group">
                <div className="flex items-center mb-4">
                  <div className="text-5xl mr-4">{testimonial.image}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Modern Design */}
      <section className="cta-section section relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-shadow-lg">
              Ready to Experience the Difference?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
              Join our community of cookie lovers and enjoy premium quality,
              fast delivery, and seamless ordering. Your perfect cookie is just
              a click away!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/menu"
                className="bg-white text-orange-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:scale-105 text-lg inline-flex items-center justify-center space-x-2"
              >
                <ChefHat className="h-5 w-5" />
                <span>Browse Menu</span>
              </Link>
              <Link
                href="/register"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-bold py-4 px-10 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg inline-flex items-center justify-center space-x-2"
              >
                <Users className="h-5 w-5" />
                <span>Sign Up Free</span>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-2 text-white/90">
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">
                Get instant WhatsApp updates on all your orders
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
