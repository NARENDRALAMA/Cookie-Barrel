import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Order from "../../../../../lib/models/Order";
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
    return decoded;
  } catch (error) {
    return null;
  }
}

// Update order status (manager function)
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const user = await verifyManagerToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { status, notes } = body;

    // Validate order exists
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Update order status
    if (status) {
      order.status = status;
      // Update delivery time if delivered
      if (status === "delivered") {
        order.actualDeliveryTime = new Date();
      }
    }

    if (notes) {
      order.notes = notes;
    }

    await order.save();

    // Populate for response
    const updatedOrder = await Order.findById(order._id)
      .populate("customer", "name email phone")
      .populate("items.product", "name image price")
      .lean();

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get single order details
export async function GET(request, { params }) {
  try {
    await connectDB();

    const user = await verifyManagerToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    const order = await Order.findById(id)
      .populate("customer", "name email phone address")
      .populate("items.product", "name image price description")
      .lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
