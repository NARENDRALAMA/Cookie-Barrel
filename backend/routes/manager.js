const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const { auth } = require("../middleware/auth");
const config = require("../config");

// Helper to check if user is manager or admin
const isManager = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // You might want to fetch user from DB to check role
  next();
};

// Get all orders (manager view)
router.get("/orders", auth, isManager, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email phone")
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });

    // Calculate statistics
    const stats = {
      pending: await Order.countDocuments({ status: "pending" }),
      confirmed: await Order.countDocuments({ status: "confirmed" }),
      preparing: await Order.countDocuments({ status: "preparing" }),
      ready: await Order.countDocuments({ status: "ready" }),
      out_for_delivery: await Order.countDocuments({
        status: "out_for_delivery",
      }),
      delivered: await Order.countDocuments({ status: "delivered" }),
    };

    res.json({
      success: true,
      data: orders,
      stats,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update order status
router.patch("/orders/:id", auth, isManager, async (req, res) => {
  try {
    const { status, notes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status) {
      order.status = status;
      if (status === "delivered") {
        order.actualDeliveryTime = new Date();
      }
    }

    if (notes) {
      order.notes = notes;
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("customer", "name email phone")
      .populate("items.product", "name price image");

    res.json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single order
router.get("/orders/:id", auth, isManager, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email phone address")
      .populate("items.product", "name price image description");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new product
router.post("/products", auth, isManager, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      allergens,
      isAvailable,
      stock,
      popular,
    } = req.body;

    if (!name || !price || !category) {
      return res
        .status(400)
        .json({ message: "Name, price, and category are required" });
    }

    const product = new Product({
      name,
      description: description || "",
      price,
      category,
      image: image || "🍽️",
      allergens: allergens || [],
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      stock: stock !== undefined ? stock : 100,
      popular: popular || false,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update product
router.patch("/products/:id", auth, isManager, async (req, res) => {
  try {
    console.log("🟢 [Backend] Updating product:", req.params.id);
    console.log("🟢 [Backend] Update data:", req.body);

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      console.error("❌ [Backend] Product not found:", req.params.id);
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("✅ [Backend] Product updated successfully:", product._id);

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("❌ [Backend] Update product error:", error);
    console.error("❌ [Backend] Error details:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

// Delete product
router.delete("/products/:id", auth, isManager, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all products (manager view)
router.get("/products", auth, isManager, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
