"use client";

import React, { useState } from "react";
import { BookModalProps, Ticket } from "@/types/api";
import { TicketModal } from "./TicketModal";
import { useCart } from "../context/CartContext";

export function BookModal({ ticket, onClose }: BookModalProps) {
  const [qty, setQty] = useState<string>("");
  const isLow: boolean = ticket.quota <= 5;
  const { addToCart } = useCart();

  const handleSubmit = (): void => {
    const quantityNum = Number(qty);
    if (!qty || quantityNum < 1 || quantityNum > ticket.quota) return;

    addToCart(
      ticket.ticketCode,
      quantityNum,
      ticket.ticketName,
      ticket.price,
      ticket.categoryName,
      ticket.quota,
      ticket.eventDate
    );
    onClose();
  };

  return (
    <TicketModal onClose={onClose}>
      <div
        className="flex-1 flex flex-col gap-1.5 p-6"
        style={{ paddingRight: 40 }}
      >
        {/* ticket info */}
        <span className="text-xl font-bold tracking-wider text-dark-1">
          {ticket.ticketName}
        </span>

        <div className="flex items-center gap-1.5 text-xs text-dark-3">
          <span className="font-bold">{ticket.ticketCode}</span>
          <span className="opacity-50">--</span>
          <span>{ticket.categoryName}</span>
        </div>

        <div className="text-xs text-dark-3">{ticket.eventDate}</div>

        <div className="text-base font-bold text-dark-1 mt-1">
          Rp. {ticket.price.toLocaleString("id-ID")}
          <span className="text-xs font-normal text-dark-4">/ticket</span>
        </div>

        <div
          className={`flex items-center gap-2 text-xs mt-0.5 ${isLow ? "text-error" : "text-dark-3"}`}
        >
          <span>{ticket.quota} tickets left</span>
          {isLow && (
            <span className="bg-error text-white text-xs font-bold px-1.5 py-0.5 rounded">
              Almost sold out!
            </span>
          )}
        </div>
      </div>

      {/* ticket UI */}
      <div className="flex flex-col items-center justify-center py-4 self-stretch">
        <div className="flex-1 border-l-2 border-dashed border-dark-4/50" />
        <div
          className="w-5 h-5 rounded-full border-2 border-dark-4 my-1 shrink-0"
          style={{ background: "#e8e4dc" }}
        />
        <div className="flex-1 border-l-2 border-dashed border-dark-4/50" />
      </div>

      {/* input quantity */}
      <div
        className="flex flex-col justify-center gap-3 px-5 py-6"
        style={{ width: 180 }}
      >
        <div>
          <label className="text-xs font-bold text-dark-1 tracking-wider uppercase mb-1.5 block">
            Quantity
          </label>
          <input
            type="number"
            min={1}
            max={ticket.quota}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="Insert Amount"
            className="w-full px-3 py-2 rounded-lg text-xs bg-white/50 border border-dark-4 text-dark-1 placeholder-dark-4 outline-none focus:border-primary transition"
          />
          {qty && Number(qty) > ticket.quota && (
            <p className="text-xs text-error mt-1">Max {ticket.quota}</p>
          )}
        </div>

        {/* show the total cost */}
        {qty && Number(qty) > 0 && (
          <div className="text-xs text-dark-1 bg-dark-4/10 rounded-lg px-2 py-1.5">
            Total:{" "}
            <span className="font-bold">
              Rp. {(Number(qty) * ticket.price).toLocaleString("id-ID")}
            </span>
          </div>
        )}

        {/* add to cart button */}
        <button
          onClick={handleSubmit}
          className="w-full py-2.5 rounded-lg text-white text-xs font-bold tracking-wide shadow-md transition-all duration-200 cursor-pointer bg-dark-1 hover:bg-dark-2 active:scale-95"
        >
          Add to Cart
        </button>
      </div>
    </TicketModal>
  );
}
