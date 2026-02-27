"use client";

import React, { useEffect, useState } from "react";
import { CreateModalProps, Category } from "@/types/api";
import { TicketModal } from "../TicketModal";
import { StatusModal } from "../StatusModal";
import { ConfigProvider, DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";

export function CreateModal({ onClose, onCreated }: CreateModalProps) {
  const [ticketName, setTicketName] = useState<string>("");
  const [ticketCode, setTicketCode] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");
  const [eventDate, setEventDate] = useState<Dayjs | null>(null);
  const [price, setPrice] = useState<string>("");
  const [quota, setQuota] = useState<string>("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [status, setStatus] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ isOpen: false, type: "success", title: "", message: "" });

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5224/api/v1/get-categories");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (e) {
      console.error("Failed to fetch categories", e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName) {
      return;
    }
    try {
      const res = await fetch("http://localhost:5224/api/v1/insert-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (res.ok) {
        await fetchCategories();
        setCategoryName(newCategoryName);
        setIsAddingCategory(false);
        setNewCategoryName("");
      }
    } catch (e) {
      console.error("Failed to add category", e);
    }
  };

  const handleSubmit = async () => {
    if (
      !ticketName ||
      !ticketCode ||
      !categoryName ||
      !eventDate ||
      !price ||
      !quota
    ) {
      setStatus({
        isOpen: true,
        type: "error",
        title: "Validation Error",
        message: "Please fill in all fields.",
      });
      return;
    }

    const payload = {
      tickets: [
        {
          code: ticketCode,
          name: ticketName,
          categoryName: categoryName,
          eventDate: eventDate.toISOString(),
          price: Number(price),
          quota: Number(quota),
        },
      ],
    };

    try {
      const res = await fetch("http://localhost:5224/api/v1/insert-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onCreated({
          ticketId: 0,
          ticketCode,
          ticketName,
          categoryName,
          eventDate: eventDate.format("YYYY-MM-DD HH:mm:ss"),
          price: Number(price),
          quota: Number(quota),
        });
        onClose();
      } else {
        const errData = await res.json();
        setStatus({
          isOpen: true,
          type: "error",
          title: "Creation Failed",
          message: errData.detail || "Failed to create ticket.",
        });
      }
    } catch (e) {
      console.error(e);
      setStatus({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "An unexpected error occurred.",
      });
    }
  };

  const inputCls =
    "w-full px-3 py-2 rounded-lg text-xs bg-white/50 border border-dark-4 text-dark-1 placeholder-dark-4 outline-none focus:border-primary transition";
  const labelCls =
    "text-xs font-bold text-dark-1 tracking-wider uppercase mb-1 block";

  return (
    <>
      <TicketModal onClose={onClose}>
        <div className="flex items-center justify-center p-4 sm:p-6 shrink-0 w-full sm:w-[150px]">
          <span className="font-mono font-bold text-dark-1 text-center">New Ticket</span>
        </div>

        {/* tear line */}
        <div className="block sm:hidden w-full border-t-2 border-dashed border-dark-4/50" />
        <div className="hidden sm:flex flex-col items-center justify-center py-4 self-stretch">
          <div className="flex-1 border-l-2 border-dashed border-dark-4/50" />
          <div className="flex-1 border-l-2 border-dashed border-dark-4/50" />
        </div>

        {/* create form */}
        <div className="flex flex-col justify-center gap-2.5 px-5 py-6 flex-1 overflow-y-auto max-h-[90vh]">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className={labelCls}>Ticket Name</label>
              <input
                value={ticketName}
                onChange={(e) => setTicketName(e.target.value)}
                placeholder="Exp: Cold play concert"
                className={inputCls}
              />
            </div>
            <div className="w-1/3">
              <label className={labelCls}>Code</label>
              <input
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value)}
                placeholder="C101"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Category</label>
            {!isAddingCategory ? (
              <div className="flex gap-2">
                <select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className={inputCls}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((c) => (
                    <option key={c.categoryName} value={c.categoryName}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setIsAddingCategory(true)}
                  className="px-2 py-1 bg-dark-1 text-white rounded text-xs font-bold hover:bg-dark-2 transition cursor-pointer"
                  title="Add New Category"
                >
                  +
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New Category Name"
                  className={inputCls}
                  autoFocus
                />
                <button
                  onClick={handleAddCategory}
                  className="px-3 py-1 bg-success text-white rounded text-xs font-bold hover:bg-success/80 transition cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsAddingCategory(false)}
                  className="px-3 py-1 bg-error text-white rounded text-xs font-bold hover:bg-error/80 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className={labelCls}>Event Date</label>
              <ConfigProvider
                theme={{
                  components: {
                    DatePicker: {
                      cellWidth: 28,
                      cellHeight: 24,
                      timeColumnWidth: 44,
                      timeColumnHeight: 180,
                    },
                  },
                }}
              >
                <DatePicker
                  showTime
                  className={inputCls}
                  placeholder="Select event date and time"
                  value={eventDate}
                  onChange={(date) => setEventDate(date)}
                  format="YYYY-MM-DD HH:mm"
                  style={{
                    width: "100%",
                    height: "34px",
                    borderColor: "#1e2a3a",
                    color: "#1e2a3a",
                    backgroundColor: "#ffffff80",
                  }}
                />
              </ConfigProvider>
            </div>
          </div>

          <div className="flex gap-2">
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
            <div className="flex-1">
              <label className={labelCls}>Quota</label>
              <input
                type="number"
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                placeholder="100"
                className={inputCls}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-2.5 rounded-lg text-white text-xs font-bold tracking-wide shadow-md transition-all duration-200 cursor-pointer bg-dark-1 hover:bg-dark-2 active:scale-95 mt-2"
          >
            Create Ticket
          </button>
        </div>
      </TicketModal>

      <StatusModal
        isOpen={status.isOpen}
        type={status.type}
        title={status.title}
        message={status.message}
        onClose={() => setStatus((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}
