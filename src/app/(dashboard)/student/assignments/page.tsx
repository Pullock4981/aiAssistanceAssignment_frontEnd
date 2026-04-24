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
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 md:space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 pt-2 md:pt-4 shrink-0">
        <div className="space-y-1 md:space-y-1.5 text-center md:text-left">
          <h1 className="text-xl md:text-3xl font-black tracking-tight text-white uppercase leading-none">All Assignments</h1>
          <p className="text-[9px] md:text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">Explore and complete your tasks</p>
        </div>
        
        <div className="relative group w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600 group-focus-within:text-purple-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search assignments..." 
            className="w-full md:w-72 bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[10px] text-white focus:outline-none focus:border-purple-500/30 transition-all shadow-inner font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            {assignments.filter(assignment => 
              assignment.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              assignment.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              assignment.difficulty?.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((assignment) => (
              <Card key={assignment._id} className="group bg-slate-950/40 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all duration-500 overflow-hidden shadow-2xl rounded-[1.5rem] md:rounded-[2rem] flex flex-col">
                <CardContent className="p-4 md:p-6 flex-1 space-y-4 md:space-y-5">
                  <div className="flex justify-between items-start">
                    <div className={`px-2 py-0.5 rounded-md text-[7px] md:text-[9px] font-black uppercase tracking-widest ${
                      assignment.difficulty === 'beginner' ? 'bg-green-500/10 text-green-400' :
                      assignment.difficulty === 'intermediate' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {assignment.difficulty}
                    </div>
                    <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                      <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm md:text-base font-black text-white group-hover:text-purple-300 transition-colors uppercase tracking-tight leading-tight line-clamp-1">
                      {assignment.title}
                    </h3>
                    <p className="text-[9px] md:text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
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

                <div className="p-2 border-t border-white/5 bg-white/[0.02] shrink-0">
                  <Button 
                    onClick={() => router.push(`/student/assignments/${assignment._id}`)}
                    className="w-full h-10 md:h-11 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all hover:bg-purple-600 group/btn cursor-pointer"
                  >
                    View Details <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
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
