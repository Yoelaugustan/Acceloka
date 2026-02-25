"use client";

import { TicketModalProps } from "@/types/api";
import React from "react";

export function TicketModal({ onClose, children }: TicketModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div
        className="relative flex items-stretch rounded-xl border-2 border-yellow-500 shadow-2xl font-mono"
        style={{ background: "#f5c842", width: 580, overflow: "visible" }}
      >
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-20 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-bold flex items-center justify-center shadow-lg transition-colors cursor-pointer"
        >
          X
        </button>

        {/* ticket UI */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full border-2 border-yellow-500 z-10"
          style={{ left: 0, background: "#e8e4dc" }}
        />

        <div
          className="absolute top-1/2 -translate-y-1/2 translate-x-1/2 w-7 h-7 rounded-full border-2 border-yellow-500 z-10"
          style={{ right: 0, background: "#e8e4dc" }}
        />

        {children}
      </div>
    </div>
  );
}
