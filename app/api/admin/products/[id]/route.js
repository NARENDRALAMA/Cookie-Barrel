import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Product from "../../../../../lib/models/Product";
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

// Update product
export async function PATCH(request, { params }) {
  try {
    console.log("🟢 [API] Updating product, params:", params);
    await connectDB();

    const user = await verifyManagerToken(request);
    if (!user) {
      console.error("❌ [API] Unauthorized - no valid token");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    console.log("🟢 [API] Product ID:", id);
    const body = await request.json();
    console.log("🟢 [API] Update data:", body);

    // Find and update product
    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      console.error("❌ [API] Product not found:", id);
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    console.log("✅ [API] Product updated successfully:", product._id);
    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("❌ [API] Update product error:", error);
    console.error("❌ [API] Error details:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error: " + error.message,
      },
      { status: 500 }
    );
  }
}

// Delete product
export async function DELETE(request, { params }) {
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

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
