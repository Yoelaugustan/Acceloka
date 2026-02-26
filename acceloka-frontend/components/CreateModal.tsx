"use client";

import React, { useState } from "react";
import { CreateModalProps, Ticket } from "@/types/api";
import { TicketModal } from "./TicketModal";

const CATEGORIES: string[] = [
  "Hotel",
  "Cinema",
  "Concert",
  "Sport",
  "Exhibition",
];

export function CreateModal({ onClose, onCreated }: CreateModalProps) {
  const [ticketName, setTicketName] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [quota, setQuota] = useState<string>("");

  const handleSubmit = (): void => {
    if (!ticketName || !categoryName || !eventDate || !price || !quota) return;
    onCreated({
      ticketId: 0, // Placeholder
      ticketCode: `C${Math.floor(Math.random() * 900 + 100)}`,
      ticketName,
      categoryName,
      eventDate,
      price: Number(price),
      quota: Number(quota),
    });
    onClose();
  };

  const inputCls =
    "w-full px-3 py-2 rounded-lg text-xs bg-white/50 border border-dark-4 text-dark-1 placeholder-dark-4 outline-none focus:border-primary transition";
  const labelCls =
    "text-xs font-bold text-dark-1 tracking-wider uppercase mb-1 block";

  return (
    <TicketModal onClose={onClose}>
      {/* Left: stub / preview */}
      <div
        className="flex flex-col justify-center gap-2 p-6 shrink-0"
        style={{ width: 180 }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base font-bold tracking-wider text-dark-1 truncate">
            {ticketName || "New Ticket"}
          </span>
          {categoryName && (
            <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded text-white bg-dark-1">
              {categoryName}
            </span>
          )}
        </div>
        <div className="text-xs text-dark-3">{eventDate || "—"}</div>
        <div className="text-sm font-bold text-dark-1">
          {price ? `Rp. ${Number(price).toLocaleString("id-ID")}` : "—"}
        </div>
        <div className="text-xs text-dark-3">
          {quota ? `${quota} tickets` : "—"}
        </div>
      </div>

      {/* Tear line */}
      <div className="flex flex-col items-center justify-center py-4 self-stretch">
        <div className="flex-1 border-l-2 border-dashed border-dark-4/50" />
        <div
          className="w-5 h-5 rounded-full border-2 border-dark-4 my-1 shrink-0"
          style={{ background: "#e8e4dc" }}
        />
        <div className="flex-1 border-l-2 border-dashed border-dark-4/50" />
      </div>

      {/* Right: create form */}
      <div className="flex flex-col justify-center gap-2.5 px-5 py-6 flex-1">
        <div>
          <label className={labelCls}>Ticket Name</label>
          <input
            value={ticketName}
            onChange={(e) => setTicketName(e.target.value)}
            placeholder="Insert Ticket Name"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <select
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className={inputCls}
          >
            <option value="" disabled>
              Select category
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className={labelCls}>Event Date</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="flex-1">
            <label className={labelCls}>Price (Rp)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="500000"
              className={inputCls}
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>Quota</label>
          <input
            type="number"
            value={quota}
            onChange={(e) => setQuota(e.target.value)}
            placeholder="Insert Quota"
            className={inputCls}
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full py-2.5 rounded-lg text-white text-xs font-bold tracking-wide shadow-md transition-all duration-200 cursor-pointer bg-dark-1 hover:bg-dark-2 active:scale-95 mt-1"
        >
          Create Ticket
        </button>
      </div>
    </TicketModal>
  );
}
