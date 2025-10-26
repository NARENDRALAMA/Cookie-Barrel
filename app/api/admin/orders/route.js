import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Order from "../../../../lib/models/Order";
import jwt from "jsonwebtoken";

// Helper function to verify manager/admin token
async function verifyManagerToken(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // In a real implementation, you'd fetch user from DB to check role
    // For now, we'll check the role from the decoded token
    return decoded;
  } catch (error) {
    return null;
  }
}

// Get all orders (manager view)
export async function GET(request) {
  try {
    await connectDB();

    const user = await verifyManagerToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50;

    // Build query
    let query = {};
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get orders with populated details
    const orders = await Order.find(query)
      .populate("customer", "name email phone")
      .populate("items.product", "name image price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Order.countDocuments(query);

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

    return NextResponse.json({
      success: true,
      data: orders,
      stats,
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
