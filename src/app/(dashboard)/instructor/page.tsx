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

  // Helper to get total submissions from stats
  const totalSubmissions = statsData?.submissionStats?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0;
  const pendingSubmissions = statsData?.submissionStats?.find((s: any) => s._id === 'pending')?.count || 0;
  const approvedSubmissions = statsData?.submissionStats?.find((s: any) => s._id === 'approved')?.count || 0;
  const approvalRate = totalSubmissions > 0 ? Math.round((approvedSubmissions / totalSubmissions) * 100) : 0;

  const stats = [
    { 
      title: "Active Assignments", 
      value: statsData?.totalAssignments || "0", 
      icon: FileText, 
      color: "bg-purple-900/40", 
      trend: "+0 THIS WEEK" 
    },
    { 
      title: "Total Submissions", 
      value: totalSubmissions, 
      icon: Users, 
      color: "bg-violet-900/40", 
      trend: "LIVE DATA" 
    },
    { 
      title: "Approval Rate", 
      value: `${approvalRate}%`, 
      icon: CheckCircle, 
      color: "bg-fuchsia-900/40", 
      trend: approvalRate > 80 ? "HIGH PERFORMANCE" : "NORMAL" 
    },
    { 
      title: "Pending Review", 
      value: pendingSubmissions, 
      icon: Clock, 
      color: "bg-slate-800/40", 
      trend: pendingSubmissions > 10 ? "NEEDS ATTENTION" : "STABLE" 
    },
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
    <div className="space-y-4 md:space-y-6 pb-6">
      <Toaster position="top-center" richColors theme="dark" />
      
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-900 p-5 md:p-8 text-white shadow-2xl border border-white/5"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[10px] md:text-[11px] font-medium backdrop-blur-md border border-white/10">
              <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5 text-purple-500" />
              <span className="text-slate-400">Instructor Overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-white">
              Welcome back, <br className="sm:hidden" />
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                {user ? `Professor ${user.name.split(' ')[0]}!` : "Professor!"}
              </span>
            </h1>
            <p className="max-w-md text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
              Your students are making progress. You have <span className="font-bold text-white/80">{pendingSubmissions} submissions</span> waiting for review.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button className="cursor-pointer w-full sm:w-auto bg-gradient-to-r from-purple-900 to-slate-900 hover:from-purple-800 hover:to-slate-800 text-slate-200 font-semibold rounded-lg px-6 h-11 md:h-10 shadow-xl shadow-black/40 text-xs transition-all duration-300 border border-white/5">
                   <Plus className="mr-2 h-4 w-4" /> New Assignment
                </Button>
                <Button variant="outline" className="cursor-pointer w-full sm:w-auto border-white/10 text-slate-400 hover:bg-white/5 hover:text-white rounded-lg px-6 h-11 md:h-10 backdrop-blur-sm text-xs transition-all duration-300">
                   View Analytics
                </Button>
            </div>
          </div>

          <div className="flex relative h-40 w-full lg:w-64 items-center justify-center overflow-hidden">
             <div className="flex items-end gap-2 px-4 h-24">
                {(statsData?.difficultyStats?.length ? statsData.difficultyStats : [{count: 40}, {count: 70}, {count: 45}, {count: 90}, {count: 60}]).map((stat: any, i: number) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.min(stat.count * 10 || 40, 100)}%` }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: i * 0.2,
                            ease: "easeInOut"
                        }}
                        className="w-3 rounded-t-sm bg-gradient-to-t from-purple-600/20 to-purple-400/60 shadow-lg shadow-purple-500/10"
                    />
                ))}
             </div>

             <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 left-4 p-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl"
             >
                <BookOpen className="h-5 w-5 text-purple-400/60" />
             </motion.div>

             <motion.div
                animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-4 right-10 p-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl"
             >
                <GraduationCap className="h-6 w-6 text-indigo-400/60" />
             </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div variants={item} key={stat.title}>
              <Card className="group relative overflow-hidden border-none bg-slate-950/40 backdrop-blur-xl border border-white/5 transition-all hover:bg-slate-900/40">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`rounded-xl ${stat.color} p-2.5 text-slate-400 border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">{stat.trend}</span>
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-medium text-slate-500">{stat.title}</h3>
                    <div className="text-2xl font-bold text-slate-400 tracking-tight">{stat.value}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Sections */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="grid gap-6 grid-cols-1 lg:grid-cols-3"
      >
        <Card className="lg:col-span-2 overflow-hidden border-none bg-slate-950/20 backdrop-blur-md min-h-[250px] md:h-[280px] flex flex-col items-center justify-center border border-white/5 border-dashed p-8">
             <BarChart3 className="h-10 w-10 text-slate-800 mb-4" />
             <p className="text-slate-400 font-medium text-base tracking-tight text-center">Analytics Visualization Ready</p>
             <p className="text-slate-600 text-[11px] text-center max-w-sm mt-2 leading-relaxed">
               Distribution: {statsData?.difficultyStats?.map((d: any) => `${d._id}: ${d.count}`).join(', ') || 'No data available'}
             </p>
        </Card>
        
        <Card className="overflow-hidden border-none bg-slate-950/20 backdrop-blur-md h-auto lg:h-[280px] p-5 border border-white/5">
            <h3 className="font-bold text-slate-300 mb-5 flex items-center gap-2 text-[13px] tracking-tight">
                <Clock className="h-4 w-4 text-purple-600" />
                Submission Status
            </h3>
            <div className="space-y-5">
                {statsData?.submissionStats?.length ? statsData.submissionStats.map((s: any) => (
                    <div key={s._id} className="flex gap-4 items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                        <div className={`h-2.5 w-2.5 rounded-full ${s._id === 'approved' ? 'bg-green-500' : s._id === 'pending' ? 'bg-yellow-500' : 'bg-red-500'} shrink-0`} />
                        <div className="flex justify-between w-full items-center">
                            <p className="text-[12px] font-bold text-slate-300 uppercase tracking-wider">{s._id}</p>
                            <p className="text-[14px] text-purple-400 font-bold">{s.count}</p>
                        </div>
                    </div>
                )) : (
                  <p className="text-slate-600 text-xs text-center py-10">No recent activity found</p>
                )}
            </div>
        </Card>
      </motion.div>
    </div>
  );
}
