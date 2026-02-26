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
  XIcon,
} from "@phosphor-icons/react";
import { useSidebar } from "@/context/SidebarContext";

export default function Sidebar() {
  const [isTicketsOpen, setIsTicketsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isMobileOpen, setIsMobileOpen } = useSidebar();
  const pathname = usePathname();

  const isPageActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");
  const isExactActive = (path: string) => pathname === path;

  const renderSidebarContent = (isMobile: boolean) => {
    const collapsed = isMobile ? false : isCollapsed;

    return (
      <div
        className={`h-full bg-[#F5F4EE] flex flex-col font-body rounded-r-3xl transition-all duration-300 relative ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo Section */}
        <div
          className={`items-center flex transition-all mb-10 ${
            collapsed ? "p-4 justify-center" : "p-7 justify-between"
          }`}
        >
          <div
            className={`flex items-center ${collapsed ? "justify-center" : ""}`}
          >
            {collapsed ? (
              <Image src="/Logo-short.png" alt="Logo" width={30} height={30} />
            ) : (
              <Image src="/Logo.png" alt="Logo" width={180} height={45} />
            )}
          </div>

          {/* Close button for mobile inside the sidebar */}
          {isMobile && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 hover:bg-black/5 rounded-lg text-primary"
            >
              <XIcon size={24} weight="bold" />
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-7 relative">
          {/* Tickets Menu Item */}
          <div className="relative">
            {isPageActive("/tickets") && (
              <div className="absolute left-0 top-0 w-1.5 h-12 bg-primary rounded-r-full z-10" />
            )}
            <button
              onClick={() => !collapsed && setIsTicketsOpen(!isTicketsOpen)}
              className={`flex w-full items-center text-primary cursor-pointer h-12 ${
                collapsed ? "justify-center" : "justify-between px-7"
              }`}
            >
              <div className="flex items-center gap-3">
                <TicketIcon size={32} weight="fill" className="text-primary" onClick={() => setIsCollapsed(false)}/>
                {!collapsed && (
                  <span
                    className={`text-lg ${isPageActive("/tickets") ? "font-bold" : ""}`}
                  >
                    Tickets
                  </span>
                )}
              </div>
              {!collapsed &&
                (isTicketsOpen ? (
                  <CaretDownIcon size={20} />
                ) : (
                  <CaretRightIcon size={20} />
                ))}
            </button>
          </div>

          {/* Ticket Sub menu */}
          {isTicketsOpen && !collapsed && (
            <div className="mt-1 flex flex-col bg-[#E0DFD7] transition-all duration-300">
              <Link
                href="/tickets"
                onClick={() => setIsMobileOpen(false)}
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
                onClick={() => setIsMobileOpen(false)}
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
            {isPageActive("/bookings") && (
              <div className="absolute left-0 top-0 w-1.5 h-12 bg-primary rounded-r-full z-10" />
            )}
            <Link
              href="/bookings"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center text-primary transition-all h-12 ${
                collapsed ? "justify-center" : "gap-3 px-7"
              } ${isPageActive("/bookings") ? "font-bold" : ""}`}
            >
              <ClipboardTextIcon size={32} weight="fill" />
              {!collapsed && <span className="text-lg">Booking</span>}
            </Link>
          </div>
        </nav>

        {/* Sidebar Collapse Button */}
        <div
          className={`hidden md:flex p-4 ${collapsed ? "justify-center" : "justify-end"}`}
        >
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-black/5 rounded-lg"
          >
            <SidebarSimpleIcon
              size={32}
              weight="fill"
              className="text-primary"
            />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block h-screen">
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          isMobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />

        <div
          className={`absolute inset-y-0 left-0 transition-transform duration-300 ease-in-out ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {renderSidebarContent(true)}
        </div>
      </div>
    </>
  );
}
