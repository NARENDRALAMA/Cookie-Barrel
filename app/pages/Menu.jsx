"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import {
  ShoppingCart,
  Plus,
  Minus,
  Search,
  Filter,
  Clock,
  Package,
} from "lucide-react";

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();

  const categories = [
    { value: "all", label: "All Items" },
    { value: "cookies", label: "Cookies" },
    { value: "cakes", label: "Cakes" },
    { value: "pastries", label: "Pastries" },
    { value: "beverages", label: "Beverages" },
    { value: "special", label: "Special Items" },
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== "all")
        params.append("category", selectedCategory);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product._id] || 1;
    addToCart(product, quantity);
    setQuantities({ ...quantities, [product._id]: 1 });
  };

  const updateQuantity = (productId, change) => {
    const currentQuantity = quantities[productId] || 1;
    const newQuantity = Math.max(1, currentQuantity + change);
    setQuantities({ ...quantities, [productId]: newQuantity });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="spinner mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 font-medium">
            Loading our delicious menu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Our <span className="gradient-text">Menu</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our collection of freshly baked goods, made with premium
            ingredients and traditional recipes
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for your favorite items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12 pr-4 py-4 text-lg"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field pl-12 pr-10 py-4 text-lg appearance-none bg-white"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedCategory !== "all" || searchTerm) && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-orange-200">
                <span className="text-sm font-medium text-gray-600">
                  Active filters:
                </span>
                {selectedCategory !== "all" && (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    {
                      categories.find((c) => c.value === selectedCategory)
                        ?.label
                    }
                  </span>
                )}
                {searchTerm && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    "{searchTerm}"
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No Items Found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any items matching your search. Try adjusting
                your filters.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div
                key={product._id}
                className="product-card group h-full flex flex-col"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-2xl h-48 bg-gradient-to-br from-orange-100 to-red-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.isFeatured && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      ⭐ Featured
                    </div>
                  )}
                  {/* Stock Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                    {product.stock} left
                  </div>
                </div>

                {/* Product Content - Flex to push button to bottom */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Price and Prep Time */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="price-tag">${product.price}</span>
                      <div className="flex items-center space-x-1 text-gray-500 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{product.preparationTime} min</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(product._id, -1)}
                          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-orange-100 flex items-center justify-center transition-colors duration-200"
                        >
                          <Minus className="h-4 w-4 text-gray-600" />
                        </button>
                        <span className="w-12 text-center font-bold text-lg text-gray-900">
                          {quantities[product._id] || 1}
                        </span>
                        <button
                          onClick={() => updateQuantity(product._id, 1)}
                          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-orange-100 flex items-center justify-center transition-colors duration-200"
                        >
                          <Plus className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Button - Always at bottom */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg ${
                      product.stock === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-xl hover:shadow-orange-500/25"
                    }`}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>
                      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
