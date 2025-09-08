import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    addressId: { type: String, required: true },
    items: [
      {
        product: {
          name: { type: String, required: true },
        },
        quantity: { type: Number, default: 1, min: 1 },
      },
    ],
    itemsCount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    promoCode: { type: String, default: null },
    address: {
      fullName: String,
      area: String,
      city: String,
      state: String,
      phoneNumber: String,
    },
    paymentMethod: { type: String, default: "COD" },
    paymentStatus: { type: String, default: "Pending" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
