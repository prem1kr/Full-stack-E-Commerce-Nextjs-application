'use client';
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderSummary = () => {
  const { currency, router, cartItems, products } = useAppContext();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [promoCode, setPromoCode] = useState("");

  // Create reactive cart array from context
  const cartItemsArray = Object.keys(cartItems)
    .map((id) => {
      const product = products.find((p) => p._id === id);
      if (!product || cartItems[id] <= 0) return null;
      return { ...product, quantity: cartItems[id] };
    })
    .filter(Boolean);

  const itemsCount = cartItemsArray.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItemsArray.reduce((acc, item) => acc + item.offerPrice * item.quantity, 0);
  const tax = Math.floor(subtotal * 0.02);
  const total = subtotal + tax;

  // 📌 Select address from dropdown
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  // 📌 Fetch user addresses from backend
  const fetchUserAddresses = async () => {
    try {
      const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
      if (!userId) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      const { data } = await axios.get(`/api/address?userId=${userId}`);
      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) setSelectedAddress(data.addresses[0]);
      } else {
        setError(data.error || "Failed to fetch addresses.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Axios error fetching addresses.");
      } else {
        setError("Unknown error fetching addresses.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 📌 Create order
  const createOrder = async () => {
    if (!selectedAddress) return alert("Please select an address before placing order.");
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!userId) return alert("User not logged in.");
    if (!cartItemsArray.length) return alert("Cart is empty.");

    try {
      const orderData = {
        userId,
        addressId: selectedAddress._id,
        address: {
          fullName: selectedAddress.fullName,
          area: selectedAddress.area,
          city: selectedAddress.city,
          state: selectedAddress.state,
          phoneNumber: selectedAddress.phoneNumber,
        },
        items: cartItemsArray.map((item) => ({
          product: { name: item.name },
          quantity: item.quantity,
        })),
        itemsCount,
        totalAmount: total,
        promoCode: promoCode || null,
        paymentMethod: "COD",
      };

      const response = await axios.post("/api/order", orderData);
      if (response.data.success) {
        localStorage.removeItem("cartItems");
        await axios.post("/api/cart", { userId, items: [] });
        router.push("/order-placed");
      } else {
        alert(response.data.error || "Failed to place order.");
      }
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Failed to place order.");
    }
  };

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">Order Summary</h2>
      <hr className="border-gray-500/30 my-5" />

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <div className="space-y-6">
        {/* 📌 Address selection */}
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">Select Address</label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {loading
                  ? "Loading..."
                  : selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5 max-h-60 overflow-auto">
                {userAddresses.length === 0 && !loading && (
                  <li className="px-4 py-2 text-center text-gray-500">No addresses found</li>
                )}
                {userAddresses.map((address) => (
                  <li
                    key={address._id}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center text-orange-600 font-medium"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* 📌 Promo code */}
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">Promo Code</label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button
              className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700"
              onClick={() => alert(`Applied promo: ${promoCode}`)}
            >
              Apply
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        {/* 📌 Summary */}
        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {itemsCount}</p>
            <p className="text-gray-800">{currency}{subtotal}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">{currency}{tax}</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{currency}{total}</p>
          </div>
        </div>
      </div>

      {/* 📌 Place order button */}
      <button
        onClick={createOrder}
        className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700"
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;
