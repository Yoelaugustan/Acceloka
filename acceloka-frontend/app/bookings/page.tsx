"use client";

import React, { useEffect, useState } from "react";
import { BookingTicket } from "@/components/BookingTicket";
import BookingDetailModal from "@/components/BookingDetailModal";
import { BookingSummary, BookingListResponse } from "@/types/api";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);

  // Modal States
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5224/api/v1/get-bookings?pageNumber=${page}`,
        );
        const data: BookingListResponse = await response.json();

        setBookings(data.bookings || []);
        setTotalBookings(data.totalBookings || 0);

        if (data.pages) {
          const total = parseInt(data.pages.split("/")[1]);
          setTotalPages(total);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [page]);

  return (
    <div className="p-6 flex flex-col h-full bg-white">
      {/* header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold text-dark-1 font-heading">
            Your Acceloka Itinerary
          </h1>
          <p className="text-dark-3 mt-2">Manage your selected experiences</p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-bold text-dark-1 whitespace-nowrap">
          {totalBookings} Bookings Total
        </span>
      </div>

      {/* booking items */}
      <div className="flex-1 overflow-y-auto pr-2">
        {loading ? (
          <div className="flex justify-center mt-20">
            <p className="animate-pulse font-bold text-dark-3">
              Loading Itinerary...
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex justify-center mt-20 text-dark-3 font-bold">
            No bookings found yet. Go explore some tickets!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-2">
            {bookings.map((booking) => (
              <BookingTicket 
                key={booking.bookedTicketId} 
                booking={booking} 
                onViewDetails={(id: number) => {
                  setSelectedId(id);
                  setIsDetailOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <BookingDetailModal 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        bookedTicketId={selectedId}
      />

      {/* pagination  */}
      <div className="pt-6 bg-white flex justify-center items-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 cursor-pointer transition-all active:scale-95"
        >
          previous
        </button>

        <span className="font-mono font-bold text-dark-1">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 cursor-pointer transition-all active:scale-95"
        >
          next
        </button>
      </div>
    </div>
  );
}
