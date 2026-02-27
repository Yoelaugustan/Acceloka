"use client";

import React, { useEffect, useState } from "react";
import HamburgerMenu from "@/components/Sidebar/HamburgerMenu";
import { PlusCircleIcon } from "@phosphor-icons/react";
import { Ticket, TicketListResponse } from "@/types/api";
import { CreateModal } from "@/components/CreateModal";
import { StatusModal } from "@/components/StatusModal";
import { ManageTicketCard } from "@/components/Create/ManageTicketCard";
import { DeleteConfirmModal } from "@/components/Create/DeleteConfirmModal";

export default function ManageTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    ticketCode: string | null;
  }>({
    isOpen: false,
    ticketCode: null,
  });
  const [status, setStatus] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ isOpen: false, type: "success", title: "", message: "" });

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5224/api/v1/get-available-ticket?pageNumber=${page}`,
      );
      const data: TicketListResponse = await response.json();

      setTickets(data.tickets || []);
      if (data.pages) {
        const total = parseInt(data.pages.split("/")[1]);
        setTotalPages(total || 1);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page]);

  const handleCloseStatus = () =>
    setStatus((prev) => ({ ...prev, isOpen: false }));

  const confirmDelete = (ticketCode: string) => {
    setDeleteConfirm({ isOpen: true, ticketCode });
  };

  const handleDeleteTicket = async () => {
    const ticketCode = deleteConfirm.ticketCode;
    if (!ticketCode) return;

    setDeleteConfirm({ isOpen: false, ticketCode: null });

    try {
      const response = await fetch(
        `http://localhost:5224/api/v1/delete-ticket/${ticketCode}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setStatus({
          isOpen: true,
          type: "success",
          title: "Ticket Deleted",
          message: `Ticket ${ticketCode} has been deleted successfully.`,
        });
        fetchTickets();
      } else {
        const data = await response.json();
        setStatus({
          isOpen: true,
          type: "error",
          title: "Delete Failed",
          message: data.detail || "Failed to delete ticket.",
        });
      }
    } catch (error) {
      setStatus({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "An error occurred while deleting the ticket.",
      });
    }
  };

  return (
    <div className="p-6 flex flex-col h-full bg-white">
      {/* header */}
      <div className="flex items-start mb-6">
        <HamburgerMenu />
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-dark-1 font-heading">
            Manage Tickets
          </h1>
          <p className="text-sm md:text-base text-dark-3 mt-2">
            Create or delete ticket experiences
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pt-2">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-dark-3 font-bold animate-pulse">
              Loading tickets...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-8 gap-x-6">
            {/* add ticket box  */}
            {page === 1 && (
              <div
                onClick={() => setIsCreateModalOpen(true)}
                className="relative flex items-center justify-center w-full max-w-[384px] h-40 my-4 rounded-xl border-2 border-dashed border-dark-4/30 bg-dark-4/5 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
              >
                <div className="flex flex-col items-center">
                  <PlusCircleIcon
                    size={48}
                    weight="bold"
                    className="text-dark-4 group-hover:text-primary transition-colors"
                  />
                  <span className="mt-2 text-xs font-bold uppercase tracking-widest text-dark-4 group-hover:text-primary font-mono">
                    Add Ticket
                  </span>
                </div>
              </div>
            )}

            {/* ticket items */}
            {tickets.map((ticket) => (
              <ManageTicketCard
                key={ticket.ticketCode}
                ticket={ticket}
                onDelete={() => confirmDelete(ticket.ticketCode)}
              />
            ))}
          </div>
        )}
      </div>

      {/* pagination */}
      <div className="pt-6 bg-white flex justify-center items-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 cursor-pointer"
        >
          prev
        </button>

        <span className="font-mono font-bold text-dark-1">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 cursor-pointer"
        >
          next
        </button>
      </div>

      {isCreateModalOpen && (
        <CreateModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={() => {
            setIsCreateModalOpen(false);
            fetchTickets();
            setStatus({
              isOpen: true,
              type: "success",
              title: "Success",
              message: "Ticket created successfully!",
            });
          }}
        />
      )}

      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        ticketCode={deleteConfirm.ticketCode}
        onCancel={() => setDeleteConfirm({ isOpen: false, ticketCode: null })}
        onConfirm={handleDeleteTicket}
      />

      <StatusModal
        isOpen={status.isOpen}
        type={status.type}
        title={status.title}
        message={status.message}
        onClose={handleCloseStatus}
      />
    </div>
  );
}
