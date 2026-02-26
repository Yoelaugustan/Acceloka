import { Ticket } from "@/types/api";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

interface TicketCardProps extends Ticket {
  onBookClick: (ticket: Ticket) => void;
}

export default function TicketCard(props: TicketCardProps) {
  const {
    categoryName,
    eventDate,
    price,
    quota,
    ticketCode,
    ticketName,
    onBookClick,
  } = props;
  const { cart } = useCart();
  const isLow: boolean = quota <= 5;

  const isAddedToCart = cart.some((item) => item.ticketCode === ticketCode);

  const handleAddClick = (): void => {
    onBookClick({
      categoryName,
      eventDate,
      price,
      quota,
      ticketCode,
      ticketName,
      ticketId: 0,
    });
  };

  return (
    <div
      className="relative flex items-stretch w-96 my-4 rounded-xl border-2 border-yellow-500 shadow-lg font-mono"
      style={{ background: "#f5c842", overflow: "visible" }}
    >
      {/* ticket UI */}
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
        style={{ right: 120 }}
      />

      <div
        className="flex-1 flex flex-col gap-1.5 p-4"
        style={{ paddingRight: 48 }}
      >
        {/* ticket name */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold font-mono tracking-wider text-dark-1">
            {ticketName}
          </span>
        </div>

        {/* ticket code and category */}
        <div className="flex items-center gap-1.5 text-xs text-dark-3">
          <span className="font-bold">{ticketCode}</span>
          <span className="opacity-50">--</span>
          <span>{categoryName}</span>
        </div>

        {/* ticket date */}
        <div className="text-xs text-dark-3">{eventDate}</div>

        {/* ticket price */}
        <div className="text-base font-bold text-dark-1 mt-1">
          Rp. {price.toLocaleString("id-ID")}
        </div>

        {/* ticket quota */}
        <div
          className={`flex items-center gap-2 text-xs mt-0.5 ${
            isLow ? "text-error" : "text-dark-2"
          }`}
        >
          <span>{quota} tickets left</span>
          {isLow && (
            <span className="bg-error text-white text-xs font-bold px-1.5 py-0.5 rounded">
              Almost sold out!
            </span>
          )}
        </div>
      </div>

      {/* add to cart button */}
      <div
        className="flex items-center justify-center px-3"
        style={{ width: 120 }}
      >
        <button
          onClick={handleAddClick}
          className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold tracking-wide shadow-md transition-all duration-300 cursor-pointer ${
            isAddedToCart
              ? "bg-success text-dark-1"
              : "bg-dark-1 hover:bg-dark-2 active:scale-95 text-white"
          }`}
          disabled={isAddedToCart}
        >
          {isAddedToCart ? "Successful" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
