"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { PencilSimpleIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { StatusModal } from "./StatusModal";
import {
  BookedTicketCategoryDetail,
  BookedTicketItem,
  BookingDetailModalProps,
} from "@/types/api";

export default function BookingDetailModal({
  isOpen,
  onClose,
  bookedTicketId,
}: BookingDetailModalProps) {
  const [details, setDetails] = useState<BookedTicketCategoryDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [tempQuantities, setTempQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [quotaMap, setQuotaMap] = useState<{ [key: string]: number }>({});

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

  useEffect(() => {
    if (isOpen && bookedTicketId !== null) {
      setLoading(true);
      fetch(`http://localhost:5224/api/v1/get-booked-ticket/${bookedTicketId}`)
        .then((res) => res.json())
        .then((data: BookedTicketCategoryDetail[]) => {
          setDetails(data);
          const qtys: { [key: string]: number } = {};
          const quotas: { [key: string]: number } = {};
          data.forEach((cat) => {
            // Type cat
            cat.tickets.forEach((t) => {
              // Type t
              qtys[t.ticketCode] = t.quantity;
              quotas[t.ticketCode] = t.quota;
            });
          });
          setTempQuantities(qtys);
          setQuotaMap(quotas);
          setLoading(false);
        });
    }
  }, [isOpen, bookedTicketId]);

  const handleUpdateAPI = async () => {
    setIsUpdating(true);
    try {
      const payload = Object.entries(tempQuantities).map(
        ([ticketCode, quantity]) => ({
          ticketCode,
          quantity,
        }),
      );

      const response = await fetch(
        `http://localhost:5224/api/v1/edit-booked-ticket/${bookedTicketId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        setStatus({
          isOpen: true,
          type: "success",
          title: "Update Successful!",
          message: "Ticket quantities have been successfully updated.",
        });
      } else {
        const errorData = await response.json();
        setStatus({
          isOpen: true,
          type: "error",
          title: "Update Failed",
          message:
            errorData.detail || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
      setStatus({
        isOpen: true,
        type: "error",
        title: "Unexpected Error",
        message: "An unexpected error occurred. Please check your connection.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseStatus = () => {
    setStatus((prev) => ({ ...prev, isOpen: false }));
    if (status.type === "success") {
      onClose();
      window.location.reload();
    }
  };

  const hasChanges = details.some((cat) =>
    cat.tickets.some((t) => tempQuantities[t.ticketCode] !== t.quantity),
  );

  const hasInvalidQuantities = details.some((cat) =>
    cat.tickets.some(
      (t) =>
        tempQuantities[t.ticketCode] > quotaMap[t.ticketCode] ||
        tempQuantities[t.ticketCode] < 1,
    ),
  );

  const getCategoryTotal = (tickets: BookedTicketItem[]) => {
    return tickets.reduce(
      (sum, t) => sum + (tempQuantities[t.ticketCode] || 0),
      0,
    );
  };

  return (
    <>
      <Modal
        title={
          <h2 className="text-2xl font-bold text-center w-full text-dark-1 font-heading">
            Booking Details #{bookedTicketId}
          </h2>
        }
        open={isOpen}
        onCancel={onClose}
        footer={
          hasChanges ? (
            <div className="p-4 border-t border-dark-4/10 flex justify-end gap-3">
              <button
                onClick={() => onClose()}
                className="px-6 py-2 text-dark-3 font-bold hover:text-dark-1 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAPI}
                disabled={isUpdating || hasInvalidQuantities}
                className="px-8 py-2 bg-primary text-white font-bold rounded-full hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50 shadow-md"
              >
                {isUpdating ? "Updating..." : "Save All Changes"}
              </button>
            </div>
          ) : null
        }
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
        <div className="space-y-6">
          {loading ? (
            <p className="text-center py-10 font-bold text-dark-3 animate-pulse">
              Fetching details...
            </p>
          ) : (
            details.map((category) => (
              <div key={category.categoryName}>
                <div className="flex items-center justify-between mb-3 py-1.5">
                  <h3 className="text-lg font-bold text-dark-1 uppercase">
                    {category.categoryName}
                  </h3>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    Total: {getCategoryTotal(category.tickets)}
                  </span>
                </div>

                <ul className="space-y-4">
                  {category.tickets.map((ticket: BookedTicketItem) => (
                    <li
                      key={ticket.ticketCode}
                      className="relative flex items-stretch rounded-xl border-2 border-yellow-500 bg-[#f5c842] shadow-sm font-mono"
                      style={{ overflow: "visible" }}
                    >
                      <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full border-2 border-yellow-500 z-10"
                        style={{ left: 0, background: "#fff" }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 translate-x-1/2 w-7 h-7 rounded-full border-2 border-yellow-500 z-10"
                        style={{ right: 0, background: "#fff" }}
                      />

                      <div
                        className="absolute top-0 bottom-0 border-l-2 border-dashed border-dark-1/10 z-10"
                        style={{ right: 80 }}
                      />

                      <div className="flex-1 p-4 px-8 flex flex-col gap-1">
                        <p className="font-bold text-dark-1 text-lg leading-tight truncate">
                          {ticket.ticketName}
                        </p>

                        <div className="flex items-center gap-2 text-[10px] text-dark-3 font-bold uppercase">
                          <span>{ticket.ticketCode}</span>
                          <span className="opacity-30">|</span>
                          <span>{category.categoryName}</span>
                        </div>

                        <p className="text-[11px] text-dark-3 font-medium">
                          {ticket.eventDate}
                        </p>

                        <div className="mt-2 flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-dark-3 uppercase">
                              Amount:
                            </span>
                            {isEditing === ticket.ticketCode ? (
                              <>
                                <input
                                  type="number"
                                  min="1"
                                  max={quotaMap[ticket.ticketCode]}
                                  className={`w-16 px-2 py-0.5 bg-white/80 border-2 rounded font-bold text-sm outline-none ${
                                    tempQuantities[ticket.ticketCode] >
                                      quotaMap[ticket.ticketCode] ||
                                    tempQuantities[ticket.ticketCode] < 1
                                      ? "border-error"
                                      : "border-primary"
                                  }`}
                                  value={tempQuantities[ticket.ticketCode]}
                                  onChange={(e) =>
                                    setTempQuantities({
                                      ...tempQuantities,
                                      [ticket.ticketCode]:
                                        parseInt(e.target.value) || 1,
                                    })
                                  }
                                  autoFocus
                                />
                                {tempQuantities[ticket.ticketCode] >
                                  quotaMap[ticket.ticketCode] && (
                                  <span className="text-error text-[10px] font-bold ml-2">
                                    Max {quotaMap[ticket.ticketCode]}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="font-bold text-dark-1 text-sm bg-dark-1/5 px-2 rounded">
                                {tempQuantities[ticket.ticketCode]}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 border-l border-dark-1/10 pl-4">
                            <span className="text-[10px] font-bold text-dark-3/50 uppercase">
                              Initial:
                            </span>
                            <span className="font-bold text-dark-3/50 text-sm">
                              {ticket.quantity}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="w-20 flex items-center justify-center pr-2">
                        <button
                          onClick={() =>
                            setIsEditing(
                              isEditing === ticket.ticketCode
                                ? null
                                : ticket.ticketCode,
                            )
                          }
                          className={`p-2 rounded-full transition-all cursor-pointer ${
                            isEditing === ticket.ticketCode
                              ? "text-white bg-success scale-110"
                              : "text-dark-1 bg-white/20 hover:bg-white/40"
                          }`}
                        >
                          {isEditing === ticket.ticketCode ? (
                            <CheckCircleIcon size={24} weight="fill" />
                          ) : (
                            <PencilSimpleIcon size={22} weight="bold" />
                          )}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
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
