"use client";

import React from "react";
import { Menu, Search, Bell, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import { Input } from "@/components/ui/input";

const Navbar = ({ role = "instructor" }: { role?: "instructor" | "student" }) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/5 bg-[#020617]/80 px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger
            render={
              <div className="cursor-pointer lg:hidden p-2 text-slate-400 hover:bg-white/5 rounded-xl transition-colors">
                <Menu className="h-6 w-6" />
              </div>
            }
          />
          <SheetContent side="left" className="p-0 border-r-white/5 bg-slate-950 w-72">
            <Sidebar role={role} />
          </SheetContent>
        </Sheet>

        {/* Search - Refined */}
        <div className="hidden md:flex relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
          <Input 
            placeholder="Search anything..." 
            className="pl-10 bg-white/5 border-white/5 text-slate-300 focus-visible:ring-purple-500/50 h-10 rounded-xl placeholder:text-slate-600 transition-all focus:bg-white/10"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" className="cursor-pointer text-slate-500 hover:bg-white/5 hover:text-slate-300 rounded-xl h-10 w-10">
          <Bell className="h-5 w-5" />
        </Button>
        
        <div className="h-8 w-[1px] bg-white/5 hidden md:block" />
        
        <div className="flex items-center gap-3 pl-2 group cursor-pointer">
            <div className="hidden md:flex flex-col items-end">
                <span className="text-[13px] font-semibold text-slate-300 tracking-tight group-hover:text-white transition-colors">Ashikur Rahman</span>
                <span className="text-[9px] uppercase font-bold text-purple-600 tracking-[0.2em]">{role}</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/5 transition-transform group-hover:scale-105">
                <UserCircle className="h-6 w-6" />
            </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
