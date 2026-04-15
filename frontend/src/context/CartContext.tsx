"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const API = "http://localhost:5000/api";

export interface CartProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: string;
  description: string;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: CartProduct;
}

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  subtotal: number;
  loading: boolean;
  addToCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch(`${API}/cart`);
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
      }
    } catch (err) {
      console.error("Cart fetch failed", err);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (res.ok) await refreshCart();
    } catch (err) {
      console.error("Add to cart failed", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      const res = await fetch(`${API}/cart/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (res.ok) await refreshCart();
    } catch (err) {
      console.error("Update quantity failed", err);
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      const res = await fetch(`${API}/cart/${productId}`, { method: "DELETE" });
      if (res.ok) await refreshCart();
    } catch (err) {
      console.error("Remove from cart failed", err);
    }
  };

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, totalItems, subtotal, loading, addToCart, updateQuantity, removeFromCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
