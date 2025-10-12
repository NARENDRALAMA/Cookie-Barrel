import connectDB from "../lib/mongodb.js";
import Product from "../lib/models/Product.js";

const sampleProducts = [
  {
    name: "Chocolate Chip Cookies",
    description:
      "Classic chocolate chip cookies made with premium dark chocolate chips and real butter. Soft and chewy on the inside with a golden brown exterior.",
    price: 4.95,
    category: "cookies",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop",
    ],
    ingredients: [
      "Flour",
      "Butter",
      "Brown Sugar",
      "Dark Chocolate Chips",
      "Vanilla Extract",
      "Eggs",
    ],
    allergens: ["Gluten", "Dairy", "Eggs"],
    nutritionalInfo: {
      calories: 150,
      protein: 2,
      carbs: 20,
      fat: 7,
      sugar: 10,
    },
    isAvailable: true,
    isFeatured: true,
    stock: 50,
    tags: ["popular", "chocolate", "classic"],
    preparationTime: 15,
  },
  {
    name: "Oatmeal Raisin Cookies",
    description:
      "Hearty oatmeal cookies packed with plump raisins and warm cinnamon. Perfect for breakfast or as a healthy snack.",
    price: 4.75,
    category: "cookies",
    image:
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=300&fit=crop",
    ],
    ingredients: [
      "Oats",
      "Flour",
      "Butter",
      "Brown Sugar",
      "Raisins",
      "Cinnamon",
      "Vanilla",
    ],
    allergens: ["Gluten", "Dairy"],
    nutritionalInfo: {
      calories: 120,
      protein: 3,
      carbs: 18,
      fat: 4,
      sugar: 8,
    },
    isAvailable: true,
    isFeatured: false,
    stock: 30,
    tags: ["healthy", "oatmeal", "breakfast"],
    preparationTime: 20,
  },
  {
    name: "Sugar Cookies",
    description:
      "Soft and sweet sugar cookies with a delicate vanilla flavor. Perfect for decorating or enjoying plain.",
    price: 3.95,
    category: "cookies",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    ],
    ingredients: [
      "Flour",
      "Butter",
      "Sugar",
      "Vanilla Extract",
      "Eggs",
      "Baking Powder",
    ],
    allergens: ["Gluten", "Dairy", "Eggs"],
    nutritionalInfo: {
      calories: 130,
      protein: 2,
      carbs: 22,
      fat: 4,
      sugar: 12,
    },
    isAvailable: true,
    isFeatured: false,
    stock: 40,
    tags: ["sweet", "vanilla", "decorating"],
    preparationTime: 12,
  },
  {
    name: "Double Chocolate Brownies",
    description:
      "Rich and fudgy brownies with double the chocolate. Made with premium cocoa and chocolate chips for the ultimate chocolate experience.",
    price: 8.95,
    category: "cakes",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
    ],
    ingredients: [
      "Dark Chocolate",
      "Butter",
      "Sugar",
      "Eggs",
      "Flour",
      "Cocoa Powder",
      "Chocolate Chips",
    ],
    allergens: ["Gluten", "Dairy", "Eggs"],
    nutritionalInfo: {
      calories: 280,
      protein: 4,
      carbs: 35,
      fat: 15,
      sugar: 25,
    },
    isAvailable: true,
    isFeatured: true,
    stock: 25,
    tags: ["chocolate", "fudgy", "premium"],
    preparationTime: 30,
  },
  {
    name: "Vanilla Cupcakes",
    description:
      "Light and fluffy vanilla cupcakes with creamy vanilla frosting. Perfect for celebrations and special occasions.",
    price: 5.95,
    category: "cakes",
    image:
      "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=300&fit=crop",
    ],
    ingredients: [
      "Flour",
      "Butter",
      "Sugar",
      "Eggs",
      "Vanilla Extract",
      "Milk",
      "Baking Powder",
    ],
    allergens: ["Gluten", "Dairy", "Eggs"],
    nutritionalInfo: {
      calories: 200,
      protein: 3,
      carbs: 28,
      fat: 8,
      sugar: 20,
    },
    isAvailable: true,
    isFeatured: false,
    stock: 20,
    tags: ["vanilla", "cupcakes", "celebration"],
    preparationTime: 25,
  },
  {
    name: "Croissants",
    description:
      "Buttery, flaky croissants made with traditional French techniques. Perfect for breakfast or as a light snack.",
    price: 6.95,
    category: "pastries",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop",
    ],
    ingredients: ["Flour", "Butter", "Yeast", "Milk", "Salt", "Sugar"],
    allergens: ["Gluten", "Dairy"],
    nutritionalInfo: {
      calories: 180,
      protein: 4,
      carbs: 22,
      fat: 9,
      sugar: 3,
    },
    isAvailable: true,
    isFeatured: false,
    stock: 35,
    tags: ["buttery", "flaky", "french"],
    preparationTime: 45,
  },
  {
    name: "Coffee",
    description:
      "Freshly brewed premium coffee made from locally sourced beans. Available in regular and decaf.",
    price: 4.95,
    category: "beverages",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    ],
    ingredients: ["Coffee Beans", "Water"],
    allergens: [],
    nutritionalInfo: {
      calories: 5,
      protein: 0,
      carbs: 1,
      fat: 0,
      sugar: 0,
    },
    isAvailable: true,
    isFeatured: false,
    stock: 100,
    tags: ["coffee", "fresh", "premium"],
    preparationTime: 5,
  },
  {
    name: "Hot Chocolate",
    description:
      "Rich and creamy hot chocolate made with premium cocoa and steamed milk. Perfect for cold days.",
    price: 5.95,
    category: "beverages",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    ],
    ingredients: [
      "Cocoa Powder",
      "Milk",
      "Sugar",
      "Vanilla Extract",
      "Whipped Cream",
    ],
    allergens: ["Dairy"],
    nutritionalInfo: {
      calories: 150,
      protein: 6,
      carbs: 20,
      fat: 6,
      sugar: 18,
    },
    isAvailable: true,
    isFeatured: false,
    stock: 50,
    tags: ["chocolate", "warm", "creamy"],
    preparationTime: 8,
  },
  {
    name: "Seasonal Special - Pumpkin Spice Cookies",
    description:
      "Limited edition pumpkin spice cookies with warm autumn flavors. Made with real pumpkin and aromatic spices.",
    price: 6.95,
    category: "special",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    ],
    ingredients: [
      "Pumpkin Puree",
      "Flour",
      "Butter",
      "Brown Sugar",
      "Pumpkin Spice",
      "Cinnamon",
      "Nutmeg",
    ],
    allergens: ["Gluten", "Dairy"],
    nutritionalInfo: {
      calories: 140,
      protein: 2,
      carbs: 19,
      fat: 6,
      sugar: 9,
    },
    isAvailable: true,
    isFeatured: true,
    stock: 15,
    tags: ["seasonal", "pumpkin", "spice", "limited"],
    preparationTime: 18,
  },
];

async function seedProducts() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${products.length} products`);

    // Display seeded products
    products.forEach((product) => {
      console.log(
        `- ${product.name} ($${product.price}) - ${product.category}`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
}

seedProducts();
