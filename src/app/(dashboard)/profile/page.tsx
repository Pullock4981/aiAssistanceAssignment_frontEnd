"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  UserCircle, Mail, Shield, Calendar, FileText, 
  CheckCircle2, Clock, TrendingUp, BookOpen, Users, Award
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      fetchStats(parsed.role);
    }
  }, []);

  const fetchStats = async (role: string) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const endpoint = role === "instructor" ? "/analytics/instructor" : "/analytics/student";
      const res = await axios.get(`${apiUrl}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setStats(res.data.data);
    } catch {}
    setLoading(false);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  // Instructor stats
  const totalSubmissions = stats?.submissionStats?.reduce((a: number, c: any) => a + c.count, 0) || 0;
  const accepted = stats?.submissionStats?.find((s: any) => s._id === "accepted")?.count || 0;
  const pending = stats?.submissionStats?.find((s: any) => s._id === "pending")?.count || 0;
  const needsImprv = stats?.submissionStats?.find((s: any) => s._id === "needs-improvement")?.count || 0;
  const approvalRate = totalSubmissions > 0 ? Math.round((accepted / totalSubmissions) * 100) : 0;

  // Student stats
  const studentTotal = stats?.totalSubmissions || 0;
  const studentAccepted = stats?.submissionStats?.find((s: any) => s._id === "accepted")?.count || 0;
  const studentPending = stats?.submissionStats?.find((s: any) => s._id === "pending")?.count || 0;
  const studentNeedsImprv = stats?.submissionStats?.find((s: any) => s._id === "needs-improvement")?.count || 0;

  const instructorStatCards = [
    { label: "Total Assignments", value: stats?.totalAssignments ?? 0, icon: FileText, color: "from-purple-500/20 to-violet-500/20", text: "text-purple-400", border: "border-purple-500/20" },
    { label: "Total Submissions", value: totalSubmissions, icon: Users, color: "from-blue-500/20 to-indigo-500/20", text: "text-blue-400", border: "border-blue-500/20" },
    { label: "Accepted", value: accepted, icon: CheckCircle2, color: "from-green-500/20 to-emerald-500/20", text: "text-green-400", border: "border-green-500/20" },
    { label: "Pending Review", value: pending, icon: Clock, color: "from-yellow-500/20 to-amber-500/20", text: "text-yellow-400", border: "border-yellow-500/20" },
    { label: "Needs Improvement", value: needsImprv, icon: TrendingUp, color: "from-orange-500/20 to-red-500/20", text: "text-orange-400", border: "border-orange-500/20" },
    { label: "Approval Rate", value: `${approvalRate}%`, icon: Award, color: "from-fuchsia-500/20 to-pink-500/20", text: "text-fuchsia-400", border: "border-fuchsia-500/20" },
  ];

  const studentStatCards = [
    { label: "Total Submissions", value: studentTotal, icon: BookOpen, color: "from-blue-500/20 to-indigo-500/20", text: "text-blue-400", border: "border-blue-500/20" },
    { label: "Accepted", value: studentAccepted, icon: CheckCircle2, color: "from-green-500/20 to-emerald-500/20", text: "text-green-400", border: "border-green-500/20" },
    { label: "Pending Review", value: studentPending, icon: Clock, color: "from-yellow-500/20 to-amber-500/20", text: "text-yellow-400", border: "border-yellow-500/20" },
    { label: "Needs Improvement", value: studentNeedsImprv, icon: TrendingUp, color: "from-orange-500/20 to-red-500/20", text: "text-orange-400", border: "border-orange-500/20" },
  ];

  const statCards = user?.role === "instructor" ? instructorStatCards : studentStatCards;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 pb-10">

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-900 border border-white/5 p-8 shadow-2xl"
      >
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-purple-600/20 blur-[60px]"
          />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="h-24 w-24 rounded-3xl bg-gradient-to-br from-purple-600/40 to-indigo-600/40 border-2 border-purple-500/30 flex items-center justify-center shadow-2xl shadow-purple-500/20 shrink-0"
          >
            <span className="text-3xl font-black text-white">
              {user ? getInitials(user.name) : "?"}
            </span>
          </motion.div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                {user?.name || "Loading..."}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <span className={`px-3 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-full border ${
                  user?.role === "instructor" 
                    ? "bg-purple-500/10 border-purple-500/30 text-purple-300" 
                    : "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                }`}>
                  {user?.role || "User"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 text-sm text-slate-400">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Mail className="h-4 w-4 text-slate-500" />
                <span className="font-medium">{user?.email || "—"}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="font-medium">Joined {formatDate(user?.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Role Badge Large */}
          <div className="hidden md:flex flex-col items-center gap-1">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${
              user?.role === "instructor" ? "bg-purple-500/10 border border-purple-500/20" : "bg-cyan-500/10 border border-cyan-500/20"
            }`}>
              <Shield className={`h-7 w-7 ${user?.role === "instructor" ? "text-purple-400" : "text-cyan-400"}`} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Role</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 px-1">
          {user?.role === "instructor" ? "Teaching Analytics" : "Learning Progress"}
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-24 rounded-2xl bg-slate-900/50 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {statCards.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <Card className={`bg-slate-950/40 backdrop-blur-xl border ${stat.border} hover:bg-white/5 transition-all group rounded-2xl shadow-xl`}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${stat.color} border ${stat.border} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <stat.icon className={`h-4 w-4 ${stat.text}`} />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Account Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 px-1">Account Info</h2>
        <Card className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
          <CardContent className="p-6 space-y-4">
            {[
              { label: "Full Name", value: user?.name, icon: UserCircle },
              { label: "Email Address", value: user?.email, icon: Mail },
              { label: "Role", value: user?.role === "instructor" ? "Instructor" : "Student", icon: Shield },
              { label: "Member Since", value: formatDate(user?.createdAt), icon: Calendar },
            ].map((info, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <info.icon className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{info.label}</p>
                  <p className="text-sm font-semibold text-white truncate">{info.value || "—"}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
}
