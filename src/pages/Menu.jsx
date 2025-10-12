import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import {
  Plus,
  Search,
  Filter,
  ShoppingBag,
  Star,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import api from "../services/api";

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(null);
  const { addToCart } = useCart();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.getProducts({
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          search: searchTerm || undefined,
          sort: sortBy,
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchTerm, sortBy]);

  const categories = [
    { id: "all", name: "All Items", icon: "🍽️" },
    { id: "cookies", name: "Cookies", icon: "🍪" },
    { id: "burgers", name: "Burgers", icon: "🍔" },
    { id: "pizza", name: "Pizza", icon: "🍕" },
    { id: "sandwiches", name: "Sandwiches", icon: "🥪" },
    { id: "salads", name: "Salads", icon: "🥗" },
    { id: "beverages", name: "Beverages", icon: "🥤" },
  ];

  const sortOptions = [
    { value: "name", label: "Name A-Z", icon: "🔤" },
    { value: "price-low", label: "Price: Low to High", icon: "💰" },
    { value: "price-high", label: "Price: High to Low", icon: "💎" },
    { value: "popular", label: "Most Popular", icon: "⭐" },
  ];

  const filteredProducts = products;

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-orange-50/50 via-white to-red-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-orange-600 to-red-600 p-4 rounded-full shadow-xl">
                <ShoppingBag className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Our <span className="gradient-text">Delicious Menu</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our handcrafted selection of premium food items. From
            artisanal cookies to gourmet meals - made fresh daily with love! 🧡
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glass rounded-2xl p-6 mb-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Menu
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for delicious items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none appearance-none bg-white cursor-pointer"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
              </label>
              <div className="relative">
                <TrendingUp className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none appearance-none bg-white cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || selectedCategory !== "all") && (
            <div className="mt-4 flex items-center space-x-3">
              <span className="text-sm text-gray-600 font-medium">
                Active filters:
              </span>
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  Search: "{searchTerm}"
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="spinner mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 font-medium">
              Loading delicious items...
            </p>
          </div>
        ) : (
          <>
            {filteredProducts.length > 0 && (
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600 font-medium">
                  <span className="text-orange-600 font-bold text-lg">
                    {filteredProducts.length}
                  </span>{" "}
                  {filteredProducts.length === 1 ? "item" : "items"} found
                </p>
              </div>
            )}

            <div className="product-grid">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="product-card group"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
                  }}
                >
                  {/* Product Image/Emoji */}
                  <div className="relative p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-t-2xl">
                    <div className="text-center">
                      <div className="text-7xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        {product.image}
                      </div>
                      {product.popular && (
                        <div className="absolute top-4 right-4">
                          <span className="badge-popular flex items-center space-x-1">
                            <Sparkles className="h-3 w-3" />
                            <span>Popular</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>

                    {/* Allergens */}
                    {product.allergens && product.allergens.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 mb-2">
                          Allergens:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {product.allergens.slice(0, 3).map((allergen) => (
                            <span
                              key={allergen}
                              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-lg font-medium"
                            >
                              {allergen}
                            </span>
                          ))}
                          {product.allergens.length > 3 && (
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-lg font-medium">
                              +{product.allergens.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Price and Add to Cart */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <div className="price-tag">${product.price}</div>
                        {product.popular && (
                          <div className="flex items-center mt-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500 ml-1">
                              Bestseller
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 ${
                          addedToCart === product.id
                            ? "bg-green-600 text-white"
                            : "bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-xl"
                        }`}
                      >
                        {addedToCart === product.id ? (
                          <>
                            <span className="text-lg">✓</span>
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* No Results */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">😢</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              No Items Found
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              We couldn't find any items matching your criteria. Try adjusting
              your filters or search term.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSortBy("name");
              }}
              className="btn-primary px-8 py-3 inline-flex items-center space-x-2"
            >
              <Filter className="h-5 w-5" />
              <span>Clear All Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
