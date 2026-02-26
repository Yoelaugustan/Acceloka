"use client";

import React from "react";
import { BookingTicketProps } from "@/types/api";

export function BookingTicket({ booking, onViewDetails }: BookingTicketProps) {
  return (
    <div className="relative group w-full">
      {/* ticket ui */}
      <div className="absolute top-2 left-2 w-full h-full bg-[#f5c842]/50 rounded-xl border-2 border-dark-4/30 translate-x-1 translate-y-1" />
      <div className="absolute top-1 left-1 w-full h-full bg-[#f5c842]/90 rounded-xl border-2 border-dark-4/40" />

      <div className="relative flex items-stretch w-full rounded-xl border-2 border-yellow-500 bg-[#f5c842] shadow-md min-h-35 font-mono">
        
        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-white border-2 border-yellow-500 rounded-full z-10" />

        {/* ticket info */}
        <div className="flex-1 p-5 border-r-2 border-dashed border-dark-1/30">
          <h3 className="text-xl font-bold text-dark-1 mb-3">
            ID: #{booking.bookedTicketId}
          </h3>
          
          <div className="space-y-1 text-sm text-dark-3 uppercase">
            <p className="font-bold">Quantity: <span className="text-dark-1">{booking.totalTickets}</span></p>
            <p className="mt-2 font-bold">
              Total Price: <br />
              <span className="text-base text-dark-1">
                Rp. {booking.totalPrice.toLocaleString("id-ID")}
              </span>
            </p>
          </div>
        </div>

        <div className="w-24 flex flex-col items-center justify-center p-4">
            <button
                onClick={() => onViewDetails(booking.bookedTicketId)}
                className="w-full py-2 bg-dark-1 text-white text-[10px] font-bold rounded-lg hover:bg-dark-2 transition-all cursor-pointer active:scale-95"
            >
                View Details
            </button>
        </div>
        
        <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-white border-2 border-yellow-500 rounded-full z-10" />
      </div>
    </div>
  );
}
