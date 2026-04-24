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
    accepted: 0,
    pending: 0,
    needsImprovement: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'student') {
        router.push('/instructor');
        return;
    }
    setUser(parsedUser);
    
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        
        // Fetch all assignments for total count
        const assignmentsRes = await axios.get(`${apiUrl}/assignments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch my submissions
        const submissionsRes = await axios.get(`${apiUrl}/submissions/my-submissions`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        let total = 0;
        if (assignmentsRes.data.success) {
          total = assignmentsRes.data.data.length;
        }

        let accepted = 0;
        let pending = 0;
        let needsImprovement = 0;
        let activities = [];

        if (submissionsRes.data.success) {
          const subs = submissionsRes.data.data;
          const allAssignments = assignmentsRes.data.success ? assignmentsRes.data.data : [];

          accepted = subs.filter((s: any) => s.status === 'accepted').length;
          pending = subs.filter((s: any) => s.status === 'pending').length;
          needsImprovement = subs.filter((s: any) => s.status === 'needs-improvement').length;
          
          // Sort by newest first and take top 5
          activities = subs.map((sub: any) => {
              let assignmentObj = sub.assignment;
              if (typeof sub.assignment === 'string') {
                  assignmentObj = allAssignments.find((a: any) => a._id === sub.assignment);
              } else if (sub.assignment && !sub.assignment.title) {
                  assignmentObj = allAssignments.find((a: any) => a._id === sub.assignment._id);
              }
              return { ...sub, resolvedAssignment: assignmentObj };
          }).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
        }

        setStats({ total, accepted, pending, needsImprovement });
        setRecentActivities(activities);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoadingActivities(false);
      }
    };
    fetchData();
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
    <div className="flex flex-col min-h-screen space-y-4 md:space-y-6 pb-10">
      
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-2xl md:rounded-[2rem] bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 p-5 md:p-8 border border-white/5 shadow-2xl shrink-0"
      >
        <div className="relative z-10 flex flex-col-reverse md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-4 text-center md:text-left md:w-1/2 mt-4 md:mt-0 z-10 relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-1.5 border border-purple-500/20 backdrop-blur-md mx-auto md:mx-0">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-[10px] font-black text-purple-200 uppercase tracking-widest">Student Portal</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight leading-none relative z-10">
              Welcome back, <br className="md:hidden" />
              <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                {user ? user.name.split(' ')[0] : "Student"}!
              </span>
            </h1>
            <p className="max-w-md text-[10px] md:text-xs text-slate-400 font-medium leading-relaxed mx-auto md:mx-0 relative z-10">
              You have <span className="text-white font-bold">{stats.total} total assignments</span> available to complete. Keep pushing your limits!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center md:justify-start relative z-10">
                <Link href="/student/assignments">
                  <Button className="w-full sm:w-auto h-10 md:h-11 rounded-xl px-6 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-purple-500/10">
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

      {/* Stats Cards Section */}
      <div className="space-y-3 md:space-y-4">
        <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Learning Progress</h3>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4 shrink-0"
        >
        {[
          { title: "Total Tasks",        value: stats.total,           icon: BookOpen,    color: "bg-blue-500/10 text-blue-400",   border: "hover:border-blue-500/30" },
          { title: "Accepted",           value: stats.accepted,         icon: CheckCircle2, color: "bg-green-500/10 text-green-400",  border: "hover:border-green-500/30" },
          { title: "Pending Review",     value: stats.pending,          icon: Timer,       color: "bg-orange-500/10 text-orange-400", border: "hover:border-orange-500/30" },
          { title: "Needs Improvement",  value: stats.needsImprovement, icon: BookOpen,    color: "bg-red-500/10 text-red-400",     border: "hover:border-red-500/30" },
        ].map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className={`bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl ${stat.border} hover:bg-white/5 transition-all group shadow-xl`}>
              <CardContent className="p-4 md:p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.title}</p>
                  <p className="text-2xl md:text-3xl font-black text-white">{stat.value}</p>
                </div>
                <div className={`h-11 w-11 rounded-xl ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pb-10 md:pb-0"
      >
        <Card className="bg-slate-950/20 backdrop-blur-md border border-white/10 border-dashed rounded-[2rem] flex flex-col p-6 md:p-8">
            <h3 className="text-xl font-black text-slate-300 uppercase tracking-tight mb-6 flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" /> Recent Activity
            </h3>
            
            {loadingActivities ? (
               <div className="flex-1 flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
               </div>
            ) : recentActivities.length > 0 ? (
               <div className="space-y-4">
                 {recentActivities.map((activity, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors gap-4">
                       <div className="flex items-center gap-3 md:gap-4">
                          <div className={`h-9 w-9 md:h-10 md:w-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 ${
                             activity.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                             activity.status === 'pending' ? 'bg-orange-500/20 text-orange-400' :
                             'bg-red-500/20 text-red-400'
                          }`}>
                             {activity.status === 'accepted' ? <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" /> :
                              activity.status === 'pending' ? <Timer className="h-4 w-4 md:h-5 md:w-5" /> :
                              <BookOpen className="h-4 w-4 md:h-5 md:w-5" />}
                          </div>
                           <div className="min-w-0">
                             <h4 className="text-[12px] md:text-sm font-bold text-white truncate pr-2">
                               {activity.resolvedAssignment?.title || activity.assignment?.title || 'Unknown Assignment'}
                             </h4>
                             <p className="text-[9px] md:text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">
                                {new Date(activity.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                             </p>
                          </div>
                       </div>
                       <div className="flex items-center justify-between sm:justify-end gap-2 md:gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                           <div className={`px-2 md:px-3 py-0.5 md:py-1 text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full border ${
                              activity.status === 'accepted' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                              activity.status === 'pending' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                              'bg-red-500/10 border-red-500/20 text-red-400'
                           }`}>
                              {activity.status}
                           </div>
                           <Link href="/student/submissions">
                               <Button variant="ghost" size="sm" className="h-7 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-white hover:bg-white/10 rounded-lg">
                                   View Details
                               </Button>
                           </Link>
                       </div>
                    </div>
                 ))}
               </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
                    <div className="h-16 w-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                        <Clock className="h-8 w-8 text-slate-700" />
                    </div>
                    <p className="text-slate-500 text-sm max-w-sm font-medium leading-relaxed">
                        Your recent assignment submissions and progress will be tracked here. Start your first assignment to see updates!
                    </p>
                </div>
            )}
        </Card>
      </motion.div>
    </div>
  );
}
