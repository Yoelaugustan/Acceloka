"use client";

import React, { useMemo, useState } from "react"; // Import useState for loading state
import { Modal } from "antd";
import { useCart, CartItem } from "../../context/CartContext";
import {
  MinusCircleIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { CartModalProps } from "@/types/api";
import { StatusModal } from "../StatusModal";

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, removeFromCart, updateCartQuantity } = useCart();
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  // Status modal state
  const [status, setStatus] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const totalCartValue = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const handleUpdateQuantity = (item: CartItem, delta: number) => {
    const newQuantity = item.quantity + delta;

    if (newQuantity < 1) {
      removeFromCart(item.ticketCode);
    } else if (newQuantity > item.quota) {
      return;
    } else {
      updateCartQuantity(item.ticketCode, newQuantity);
    }
  };

  const handleCheckout = async () => {
    setLoadingCheckout(true);
    try {
      const bookingItems = cart.map((item) => ({
        ticketCode: item.ticketCode,
        quantity: item.quantity,
      }));

      const response = await fetch("http://localhost:5224/api/v1/book-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingItems }),
      });

      if (response.ok) {
        // Clear cart on success
        const itemsToRemove = [...cart];
        itemsToRemove.forEach((item) => removeFromCart(item.ticketCode));

        setStatus({
          isOpen: true,
          type: "success",
          title: "Booking Successful!",
          message: "Your tickets have been reserved. Enjoy your experience!",
        });
      } else {
        const errorData = await response.json();
        setStatus({
          isOpen: true,
          type: "error",
          title: "Booking Failed",
          message:
            errorData.title ||
            errorData.detail ||
            "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      setStatus({
        isOpen: true,
        type: "error",
        title: "Unexpected Error",
        message: "An unexpected error occurred. Please check your connection.",
      });
    } finally {
      setLoadingCheckout(false);
    }
  };

  const handleCloseStatus = () => {
    setStatus((prev) => ({ ...prev, isOpen: false }));
    if (status.type === "success") {
      onClose();
    }
  };

  return (
    <>
      <Modal
        title={
          <h2 className="text-2xl font-bold text-center w-full text-dark-1 font-heading">
            Your Cart
          </h2>
        }
        open={isOpen}
        onCancel={onClose}
        footer={null}
        centered
        width={600}
        styles={{
          body: { padding: "20px", maxHeight: "70vh", overflowY: "auto" },
        }}
        closeIcon={
          <span className="bg-error text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold">
            ✕
          </span>
        }
      >
        <div className="space-y-4">
          {cart.length === 0 ? (
            <p className="text-center text-dark-3">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li
                  key={item.ticketCode}
                  className="flex justify-center font-mono"
                >
                  {/* Ticket UI */}
                  <div
                    className="relative flex items-stretch my-2 rounded-xl border-2 border-yellow-500 shadow-sm w-full"
                    style={{ background: "#f5c842", overflow: "visible" }}
                  >
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full border-2 border-yellow-500 z-10"
                      style={{ left: 0, background: "#f0ede6" }}
                    />

                    <div
                      className="absolute top-1/2 -translate-y-1/2 translate-x-1/2 w-7 h-7 rounded-full border-2 border-yellow-500 z-10"
                      style={{ right: 0, background: "#f0ede6" }}
                    />

                    <div
                      className="absolute top-0 bottom-0 border-l-2 border-dashed border-yellow-500 z-10"
                      style={{ right: 160 }}
                    />

                    {/* ticket info */}
                    <div className="flex-1 flex flex-col gap-1.5 p-4 pr-16">
                      <span className="text-lg font-bold tracking-wider text-dark-1">
                        {item.ticketName}
                      </span>

                      <div className="flex items-center gap-1.5 text-xs text-dark-3">
                        <span className="font-bold">{item.ticketCode}</span>
                        <span className="opacity-50">--</span>
                        <span className="text-xs">{item.categoryName}</span>
                      </div>

                      <div className="text-xs text-dark-3">
                        <span>{item.eventDate}</span>
                      </div>

                      <div className="text-base font-bold text-dark-1 mt-1">
                        Rp. {item.price.toLocaleString("id-ID")}
                        <span className="text-xs font-normal text-dark-4">
                          /ticket
                        </span>
                      </div>
                    </div>

                    <div
                      className="flex flex-col justify-center items-end gap-2 px-4 py-3"
                      style={{ width: 160 }}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item, -1)}
                          className="text-error cursor-pointer"
                          disabled={item.quantity <= 1}
                        >
                          <MinusCircleIcon size={20} weight="fill" />
                        </button>
                        <span className="font-bold text-lg text-dark-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item, 1)}
                          className={`cursor-pointer ${item.quantity >= item.quota ? "text-dark-4" : "text-success"}`}
                          disabled={item.quantity >= item.quota}
                        >
                          <PlusCircleIcon size={20} weight="fill" />
                        </button>
                      </div>
                      <p className="font-bold text-dark-1 text-lg">
                        Rp.{" "}
                        {(item.quantity * item.price).toLocaleString("id-ID")}
                      </p>
                      <div
                        onClick={() => removeFromCart(item.ticketCode)}
                        className="text-error flex flex-col items-center cursor-pointer text-xs"
                      >
                        <TrashIcon size={20} weight="fill" />
                        <span>Remove</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {cart.length > 0 && (
            <>
              <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-dark-4 mt-6">
                <span className="text-lg font-bold text-dark-1">Total:</span>
                <span className="text-xl font-bold text-dark-1">
                  Rp. {totalCartValue.toLocaleString("id-ID")}
                </span>
              </div>
              <button
                className="w-full py-3 bg-dark-1 text-white rounded-full font-bold text-lg mt-4 cursor-pointer hover:bg-dark-2 active:scale-95 transition-all"
                onClick={handleCheckout}
                disabled={loadingCheckout}
              >
                {loadingCheckout ? "Processing..." : "Proceed to Checkout"}
              </button>
            </>
          )}
        </div>
      </Modal>

      <StatusModal
        isOpen={status.isOpen}
        type={status.type}
        title={status.title}
        message={status.message}
        onClose={handleCloseStatus}
      />
    </>
  );
}
