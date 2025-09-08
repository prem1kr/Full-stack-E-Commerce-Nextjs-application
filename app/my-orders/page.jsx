"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import axios from "axios";

const MyOrders = () => {
  const { currency } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return setLoading(false);

    try {
      const { data } = await axios.get(`/api/order?userId=${userId}`);
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
        <h2 className="text-lg font-medium mt-6">My Orders</h2>
        {loading ? (
          <Loading />
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-5 p-5 border-b">
              <div className="flex-1 flex gap-5">
                <Image src={assets.box_icon} alt="box" width={64} height={64} />
                <p>
                  {order.items.map((item) => item.product.name + ` x ${item.quantity}`).join(", ")}
                </p>
              </div>
              <div>
                <p>{order.address.fullName}</p>
                <p>{order.address.area}</p>
                <p>{order.address.city}, {order.address.state}</p>
              </div>
              <p>{currency}{order.totalAmount}</p>
            </div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
