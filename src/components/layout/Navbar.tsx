"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Bell, Search, UserCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <nav className="flex h-16 items-center justify-between px-4 md:px-8 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-6 w-full max-w-sm">
        <div className="relative group w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search anything.." 
            className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-300 focus:outline-none focus:border-purple-500/30 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-purple-500 border border-slate-950"></span>
        </button>

        <div className="h-8 w-px bg-white/5 hidden md:block"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-[12px] font-bold text-slate-200 leading-tight">
              {user ? user.name : "Guest User"}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-purple-500">
              {user ? user.role : "Visitior"}
            </p>
          </div>
          <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/30 flex items-center justify-center group cursor-pointer hover:border-purple-500/50 transition-all">
            <UserCircle className="h-5 w-5 md:h-6 md:w-6 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
    </nav>
  );
}
