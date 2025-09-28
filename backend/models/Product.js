const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['cookies', 'burgers', 'pizza', 'sandwiches', 'salads', 'beverages']
  },
  image: {
    type: String,
    default: '🍪'
  },
  allergens: [{
    type: String,
    enum: ['gluten', 'dairy', 'eggs', 'nuts', 'peanuts', 'soy', 'fish', 'shellfish']
  }],
  popular: {
    type: Boolean,
    default: false
  },
  available: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: 100,
    min: [0, 'Stock cannot be negative']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

