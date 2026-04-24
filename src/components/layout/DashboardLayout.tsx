"use client";

import React, { useState } from "react";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-200 overflow-hidden relative">
      {/* Sidebar - Desktop Always, Mobile Overlay */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-white/5 transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <Sidebar role={role} onClose={() => setIsSidebarOpen(false)} />
      </aside>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content & Navbar Wrapper */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <Navbar role={role} onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto pt-4 px-4 md:px-10 pb-10 scroll-smooth custom-scrollbar">
          <div className="w-full max-w-[1600px] mx-auto">
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
