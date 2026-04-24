"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  BarChart3, 
  LogOut,
  GraduationCap,
  ChevronRight,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Sidebar = ({ role = "instructor", onClose }: { role?: "instructor" | "student", onClose?: () => void }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const navItems = role === "instructor" ? [
    { name: "Dashboard", href: "/instructor", icon: LayoutDashboard },
    { name: "My Assignments", href: "/instructor/assignments", icon: BookOpen },
    { name: "Submissions", href: "/instructor/submissions", icon: FileText },
    { name: "Analytics", href: "/instructor/analytics", icon: BarChart3 },
  ] : [
    { name: "My Progress", href: "/student", icon: LayoutDashboard },
    { name: "All Assignments", href: "/student/assignments", icon: BookOpen },
    { name: "My Submissions", href: "/student/submissions", icon: FileText },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="flex h-screen w-full flex-col bg-slate-950 text-white border-r border-white/5 relative">
      {/* Mobile Close Button */}
      <button 
        onClick={onClose}
        className="lg:hidden absolute right-4 top-4 p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors z-50"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Logo Area - Adjusted for mobile overlap */}
      <div className="flex h-16 items-center justify-start px-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3" onClick={onClose}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-900/30 border border-purple-500/20 shadow-lg shadow-purple-500/5">
            <GraduationCap className="h-5 w-5 text-purple-400" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
            EduFlow
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="block group"
                onClick={onClose}
              >
                <div
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                    isActive 
                      ? "bg-white/5 text-purple-200 border border-white/5 shadow-xl shadow-black/20" 
                      : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                  )}
                >
                  <Icon className={cn(
                    "h-4.5 w-4.5 transition-colors",
                    isActive ? "text-purple-400" : "text-slate-600 group-hover:text-slate-400"
                  )} />
                  {item.name}
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute right-3"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-purple-500/50" />
                    </motion.div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info & Footer */}
      <div className="border-t border-white/5 p-6 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4 px-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/10">
            <div className="flex h-full w-full items-center justify-center bg-purple-900/10 text-purple-400/70 text-xs">
               <span className="font-bold tracking-tighter">
                 {user ? user.name.split(' ').map((n: string) => n[0]).join('') : "US"}
               </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-slate-300 leading-tight">
              {user ? user.name : "Loading..."}
            </span>
            <span className="text-[9px] text-slate-600 uppercase tracking-[0.2em] font-bold">{role}</span>
          </div>
        </div>
        <button 
          onClick={handleSignOut}
          className="cursor-pointer mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-white/5 bg-white/5 px-4 py-2.5 text-[12px] font-semibold text-slate-500 transition-all hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 shadow-sm"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
