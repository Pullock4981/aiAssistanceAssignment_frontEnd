"use client";

import React, { useEffect, useState, useRef } from "react";
import { Bell, UserCircle, Menu, CheckCheck, BookOpen, CheckCircle2, Clock, LogOut, User, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar({ role, onMenuClick }: { role?: string, onMenuClick?: () => void }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await axios.get(`${apiUrl}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setUnreadCount(res.data.count);
    } catch {}
  };

  const fetchNotifications = async () => {
    setLoadingNotifs(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await axios.get(`${apiUrl}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setNotifications(res.data.data);
    } catch {}
    setLoadingNotifs(false);
  };

  const handleBellClick = () => {
    setIsProfileOpen(false);
    setIsNotifOpen(prev => { if (!prev) fetchNotifications(); return !prev; });
  };

  const handleProfileClick = () => {
    setIsNotifOpen(false);
    setIsProfileOpen(prev => !prev);
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      await axios.patch(`${apiUrl}/notifications/mark-all-read`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  const markOneRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      await axios.patch(`${apiUrl}/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <nav className="flex h-16 w-full items-center justify-between px-4 md:px-8 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl shrink-0 relative z-40">
      <div className="flex items-center gap-4 md:gap-6 w-full max-w-sm">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors">
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">AIMS DASHBOARD</p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">

        {/* ── Notification Bell ── */}
        <div className="relative" ref={notifRef}>
          <button onClick={handleBellClick} className="relative p-2 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg cursor-pointer">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <motion.span key={unreadCount} initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-purple-500 border border-slate-950 flex items-center justify-center text-[9px] font-black text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.15 }}
                className="fixed md:absolute right-4 md:right-0 left-4 md:left-auto mt-2 md:w-96 bg-slate-950 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-[100]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-black text-white uppercase tracking-widest">Notifications</span>
                    {unreadCount > 0 && <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black border border-purple-500/30">{unreadCount} new</span>}
                  </div>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer">
                      <CheckCheck className="h-3 w-3" /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {loadingNotifs ? (
                    <div className="flex items-center justify-center py-10"><div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" /></div>
                  ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2 opacity-50">
                      <Bell className="h-8 w-8 text-slate-600" />
                      <p className="text-xs text-slate-500 font-medium">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {notifications.map((notif) => (
                        <div key={notif._id} onClick={() => !notif.isRead && markOneRead(notif._id)}
                          className={`flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer ${notif.isRead ? "opacity-50" : "hover:bg-white/5"}`}>
                          <div className={`mt-0.5 h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${notif.type === "new_submission" ? "bg-purple-500/10 border border-purple-500/20" : "bg-green-500/10 border border-green-500/20"}`}>
                            {notif.type === "new_submission" ? <BookOpen className="h-4 w-4 text-purple-400" /> : <CheckCircle2 className="h-4 w-4 text-green-400" />}
                          </div>
                          <div className="flex-1 min-w-0 py-0.5">
                            <p className={`text-[12px] leading-snug ${notif.isRead ? "text-slate-500" : "text-slate-100 font-medium"}`}>{notif.message}</p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <Clock className="h-3 w-3 text-slate-600" />
                              <span className="text-[10px] text-slate-500 font-medium">{formatTime(notif.createdAt)}</span>
                            </div>
                          </div>
                          {!notif.isRead && <div className="mt-1.5 h-2 w-2 rounded-full bg-purple-500 shrink-0" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="px-4 py-2.5 border-t border-white/5 bg-white/[0.02]">
                    <p className="text-[10px] text-slate-600 text-center font-medium">Showing last {notifications.length} notifications</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-white/5 hidden md:block" />

        {/* ── Profile Dropdown ── */}
        <div className="relative" ref={profileRef}>
          <button onClick={handleProfileClick} className="flex items-center gap-3 pl-1 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-[12px] font-bold text-slate-200 leading-tight group-hover:text-white transition-colors">{user ? user.name : "Guest"}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-purple-500">{user ? user.role : "Visitor"}</p>
            </div>
            <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-500/40 flex items-center justify-center group-hover:border-purple-500/70 transition-all shadow-lg shadow-purple-500/10">
              {user ? (
                <span className="text-sm font-black text-white">{getInitials(user.name)}</span>
              ) : (
                <UserCircle className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.15 }}
                className="fixed md:absolute right-4 md:right-0 left-4 md:left-auto mt-2 md:w-72 bg-slate-950 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-[100]">

                {/* Header */}
                <div className="p-4 border-b border-white/5 bg-gradient-to-br from-purple-950/40 to-slate-950">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-600/40 to-indigo-600/40 border border-purple-500/30 flex items-center justify-center shadow-lg shrink-0">
                      <span className="text-lg font-black text-white">{user ? getInitials(user.name) : "?"}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-white truncate">{user?.name || "User"}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email || ""}</p>
                      <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        user?.role === "instructor" ? "bg-purple-500/10 border-purple-500/30 text-purple-300" : "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                      }`}>
                        <Shield className="h-2.5 w-2.5" /> {user?.role || "user"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-2">
                  <Link href="/profile" onClick={() => setIsProfileOpen(false)}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
                        <User className="h-4 w-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">View Full Profile</p>
                        <p className="text-[10px] text-slate-500">Stats & account details</p>
                      </div>
                    </div>
                  </Link>

                  <div className="my-2 border-t border-white/5" />

                  <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer group">
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
                      <LogOut className="h-4 w-4 text-slate-400 group-hover:text-red-400 transition-colors" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-200 group-hover:text-red-400 transition-colors">Sign Out</p>
                      <p className="text-[10px] text-slate-500">End your session</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </nav>
  );
}
