"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Timer, 
  LayoutDashboard,
  ArrowUpRight,
  BookOpen
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import axios from "axios";
import Link from "next/link";

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(storedUser));
    
    // Fetch basic stats
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await axios.get(`${apiUrl}/assignments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setStats(prev => ({ ...prev, total: response.data.data.length }));
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats");
      }
    };
    fetchStats();
  }, [router]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 md:space-y-6">
      <Toaster position="top-center" richColors theme="dark" />
      
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-2xl md:rounded-[2.5rem] bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 p-6 md:p-10 border border-white/5 shadow-2xl shrink-0"
      >
        <div className="relative z-10 flex flex-col-reverse md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-4 text-center md:text-left md:w-1/2 mt-4 md:mt-0 z-10 relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-1.5 border border-purple-500/20 backdrop-blur-md mx-auto md:mx-0">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-[10px] font-black text-purple-200 uppercase tracking-widest">Student Portal</span>
            </div>
            <h1 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tight leading-none relative z-10">
              Welcome back, <br className="md:hidden" />
              <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                {user ? user.name.split(' ')[0] : "Student"}!
              </span>
            </h1>
            <p className="max-w-md text-xs md:text-sm text-slate-400 font-medium leading-relaxed mx-auto md:mx-0 relative z-10">
              You have <span className="text-white font-bold">{stats.total} total assignments</span> available to complete. Keep pushing your limits!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center md:justify-start relative z-10">
               <Link href="/student/assignments">
                  <Button className="w-full sm:w-auto h-12 rounded-xl px-8 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-purple-500/10">
                     View Assignments <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
               </Link>
            </div>
          </div>

          {/* HIGH-END PREMIUM STUDENT ANIMATION */}
          <div className="relative h-32 sm:h-40 w-full md:h-full md:w-1/2 flex items-center justify-center md:justify-end pointer-events-none z-0 mt-2 md:mt-0">
            {/* Core Glowing Orb */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute m-auto h-24 w-24 sm:h-32 sm:w-32 md:h-56 md:w-56 rounded-full bg-blue-600/30 blur-[40px] md:blur-[50px] md:right-10"
            />

            {/* Orbital Ring 1 */}
            <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
               className="absolute m-auto h-32 w-32 sm:h-40 sm:w-40 md:h-64 md:w-64 rounded-full border border-white/[0.03] border-t-cyan-400/30 border-l-cyan-400/10 md:right-0"
            />

            {/* Orbital Ring 2 */}
            <motion.div
               animate={{ rotate: -360 }}
               transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
               className="absolute m-auto h-20 w-20 sm:h-28 sm:w-28 md:h-40 md:w-40 rounded-full border border-white/[0.03] border-b-blue-400/30 border-r-blue-400/10 md:right-12"
            />
            
            {/* Floating Premium Card 1 (Top Right) */}
            <motion.div 
              animate={{ y: [-6, 6, -6], rotateZ: [-2, 2, -2] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-0 sm:right-4 md:right-8 top-0 sm:top-4 md:top-6 flex items-center gap-2 md:gap-3 rounded-xl md:rounded-2xl border border-white/10 bg-white/[0.03] px-2.5 py-1.5 md:px-4 md:py-3 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] shadow-cyan-500/20"
            >
              <div className="flex h-5 w-5 md:h-9 md:w-9 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/10 shadow-inner">
                 <BookOpen className="h-2.5 w-2.5 md:h-4 md:w-4 text-cyan-300" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">Course Progress</span>
                 <span className="text-[6px] md:text-[8px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
              </div>
            </motion.div>

            {/* Floating Premium Card 2 (Bottom Left) */}
            <motion.div 
              animate={{ y: [6, -6, 6], rotateZ: [2, -2, 2] }} 
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 sm:left-4 md:left-auto md:right-40 bottom-0 sm:bottom-4 md:bottom-6 flex items-center gap-2 md:gap-3 rounded-xl md:rounded-2xl border border-white/10 bg-black/40 px-2.5 py-1.5 md:px-4 md:py-3 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] shadow-blue-500/20"
            >
              <div className="flex h-5 w-5 md:h-9 md:w-9 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 shadow-inner">
                 <CheckCircle2 className="h-2.5 w-2.5 md:h-4 md:w-4 text-indigo-300" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">Skill Mastery</span>
                 <span className="text-[6px] md:text-[8px] font-bold text-slate-400 uppercase tracking-widest">Level Up</span>
              </div>
            </motion.div>

            {/* Tiny glowing particles */}
            <motion.div animate={{ y: [-20, 20], opacity: [0, 1, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-8 right-16 md:top-10 md:right-32 h-1.5 w-1.5 rounded-full bg-cyan-400 blur-[1px]" />
            <motion.div animate={{ y: [20, -20], opacity: [0, 1, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute bottom-8 left-16 md:left-auto md:bottom-10 md:right-20 h-2 w-2 rounded-full bg-blue-400 blur-[1px]" />
            <motion.div animate={{ scale: [1, 2, 1], opacity: [0, 0.8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 2 }} className="absolute top-1/2 left-1/2 md:left-auto md:right-1/4 h-1 w-1 rounded-full bg-white blur-[1px]" />
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 shrink-0"
      >
        {[
          { title: "Total Tasks", value: stats.total, icon: BookOpen, color: "bg-blue-500/10 text-blue-400" },
          { title: "Completed", value: stats.completed, icon: CheckCircle2, color: "bg-green-500/10 text-green-400" },
          { title: "Pending", value: stats.total - stats.completed, icon: Timer, color: "bg-orange-500/10 text-orange-400" }
        ].map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl hover:bg-white/5 transition-all group shadow-xl">
              <CardContent className="p-4 md:p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.title}</p>
                  <p className="text-2xl md:text-3xl font-black text-white">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Activity Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex-1 min-h-0 pb-10 md:pb-0"
      >
        <Card className="h-full bg-slate-950/20 backdrop-blur-md border border-white/10 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-8 text-center">
            <div className="h-16 w-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-slate-700" />
            </div>
            <h3 className="text-xl font-black text-slate-300 uppercase tracking-tight">Recent Activity</h3>
            <p className="text-slate-600 text-xs mt-2 max-w-sm font-medium leading-relaxed">
                Your recent assignment submissions and progress will be tracked here. Start your first assignment to see updates!
            </p>
        </Card>
      </motion.div>
    </div>
  );
}
