"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FileText, 
  Calendar, 
  BarChart, 
  Layout, 
  Save, 
  ArrowLeft,
  Loader2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { toast, Toaster } from "sonner";

export default function EditAssignment() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.id;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    difficulty: "beginner"
  });

  const refineDescription = async () => {
    if (!formData.description) {
      toast.warning("Please enter some description first");
      return;
    }
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const original = formData.description;
    const refined = `[Refined by AI]\n\nTask Overview:\n${original}\n\nDeliverables:\n1. Clean, documented code in a GitHub repository.\n2. A working live demonstration link.\n3. A summary of the approach used.\n\nKey Requirements:\n- Adherence to best practices.\n- Efficient solution to the core problem.`;
    
    setFormData({ ...formData, description: refined });
    setLoading(false);
    toast.success("Assignment instructions refined for clarity!");
  };

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await axios.get(`${apiUrl}/assignments/${assignmentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const data = response.data.data;
          setFormData({
            title: data.title,
            description: data.description,
            deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : "",
            difficulty: data.difficulty
          });
        }
      } catch (error: any) {
        toast.error("Failed to load assignment data");
        router.push("/instructor/assignments");
      } finally {
        setFetching(false);
      }
    };

    if (assignmentId) fetchAssignment();
  }, [assignmentId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      
      const response = await axios.patch(`${apiUrl}/assignments/${assignmentId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success("Assignment updated successfully!");
        setTimeout(() => router.push("/instructor/assignments"), 1500);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update assignment");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
        <p className="text-slate-500 font-medium">Loading Assignment Data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6 pb-6 overflow-y-auto custom-scrollbar pr-1">
      
      {/* Header Area */}
      <div className="flex items-center justify-between px-4 pt-2 md:pt-4">
        <div className="flex items-center gap-3 md:gap-6">
           <button 
             onClick={() => router.back()}
             className="h-9 w-9 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg"
           >
             <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 text-slate-400" />
           </button>
           <div>
              <h1 className="text-xl md:text-4xl font-black tracking-tight text-white uppercase leading-none">Edit Assignment</h1>
              <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 md:mt-2">Update your existing task</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-10 flex-1 px-4 pb-10 md:pb-0">
        {/* Form Section */}
        <Card className="lg:col-span-2 bg-slate-950/40 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl rounded-2xl md:rounded-[2.5rem]">
          <CardContent className="p-5 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-10">
              <div className="space-y-2 md:space-y-3">
                <label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Assignment Title</label>
                <div className="relative group">
                  <Layout className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-slate-600 group-focus-within:text-purple-500 transition-colors" />
                  <input 
                    type="text"
                    required
                    placeholder="Enter title..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-3xl py-3 md:py-6 pl-12 md:pl-16 pr-6 md:pr-8 text-sm md:text-lg text-white focus:outline-none focus:border-purple-500/30 focus:bg-white/10 transition-all shadow-inner font-bold"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <div className="flex items-center justify-between ml-1">
                   <label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">Instructions & Details</label>
                   <button 
                     type="button"
                     onClick={refineDescription}
                     disabled={loading}
                     className="flex items-center gap-1.5 text-[9px] font-black text-purple-400 hover:text-purple-300 uppercase tracking-widest transition-colors"
                   >
                      <Sparkles className="h-3 w-3" /> Smart Refine
                   </button>
                </div>
                <div className="relative group">
                  <FileText className="absolute left-4 md:left-6 top-5 md:top-8 h-5 w-5 md:h-6 md:w-6 text-slate-600 group-focus-within:text-purple-500 transition-colors" />
                  <textarea 
                    required
                    rows={4}
                    placeholder="Provide detailed instructions..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-3xl py-4 md:py-8 pl-12 md:pl-16 pr-6 md:pr-8 text-sm md:text-lg text-white focus:outline-none focus:border-purple-500/30 focus:bg-white/10 transition-all shadow-inner resize-none font-medium leading-relaxed"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
                 <div className="space-y-2 md:space-y-3">
                    <label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Deadline</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-slate-600 group-focus-within:text-purple-500 transition-colors" />
                      <input 
                        type="date"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-3xl py-3 md:py-6 pl-12 md:pl-16 pr-6 md:pr-8 text-sm md:text-lg text-white focus:outline-none focus:border-purple-500/30 focus:bg-white/10 transition-all shadow-inner [color-scheme:dark] font-bold"
                        value={formData.deadline}
                        onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                      />
                    </div>
                 </div>

                 <div className="space-y-2 md:space-y-3">
                    <label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Difficulty Level</label>
                    <div className="relative group">
                      <BarChart className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-slate-600 group-focus-within:text-purple-500 transition-colors" />
                      <select 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-3xl py-3 md:py-6 pl-12 md:pl-16 pr-6 md:pr-8 text-sm md:text-lg text-white focus:outline-none focus:border-purple-500/30 focus:bg-white/10 transition-all shadow-inner appearance-none cursor-pointer font-bold"
                        value={formData.difficulty}
                        onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                      >
                        <option value="beginner" className="bg-slate-900">Beginner</option>
                        <option value="intermediate" className="bg-slate-900">Intermediate</option>
                        <option value="advanced" className="bg-slate-900">Advanced</option>
                      </select>
                    </div>
                 </div>
              </div>

              <div className="pt-2 md:pt-6">
                 <Button 
                   type="submit" 
                   disabled={loading}
                   className="w-full h-12 md:h-20 rounded-xl md:rounded-3xl font-black tracking-widest uppercase text-xs md:text-base shadow-2xl transition-all active:scale-[0.98]"
                 >
                    {loading ? <Loader2 className="h-5 w-5 md:h-8 md:w-8 animate-spin" /> : (
                      <span className="flex items-center gap-2 md:gap-4">
                        Update Changes <Save className="h-4 w-4 md:h-6 md:w-6" />
                      </span>
                    )}
                 </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Live Preview Section */}
        <div className="space-y-4 md:space-y-8">
            <Card className="bg-slate-950/40 backdrop-blur-md border border-white/10 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-xl">
                <p className="text-[9px] md:text-[11px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 md:mb-6 text-center">Live Changes Preview</p>
                <div className="p-4 md:p-6 rounded-xl md:rounded-[2rem] bg-white/5 border border-white/10 space-y-4 md:space-y-5 relative overflow-hidden group transition-all hover:bg-white/[0.07]">
                    <div className="flex justify-between items-start">
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
                        </div>
                        <div className={`px-2 py-0.5 md:px-3 md:py-1 rounded-md md:rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-tighter ${
                            formData.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                            formData.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                        }`}>
                            {formData.difficulty || 'Beginner'}
                        </div>
                    </div>
                    
                    <div className="space-y-1 md:space-y-2">
                        <h4 className="text-base md:text-lg font-black text-white truncate">
                            {formData.title || "Untitled Assignment"}
                        </h4>
                        <p className="text-[10px] md:text-xs text-slate-500 line-clamp-3 leading-relaxed">
                            {formData.description || "Instructions preview..."}
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-slate-600" />
                            <span className="text-[10px] md:text-[11px] font-bold text-slate-500">
                                {formData.deadline ? new Date(formData.deadline).toLocaleDateString() : "No date set"}
                            </span>
                        </div>
                        <div className="h-7 md:h-8 px-3 md:px-4 rounded-lg md:rounded-xl bg-purple-600/50 text-[8px] md:text-[10px] font-black text-white flex items-center shadow-lg uppercase tracking-widest">
                            Updated
                        </div>
                    </div>
                </div>
            </Card>
            
            <Card className="bg-indigo-900/10 backdrop-blur-md p-5 md:p-8 border border-white/10 rounded-2xl md:rounded-[2.5rem]">
                <h4 className="text-[10px] md:text-sm font-black text-white mb-2 md:mb-3 uppercase tracking-widest flex items-center gap-2 md:gap-3">
                   <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-purple-500 animate-pulse" />
                   Instructor Note
                </h4>
                <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed font-medium">
                  Updating this assignment will immediately notify any students who have already started their submission. Please double-check the deadline and instructions.
                </p>
            </Card>
        </div>
      </div>
    </div>
  );
}
