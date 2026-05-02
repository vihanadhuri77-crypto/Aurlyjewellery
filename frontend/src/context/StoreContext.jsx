import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

const StoreContext = createContext(null);

const readLS = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => readLS("cently_cart", []));
  const [wishlist, setWishlist] = useState(() => readLS("cently_wishlist", []));
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  useEffect(() => localStorage.setItem("cently_cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("cently_wishlist", JSON.stringify(wishlist)), [wishlist]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + qty } : p));
      return [...prev, { id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.images[0], qty }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((p) => p.id !== id));
  const updateQty = (id, qty) => setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p)));
  const clearCart = () => setCart([]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev.filter((p) => p.id !== product.id);
      return [...prev, { id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.images[0] }];
    });
  };
  const isWishlisted = (id) => wishlist.some((p) => p.id === id);
  const removeFromWishlist = (id) => setWishlist((prev) => prev.filter((p) => p.id !== id));

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  const itemCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  const value = {
    cart, wishlist, cartOpen, wishlistOpen, subtotal, itemCount,
    setCartOpen, setWishlistOpen,
    addToCart, removeFromCart, updateQty, clearCart,
    toggleWishlist, isWishlisted, removeFromWishlist,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};
