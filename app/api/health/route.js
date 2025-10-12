import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      message: "Cookie Barrel API is running",
      status: "OK",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "API health check failed",
        status: "ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
