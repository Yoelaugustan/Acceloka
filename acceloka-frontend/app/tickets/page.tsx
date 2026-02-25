"use client";

import FilterModal from "@/components/FilterModel";
import TicketCard from "@/components/TicketCard";
import { BookModal } from "@/components/BookModal";
import { CartModal } from "@/components/CartModal";
import { CartProvider, useCart } from "@/context/CartContext";
import { FilterData, Ticket } from "@/types/api";
import {
  CalendarDotsIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "@phosphor-icons/react";
import { DatePicker } from "antd";
import { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";

const { RangePicker } = DatePicker;

// set default value for the filter
const defaultFilters: FilterData = {
  priceRange: null,
  category: null,
  orderBy: "ticketcode",
  orderState: "asc",
};

export default function TicketsPage() {
  return (
    // use cart provider to access the cart items and functions
    <CartProvider>
      <ViewTicketsPage />
    </CartProvider>
  );
}

// view ticket
function ViewTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);

  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterData>(defaultFilters);
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const [search, setSearch] = useState("");

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  // count the filters used
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.priceRange) count++;
    if (dateRange) count++;
    return count;
  }, [filters, dateRange]);

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setDateRange(null);
  };

  const handleBookClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsBookModalOpen(true);
  };

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      console.log(filters);
      try {
        // insert the filter to the query params
        const queryParams = new URLSearchParams();
        queryParams.append("pageNumber", page.toString());

        if (filters.category) {
          queryParams.append("categoryName", filters.category);
        }
        if (filters.priceRange) {
          queryParams.append("maxPrice", filters.priceRange[1].toString());
        }
        if (filters.orderBy) {
          queryParams.append("orderBy", filters.orderBy);
        }
        if (filters.orderState) {
          queryParams.append("orderState", filters.orderState.toLowerCase());
        }
        if (search) {
          queryParams.append("ticketName", search);
        }
        if (dateRange && dateRange[0]) {
          queryParams.append("minEventDate", dateRange[0].toISOString());
        }
        if (dateRange && dateRange[1]) {
          queryParams.append("maxEventDate", dateRange[1].toISOString());
        }

        // fetch tickets
        const response = await fetch(
          `http://localhost:5224/api/v1/get-available-ticket?${queryParams.toString()}`,
        );

        const data = await response.json();
        setTickets(data.tickets || []);
        setTotalTickets(data.totalTickets || 0);

        // pagination
        if (data.pages) {
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
  }, [page, filters, dateRange, search]);

  // to show the cart item amount
  const { getUniqueItemCount } = useCart();

  return (
    <div className="p-6 flex flex-col h-full bg-white">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          {/* header */}
          <h1 className="text-4xl font-bold text-[#334155]">
            Find Your Next Experience
          </h1>
          <p className="text-slate-500 mt-2">
            From entertainment to accommodation, secure your spot in just a few
            clicks.
          </p>
        </div>

        {/* cart */}
        <div
          className="relative cursor-pointer"
          onClick={() => setIsCartModalOpen(true)}
        >
          <ShoppingCartIcon size={32} weight="fill" color="#958C55" />
          {getUniqueItemCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {getUniqueItemCount()}
            </span>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-10">
        <div className="relative flex-1 max-w-2xl">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for events, hotels, or movie titles..."
            className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-[#334155] focus:border-[#958C55] outline-none transition-all text-[#334155]"
          />
          <MagnifyingGlassIcon
            className="absolute left-4 top-3.5 text-[#334155] opacity-40"
            size={24}
          />
        </div>

        {/* date picker */}
        <div className="flex items-center gap-2 cursor-pointer">
          <RangePicker
            variant="filled"
            suffixIcon={
              <CalendarDotsIcon size={32} className="text-[#334155]" />
            }
            placeholder={["Start", "End"]}
            onChange={(dates) => setDateRange(dates)}
            className="hover:bg-slate-50 p-1 rounded-md"
          />
        </div>

        {/* filter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 relative">
            <FunnelIcon
              size={32}
              className="cursor-pointer text-[#334155]"
              onClick={() => setIsModalFilterOpen(true)}
            />
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
            >
              Clear Filters
            </button>
          )}

          <span className="text-sm text-slate-500 italic whitespace-nowrap">
            {activeFilterCount} filters in use
          </span>
        </div>

        <FilterModal
          isOpen={isModalFilterOpen}
          onClose={() => setIsModalFilterOpen(false)}
          onSave={(data) => setFilters(data)}
          initialFilters={filters}
        />

        {/* show total tickets */}
        <span className="ml-auto font-bold text-[#334155] whitespace-nowrap">
          {totalTickets} tickets total
        </span>
      </div>

      {/* ticket items */}
      <div className="flex-1 overflow-y-auto p-6 pt-2">
        {loading ? (
          // show loading when fetching
          <div>
            <p className="text-center mt-10">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((t) => (
              <TicketCard
                key={t.ticketCode}
                {...t}
                onBookClick={handleBookClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* page number */}
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

      {/* show book modal and cart modal */}
      {selectedTicket && isBookModalOpen && (
        <BookModal
          ticket={selectedTicket}
          onClose={() => setIsBookModalOpen(false)}
        />
      )}

      {isCartModalOpen && (
        <CartModal
          isOpen={isCartModalOpen}
          onClose={() => setIsCartModalOpen(false)}
        />
      )}
    </div>
  );
}
