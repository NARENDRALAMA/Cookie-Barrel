const mongoose = require("mongoose");
const User = require("../models/User");
const config = require("../config");

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: "admin@cookiebarrel.com",
    });
    if (existingAdmin) {
      console.log("Admin account already exists!");
      console.log("Email: admin@cookiebarrel.com");
      console.log("Password: Admin123!");
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name: "Admin User",
      email: "admin@cookiebarrel.com",
      phone: "+1-555-0100",
      password: "Admin123!", // This will be hashed automatically
      role: "admin",
      isAdmin: true,
    });

    await admin.save();
    console.log("✅ Admin account created successfully!");
    console.log("\n📧 Credentials:");
    console.log("Email: admin@cookiebarrel.com");
    console.log("Password: Admin123!");
    console.log("\n⚠️  IMPORTANT: Keep these credentials secure!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
