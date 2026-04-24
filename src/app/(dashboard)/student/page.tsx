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
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <LayoutDashboard className="h-40 w-40 text-purple-400 rotate-12" />
        </div>
        
        <div className="relative z-10 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-1.5 border border-purple-500/20 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-[10px] font-black text-purple-200 uppercase tracking-widest">Student Portal</span>
          </div>
          <h1 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tight leading-none">
            Welcome back, <br className="md:hidden" />
            <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
              {user ? user.name.split(' ')[0] : "Student"}!
            </span>
          </h1>
          <p className="max-w-md text-xs md:text-sm text-slate-400 font-medium leading-relaxed mx-auto md:mx-0">
            You have <span className="text-white font-bold">{stats.total} total assignments</span> available to complete. Keep pushing your limits!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center md:justify-start">
             <Link href="/student/assignments">
                <Button className="w-full sm:w-auto h-12 rounded-xl px-8 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-purple-500/10">
                   View Assignments <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
             </Link>
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
