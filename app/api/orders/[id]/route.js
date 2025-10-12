import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Order from "../../../../lib/models/Order";
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

export async function GET(request, { params }) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    const order = await Order.findOne({
      _id: id,
      customer: user.userId,
    })
      .populate("items.product", "name image price")
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

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // Only allow customers to cancel their orders
    if (status === "cancelled") {
      const order = await Order.findOne({
        _id: id,
        customer: user.userId,
      });

      if (!order) {
        return NextResponse.json(
          { success: false, message: "Order not found" },
          { status: 404 }
        );
      }

      // Only allow cancellation if order is pending or confirmed
      if (!["pending", "confirmed"].includes(order.status)) {
        return NextResponse.json(
          {
            success: false,
            message: "Order cannot be cancelled at this stage",
          },
          { status: 400 }
        );
      }

      order.status = "cancelled";
      await order.save();

      return NextResponse.json({
        success: true,
        message: "Order cancelled successfully",
        data: order,
      });
    }

    // For other status updates, check if user is admin
    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized to update order status" },
        { status: 403 }
      );
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
      .populate("items.product", "name image price")
      .lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
