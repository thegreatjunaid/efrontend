// import { createContext, useContext, useState, useEffect } from "react";

// const CartContext = createContext();

// export function CartProvider({ children }) {

//    // Load cart from localStorage on first load
//    const [cartItems, setCartItems] = useState(() => {
//       const stored = localStorage.getItem("cart");
//       return stored ? JSON.parse(stored) : [];
//    });

//    // Save cart whenever it changes
//    useEffect(() => {
//       localStorage.setItem("cart", JSON.stringify(cartItems));
//    }, [cartItems]);

//    // Add to cart (with quantity + duplicate prevention)
//    const addToCart = (product) => {
//       setCartItems(prev => {
//          const existing = prev.find(item => item._id === product._id);

//          if (existing) {
//             return prev.map(item =>
//                item._id === product._id
//                   ? { ...item, quantity: item.quantity + 1 }
//                   : item
//             );
//          }

//          return [...prev, { ...product, quantity: 1 }];
//       });
//    };

//    // Remove item completely
//    const removeFromCart = (id) => {
//       setCartItems(prev => prev.filter(item => item._id !== id));
//    };

//    // Decrease quantity
//    const decreaseQuantity = (id) => {
//       setCartItems(prev =>
//          prev
//             .map(item =>
//                item._id === id
//                   ? { ...item, quantity: item.quantity - 1 }
//                   : item
//             )
//             .filter(item => item.quantity > 0)
//       );
//    };

//    // Clear cart
//    const clearCart = () => {
//       setCartItems([]);
//    };

//    // Total price calculation
//    const totalPrice = cartItems.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//    );

//    return (
//       <CartContext.Provider
//          value={{
//             cartItems,
//             addToCart,
//             removeFromCart,
//             decreaseQuantity,
//             clearCart,
//             totalPrice
//          }}
//       >
//          {children}
//       </CartContext.Provider>
//    );
// }

// // Custom hook
// export function useCart() {
//    return useContext(CartContext);
// }

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isOpen, setIsOpen] = useState(false); // 👈 new

  const toggleCart = () => setIsOpen((prev) => !prev); // 👈 new
  const closeCart = () => setIsOpen(false);             // 👈 new

  // ✅ REFRESH TOKEN WHEN LOCALSTORAGE CHANGES
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ LOAD CART FROM DATABASE
  const loadCart = async () => {
    try {
      if (!token) {
        setCartItems([]);
        return;
      }

      const res = await axios.get("https://backend-4g4m.onrender.com/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const validItems =
        res.data.cart?.items?.filter(
          (i) => i && typeof i.price === "number" && i.productId
        ) || [];

      setCartItems(validItems);
    } catch (err) {
      console.log("Cart load failed:", err.message);
      setCartItems([]);
    }
  };

  // 🔥 REFETCH CART WHEN TOKEN CHANGES
  useEffect(() => {
    loadCart();
  }, [token]);

  // ✅ ADD TO CART
  const addToCart = async (product) => {
    if (!token) return;

    const payload = {
      productId: product._id,
      name: product.name,
      price: product.price || 0,
      image: product.image || "",
      quantity: 1,
    };

    try {
      const res = await axios.post(
        "https://backend-4g4m.onrender.com/api/cart/add",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const validItems =
        res.data.cart?.items?.filter(
          (i) => i && typeof i.price === "number" && i.productId
        ) || [];

      setCartItems(validItems);
      toast.success(`${product.name} added to cart 🛒`);
      setIsOpen(true); // 👈 auto-open drawer when item is added
    } catch (err) {
      console.log("Add to cart failed:", err.message);
    }
  };

  // ✅ REMOVE ITEM
  const removeFromCart = async (productId) => {
    if (!token) return;

    try {
      const res = await axios.delete(
        `https://backend-4g4m.onrender.com/api/cart/delete/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const validItems =
        res.data.cart?.items?.filter(
          (i) => i && typeof i.price === "number" && i.productId
        ) || [];

      setCartItems(validItems);
    } catch (err) {
      console.log("Remove failed:", err.message);
    }
  };

  // ✅ DECREASE QUANTITY
  const decreaseQuantity = async (productId) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item || !token) return;

    try {
      const res = await axios.put(
        "https://backend-4g4m.onrender.com/api/cart/update",
        {
          productId,
          quantity: item.quantity - 1,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const validItems =
        res.data.cart?.items?.filter(
          (i) => i && typeof i.price === "number" && i.productId
        ) || [];

      setCartItems(validItems);
    } catch (err) {
      console.log("Update failed:", err.message);
    }
  };

  // ✅ TOTAL PRICE
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item?.price || 0) * (item?.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        totalPrice,
        loadCart,
        setToken,
        isOpen,     // 👈 new
        toggleCart, // 👈 new
        closeCart,  // 👈 new
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);