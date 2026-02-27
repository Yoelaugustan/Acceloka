import { Ticket } from "@/types/api";
import { TrashIcon } from "@phosphor-icons/react";

export function CreateTicketCard({
  ticket,
  onDelete,
}: {
  ticket: Ticket;
  onDelete: () => void;
}) {
  return (
    <div
      className="relative flex items-stretch w-full max-w-[384px] my-4 rounded-xl border-2 border-yellow-500 shadow-lg font-mono"
      style={{ background: "#f5c842", overflow: "visible" }}
    >
      {/* ticket UI */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full border-2 border-yellow-500 z-10"
        style={{ left: 0, background: "#f0ede6" }}
      />

      <div
        className="absolute top-1/2 -translate-y-1/2 translate-x-1/2 w-7 h-7 rounded-full border-2 border-yellow-500 z-10"
        style={{ right: 0, background: "#f0ede6" }}
      />

      <div
        className="absolute top-0 bottom-0 border-l-2 border-dashed border-yellow-500 z-10"
        style={{ right: 100 }}
      />

      <div
        className="flex-1 flex flex-col gap-1.5 p-4"
        style={{ paddingRight: 32 }}
      >
        {/* ticket name */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base sm:text-lg font-bold font-mono tracking-wider text-dark-1 leading-tight">
            {ticket.ticketName}
          </span>
        </div>

        {/* ticket code and category */}
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] sm:text-xs text-dark-3">
          <span className="font-bold">{ticket.ticketCode}</span>
          <span className="opacity-50 hidden sm:inline">--</span>
          <span>{ticket.categoryName}</span>
        </div>

        {/* ticket date */}
        <div className="text-[10px] sm:text-xs text-dark-3">
          {ticket.eventDate}
        </div>

        {/* ticket price */}
        <div className="text-sm sm:text-base font-bold text-dark-1 mt-1">
          Rp. {ticket.price.toLocaleString("id-ID")}
        </div>

        {/* ticket quota */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs mt-0.5 text-dark-2">
          <span>{ticket.quota} tickets left</span>
        </div>
      </div>

      {/* action */}
      <div
        className="flex items-center justify-center px-2 sm:px-3"
        style={{ width: 100 }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-3 text-dark-1 hover:text-error hover:scale-125 transition-all cursor-pointer"
          title="Delete Ticket"
        >
          <TrashIcon size={24} weight="bold" />
        </button>
      </div>
    </div>
  );
}
