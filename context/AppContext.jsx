'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()
    const { user } = useUser()

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(true)
    const [cartItems, setCartItems] = useState({})

    // ---------- CART API HELPERS ----------
    const saveCartToDB = async (cartData) => {
        if (!user) return;
        try {
            await axios.post("/api/cart", {
                userId: user.id,
                items: Object.keys(cartData).map(id => ({
                    productId: id,
                    quantity: cartData[id],
                }))
            });
        } catch (error) {
            console.error("Error saving cart:", error);
        }
    };

    const fetchCartFromDB = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`/api/cart?userId=${user.id}`);
            if (res.data?.items) {
                const formattedCart = {};
                res.data.items.forEach(item => {
                    formattedCart[item.productId] = item.quantity;
                });
                setCartItems(formattedCart);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };
    // -------------------------------------

    const fetchProductData = async () => {
        setProducts(productsDummyData)
    }

    const fetchUserData = async () => {
        setUserData(userDummyData)
    }

    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        await saveCartToDB(cartData);
    }

    const updateCartQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData);
        await saveCartToDB(cartData);
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0 && itemInfo) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
        fetchUserData()
    }, [])

    // 🔹 Load cart when user logs in
    useEffect(() => {
        if (user) fetchCartFromDB();
    }, [user]);

    // 🔹 Save cart to localStorage whenever it changes
    useEffect(() => {
        const cartArray = Object.keys(cartItems).map((id) => {
            const product = products.find((p) => p._id === id);
            return product
                ? {
                      _id: id,
                      name: product.name,
                      quantity: cartItems[id],
                      price: product.offerPrice,
                  }
                : null;
        }).filter(Boolean);
        localStorage.setItem("cartItems", JSON.stringify(cartArray));
    }, [cartItems, products]);

    const value = {
        user,
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
