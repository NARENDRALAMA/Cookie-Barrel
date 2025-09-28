const mongoose = require('mongoose');
const Product = require('./models/Product');
const config = require('./config');

const seedProducts = [
  // Cookies
  {
    name: "Chocolate Chip Cookies",
    description: "Classic chocolate chip cookies with gooey centers and crispy edges",
    price: 2.99,
    category: "cookies",
    image: "🍪",
    allergens: ["gluten", "dairy", "eggs"],
    popular: true
  },
  {
    name: "Oatmeal Raisin Cookies",
    description: "Hearty oatmeal cookies with plump raisins and warm spices",
    price: 2.49,
    category: "cookies",
    image: "🍪",
    allergens: ["gluten", "dairy", "eggs"],
    popular: false
  },
  {
    name: "Gluten-Free Almond Cookies",
    description: "Delicate almond cookies made with almond flour and honey",
    price: 3.99,
    category: "cookies",
    image: "🍪",
    allergens: ["nuts", "eggs"],
    popular: true
  },
  
  // Burgers
  {
    name: "Classic Beef Burger",
    description: "Juicy beef patty with lettuce, tomato, onion, and our special sauce",
    price: 8.99,
    category: "burgers",
    image: "🍔",
    allergens: ["gluten", "dairy", "eggs"],
    popular: true
  },
  {
    name: "Chicken Deluxe Burger",
    description: "Grilled chicken breast with avocado, bacon, and chipotle mayo",
    price: 9.49,
    category: "burgers",
    image: "🍔",
    allergens: ["gluten", "dairy"],
    popular: true
  },
  {
    name: "Veggie Supreme Burger",
    description: "Plant-based patty with grilled vegetables and vegan cheese",
    price: 7.99,
    category: "burgers",
    image: "🍔",
    allergens: ["gluten"],
    popular: false
  },
  {
    name: "BBQ Bacon Burger",
    description: "Beef patty with crispy bacon, BBQ sauce, and onion rings",
    price: 10.99,
    category: "burgers",
    image: "🍔",
    allergens: ["gluten", "dairy", "eggs"],
    popular: true
  },
  
  // Pizza
  {
    name: "Margherita Pizza",
    description: "Classic tomato sauce, mozzarella, and fresh basil",
    price: 12.99,
    category: "pizza",
    image: "🍕",
    allergens: ["gluten", "dairy"],
    popular: true
  },
  {
    name: "Pepperoni Supreme",
    description: "Pepperoni, sausage, bell peppers, and extra cheese",
    price: 15.99,
    category: "pizza",
    image: "🍕",
    allergens: ["gluten", "dairy"],
    popular: true
  },
  {
    name: "BBQ Chicken Pizza",
    description: "Grilled chicken, red onions, and BBQ sauce on our signature crust",
    price: 14.99,
    category: "pizza",
    image: "🍕",
    allergens: ["gluten", "dairy"],
    popular: false
  },
  {
    name: "Veggie Delight Pizza",
    description: "Mushrooms, bell peppers, olives, and fresh tomatoes",
    price: 13.99,
    category: "pizza",
    image: "🍕",
    allergens: ["gluten", "dairy"],
    popular: false
  },
  
  // Sandwiches
  {
    name: "Turkey Club Sandwich",
    description: "Sliced turkey, bacon, lettuce, tomato, and mayo on toasted bread",
    price: 7.49,
    category: "sandwiches",
    image: "🥪",
    allergens: ["gluten", "dairy", "eggs"],
    popular: true
  },
  {
    name: "Grilled Chicken Panini",
    description: "Grilled chicken, pesto, mozzarella, and sun-dried tomatoes",
    price: 8.99,
    category: "sandwiches",
    image: "🥪",
    allergens: ["gluten", "dairy", "nuts"],
    popular: false
  },
  {
    name: "BLT Sandwich",
    description: "Crispy bacon, lettuce, tomato, and mayo on sourdough",
    price: 6.99,
    category: "sandwiches",
    image: "🥪",
    allergens: ["gluten", "dairy", "eggs"],
    popular: true
  },
  
  // Salads
  {
    name: "Caesar Salad",
    description: "Romaine lettuce, parmesan cheese, croutons, and caesar dressing",
    price: 8.49,
    category: "salads",
    image: "🥗",
    allergens: ["gluten", "dairy", "eggs"],
    popular: true
  },
  {
    name: "Mediterranean Salad",
    description: "Mixed greens, feta cheese, olives, tomatoes, and balsamic vinaigrette",
    price: 9.99,
    category: "salads",
    image: "🥗",
    allergens: ["dairy"],
    popular: false
  },
  {
    name: "Grilled Chicken Salad",
    description: "Grilled chicken breast, mixed greens, and honey mustard dressing",
    price: 10.49,
    category: "salads",
    image: "🥗",
    allergens: ["dairy", "eggs"],
    popular: true
  },
  
  // Beverages
  {
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice, served cold",
    price: 3.99,
    category: "beverages",
    image: "🍊",
    allergens: [],
    popular: true
  },
  {
    name: "Iced Coffee",
    description: "Cold brew coffee with your choice of milk and sweetener",
    price: 4.49,
    category: "beverages",
    image: "☕",
    allergens: ["dairy"],
    popular: true
  },
  {
    name: "Smoothie Bowl",
    description: "Acai bowl with granola, berries, and coconut flakes",
    price: 7.99,
    category: "beverages",
    image: "🥤",
    allergens: ["nuts"],
    popular: false
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert seed products
    await Product.insertMany(seedProducts);
    console.log('Seeded products successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedProducts, seedDatabase };

