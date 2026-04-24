"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Search, 
  Calendar, 
  Users, 
  Edit2, 
  Trash2, 
  Eye,
  Loader2,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import axios from "axios";
import { toast, Toaster } from "sonner";
import Swal from "sweetalert2";

export default function InstructorAssignments() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!storedUser || !token) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    const fetchAssignments = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await axios.get(`${apiUrl}/assignments`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const myAssignments = response.data.data.filter(
            (a: any) => a.createdBy?._id === userData._id || a.createdBy === userData._id
          );
          setAssignments(myAssignments);
        }
      } catch (error: any) {
        toast.error("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [router]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      background: '#0f172a',
      color: '#f1f5f9',
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#1e293b',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        popup: 'rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl',
        title: 'text-xl font-black tracking-tight',
        htmlContainer: 'text-xs text-slate-500 font-medium',
        confirmButton: 'rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest',
        cancelButton: 'rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest'
      }
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        await axios.delete(`${apiUrl}/assignments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Your assignment has been removed.',
          icon: 'success',
          background: '#0f172a',
          color: '#f1f5f9',
          confirmButtonColor: '#7c3aed',
          customClass: {
            popup: 'rounded-3xl border border-white/5 shadow-2xl',
            confirmButton: 'rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest'
          }
        });

        setAssignments(assignments.filter(a => a._id !== id));
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete assignment");
      }
    }
  };

  if (!mounted || loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
        <p className="text-slate-500 font-medium">Fetching your assignments...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 md:space-y-6">
      <Toaster position="top-center" richColors theme="dark" />
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 px-4 pt-2 md:pt-4 shrink-0">
        <div className="space-y-1 md:space-y-2 text-center md:text-left">
          <h1 className="text-xl md:text-4xl font-black tracking-tight text-white uppercase leading-none">My Assignments</h1>
          <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-[0.2em]">Manage your active tasks</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-purple-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-xs text-white focus:outline-none focus:border-purple-500/30 w-64 transition-all shadow-inner"
            />
          </div>
          
          <Link href="/instructor/assignments/create" className="w-full sm:w-auto">
            <Button className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl px-8 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-2xl group transition-all active:scale-95">
               <Plus className="mr-2 h-4 w-4 md:h-5 md:w-5 group-hover:rotate-90 transition-transform" /> Create New
            </Button>
          </Link>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="px-4 py-2 flex-1 overflow-y-auto custom-scrollbar pb-10 md:pb-6">
        {assignments.length === 0 ? (
          <Card className="border-none bg-slate-950/20 backdrop-blur-md p-10 md:p-16 text-center border-dashed border border-white/10 rounded-[1.5rem] md:rounded-[2rem]">
            <div className="flex flex-col items-center gap-4">
              <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl md:rounded-3xl bg-purple-500/10 flex items-center justify-center">
                <FileText className="h-6 w-6 md:h-8 md:w-8 text-purple-500/40" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg md:text-xl font-black text-slate-300">No Assignments Yet</h3>
                <p className="text-[10px] md:text-xs text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
                  You haven't created any assignments yet. Start your journey by creating one.
                </p>
              </div>
              <Link href="/instructor/assignments/create" className="mt-2">
                 <Button variant="outline" className="h-10 border-white/10 hover:bg-white/5 text-slate-400 font-black text-[9px] md:text-[10px] uppercase tracking-widest rounded-xl md:rounded-2xl px-6">
                    Create First Assignment
                 </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {assignments.map((assignment) => (
              <Card key={assignment._id} className="group bg-slate-950/40 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all duration-500 overflow-hidden shadow-2xl rounded-2xl md:rounded-[2rem]">
                <CardContent className="p-0">
                  <div className="p-5 md:p-8 space-y-4 md:space-y-5">
                    <div className="flex justify-between items-start">
                      <div className={`px-2 py-0.5 md:px-3 md:py-1 rounded-md md:rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] ${
                        assignment.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400 border border-green-500/10' :
                        assignment.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/10' :
                        'bg-red-500/20 text-red-400 border border-red-500/10'
                      }`}>
                        {assignment.difficulty}
                      </div>
                      <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-purple-400 transition-colors border border-white/5 shadow-inner">
                        <FileText className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                      <h3 className="text-base md:text-xl font-black text-white group-hover:text-purple-300 transition-colors line-clamp-1 uppercase tracking-tight">
                        {assignment.title}
                      </h3>
                      <p className="text-[10px] md:text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                        {assignment.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-purple-500/50" />
                        <div className="space-y-0.5">
                           <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Deadline</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase">
                             {new Date(assignment.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                           </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <Users className="h-3.5 w-3.5 text-slate-600" />
                        <div className="space-y-0.5 text-right">
                           <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Submissions</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase">0/0</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border-t border-white/5 p-4 flex items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all border border-transparent hover:border-white/10" 
                        onClick={() => router.push(`/instructor/assignments/edit/${assignment._id}`)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all border border-transparent hover:border-red-500/10" 
                        onClick={() => handleDelete(assignment._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button variant="outline" className="h-9 px-4 text-[9px] font-black uppercase tracking-widest border-white/10 hover:bg-purple-600 hover:border-purple-600 transition-all rounded-xl shadow-lg">
                      Review <Eye className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
