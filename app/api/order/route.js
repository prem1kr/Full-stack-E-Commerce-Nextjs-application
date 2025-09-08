import connectDB from "@/app/api/config/db";
import Order from "@/app/api/models/Order";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const orders = await Order.find({ userId }).sort({ date: -1 });

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      userId,
      addressId,
      items,
      itemsCount,
      totalAmount,
      promoCode = null,
      address,
      paymentMethod = "COD",
    } = body;

    if (
      !userId ||
      !addressId ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !itemsCount ||
      !totalAmount ||
      !address
    ) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    const newOrder = await Order.create({
      userId,
      addressId,
      items,
      itemsCount,
      totalAmount,
      promoCode,
      address,
      paymentMethod,
      paymentStatus: "Pending",
      date: new Date(),
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
