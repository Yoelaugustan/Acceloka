"use client";

import TicketCard from "@/components/TicketCard";
import {
  CalendarDotsIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:5224/api/v1/get-available-ticket",
        );
        const data = await response.json();
        setTickets(data.tickets);

        if (data.page) {
          const total = parseInt(data.pages.split("/")[1]);
          setTotalPages(total);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [page]);

  return (
    <div className="p-6 flex flex-col h-full bg-white">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold text-[#334155]">
            Find Your Next Experience
          </h1>
          <p className="text-slate-500 mt-2">
            From entertainment to accommodation, secure your spot in just a few
            clicks.
          </p>
        </div>
        <ShoppingCartIcon size={32} weight="fill" color="#958C55" />
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-10">
        <div className="relative flex-1 max-w-2xl">
          <input
            type="text"
            placeholder="Search for events, hotels, or movie titles..."
            className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-[#334155] focus:border-[#958C55] outline-none transition-all text-[#334155]"
          />
          <MagnifyingGlassIcon
            className="absolute left-4 top-3.5 text-[#334155] opacity-40"
            size={24}
          />
        </div>
        <CalendarDotsIcon size={32} className="text-[#334155] cursor-pointer" />
        <FunnelIcon size={32} className="text-[#334155] cursor-pointer" />
        <span className="ml-auto font-bold text-[#334155]">
          {tickets.length} tickets total
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pt-2">
        {loading ? (
          <div>
            <p className="text-center mt-10">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((t) => (
              <TicketCard key={t.ticketCode} {...t} />
            ))}
          </div>
        )}
      </div>

      <div className="pt-6 bg-white flex justify-center items-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-[#958C55] text-white rounded-lg disabled:opacity-50 cursor-pointer"
        >
          previous
        </button>

        <span className="font-mono font-bold text-yellow-950">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-[#958C55] text-white rounded-lg disabled:opacity-50 cursor-pointer"
        >
          next
        </button>
      </div>
    </div>
  );
}
