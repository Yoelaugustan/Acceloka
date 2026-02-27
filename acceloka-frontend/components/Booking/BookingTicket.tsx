"use client";

import React from "react";
import { BookingTicketProps } from "@/types/api";

export function BookingTicket({
  booking,
  onViewDetails,
  onRevoke,
}: BookingTicketProps) {
  return (
    <div className="relative group w-full">
      {/* ticket UI */}
      <div className="absolute top-2 left-2 w-full h-full bg-[#f5c842]/50 rounded-xl border-2 border-dark-4/30 translate-x-1 translate-y-1" />
      <div className="absolute top-1 left-1 w-full h-full bg-[#f5c842]/90 rounded-xl border-2 border-dark-4/40" />

      <div className="relative flex flex-col sm:flex-row items-stretch w-full rounded-xl border-2 border-yellow-500 bg-[#f5c842] shadow-md font-mono overflow-visible">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 border-yellow-500 z-10"
          style={{ left: -14, background: "#f0ede6" }}
        />

        <div
          className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 border-yellow-500 z-10"
          style={{ right: -14, background: "#f0ede6" }}
        />

        {/* Ticket info */}
        <div className="flex-1 p-4 sm:p-5 border-b-2 sm:border-b-0 sm:border-r-2 border-dashed border-dark-1/30 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-dark-1 mb-2 sm:mb-3">
            ID: #{booking.bookedTicketId}
          </h3>
          <div className="space-y-1 text-xs sm:text-sm text-dark-3 uppercase">
            <p className="font-bold">
              Quantity: <span className="text-dark-1">{booking.totalTickets}</span>
            </p>
            <p className="mt-2 font-bold">
              Total Price: <br />
              <span className="text-sm sm:text-base text-dark-1">
                Rp. {booking.totalPrice.toLocaleString("id-ID")}
              </span>
            </p>
          </div>
        </div>

        {/* action button */}
        <div className="w-full sm:w-24 flex flex-row sm:flex-col items-center justify-center p-3 sm:p-4 gap-2 bg-dark-1/5 sm:bg-transparent shrink-0">
          <button
            onClick={() => onViewDetails(booking.bookedTicketId)}
            className="flex-1 sm:w-full py-2 bg-dark-1 text-white text-[10px] font-bold rounded-lg hover:bg-dark-2 transition-all cursor-pointer active:scale-95"
          >
            Details
          </button>
          <button
            onClick={() => onRevoke(booking.bookedTicketId)}
            className="flex-1 sm:w-full py-2 bg-error text-white text-[10px] font-bold rounded-lg hover:bg-error/80 transition-all cursor-pointer active:scale-95"
          >
            Revoke
          </button>
        </div>
      </div>
    </div>
  );
}