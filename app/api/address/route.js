import connectDB from "@/app/api/config/db";
import Address from "@/app/api/models/Address";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, fullName, phoneNumber, pincode, area, city, state } = body;

    if (!userId || !fullName || !phoneNumber || !pincode || !area || !city || !state) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newAddress = await Address.create({
      userId,
      fullName,
      phoneNumber,
      pincode,
      area,
      city,
      state,
    });

    return NextResponse.json({ success: true, address: newAddress }, { status: 201 });
  } catch (error) {
    console.error("Error saving address:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, addresses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
