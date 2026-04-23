"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/sonner";

const DashboardLayout = ({ 
  children, 
  role = "instructor" 
}: { 
  children: React.ReactNode; 
  role?: "instructor" | "student" 
}) => {
  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-200 overflow-hidden">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:block h-screen w-72 flex-shrink-0">
        <Sidebar role={role} />
      </aside>

      {/* Main Content & Navbar Wrapper */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <Navbar role={role} />
        
        {/* Content Area */}
        <main className="flex-1 overflow-hidden pt-4 px-6 pb-6 scroll-smooth">
          <div className="w-full px-2">
            {children}
          </div>
        </main>
      </div>

      {/* Global Notifications */}
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default DashboardLayout;
