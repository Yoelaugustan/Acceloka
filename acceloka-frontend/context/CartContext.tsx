"use client";

import { CartContextType, CartItem } from "@/types/api";
import React, { useState, useEffect, createContext, useContext } from "react";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// use local storage to store the cart
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    ticketCode: string,
    quantity: number,
    ticketName: string,
    price: number,
    categoryName: string,
    quota: number,
    eventDate: string,
  ) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.ticketCode === ticketCode,
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        updatedCart[existingItemIndex].quota = quota;
        updatedCart[existingItemIndex].eventDate = eventDate;
        return updatedCart;
      } else {
        return [
          ...prevCart,
          {
            ticketCode,
            quantity,
            ticketName,
            price,
            categoryName,
            quota,
            eventDate,
          },
        ];
      }
    });
  };

  const removeFromCart = (ticketCode: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.ticketCode !== ticketCode),
    );
  };

  const updateCartQuantity = (ticketCode: string, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.ticketCode === ticketCode
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  const getUniqueItemCount = () => {
    return cart.length;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        getUniqueItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
