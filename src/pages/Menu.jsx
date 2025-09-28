import React, { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { Plus, Minus, Search, Filter } from 'lucide-react'
import api from '../services/api'

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await api.getProducts({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchTerm || undefined,
          sort: sortBy
        })
        setProducts(response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
        // Fallback to empty array if API fails
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, searchTerm, sortBy])

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'cookies', name: 'Cookies' },
    { id: 'burgers', name: 'Burgers' },
    { id: 'pizza', name: 'Pizza' },
    { id: 'sandwiches', name: 'Sandwiches' },
    { id: 'salads', name: 'Salads' },
    { id: 'beverages', name: 'Beverages' }
  ]

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' }
  ]

  // Products are already filtered and sorted by the API
  const filteredProducts = products

  const handleAddToCart = (product) => {
    addToCart(product)
    // Show success message (you could add a toast notification here)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our delicious selection of fresh food items. 
            From cookies to burgers, pizza to salads - we have something for everyone!
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading menu items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
            <div key={product.id} className="card hover:shadow-lg transition-shadow duration-200">
              {/* Product Image */}
              <div className="text-center mb-4">
                <span className="text-6xl">{product.image}</span>
                {product.popular && (
                  <span className="inline-block bg-primary-600 text-white text-xs px-2 py-1 rounded-full mt-2">
                    Popular
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary-600">${product.price}</span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>

              {/* Allergens */}
              <div className="border-t pt-3">
                <p className="text-xs text-gray-500 mb-2">Allergens:</p>
                <div className="flex flex-wrap gap-1">
                  {product.allergens.map(allergen => (
                    <span
                      key={allergen}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              className="btn-secondary mt-4"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Menu
