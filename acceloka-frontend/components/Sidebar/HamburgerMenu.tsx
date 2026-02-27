"use client";

import React from "react";
import { SidebarSimpleIcon } from "@phosphor-icons/react";
import { useSidebar } from "@/context/SidebarContext";

export default function HamburgerMenu() {
  const { toggleSidebar, isMobileOpen } = useSidebar();

  if (isMobileOpen) return null;

  return (
    <button
      onClick={toggleSidebar}
      className="md:hidden p-2 hover:bg-black/5 rounded-lg text-primary mr-2"
      aria-label="Open Sidebar"
    >
      <SidebarSimpleIcon size={32} weight="fill" />
    </button>
  );
}
