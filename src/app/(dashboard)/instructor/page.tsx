"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, CheckCircle, Clock, Sparkles, TrendingUp, Plus, BarChart3, BookOpen, GraduationCap, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  const router = useRouter();
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
      <div className="space-y-4 md:space-y-4 pb-4 animate-pulse">
        {/* Skeleton Banner */}
        <div className="h-48 rounded-3xl bg-slate-900/50 border border-white/5" />
        
        {/* Skeleton Stats */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-3xl bg-slate-900/50 border border-white/5" />
          ))}
        </div>

        {/* Skeleton Main Sections */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 h-[180px]">
          <div className="lg:col-span-2 rounded-3xl bg-slate-900/30 border border-white/5 border-dashed" />
          <div className="rounded-3xl bg-slate-900/30 border border-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-2 h-[calc(100vh-100px)] flex flex-col">
      <Toaster position="top-center" richColors theme="dark" />
      
      {/* Welcome Banner - More Compact but High Impact */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl md:rounded-[2rem] bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-900 p-5 md:p-8 text-white shadow-2xl border border-white/5 shrink-0"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 md:space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[8px] md:text-[10px] font-medium backdrop-blur-md border border-white/10 mx-auto md:mx-0">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-purple-500" />
              <span className="text-slate-400 font-bold uppercase tracking-widest">Instructor Overview</span>
            </div>
            <h1 className="text-xl md:text-3xl font-black tracking-tight leading-tight text-white uppercase">
              Welcome, <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                {user ? `${user.name.split(' ')[0]}!` : "Professor!"}
              </span>
            </h1>
            <p className="max-w-md text-[10px] md:text-xs text-slate-500 leading-relaxed font-medium mx-auto md:mx-0">
              You have <span className="font-bold text-white/80">{pendingSubmissions} submissions</span> to review today.
            </p>
            <div className="flex justify-center md:justify-start pt-1">
                <Link href="/instructor/assignments/create" className="w-full md:w-auto">
                    <Button 
                      className="cursor-pointer w-full md:w-auto font-black rounded-xl px-8 h-10 text-[9px] md:text-[10px] uppercase tracking-widest"
                    >
                       <Plus className="mr-2 h-4 w-4" /> New Assignment
                    </Button>
                </Link>
            </div>
          </div>

          <div className="hidden md:flex relative h-20 md:h-24 w-32 md:w-40 items-center justify-center overflow-hidden">
             <div className="flex items-end gap-1.5 md:gap-2 h-12 md:h-16">
                {(statsData?.difficultyStats?.length ? statsData.difficultyStats : [{count: 4}, {count: 7}, {count: 5}]).map((stat: any, i: number) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.min(stat.count * 12 || 40, 100)}%` }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: i * 0.2 }}
                        className="w-2.5 md:w-3 rounded-t-md bg-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                    />
                ))}
             </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - Balanced */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-3 grid-cols-2 lg:grid-cols-4 shrink-0">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div variants={item} key={stat.title}>
              <Card className="group relative overflow-hidden bg-slate-950/40 backdrop-blur-xl border border-white/10 transition-all hover:bg-slate-900/40 rounded-xl md:rounded-[1.5rem] shadow-xl">
                <CardContent className="p-3 md:p-5">
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <div className={`rounded-lg md:rounded-xl ${stat.color} p-2 md:p-2.5 text-slate-400 border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </div>
                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-600">{stat.trend}</span>
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.title}</h3>
                    <div className="text-xl md:text-2xl font-black text-white tracking-tighter">{stat.value}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Sections - Dynamic Height */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid gap-3 grid-cols-1 lg:grid-cols-3 flex-1 min-h-0 pb-10 md:pb-0"
      >
        <Card className="lg:col-span-2 overflow-hidden bg-slate-950/20 backdrop-blur-md flex flex-col items-center justify-center border border-white/10 border-dashed p-6 text-center rounded-2xl md:rounded-[2rem]">
             <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center mb-3 md:mb-4">
                <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-purple-500" />
             </div>
             <h3 className="text-base md:text-lg font-black text-white tracking-tight mb-1">Performance Analytics</h3>
             <p className="text-slate-500 text-[8px] md:text-[10px] max-w-sm leading-relaxed font-medium">
               Detailed distribution and analytics data will appear here once students start submitting their assignments.
             </p>
        </Card>
        
        <Card className="overflow-hidden bg-slate-950/20 backdrop-blur-md p-5 md:p-6 border border-white/10 rounded-2xl md:rounded-[2rem] flex flex-col min-h-0">
            <h3 className="font-black text-white mb-3 md:mb-4 flex items-center gap-2 md:gap-3 text-[10px] md:text-xs uppercase tracking-widest shrink-0">
                <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-purple-600" />
                Status Overview
            </h3>
            <div className="space-y-2 md:space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                {statsData?.submissionStats?.length ? statsData.submissionStats.slice(0, 8).map((s: any) => (
                    <div key={s._id} className="flex gap-3 items-center justify-between border-b border-white/5 pb-2 md:pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center gap-1.5 md:gap-2">
                            <div className={`h-1.5 w-1.5 md:h-2 md:w-2 rounded-full ${s._id === 'approved' ? 'bg-green-500' : s._id === 'pending' ? 'bg-yellow-500' : 'bg-red-500'} shadow-[0_0_10px_rgba(34,197,94,0.3)]`} />
                            <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{s._id}</p>
                        </div>
                        <p className="text-sm md:text-base font-black text-white">{s.count}</p>
                    </div>
                )) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3 py-4 md:py-6">
                     <Users className="h-6 w-6 md:h-8 md:w-8 text-slate-800" />
                     <p className="text-slate-600 text-[8px] md:text-[10px] font-bold italic tracking-wide">No activity found</p>
                  </div>
                )}
            </div>
        </Card>
      </motion.div>
    </div>
  );
}
