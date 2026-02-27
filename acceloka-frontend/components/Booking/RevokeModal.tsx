"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import { StatusModal } from "../StatusModal";
import { BookedTicketCategoryDetail, RevokeModalProps } from "@/types/api";

export default function RevokeModal({
  isOpen,
  onClose,
  bookedTicketId,
  onSuccess,
}: RevokeModalProps) {
  const [details, setDetails] = useState<BookedTicketCategoryDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingCode, setRevokingCode] = useState<string | null>(null);
  const [revokeQuantities, setRevokeQuantities] = useState<{ [key: string]: number }>({});

  const [status, setStatus] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ isOpen: false, type: "success", title: "", message: "" });

  // fetch booking details
  const fetchDetails = () => {
    if (bookedTicketId !== null) {
      setLoading(true);
      fetch(`http://localhost:5224/api/v1/get-booked-ticket/${bookedTicketId}`)
        .then((res) => res.json())
        .then((data: BookedTicketCategoryDetail[]) => {
          setDetails(data);
          const initialQtys: { [key: string]: number } = {};
          data.forEach((cat) => {
            cat.tickets.forEach((t) => { initialQtys[t.ticketCode] = 1; });
          });
          setRevokeQuantities(initialQtys);
          setLoading(false);
          if (data.length === 0) { onSuccess(); onClose(); }
        })
        .catch((err) => { console.error(err); setLoading(false); });
    }
  };

  useEffect(() => { if (isOpen) fetchDetails(); }, [isOpen, bookedTicketId]);

  // delete API
  const handleRevoke = async (ticketCode: string, maxQty: number) => {
    const qty = revokeQuantities[ticketCode] || 1;
    if (qty < 1 || qty > maxQty) return;
    setRevokingCode(ticketCode);
    try {
      const response = await fetch(
        `http://localhost:5224/api/v1/revoke-ticket/${bookedTicketId}/${ticketCode}/${qty}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setStatus({ isOpen: true, type: "success", title: "Revoke Successful!", message: `${qty} ticket(s) have been successfully revoked.` });
        fetchDetails();
      } else {
        const errorData = await response.json();
        setStatus({ isOpen: true, type: "error", title: "Revoke Failed", message: errorData.detail || "Something went wrong. Please try again." });
      }
    } catch (error) {
      console.error(error);
      setStatus({ isOpen: true, type: "error", title: "Unexpected Error", message: "An unexpected error occurred. Please check your connection." });
    } finally {
      setRevokingCode(null);
    }
  };

  const handleCloseStatus = () => setStatus((prev) => ({ ...prev, isOpen: false }));

  const updateRevokeQty = (ticketCode: string, qty: number, max: number) => {
    setRevokeQuantities({ ...revokeQuantities, [ticketCode]: Math.max(1, Math.min(qty, max)) });
  };

  return (
    <>
      <Modal
        title={
          <h2 className="text-xl sm:text-2xl font-bold text-center w-full text-dark-1 font-heading">
            Revoke Tickets #{bookedTicketId}
          </h2>
        }
        open={isOpen}
        onCancel={onClose}
        footer={null}
        centered
        width="95%"
        style={{ maxWidth: "600px" }}
        styles={{
          body: { padding: "12px", maxHeight: "70vh", overflowY: "auto" },
        }}
        closeIcon={
          <span className="bg-error text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold">✕</span>
        }
      >
        <div className="space-y-6">
          {loading ? (
            <p className="text-center py-10 font-bold text-dark-3 animate-pulse">Fetching tickets...</p>
          ) : details.length === 0 ? (
            <p className="text-center py-10 text-dark-3 font-bold">No tickets left to revoke.</p>
          ) : (
            details.map((category) => (
              <div key={category.categoryName}>
                <h3 className="text-base sm:text-lg font-bold text-dark-1 uppercase mb-3 py-1.5 border-b border-dark-4/10 px-4">
                  {category.categoryName}
                </h3>

                {/* ticket UI */}
                <ul className="space-y-5 px-4 overflow-visible">
                  {category.tickets.map((ticket) => (
                    <li
                      key={ticket.ticketCode}
                      className="relative flex flex-col sm:flex-row items-stretch rounded-xl border-2 border-yellow-500 bg-[#f5c842] shadow-sm font-mono overflow-visible"
                    >
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 border-yellow-500 z-10"
                        style={{ left: -14, background: "#f0ede6" }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 border-yellow-500 z-10"
                        style={{ right: -14, background: "#f0ede6" }}
                      />

                      <div
                        className="absolute top-0 bottom-0 border-l-2 border-dashed border-dark-1/10 z-10 hidden sm:block"
                        style={{ right: 128 }}
                      />

                      {/* ticket info */}
                      <div className="flex-1 p-4 sm:px-6 flex flex-col gap-1 min-w-0">
                        <p className="font-bold text-dark-1 text-base sm:text-lg leading-tight truncate">
                          {ticket.ticketName}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-dark-3 font-bold uppercase">
                          <span>{ticket.ticketCode}</span>
                        </div>
                        <p className="font-bold text-dark-1 mt-1 text-xs sm:text-sm">
                          Quantity:
                          <span className="text-dark-1 px-2 py-0.5 rounded ml-1">{ticket.quantity}</span>
                        </p>
                      </div>

                      {/* Revoke button */}
                      <div className="w-full sm:w-32 flex flex-row sm:flex-col items-center justify-between sm:justify-center p-3 sm:pr-4 gap-4 sm:gap-2 bg-dark-1/5 sm:bg-transparent shrink-0 border-t-2 sm:border-t-0 border-dashed border-dark-1/20">
                        <div className="flex flex-col flex-1 sm:w-full">
                          <label className="text-[10px] font-bold text-dark-1 uppercase mb-1">Qty</label>
                          <input
                            type="number"
                            min={1}
                            max={ticket.quantity}
                            value={revokeQuantities[ticket.ticketCode] || 1}
                            onChange={(e) =>
                              updateRevokeQty(ticket.ticketCode, parseInt(e.target.value) || 1, ticket.quantity)
                            }
                            className="w-full px-2 py-1 bg-white/50 border border-dark-1/20 rounded font-bold text-sm outline-none focus:border-primary"
                          />
                        </div>
                        <button
                          onClick={() => handleRevoke(ticket.ticketCode, ticket.quantity)}
                          disabled={revokingCode !== null}
                          className="flex-1 sm:w-full flex justify-center items-center gap-1 bg-error text-white py-2 sm:py-1.5 rounded-lg hover:bg-error/80 transition-all cursor-pointer active:scale-95 disabled:opacity-50 h-9.5 sm:h-auto"
                        >
                          <ArrowCounterClockwiseIcon
                            size={16}
                            weight="bold"
                            className={revokingCode === ticket.ticketCode ? "animate-spin" : ""}
                          />
                          <span className="text-[10px] font-bold uppercase">Revoke</span>
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