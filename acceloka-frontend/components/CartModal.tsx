"use client";

import React, { useMemo } from "react";
import { Modal } from "antd";
import { useCart, CartItem } from "../context/CartContext";
import {
  MinusCircleIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { CartModalProps } from "@/types/api";

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, removeFromCart, updateCartQuantity } = useCart();

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

  return (
    <Modal
      title={
        <h2 className="text-2xl font-bold text-center w-full">Your Cart</h2>
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
        <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold">
          ✕
        </span>
      }
    >
      <div className="space-y-4 font-body">
        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <ul className="space-y-4">
            {cart.map((item) => (
              <li key={item.ticketCode} className="flex justify-center">
                {/* Ticket UI */}
                <div
                  className="relative flex items-stretch my-2 rounded-xl border-2 border-yellow-500 shadow-sm font-mono w-full"
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
                    <span className="text-lg font-bold tracking-wider text-yellow-950">
                      {item.ticketName}
                    </span>
                    <span className="text-xs text-yellow-900">
                      {item.categoryName}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs text-yellow-900">
                      <span className="font-bold">{item.ticketCode}</span>
                    </div>

                    <div className="text-base font-bold text-yellow-950 mt-1">
                      Rp. {item.price.toLocaleString("id-ID")}
                      <span className="text-xs font-normal text-yellow-800">
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
                        className="text-red-500 cursor-pointer"
                        disabled={item.quantity <= 1}
                      >
                        <MinusCircleIcon size={20} weight="fill" />
                      </button>
                      <span className="font-bold text-lg">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item, 1)}
                        className={`cursor-pointer ${item.quantity >= item.quota ? "text-gray-400" : "text-green-500"}`}
                        disabled={item.quantity >= item.quota}
                      >
                        <PlusCircleIcon size={20} weight="fill" />
                      </button>
                    </div>
                    <p className="font-bold text-[#334155] text-lg">
                      Rp. {(item.quantity * item.price).toLocaleString("id-ID")}
                    </p>
                    <div
                      onClick={() => removeFromCart(item.ticketCode)}
                      className="text-red-600 flex flex-col items-center cursor-pointer"
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
            <div className="flex justify-between items-center pt-4 border-t-2 border-dashed mt-6">
              <span className="text-lg font-bold text-[#334155]">Total:</span>
              <span className="text-xl font-bold text-[#334155]">
                Rp. {totalCartValue.toLocaleString("id-ID")}
              </span>
            </div>
            <button
              className="w-full py-3 bg-[#958C55] text-white rounded-full font-bold text-lg mt-4 cursor-pointer"
              onClick={() => alert("Proceed to Checkout (Not implemented yet)")}
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
