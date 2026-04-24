"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { BarChart3, Clock, Loader2, TrendingUp, Users, CheckCircle, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast, Toaster } from "sonner";

export default function AnalyticsDashboard() {
  const [statsData, setStatsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await axios.get(`${apiUrl}/analytics/instructor`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setStatsData(response.data.data);
        }
      } catch (error: any) {
        console.error("Failed to fetch analytics:", error);
        toast.error("Failed to load analytics data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
        <p className="text-slate-500 font-medium tracking-widest uppercase text-xs">Analyzing Data...</p>
      </div>
    );
  }

  const totalSubmissions = statsData?.submissionStats?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0;
  const approvedSubmissions = statsData?.submissionStats?.find((s: any) => s._id === 'accepted')?.count || 0;
  const pendingSubmissions = statsData?.submissionStats?.find((s: any) => s._id === 'pending')?.count || 0;
  const needsImprovementSubmissions = statsData?.submissionStats?.find((s: any) => s._id === 'needs-improvement')?.count || 0;
  
  const approvalRate = totalSubmissions > 0 ? Math.round((approvedSubmissions / totalSubmissions) * 100) : 0;

  // Colors mapping matching the global theme
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

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="px-4 pt-4 shrink-0">
        <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase leading-none">Learning Analytics</h1>
        <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">Track performance & submission trends</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4">
        {[
            { label: "Total Assignments", val: statsData?.totalAssignments || 0, icon: GraduationCap, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
            { label: "Total Submissions", val: totalSubmissions, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
            { label: "Acceptance Rate", val: `${approvalRate}%`, icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
            { label: "Needs Intervention", val: needsImprovementSubmissions, icon: Clock, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" }
        ].map((item, idx) => (
            <Card key={idx} className={`bg-slate-950/40 backdrop-blur-xl border ${item.bg} shadow-lg rounded-2xl`}>
                <CardContent className="p-4 md:p-6 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-500 mb-1 leading-tight">{item.label}</p>
                        <p className="text-2xl md:text-3xl font-black text-white">{item.val}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-slate-900/50 ${item.color}`}>
                        <item.icon className="h-5 w-5" />
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 px-4">
          
        {/* Difficult Assignments Chart */}
        <Card className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 flex flex-col h-[400px]">
            <div className="mb-6">
                <h3 className="text-sm md:text-base font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-purple-500" /> Difficulty Distribution
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Number of assignments created across difficulty levels.</p>
            </div>
            <div className="flex-1 w-full min-h-0">
                {barData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 20, right: 10, left: -25, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey="name" stroke="#ffffff50" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#ffffff50" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                            <RechartsTooltip 
                                cursor={{ fill: '#ffffff05' }}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', borderRadius: '12px', color: '#fff' }}
                            />
                            <Bar dataKey="Assignments" radius={[6, 6, 0, 0]} maxBarSize={60}>
                                {barData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-500 text-sm font-medium">No data available</div>
                )}
            </div>
        </Card>

        {/* Acceptance Rate Chart */}
        <Card className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 flex flex-col h-[400px]">
            <div className="mb-6">
                <h3 className="text-sm md:text-base font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> Submission Success Rate
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Status breakdown of all student submissions.</p>
            </div>
            <div className="flex-1 w-full min-h-0 relative">
                {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius="65%"
                                outerRadius="85%"
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {pieData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <RechartsTooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', borderRadius: '12px', color: '#fff' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-500 text-sm font-medium">No data available</div>
                )}
                
                {pieData.length > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col pb-8">
                        <span className="text-4xl font-black text-white">{totalSubmissions}</span>
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Total</span>
                    </div>
                )}
            </div>
        </Card>

      </div>
    </div>
  );
}
