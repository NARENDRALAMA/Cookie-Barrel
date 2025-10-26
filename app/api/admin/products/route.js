import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Product from "../../../../lib/models/Product";
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

// Get all products (manager view)
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

    const products = await Product.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Create new product
export async function POST(request) {
  try {
    await connectDB();

    const user = await verifyManagerToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
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
    } = body;

    // Validation
    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, message: "Name, price, and category are required" },
        { status: 400 }
      );
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

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
