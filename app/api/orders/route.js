import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Order from "../../../lib/models/Order";
import Product from "../../../lib/models/Product";
import jwt from "jsonwebtoken";

// Helper function to verify JWT token
async function verifyToken(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    // Build query
    let query = { customer: user.userId };
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get orders with populated product details
    const orders = await Order.find(query)
      .populate("items.product", "name image price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Order.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit,
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      items,
      deliveryAddress,
      contactInfo,
      paymentMethod,
      specialInstructions,
    } = body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order items are required" },
        { status: 400 }
      );
    }

    if (!deliveryAddress || !contactInfo || !paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Delivery address, contact info, and payment method are required",
        },
        { status: 400 }
      );
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isAvailable) {
        return NextResponse.json(
          {
            success: false,
            message: `Product ${item.productId} not available`,
          },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, message: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        specialInstructions: item.specialInstructions || "",
      });
    }

    // Calculate delivery fee (example: free for orders over $50, otherwise $5)
    const deliveryFee = totalAmount >= 50 ? 0 : 5;

    // Calculate tax (example: 10% tax)
    const tax = totalAmount * 0.1;

    const finalAmount = totalAmount + deliveryFee + tax;

    // Create order
    const order = new Order({
      customer: user.userId,
      items: orderItems,
      totalAmount,
      deliveryFee,
      tax,
      finalAmount,
      paymentMethod,
      deliveryAddress,
      contactInfo,
      specialInstructions: specialInstructions || "",
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    });

    await order.save();

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Populate the order for response
    const populatedOrder = await Order.findById(order._id)
      .populate("items.product", "name image price")
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        data: populatedOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
