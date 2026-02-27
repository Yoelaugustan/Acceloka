"use client";

import React, { useState, useEffect } from "react";
import { Modal, Slider } from "antd";
import { Category, FilterModalProps } from "@/types/api";

export default function FilterModal({
  isOpen,
  onClose,
  onSave,
  initialFilters,
}: FilterModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  const [priceRange, setPriceRange] = useState<[number, number] | null>(
    initialFilters.priceRange,
  );
  const [category, setCategory] = useState<string | null>(
    initialFilters.category,
  );
  const [orderBy, setOrderBy] = useState(initialFilters.orderBy);
  const [orderState, setOrderState] = useState(initialFilters.orderState);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5224/api/v1/get-categories",
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleSave = () => {
    onSave({ priceRange, category, orderBy, orderState });
    onClose();
  };

  const orderByOptions = [
    { label: "Ticket Code", value: "ticketcode" },
    { label: "Category Name", value: "categoryname" },
    { label: "Ticket Name", value: "ticketname" },
    { label: "Price", value: "price" },
    { label: "Event Date", value: "eventdate" },
  ];

  return (
    <Modal
      title={<h2 className="text-2xl font-bold text-center w-full">Filters</h2>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      styles={{ body: { padding: "20px" } }}
      closeIcon={
        <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold">
          ✕
        </span>
      }
    >
      <div className="space-y-6 font-body">
        {/* Price Range Slider */}
        <div>
          <p className="font-bold mb-2">Price Range</p>
          <Slider
            range
            max={2000000}
            value={priceRange || [0, 2000000]}
            onChange={(val) => setPriceRange(val as [number, number])}
          />
        </div>

        {/* Categories Selection */}
        <div>
          <p className="font-bold mb-2">Category</p>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.categoryName}
                onClick={() =>
                  setCategory(
                    category === cat.categoryName ? null : cat.categoryName,
                  )
                }
                className={`px-4 py-1.5 rounded-full border text-xs transition-all ${
                  category === cat.categoryName
                    ? "bg-[#958C55] text-white border-[#958C55]"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>
        </div>

        {/* Oder By Selection */}
        <div>
          <p className="font-bold mb-2">Order By</p>
          <div className="flex gap-2 flex-wrap">
            {orderByOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setOrderBy(opt.value)}
                className={`px-4 py-1.5 rounded-full border text-xs transition-all ${
                  orderBy === opt.value
                    ? "bg-[#958C55] text-white border-[#958C55]"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Order State Selection */}
        <div>
          <p className="font-bold mb-2">Order State</p>
          <div className="flex gap-2">
            {(["asc", "desc"] as const).map((state) => (
              <button
                key={state}
                onClick={() => setOrderState(state)}
                className={`flex-1 py-2 rounded-lg font-bold ${orderState === state ? "bg-[#958C55] text-white" : "bg-gray-100 text-gray-400"}`}
              >
                {state === "asc" ? "Ascending" : "Descending"}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 bg-[#958C55] text-white rounded-full font-bold text-lg mt-4"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
