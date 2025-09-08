import connectDB from "../config/db";
import { NextResponse } from "next/server";
import Cart from "../models/Cart";

export async function POST(req) {
  try {
    await connectDB();
    const { userId, items } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "UserId required" }, { status: 400 });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { items },
      { new: true, upsert: true }
    );

    return NextResponse.json(updatedCart, { status: 200 });
  } catch (error) {
    console.error("Error saving cart:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "UserId required" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId });
    return NextResponse.json(cart || { userId, items: [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
