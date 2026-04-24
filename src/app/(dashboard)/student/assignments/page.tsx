"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Calendar, 
  FileText, 
  Loader2, 
  ArrowRight,
  BookOpen,
  Sparkles,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import axios from "axios";

export default function StudentAssignments() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await axios.get(`${apiUrl}/assignments`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setAssignments(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [router]);

  if (!mounted || loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
        <p className="text-slate-500 font-medium">Loading challenges...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-6">
      <Toaster position="top-center" richColors theme="dark" />
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 pt-4 shrink-0">
        <div className="space-y-1 md:space-y-2">
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase leading-none">All Assignments</h1>
          <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-[0.2em]">Explore and complete your tasks</p>
        </div>
        
        <div className="relative group w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-purple-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search assignments..." 
            className="w-full md:w-80 bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-purple-500/30 transition-all shadow-inner font-medium"
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="px-4 py-2 flex-1 overflow-y-auto custom-scrollbar pb-10 md:pb-6">
        {assignments.length === 0 ? (
          <Card className="border-none bg-slate-950/20 backdrop-blur-md p-16 text-center border-dashed border border-white/10 rounded-[2rem]">
            <div className="flex flex-col items-center gap-4">
              <BookOpen className="h-12 w-12 text-slate-700" />
              <p className="text-slate-500 font-medium">No assignments available at the moment.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {assignments.map((assignment) => (
              <Card key={assignment._id} className="group bg-slate-950/40 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all duration-500 overflow-hidden shadow-2xl rounded-[1.5rem] md:rounded-[2rem] flex flex-col">
                <CardContent className="p-6 md:p-8 flex-1 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      assignment.difficulty === 'beginner' ? 'bg-green-500/10 text-green-400' :
                      assignment.difficulty === 'intermediate' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {assignment.difficulty}
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shadow-lg border border-purple-500/20">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-white group-hover:text-purple-300 transition-colors uppercase tracking-tight leading-tight line-clamp-1">
                      {assignment.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-medium">
                      {assignment.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-600" />
                      <div className="space-y-0.5">
                        <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Deadline</p>
                        <p className="text-[10px] font-black text-slate-400">
                          {new Date(assignment.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-0.5">
                       <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Instructor</p>
                       <p className="text-[10px] font-black text-slate-400">@{assignment.createdBy?.name?.split(' ')[0] || "Admin"}</p>
                    </div>
                  </div>
                </CardContent>

                <div className="p-2 border-t border-white/5 bg-white/[0.02]">
                  <Button 
                    onClick={() => router.push(`/student/assignments/${assignment._id}`)}
                    className="w-full h-12 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-purple-600 group/btn cursor-pointer"
                  >
                    View Details <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
