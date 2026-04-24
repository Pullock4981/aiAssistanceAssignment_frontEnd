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
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

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
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'instructor') {
          router.push('/student');
          return;
      }
      setUser(parsedUser);
    } else {
        router.push('/login');
        return;
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
  const pendingSubmissions  = statsData?.submissionStats?.find((s: any) => s._id === 'pending')?.count || 0;
  const acceptedSubmissions = statsData?.submissionStats?.find((s: any) => s._id === 'accepted')?.count || 0;
  const needsImprovCount    = statsData?.submissionStats?.find((s: any) => s._id === 'needs-improvement')?.count || 0;
  const approvalRate = totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0;

  const stats = [
    { title: "Assignments",      value: statsData?.totalAssignments ?? "0", icon: FileText,    color: "bg-purple-900/40",  borderColor: "border-purple-500/10", trend: "TOTAL" },
    { title: "Submissions",      value: totalSubmissions,                    icon: Users,       color: "bg-violet-900/40",  borderColor: "border-violet-500/10", trend: "LIVE"  },
    { title: "Accepted",         value: acceptedSubmissions,                 icon: CheckCircle, color: "bg-green-900/40",   borderColor: "border-green-500/10",  trend: "PERF"  },
    { title: "Pending",          value: pendingSubmissions,                  icon: Clock,       color: "bg-slate-800/40",   borderColor: "border-slate-500/10",  trend: "ATTN"  },
    { title: "Needs Improvement",value: needsImprovCount,                    icon: TrendingUp,  color: "bg-orange-900/40", borderColor: "border-orange-500/10", trend: "REVW"  },
  ];

  // Prepare Chart Data
  const COLORS: Record<string, string> = {
    accepted: '#22c55e', 
    pending: '#eab308',  
    'needs-improvement': '#f97316', 
    beginner: '#2dd4bf', 
    intermediate: '#a855f7', 
    advanced: '#ef4444' 
  };

  const pieData = statsData?.submissionStats?.map((s: any) => ({
    name: s._id === 'accepted' ? 'Accepted' : s._id === 'pending' ? 'Pending' : 'Needs Improvement',
    value: s.count,
    color: COLORS[s._id] || '#8884d8'
  })) || [];

  const barData = statsData?.difficultyStats?.map((d: any) => ({
    name: d._id.charAt(0).toUpperCase() + d._id.slice(1),
    Assignments: d.count,
    fill: COLORS[d._id] || '#8884d8'
  })) || [];

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
    <div className="space-y-4 md:space-y-6 pb-8 min-h-screen flex flex-col">
      
      {/* Welcome Banner - Compact but High Impact */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-900 p-5 md:p-7 text-white shadow-2xl border border-white/5 shrink-0"
      >
        <div className="relative z-10 flex flex-col-reverse md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 md:space-y-3 text-center md:text-left md:w-1/2 mt-4 md:mt-0 z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[10px] md:text-xs font-medium backdrop-blur-md border border-white/10 mx-auto md:mx-0">
              <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 text-purple-500" />
              <span className="text-slate-400 font-bold uppercase tracking-widest">Instructor Overview</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none text-white uppercase relative z-10">
              Welcome, <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                {user ? `${user.name.split(' ')[0]}!` : "Professor!"}
              </span>
            </h1>
            <p className="max-w-md text-xs md:text-lg text-slate-400/80 leading-relaxed font-medium mx-auto md:mx-0 relative z-10">
              You have <span className="font-bold text-purple-400">{pendingSubmissions} submissions</span> to review today.
            </p>
            <div className="flex justify-center md:justify-start pt-2 relative z-10">
                <Link href="/instructor/assignments/create" className="w-full md:w-auto">
                    <Button 
                      className="cursor-pointer w-full md:w-auto font-black rounded-lg px-8 h-12 text-xs md:text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform"
                    >
                       <Plus className="mr-2 h-4 w-4" /> New Assignment
                    </Button>
                </Link>
            </div>
          </div>

          {/* HIGH-END PREMIUM ANIMATION */}
          <div className="relative h-32 sm:h-40 w-full md:h-full md:w-64 lg:w-80 flex items-center justify-center md:justify-end pointer-events-none z-0 mt-2 md:mt-0">
             {/* Core Glowing Orb */}
             <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute m-auto h-24 w-24 sm:h-32 sm:w-32 md:h-48 md:w-48 rounded-full bg-fuchsia-600/30 blur-[40px] md:blur-[50px]"
             />

             {/* Orbital Ring 1 */}
             <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute m-auto h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 rounded-full border border-white/[0.03] border-t-purple-400/30 border-l-purple-400/10"
             />

             {/* Orbital Ring 2 */}
             <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute m-auto h-20 w-20 sm:h-28 sm:w-28 lg:h-32 lg:w-32 rounded-full border border-white/[0.03] border-b-fuchsia-400/30 border-r-fuchsia-400/10"
             />

             {/* Floating Premium Card 1 */}
             <motion.div 
                animate={{ y: [-6, 6, -6], rotateZ: [-2, 2, -2] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-0 sm:right-4 lg:right-4 top-0 sm:top-4 lg:top-4 flex items-center gap-2 md:gap-3 rounded-xl md:rounded-2xl border border-white/10 bg-white/[0.03] px-2.5 py-1.5 md:px-3 md:py-2.5 lg:px-4 lg:py-3 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] shadow-purple-500/20"
             >
                <div className="flex h-5 w-5 md:h-7 md:w-7 lg:h-9 lg:w-9 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 border border-white/10 shadow-inner">
                  <GraduationCap className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4 text-fuchsia-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] md:text-[9px] lg:text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-fuchsia-200 to-purple-200 bg-clip-text text-transparent">Teaching Hub</span>
                  <span className="text-[6px] md:text-[7px] lg:text-[8px] font-bold text-slate-400 uppercase tracking-widest">Live Sync</span>
                </div>
             </motion.div>

             {/* Floating Premium Card 2 */}
             <motion.div 
                animate={{ y: [6, -6, 6], rotateZ: [2, -2, 2] }} 
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 sm:left-4 md:-left-6 lg:left-0 bottom-0 sm:bottom-4 lg:bottom-6 flex items-center gap-2 md:gap-3 rounded-xl md:rounded-2xl border border-white/10 bg-black/40 px-2.5 py-1.5 md:px-3 md:py-2.5 lg:px-4 lg:py-3 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] shadow-indigo-500/20"
             >
                <div className="flex h-5 w-5 md:h-7 md:w-7 lg:h-9 lg:w-9 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-white/10 shadow-inner">
                  <BookOpen className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4 text-indigo-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] md:text-[9px] lg:text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-indigo-200 to-blue-200 bg-clip-text text-transparent">Curriculum</span>
                  <span className="text-[6px] md:text-[7px] lg:text-[8px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
                </div>
             </motion.div>

             {/* Tiny glowing particles */}
             <motion.div animate={{ y: [-20, 20], opacity: [0, 1, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-8 right-16 h-1.5 w-1.5 rounded-full bg-purple-400 blur-[1px]" />
             <motion.div animate={{ y: [20, -20], opacity: [0, 1, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute bottom-8 left-16 h-2 w-2 rounded-full bg-fuchsia-400 blur-[1px]" />
             <motion.div animate={{ scale: [1, 2, 1], opacity: [0, 0.8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 2 }} className="absolute top-1/2 left-1/2 md:left-auto md:right-32 h-1 w-1 rounded-full bg-white blur-[1px]" />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - Balanced */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-5 shrink-0 py-2 md:py-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div variants={item} key={stat.title}>
              <Card className={`group relative overflow-hidden bg-slate-950/40 backdrop-blur-xl border ${stat.borderColor} transition-all hover:bg-slate-900/40 hover:border-white/40 rounded-lg md:rounded-xl shadow-xl h-full md:h-48`}>
                <CardContent className="p-4 md:p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <div className={`rounded-lg md:rounded-xl ${stat.color} p-1.5 md:p-2 text-slate-400 border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-600">{stat.trend}</span>
                  </div>
                  <div className="space-y-1 mt-auto">
                    <h3 className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-widest truncate">{stat.title}</h3>
                    <div className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none">{stat.value}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3 shrink-0 h-auto min-h-[400px] pb-6"
      >
        <Card className="lg:col-span-2 min-h-0 overflow-hidden bg-slate-950/40 backdrop-blur-md flex flex-col border border-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl h-[350px] md:h-auto">
            <h3 className="font-black text-white mb-2 flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest shrink-0">
                <BarChart3 className="h-3.5 w-3.5 md:h-4 md:w-4 text-purple-600" />
                Difficulty Distribution
            </h3>
            <div className="h-full w-full flex-1 min-h-0">
                {barData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey="name" stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                            <RechartsTooltip 
                                cursor={{ fill: '#ffffff05' }}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                            />
                            <Bar dataKey="Assignments" radius={[4, 4, 0, 0]}>
                                {barData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-2 opacity-50">
                        <BarChart3 className="h-8 w-8 text-slate-600" />
                        <span className="text-xs text-slate-500 font-medium">No data available</span>
                    </div>
                )}
            </div>
        </Card>
        
        <Card className="min-h-0 overflow-hidden bg-slate-950/40 backdrop-blur-md p-3 md:p-4 border border-white/10 rounded-xl md:rounded-2xl flex flex-col h-[350px] md:h-auto">
            <h3 className="font-black text-white mb-2 flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest shrink-0">
                <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-purple-600" />
                Submission Rates
            </h3>
            <div className="h-full w-full relative flex items-center justify-center flex-1 min-h-0">
                {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius="60%"
                                outerRadius="80%"
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {pieData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <RechartsTooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-2 opacity-50">
                        <PieChart className="h-8 w-8 text-slate-600" />
                        <span className="text-xs text-slate-500 font-medium">No submissions yet</span>
                    </div>
                )}
                {pieData.length > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                        <span className="text-2xl font-black text-white">{totalSubmissions}</span>
                        <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold">Total</span>
                    </div>
                )}
            </div>
            {pieData.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                    {pieData.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-[9px] font-bold text-slate-400 uppercase">{entry.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </Card>
      </motion.div>
    </div>
  );
}
