"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, CheckCircle, Clock, Sparkles, TrendingUp, Plus, BarChart3, BookOpen, GraduationCap, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast, Toaster } from "sonner";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function InstructorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [statsData, setStatsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await axios.get(`${apiUrl}/analytics/instructor`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setStatsData(response.data.data);
        }
      } catch (error: any) {
        console.error("Failed to fetch stats:", error);
        toast.error("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const totalSubmissions = statsData?.submissionStats?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0;
  const pendingSubmissions = statsData?.submissionStats?.find((s: any) => s._id === 'pending')?.count || 0;
  const approvedSubmissions = statsData?.submissionStats?.find((s: any) => s._id === 'approved')?.count || 0;
  const approvalRate = totalSubmissions > 0 ? Math.round((approvedSubmissions / totalSubmissions) * 100) : 0;

  const stats = [
    { title: "Assignments", value: statsData?.totalAssignments || "0", icon: FileText, color: "bg-purple-900/40", trend: "+0 WK" },
    { title: "Submissions", value: totalSubmissions, icon: Users, color: "bg-violet-900/40", trend: "LIVE" },
    { title: "Approval", value: `${approvalRate}%`, icon: CheckCircle, color: "bg-fuchsia-900/40", trend: "PERF" },
    { title: "Pending", value: pendingSubmissions, icon: Clock, color: "bg-slate-800/40", trend: "ATTN" },
  ];

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-4 pb-4">
      <Toaster position="top-center" richColors theme="dark" />
      
      {/* Welcome Banner - Compact */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-900 p-4 md:p-6 text-white shadow-2xl border border-white/5"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[9px] font-medium backdrop-blur-md border border-white/10">
              <Sparkles className="h-3 w-3 text-purple-500" />
              <span className="text-slate-400">Instructor Overview</span>
            </div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight leading-tight text-white">
              Welcome, <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                {user ? `Professor ${user.name.split(' ')[0]}!` : "Professor!"}
              </span>
            </h1>
            <p className="max-w-md text-[11px] text-slate-500 leading-relaxed font-medium">
              You have <span className="font-bold text-white/80">{pendingSubmissions} submissions</span> to review.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <Button className="cursor-pointer w-full sm:w-auto bg-gradient-to-r from-purple-900 to-slate-900 hover:from-purple-800 hover:to-slate-800 text-slate-200 font-bold rounded-lg px-6 h-9 shadow-xl shadow-black/40 text-[10px] transition-all border border-white/5">
                   <Plus className="mr-2 h-3.5 w-3.5" /> New Assignment
                </Button>
            </div>
          </div>

          <div className="hidden lg:flex relative h-24 w-32 items-center justify-center overflow-hidden">
             <div className="flex items-end gap-1.5 px-4 h-16">
                {(statsData?.difficultyStats?.length ? statsData.difficultyStats : [{count: 4}, {count: 7}, {count: 5}]).map((stat: any, i: number) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.min(stat.count * 10 || 40, 100)}%` }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: i * 0.2 }}
                        className="w-2.5 rounded-t-sm bg-purple-500/40"
                    />
                ))}
             </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - Compact */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div variants={item} key={stat.title}>
              <Card className="group relative overflow-hidden border-none bg-slate-950/40 backdrop-blur-xl border border-white/5 transition-all hover:bg-slate-900/40">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`rounded-lg ${stat.color} p-2 text-slate-400 border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600">{stat.trend}</span>
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-[10px] font-medium text-slate-500">{stat.title}</h3>
                    <div className="text-xl font-bold text-slate-400 tracking-tight">{stat.value}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Sections - Compact */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="grid gap-4 grid-cols-1 lg:grid-cols-3 h-[180px]"
      >
        <Card className="lg:col-span-2 overflow-hidden border-none bg-slate-950/20 backdrop-blur-md flex flex-col items-center justify-center border border-white/5 border-dashed p-4 text-center">
             <BarChart3 className="h-8 w-8 text-slate-800 mb-2" />
             <p className="text-slate-400 font-bold text-sm tracking-tight">Performance Analytics</p>
             <p className="text-slate-600 text-[10px] max-w-sm mt-1">
               Detailed distribution and analytics data ready for synchronization.
             </p>
        </Card>
        
        <Card className="overflow-hidden border-none bg-slate-950/20 backdrop-blur-md p-4 border border-white/5">
            <h3 className="font-bold text-slate-300 mb-3 flex items-center gap-2 text-[11px] tracking-tight">
                <Clock className="h-3.5 w-3.5 text-purple-600" />
                Status Overview
            </h3>
            <div className="space-y-3">
                {statsData?.submissionStats?.length ? statsData.submissionStats.slice(0, 3).map((s: any) => (
                    <div key={s._id} className="flex gap-4 items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${s._id === 'approved' ? 'bg-green-500' : s._id === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s._id}</p>
                        </div>
                        <p className="text-sm font-extrabold text-white">{s.count}</p>
                    </div>
                )) : (
                  <p className="text-slate-600 text-[10px] text-center py-10 font-medium italic">No activity found</p>
                )}
            </div>
        </Card>
      </motion.div>
    </div>
  );
}
