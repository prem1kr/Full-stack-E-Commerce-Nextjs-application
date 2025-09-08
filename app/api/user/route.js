import connectDB from "../config/db";
import userModel from "../models/User";

export async function POST(req) {
  try {
    const body = await req.json();
    const { _id, name, email, imageUrl, cartItems } = body;

    console.log("Incoming data:", body);

    await connectDB();

    let user = await userModel.findOne({ _id });

    if (!user) {
      user = await userModel.create({
        _id,
        name,
        email,
        imageUrl,
        cartItems,
        address: [],

      });
      console.log(" User created:", user);
    } else {
      console.log(" User already exists:", user);
    }

    return Response.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error(" Error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
