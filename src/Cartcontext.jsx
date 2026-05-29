import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CartContext = createContext();
const API = "https://backend-4g4m.onrender.com";
const COOKIE_NAME = "guest_cart";
const COOKIE_DAYS = 7;

// ── Cookie helpers ──────────────────────────────────────────
const getCookieCart = () => {
  try {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${COOKIE_NAME}=`));
    if (!match) return [];
    return JSON.parse(decodeURIComponent(match.split("=")[1]));
  } catch {
    return [];
  }
};

const setCookieCart = (items) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_DAYS);
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(items)
  )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

const clearCookieCart = () => {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
// ────────────────────────────────────────────────────────────

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isOpen, setIsOpen] = useState(false);

  const toggleCart = () => setIsOpen((prev) => !prev);
  const closeCart = () => setIsOpen(false);

  // ── Sync token when localStorage changes (other tabs) ──
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      setToken(newToken);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ── Load cart ──
  const loadCart = async () => {
    if (!token) {
      // Guest: always read from cookie
      const cookieItems = getCookieCart();
      setCartItems(cookieItems);
      return;
    }
    // Logged in: load from DB
    try {
      const res = await axios.get(`${API}/api/cart`, {
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

  // ── Run loadCart on mount and whenever token changes ──
  useEffect(() => {
    loadCart();
  }, [token]);

  // ── ADD TO CART ──
  const addToCart = async (product) => {
    if (!token) {
      // Guest: update cookie cart
      const prev = getCookieCart();
      const existing = prev.find((i) => i.productId === product._id);
      let updated;
      if (existing) {
        updated = prev.map((i) =>
          i.productId === product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        updated = [
          ...prev,
          {
            productId: product._id,
            name: product.name,
            price: product.price || 0,
            image: product.image || "",
            quantity: 1,
          },
        ];
      }
      setCookieCart(updated);
      setCartItems(updated);
      toast.success(`${product.name} added to cart 🛒`);
      setIsOpen(true);
      return;
    }

    // Logged in: DB cart
    const payload = {
      productId: product._id,
      name: product.name,
      price: product.price || 0,
      image: product.image || "",
      quantity: 1,
    };
    try {
      const res = await axios.post(`${API}/api/cart/add`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const validItems =
        res.data.cart?.items?.filter(
          (i) => i && typeof i.price === "number" && i.productId
        ) || [];
      setCartItems(validItems);
      toast.success(`${product.name} added to cart 🛒`);
      setIsOpen(true);
    } catch (err) {
      console.log("Add to cart failed:", err.message);
    }
  };

  // ── REMOVE ITEM ──
  const removeFromCart = async (productId) => {
    if (!token) {
      const updated = getCookieCart().filter((i) => i.productId !== productId);
      setCookieCart(updated);
      setCartItems(updated);
      return;
    }
    try {
      const res = await axios.delete(`${API}/api/cart/delete/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const validItems =
        res.data.cart?.items?.filter(
          (i) => i && typeof i.price === "number" && i.productId
        ) || [];
      setCartItems(validItems);
    } catch (err) {
      console.log("Remove failed:", err.message);
    }
  };

  // ── DECREASE QUANTITY ──
  const decreaseQuantity = async (productId) => {
    if (!token) {
      const prev = getCookieCart();
      const updated = prev
        .map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0);
      setCookieCart(updated);
      setCartItems(updated);
      return;
    }
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;
    try {
      const res = await axios.put(
        `${API}/api/cart/update`,
        { productId, quantity: item.quantity - 1 },
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

  // ── CLEAR CART (called on logout) ──
  const clearCart = () => {
    clearCookieCart();
    setCartItems([]);
  };

  // ── TOTAL PRICE ──
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
        clearCart,
        totalPrice,
        loadCart,
        setToken,
        isOpen,
        toggleCart,
        closeCart,
        isGuest: !token,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);