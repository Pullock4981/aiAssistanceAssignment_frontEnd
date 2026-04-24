"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Loader2, 
  Send,
  Sparkles,
  Link as LinkIcon,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import axios from "axios";

export default function StudentAssignmentDetails() {
  const router = useRouter();
  const { id } = useParams();
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState({
    repoUrl: "",
    liveUrl: "",
    comment: ""
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await axios.get(`${apiUrl}/assignments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setAssignment(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting to submit:", submission);
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      
      console.log("Submitting to:", `${apiUrl}/submissions`);
      const response = await axios.post(`${apiUrl}/submissions`, {
        assignment: id,
        repoUrl: submission.repoUrl,
        liveUrl: submission.liveUrl,
        comment: submission.comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success("Assignment submitted successfully!");
        setTimeout(() => router.push("/student/submissions"), 1500);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
        <p className="text-slate-500 font-medium">Preparing your workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 md:space-y-6 overflow-y-auto custom-scrollbar pr-1 pb-10">
      <Toaster position="top-center" richColors theme="dark" />
      
      {/* Header */}
      <div className="flex items-center gap-4 md:gap-6 px-2 pt-2 shrink-0">
        <button 
          onClick={() => router.back()}
          className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg"
        >
          <ArrowLeft className="h-5 w-5 text-slate-400" />
        </button>
        <div>
          <h1 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight leading-none">
            {assignment?.title}
          </h1>
          <div className="flex items-center gap-3 mt-1.5 md:mt-2">
             <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
                <Calendar className="h-3.5 w-3.5" /> Due: {new Date(assignment?.deadline).toLocaleDateString()}
             </div>
             <div className="h-1 w-1 rounded-full bg-slate-700" />
             <div className="text-[10px] md:text-xs font-bold text-purple-400 uppercase tracking-widest">
                By {assignment?.createdBy?.name}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
         {/* Instructions Card */}
         <Card className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl h-fit">
            <div className="p-6 md:p-10 space-y-6">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                     <FileText className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="text-sm md:text-lg font-black text-white uppercase tracking-widest">Task Instructions</h3>
               </div>
               
               <div className="prose prose-invert max-w-none">
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                     {assignment?.description}
                  </p>
               </div>

               <div className="bg-indigo-900/10 border border-white/5 p-5 md:p-6 rounded-2xl space-y-3">
                  <h4 className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                     <Sparkles className="h-3.5 w-3.5 text-purple-500" /> Requirements
                  </h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                     Make sure to include your GitHub repository link and a live demo link (if applicable). Your submission will be reviewed based on the instructions provided above.
                  </p>
               </div>
            </div>
         </Card>

         {/* Submission Form Card */}
         <Card className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden h-fit">
            <CardContent className="p-6 md:p-10 space-y-8">
               <div className="space-y-1">
                  <h3 className="text-sm md:text-lg font-black text-white uppercase tracking-widest">Submit Your Work</h3>
                  <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest">Enter your project details below</p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">GitHub Repository URL</label>
                     <div className="relative group">
                        <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-purple-500 transition-colors" />
                        <input 
                           type="url"
                           required
                           placeholder="https://github.com/your-username/repo"
                           className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 md:py-5 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-purple-500/30 focus:bg-white/10 transition-all shadow-inner font-medium"
                           value={submission.repoUrl}
                           onChange={(e) => setSubmission({...submission, repoUrl: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Live Demo URL (Optional)</label>
                     <div className="relative group">
                        <Sparkles className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-purple-500 transition-colors" />
                        <input 
                           type="url"
                           placeholder="https://your-project.vercel.app"
                           className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 md:py-5 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-purple-500/30 focus:bg-white/10 transition-all shadow-inner font-medium"
                           value={submission.liveUrl}
                           onChange={(e) => setSubmission({...submission, liveUrl: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Comments for Instructor</label>
                     <div className="relative group">
                        <MessageSquare className="absolute left-5 top-6 h-5 w-5 text-slate-600 group-focus-within:text-purple-500 transition-colors" />
                        <textarea 
                           rows={4}
                           placeholder="Any notes or special instructions..."
                           className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 md:py-5 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-purple-500/30 focus:bg-white/10 transition-all shadow-inner resize-none font-medium leading-relaxed"
                           value={submission.comment}
                           onChange={(e) => setSubmission({...submission, comment: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="pt-4">
                     <Button 
                        type="submit"
                        disabled={submitting}
                        className="w-full h-14 md:h-16 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.2em] shadow-2xl transition-all active:scale-[0.98] group"
                     >
                        {submitting ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                           <span className="flex items-center gap-3">
                              Finalize Submission <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                           </span>
                        )}
                     </Button>
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
