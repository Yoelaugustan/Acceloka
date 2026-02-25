import { Ticket } from "@/types/api";
import { useState } from "react";

export default function TicketCard({
  categoryName,
  eventDate,
  price,
  quota,
  ticketCode,
  ticketName,
}: Ticket) {
  const [added, setAdded] = useState<boolean>(false);
  const isLow: boolean = quota <= 5;

  const handleAdd = (): void => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="relative flex items-stretch w-96 my-4 rounded-xl border-2 border-yellow-500 shadow-lg font-mono"
      style={{ background: "#f5c842", overflow: "visible" }}
    >
      {/* Left hole */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full border-2 border-yellow-500 z-10"
        style={{ left: 0, background: "#f0ede6" }}
      />

      {/* Right hole */}
      <div
        className="absolute top-1/2 -translate-y-1/2 translate-x-1/2 w-7 h-7 rounded-full border-2 border-yellow-500 z-10"
        style={{ right: 0, background: "#f0ede6" }}
      />

      {/* Tear line */}
      <div
        className="absolute top-0 bottom-0 border-l-2 border-dashed border-yellow-500 z-10"
        style={{ right: 120 }}
      />

      {/* Main content */}
      <div
        className="flex-1 flex flex-col gap-1.5 p-5"
        style={{ paddingRight: 48 }}
      >
        {/* Title row */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold font-mono tracking-wider text-yellow-950">
            {ticketName}
          </span>
        </div>

        {/* Code & Category*/}
        <div className="flex items-center gap-1.5 text-xs text-yellow-900">
          <span className="font-bold">{ticketCode}</span>
          <span className="opacity-50">—</span>
          <span>{categoryName}</span>
        </div>

        {/* Date */}
        <div className="text-xs text-yellow-900">{eventDate}</div>

        {/* Price */}
        <div className="text-base font-bold text-yellow-950 mt-1">{price}</div>

        {/* Remaining */}
        <div
          className={`flex items-center gap-2 text-xs mt-0.5 ${
            isLow ? "text-orange-600" : "text-yellow-800"
          }`}
        >
          <span>{quota} tickets left</span>
          {isLow && (
            <span className="bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
              Almost sold out!
            </span>
          )}
        </div>
      </div>

      {/* Stub */}
      <div
        className="flex items-center justify-center px-3"
        style={{ width: 120 }}
      >
        <button
          onClick={handleAdd}
          className={`w-full py-2.5 px-3 rounded-lg text-white text-xs font-bold tracking-wide shadow-md transition-all duration-300 cursor-pointer ${
            added
              ? "bg-green-700"
              : "bg-stone-800 hover:bg-stone-700 active:scale-95"
          }`}
        >
          {added ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
