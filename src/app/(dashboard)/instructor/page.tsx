"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, CheckCircle, Clock, Sparkles, TrendingUp, Plus, BarChart3, BookOpen, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function InstructorDashboard() {
  const stats = [
    { title: "Active Assignments", value: "12", icon: FileText, color: "bg-purple-900/40", trend: "+2 THIS WEEK" },
    { title: "Total Submissions", value: "148", icon: Users, color: "bg-violet-900/40", trend: "+24 TODAY" },
    { title: "Approval Rate", value: "92%", icon: CheckCircle, color: "bg-fuchsia-900/40", trend: "HIGH PERFORMANCE" },
    { title: "Pending Review", value: "56", icon: Clock, color: "bg-slate-800/40", trend: "NEEDS ATTENTION" },
  ];

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
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
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Professor Ashik!</span>
            </h1>
            <p className="max-w-md text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
              Your students are making great progress. You have <span className="font-bold text-white/80">56 submissions</span> waiting for review.
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

          {/* Premium Floating Analytics Animation - Now visible on Mobile */}
          <div className="flex relative h-40 w-full lg:w-64 items-center justify-center overflow-hidden">
             {/* Animated Bar Chart */}
             <div className="flex items-end gap-2 px-4 h-24">
                {[40, 70, 45, 90, 60].map((height, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
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

             <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute center h-32 w-32 rounded-full bg-purple-500/10 blur-2xl -z-10"
             />
          </div>
        </div>
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-purple-600/5 blur-[100px]" />
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
             <p className="text-slate-600 font-medium text-base tracking-tight text-center">Performance Statistics Overview</p>
             <p className="text-slate-700 text-[11px] text-center max-w-sm mt-2 leading-relaxed">
               Your students' data analytics and performance metrics will be available here after the next sync.
             </p>
        </Card>
        
        <Card className="overflow-hidden border-none bg-slate-950/20 backdrop-blur-md h-auto lg:h-[280px] p-5 border border-white/5">
            <h3 className="font-bold text-slate-300 mb-5 flex items-center gap-2 text-[13px] tracking-tight">
                <Clock className="h-4 w-4 text-purple-600" />
                Recent Activity
            </h3>
            <div className="space-y-5">
                {[1,2,3].map((i) => (
                    <div key={i} className="flex gap-4 items-start border-b border-white/5 pb-4 last:border-0 last:pb-0">
                        <div className="h-2 w-2 rounded-full bg-slate-700 mt-1.5 shrink-0" />
                        <div>
                            <p className="text-[11px] font-medium text-slate-300 leading-tight">New assignment submission received from student</p>
                            <p className="text-[9px] text-slate-500 mt-1 uppercase font-semibold">2 min ago</p>
                        </div>
                    </div>
                ))}
            </div>
            <Button variant="ghost" className="cursor-pointer w-full mt-4 text-[11px] text-slate-400 hover:text-slate-200 hover:bg-white/5 h-9">
                View All Activity
            </Button>
        </Card>
      </motion.div>
    </div>
  );
}
