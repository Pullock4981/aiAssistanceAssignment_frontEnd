"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FileText, 
  Calendar, 
  BarChart, 
  Layout, 
  Plus, 
  ArrowLeft,
  Loader2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { toast, Toaster } from "sonner";

export default function CreateAssignment() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    // Simulate AI refining the text
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const original = formData.description;
    const refined = `[Refined by AI]\n\nTask Overview:\n${original}\n\nDeliverables:\n1. Clean, documented code in a GitHub repository.\n2. A working live demonstration link.\n3. A summary of the approach used.\n\nKey Requirements:\n- Adherence to best practices.\n- Efficient solution to the core problem.`;
    
    setFormData({ ...formData, description: refined });
    setLoading(false);
    toast.success("Assignment instructions refined for clarity!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not authenticated. Please login again.");
        router.push("/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      console.log("Using API URL:", apiUrl);
      
      const response = await axios.post(`${apiUrl}/assignments`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("API Response:", response.data);

      if (response.data.status === "success" || response.data.success) {
        toast.success("Assignment created successfully!");
        // Small delay to let user see the success message
        setTimeout(() => {
          router.push("/instructor/assignments");
          router.refresh();
        }, 1500);
      }
    } catch (error: any) {
      console.error("Submission Error:", error);
      const errorMessage = error.response?.data?.message || "Failed to create assignment. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 pb-4 overflow-y-auto custom-scrollbar pr-1">
      <Toaster position="top-center" richColors theme="dark" />
      
      {/* Header Area */}
      <div className="flex items-center justify-between px-2 pt-2">
        <div className="flex items-center gap-3 md:gap-4">
           <button 
             onClick={() => router.back()}
             className="h-8 w-8 md:h-9 md:w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
           >
             <ArrowLeft className="h-4 w-4 text-slate-400" />
           </button>
           <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white leading-none">Create Assignment</h1>
              <p className="text-[9px] md:text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1">Post a new challenge</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 flex-1">
        {/* Form Section */}
        <Card className="lg:col-span-2 bg-slate-950/40 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl rounded-3xl">
          <CardContent className="p-4 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Assignment Title</label>
                <div className="relative group">
                  <Layout className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-purple-500 transition-colors" />
                  <input 
                    type="text"
                    required
                    placeholder="Enter title..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 md:pl-14 pr-6 text-sm text-white focus:outline-none focus:border-purple-500/30 focus:bg-white/10 transition-all shadow-inner font-bold"
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
                  <FileText className="absolute left-4 md:left-5 top-5 h-5 w-5 text-slate-600 group-focus-within:text-purple-500 transition-colors" />
                  <textarea 
                    required
                    rows={4}
                    placeholder="Provide detailed instructions..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-4 md:py-5 pl-12 md:pl-14 pr-6 text-sm text-white focus:outline-none focus:border-purple-500/30 focus:bg-white/10 transition-all shadow-inner resize-none font-medium leading-relaxed"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                 <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Deadline</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-purple-500 transition-colors" />
                      <input 
                        type="date"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 md:pl-14 pr-6 text-sm text-white focus:outline-none focus:border-purple-500/30 focus:bg-white/10 transition-all shadow-inner [color-scheme:dark] font-bold"
                        value={formData.deadline}
                        onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                      />
                    </div>
                 </div>

                 <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Difficulty Level</label>
                    <div className="relative group">
                      <BarChart className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-purple-500 transition-colors" />
                      <select 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 md:pl-14 pr-6 text-sm text-white focus:outline-none focus:border-purple-500/30 focus:bg-white/10 transition-all shadow-inner appearance-none cursor-pointer font-bold"
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

              <div className="pt-2 md:pt-4">
                 <Button 
                   type="submit" 
                   disabled={loading}
                   className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl font-black tracking-widest uppercase text-[10px] md:text-xs shadow-2xl"
                 >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                      <span className="flex items-center gap-2">
                        Publish Assignment <Plus className="h-4 w-4" />
                      </span>
                    )}
                 </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info/Preview Section */}
        <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-600/20 to-indigo-900/20 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl">
                <div className="flex h-12 w-12 rounded-2xl bg-white/10 items-center justify-center mb-6">
                    <Sparkles className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-black text-white mb-2">Pro Tips</h3>
                <ul className="space-y-4 text-[11px] text-slate-400 font-medium">
                    <li className="flex gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1 shrink-0" />
                        Clearly define the learning objectives to help students focus.
                    </li>
                    <li className="flex gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1 shrink-0" />
                        Break down complex requirements into manageable steps.
                    </li>
                    <li className="flex gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1 shrink-0" />
                        Use labels like 'Beginner' for foundational tasks.
                    </li>
                </ul>
            </Card>

            <Card className="bg-slate-950/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 text-center">Student View Preview</p>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 relative overflow-hidden group transition-all hover:bg-white/[0.07]">
                    <div className="flex justify-between items-start">
                        <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-purple-400" />
                        </div>
                        <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter ${
                            formData.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                            formData.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                        }`}>
                            {formData.difficulty || 'Beginner'}
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <h4 className="text-sm font-black text-white truncate">
                            {formData.title || "Untitled Assignment"}
                        </h4>
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                            {formData.description || "The instructions you write will appear here for your students..."}
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-slate-600" />
                            <span className="text-[9px] font-bold text-slate-500">
                                {formData.deadline ? new Date(formData.deadline).toLocaleDateString() : "No date set"}
                            </span>
                        </div>
                        <div className="h-6 px-3 rounded-md bg-purple-600/50 text-[9px] font-bold text-white flex items-center shadow-lg">
                            Open Task
                        </div>
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
