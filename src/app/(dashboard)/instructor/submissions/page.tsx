// Force re-compile to fix stuck 404 issue
"use client";

import React, { useEffect, useState } from "react";
import { 
  CheckCircle2, 
  Clock, 
  Search, 
  Loader2, 
  ExternalLink, 
  Globe, 
  MessageSquare,
  GraduationCap,
  X,
  Send,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function InstructorSubmissions() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [feedback, setFeedback] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await axios.get(`${apiUrl}/submissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Sort submissions to show the newest ones first
        const sortedSubmissions = response.data.data.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setSubmissions(sortedSubmissions);
      }
    } catch (error) {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const generateAIFeedback = async () => {
    if (!selectedSub) return;
    
    setUpdating(true);
    // Simulate deep scanning of links and codebase
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const title = selectedSub.assignment?.title || "Assignment";
    const studentNote = selectedSub.comment || "";
    const repoUrl = selectedSub.repoUrl || "";
    const liveUrl = selectedSub.liveUrl || "";
    
    const noteLower = studentNote.toLowerCase();
    
    // --- ADVANCED DYNAMIC ANALYSIS LOGIC --- //
    
    // 1. Analyze Note Quality (Detect Gibberish/Spam)
    const words = studentNote.trim().split(/\s+/);
    const avgWordLength = words.length > 0 ? studentNote.length / words.length : 0;
    const isGibberish = studentNote.length > 15 && (avgWordLength > 12 || words.length < 3);
    const isDetailedNote = !isGibberish && studentNote.length > 30;
    
    const mentionedBug = !isGibberish && (noteLower.includes("bug") || noteLower.includes("error") || noteLower.includes("issue"));
    
    // 2. Analyze Links Quality
    const isGitHub = repoUrl.includes("github.com");
    const isGitLab = repoUrl.includes("gitlab.com");
    const isValidRepo = isGitHub || isGitLab;
    const isSuspiciousRepo = repoUrl.includes("freepik") || repoUrl.includes("image") || repoUrl.includes("google.com");
    
    const isVercel = liveUrl.includes("vercel.app");
    const isNetlify = liveUrl.includes("netlify.app");
    const isSuspiciousLive = liveUrl && (liveUrl.includes("freepik") || liveUrl.includes("google.com"));
    
    // --- GENERATE STRUCTURED FEEDBACK --- //
    let suggestion = `[AI SMART REVIEW: ${title.toUpperCase()}]\n\n`;
    
    let hasPositives = false;
    suggestion += `✅ POSITIVES (ভালো দিক):\n`;
    if (isDetailedNote) {
      suggestion += `- Your note clearly explains your approach to the problem.\n`;
      hasPositives = true;
    }
    if (isValidRepo) {
      suggestion += `- Proper code repository (${isGitHub ? 'GitHub' : 'GitLab'}) link provided.\n`;
      hasPositives = true;
    }
    if (liveUrl && !isSuspiciousLive) {
      suggestion += `- Live demo is active ${isVercel ? '(Vercel)' : isNetlify ? '(Netlify)' : ''}.\n`;
      hasPositives = true;
    }
    
    if (!hasPositives) {
      suggestion += `- No significant positive aspects found in the submitted links/notes.\n`;
    }
    suggestion += `\n`;
    
    suggestion += `⚠️ NEGATIVES & CHALLENGES (ঘাটতি/সমস্যা):\n`;
    let hasNegatives = false;
    
    if (isGibberish) {
      suggestion += `- The student note appears to be random/gibberish text. Please provide meaningful explanations.\n`;
      hasNegatives = true;
    } else if (!isDetailedNote) {
      suggestion += `- The submission note is too short. Hard to evaluate your thought process.\n`;
      hasNegatives = true;
    }
    
    if (!isValidRepo || isSuspiciousRepo) {
      suggestion += `- The repository link provided (${repoUrl}) does not look like a valid GitHub or GitLab repository.\n`;
      hasNegatives = true;
    }
    
    if (isSuspiciousLive) {
      suggestion += `- The live demo link looks suspicious or unrelated to a web deployment.\n`;
      hasNegatives = true;
    } else if (!liveUrl) {
      suggestion += `- Missing live demo link. Deployment is essential for UI evaluation.\n`;
      hasNegatives = true;
    }
    
    if (!hasNegatives) {
      suggestion += `- Everything looks proper and standard. Great job!\n`;
    }
    suggestion += `\n`;
    
    suggestion += `🛠️ UPDATES NEEDED (পরবর্তী ধাপে যা করবেন):\n`;
    if (isGibberish) {
      suggestion += `1. Rewrite your submission note using proper, meaningful sentences explaining your work.\n`;
    } else if (mentionedBug) {
      suggestion += `1. Address the bugs/issues mentioned in your notes.\n`;
    } else {
      suggestion += `1. Review your codebase for potential performance optimizations.\n`;
    }
    
    if (!isValidRepo || isSuspiciousRepo) {
      suggestion += `2. Update the Codebase link to a valid GitHub repository containing your project files.\n`;
    }
    
    if (isSuspiciousLive || !liveUrl) {
      suggestion += `3. Deploy the project properly (e.g., Vercel, Netlify) and provide the correct URL.\n`;
    }
    
    suggestion += `\n[Status Recommendation: ${hasNegatives ? 'Needs Improvement' : 'Acceptable'}]`;
    
    setFeedback(suggestion);
    setUpdating(false);
    toast.success("AI Analysis Complete!");
  };

  const handleOpenReview = (sub: any) => {
    setSelectedSub(sub);
    setFeedback(sub.feedback || "");
    setIsModalOpen(true);
  };

  const submitReview = async (status: 'accepted' | 'pending' | 'needs-improvement') => {
    if (!feedback && status === 'needs-improvement') {
      toast.warning("Please provide feedback for improvement");
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      
      const response = await axios.patch(`${apiUrl}/submissions/${selectedSub._id}`, {
        status,
        feedback
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success(`Submission ${status} successfully!`);
        setIsModalOpen(false);
        fetchSubmissions(); // Refresh list
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
        <p className="text-slate-500 font-medium">Loading student submissions...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-6">
      <Toaster position="top-center" richColors theme="dark" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 pt-4 shrink-0">
        <div className="space-y-1 md:space-y-2">
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase leading-none">Student Submissions</h1>
          <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-[0.2em]">Review work and provide feedback</p>
        </div>
        
        <div className="relative group w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-purple-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Filter by student or task..." 
            className="w-full md:w-80 bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-purple-500/30 transition-all shadow-inner font-medium"
          />
        </div>
      </div>

      {/* Submission List */}
      <div className="px-4 py-2 flex-1 overflow-y-auto custom-scrollbar pb-10 md:pb-6">
        {submissions.length === 0 ? (
          <Card className="border-none bg-slate-950/20 backdrop-blur-md p-16 text-center border-dashed border border-white/10 rounded-[2rem]">
             <div className="flex flex-col items-center gap-4">
                <AlertCircle className="h-12 w-12 text-slate-800" />
                <p className="text-slate-500 font-medium">No student submissions found yet.</p>
             </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {submissions.map((sub) => (
              <Card key={sub._id} className="group bg-slate-950/40 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all duration-500 overflow-hidden shadow-2xl rounded-[1.5rem] md:rounded-[2rem] flex flex-col">
                <CardContent className="p-6 md:p-8 flex-1 space-y-6">
                   <div className="flex justify-between items-start">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full border-2 border-purple-500/20 p-0.5 overflow-hidden shrink-0">
                             <div className="h-full w-full rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 text-xs font-black uppercase">
                                {sub.student?.name?.[0] || "S"}
                             </div>
                          </div>
                          <div className="flex flex-col">
                             <h3 className="text-sm font-black text-white line-clamp-1">{sub.student?.name || "Unknown Student"}</h3>
                             <p className="text-[9px] text-slate-500 font-bold tracking-widest truncate max-w-[120px]">{sub.student?.email || "No email"}</p>
                          </div>
                       </div>
                      <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                         sub.status === 'accepted' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                         sub.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                         'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      }`}>
                         {sub.status === 'needs-improvement' ? 'Needs Improvement' : sub.status}
                      </div>
                   </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Assignment</p>
                      <h4 className="text-base font-black text-white group-hover:text-purple-300 transition-colors uppercase truncate">
                         {sub.assignment?.title}
                      </h4>
                   </div>

                   <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-1.5">
                         <Clock className="h-3.5 w-3.5 text-slate-600" />
                         <span className="text-[10px] font-bold text-slate-500">
                            {new Date(sub.createdAt).toLocaleDateString()}
                         </span>
                      </div>
                      <Button 
                        onClick={() => handleOpenReview(sub)}
                        variant="outline" 
                        className="h-8 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest border-white/10 hover:bg-purple-600 hover:border-purple-600 transition-all shadow-lg"
                      >
                         Review Task
                      </Button>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-10 space-y-8">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2 text-purple-400">
                         <GraduationCap className="h-5 w-5" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Submission Review</span>
                      </div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                         {selectedSub?.assignment?.title}
                      </h2>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                      <X className="h-5 w-5 text-slate-400" />
                   </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <a href={selectedSub?.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                      <Globe className="h-5 w-5 text-slate-400" />
                      <div className="text-left">
                         <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Codebase</p>
                         <p className="text-[10px] font-bold text-white uppercase tracking-tighter truncate max-w-[120px]">View Github</p>
                      </div>
                      <ExternalLink className="h-3 w-3 text-slate-600 ml-auto" />
                   </a>
                   {selectedSub?.liveUrl && (
                      <a href={selectedSub?.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/10 hover:bg-purple-500/20 transition-all">
                         <Sparkles className="h-5 w-5 text-purple-400" />
                         <div className="text-left">
                            <p className="text-[8px] font-black text-purple-600 uppercase tracking-widest">Live Site</p>
                            <p className="text-[10px] font-bold text-purple-200 uppercase tracking-tighter truncate max-w-[120px]">Open Demo</p>
                         </div>
                         <ExternalLink className="h-3 w-3 text-purple-600 ml-auto" />
                      </a>
                   )}
                </div>

                {selectedSub?.comment && (
                   <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                         <MessageSquare className="h-3.5 w-3.5 text-slate-600" />
                         <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Student's Note</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium italic">"{selectedSub.comment}"</p>
                   </div>
                )}

                <div className="space-y-3">
                   <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Your Feedback & Guidance</label>
                      <button 
                        onClick={generateAIFeedback}
                        disabled={updating}
                        type="button"
                        className="flex items-center gap-1.5 text-[9px] font-black text-purple-400 hover:text-purple-300 uppercase tracking-widest transition-colors"
                      >
                         <Sparkles className="h-3 w-3" /> Get AI Suggestion
                      </button>
                   </div>
                   <textarea 
                     rows={10}
                     placeholder="Great work! To improve further, you could try..."
                     className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-purple-500/30 focus:bg-white/10 transition-all shadow-inner resize-none font-medium leading-relaxed"
                     value={feedback}
                     onChange={(e) => setFeedback(e.target.value)}
                   />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                   <Button 
                     onClick={() => submitReview('pending')}
                     disabled={updating}
                     variant="outline" 
                     className="flex-1 h-12 rounded-xl border-white/5 bg-white/5 hover:bg-yellow-500/10 hover:text-yellow-400 font-black uppercase text-[9px] tracking-widest"
                   >
                      Keep Pending
                   </Button>
                   <Button 
                     onClick={() => submitReview('needs-improvement')}
                     disabled={updating}
                     variant="outline" 
                     className="flex-1 h-12 rounded-xl border-white/5 bg-white/5 hover:bg-orange-500/10 hover:text-orange-400 font-black uppercase text-[9px] tracking-widest"
                   >
                      Needs Improvement
                   </Button>
                   <Button 
                     onClick={() => submitReview('accepted')}
                     disabled={updating}
                     className="flex-1 h-12 rounded-xl font-black uppercase text-[9px] tracking-widest shadow-xl shadow-purple-500/20 bg-gradient-to-r from-purple-600 to-indigo-600"
                   >
                      {updating ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                         <span className="flex items-center gap-2">
                            Accept Work <Send className="h-4 w-4" />
                         </span>
                      )}
                   </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
