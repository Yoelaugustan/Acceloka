"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  TicketIcon,
  CaretRightIcon,
  CaretDownIcon,
  ClipboardTextIcon,
  SidebarSimpleIcon,
} from "@phosphor-icons/react";

export default function Sidebar() {
  const [isTicketsOpen, setIsTicketsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const isPageActive = (path: string) => pathname === path || pathname.startsWith(path + "/");
  const isExactActive = (path: string) => pathname === path;

  return (
    <div
      className={`h-screen bg-[#F5F4EE] flex flex-col font-body rounded-r-3xl transition-all duration-300 relative ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo Section */}
      <div
        className={`justify-center items-center flex transition-all ${isCollapsed ? "p-4" : "p-7 mb-10"}`}
      >
        {isCollapsed ? (
          <Image src="/Logo-short.png" alt="Logo" width={30} height={30} />
        ) : (
          <Image src="/Logo.png" alt="Logo" width={200} height={50} />
        )}
      </div>

      <nav className="flex-1 space-y-7 relative">
        {/* Tickets Menu Item */}
        <div className="relative">
          {!isCollapsed && isPageActive("/tickets") && (
            <div className="absolute left-0 top-0 w-1.5 h-12 bg-primary rounded-r-full z-10" />
          )}
          <button
            onClick={() => !isCollapsed && setIsTicketsOpen(!isTicketsOpen)}
            className={`flex w-full items-center text-primary cursor-pointer h-12 ${
              isCollapsed ? "justify-center" : "justify-between px-7"
            }`}
          >
            <div className="flex items-center gap-3">
              <TicketIcon size={32} weight="fill" className="text-primary" />
              {!isCollapsed && (
                <span
                  className={`text-lg ${isPageActive("/tickets") ? "font-bold" : ""}`}
                >
                  Tickets
                </span>
              )}
            </div>
            {!isCollapsed &&
              (isTicketsOpen ? (
                <CaretDownIcon size={20} />
              ) : (
                <CaretRightIcon size={20} />
              ))}
          </button>
        </div>

        {/* Ticket Sub menu */}
        {isTicketsOpen && !isCollapsed && (
          <div className="mt-1 flex flex-col bg-[#E0DFD7] transition-all duration-300">
            <Link
              href="/tickets"
              className={`m-2 p-2 px-6 rounded-full transition-all ${
                isExactActive("/tickets")
                  ? "bg-white text-primary font-bold shadow-sm"
                  : "text-primary hover:bg-white/50"
              }`}
            >
              View Tickets
            </Link>
            <Link
              href="/tickets/create"
              className={`m-2 p-2 px-6 rounded-full transition-all ${
                isExactActive("/tickets/create")
                  ? "bg-white text-primary font-bold shadow-sm"
                  : "text-primary hover:bg-white/50"
              }`}
            >
              Create Tickets
            </Link>
          </div>
        )}

        {/* Booking Menu Item */}
        <div className="relative">
          {!isCollapsed && isPageActive("/bookings") && (
            <div className="absolute left-0 top-0 w-1.5 h-12 bg-primary rounded-r-full z-10" />
          )}
          <Link
            href="/bookings"
            className={`flex items-center text-primary transition-all h-12 ${
              isCollapsed ? "justify-center" : "gap-3 px-7"
            } ${isPageActive("/bookings") ? "font-bold" : ""}`}
          >
            <ClipboardTextIcon size={32} weight="fill" />
            {!isCollapsed && <span className="text-lg">Booking</span>}
          </Link>
        </div>
      </nav>

      {/* Sidebar Button */}
      <div
        className={`flex p-4 ${isCollapsed ? "justify-center" : "justify-end"}`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-black/5 rounded-lg"
        >
          <SidebarSimpleIcon size={32} weight="fill" className="text-primary" />
        </button>
      </div>
    </div>
  );
}
