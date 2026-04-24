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

  const [existingSubmission, setExistingSubmission] = useState<any>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");

  const getAIHelp = async () => {
    if (!assignment?.description) return;
    setIsExplaining(true);
    
    // Simulate deep AI parsing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const desc = assignment.description;
    const descLower = desc.toLowerCase();
    const title = assignment.title || "this task";
    
    // 1. URL Analysis
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = desc.match(urlRegex) || [];
    
    let explanation = `**Task Overview:**\nYour primary goal for "${title}" is to follow the instructor's guidelines carefully. `;
    
    // Check if the instructor just gave a brief instruction with a link
    if (desc.length < 100 && urls.length > 0) {
       explanation += `The instructions are brief, which means the main requirements are likely inside the provided link(s). `;
    } else {
       explanation += `Based on the detailed description, you need to break down the problem step-by-step. `;
    }
    
    explanation += `\n\n`;
    
    // 2. Extracted Links Guidance
    if (urls.length > 0) {
      explanation += `**Reference Links Found:**\n`;
      urls.forEach((url: string, index: number) => {
        if (url.includes("github.com")) {
          explanation += `${index + 1}. The instructor provided a **GitHub Repository** (${url}). You should clone or review this codebase as it contains essential starter code or examples.\n`;
        } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
          explanation += `${index + 1}. There is a **Video Tutorial** (${url}). Watch it completely before writing your code.\n`;
        } else {
          explanation += `${index + 1}. External Resource: (${url}). Make sure to read the documentation or problem statement here.\n`;
        }
      });
      explanation += `\n`;
    }
    
    // 3. Keyword Analysis
    explanation += `**Actionable Tips:**\n`;
    let addedTip = false;
    
    if (descLower.includes("solve") || descLower.includes("problem") || descLower.includes("algorithm")) {
      explanation += `- This looks like a problem-solving task. Focus on optimizing your logic and handling edge cases.\n`;
      addedTip = true;
    }
    if (descLower.includes("design") || descLower.includes("ui") || descLower.includes("frontend")) {
      explanation += `- Pay attention to the UI/UX design. Make sure it's responsive and matches the requirements.\n`;
      addedTip = true;
    }
    if (descLower.includes("api") || descLower.includes("backend") || descLower.includes("database")) {
      explanation += `- Ensure your backend routes are secure and database queries are optimized.\n`;
      addedTip = true;
    }
    
    if (!addedTip) {
      explanation += `- Make sure to initialize a Git repository and push your final code.\n`;
      explanation += `- Verify that your code is clean and well-commented before submission.\n`;
    }
    
    explanation += `\n*Remember:* If you face any critical bugs, mention them in the submission comments so the instructor knows you tried!`;
    
    setAiExplanation(explanation);
    setIsExplaining(false);
    toast.success("AI has dynamically analyzed the task!");
  };

  const renderDescriptionWithLinks = (text: string) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline underline-offset-4 break-all">
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        
        // 1. Fetch Assignment Details
        const assignRes = await axios.get(`${apiUrl}/assignments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (assignRes.data.success) {
          setAssignment(assignRes.data.data);
        }

        // 2. Fetch My Submissions to check if already submitted
        const subRes = await axios.get(`${apiUrl}/submissions/my-submissions`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (subRes.data.success) {
          const previous = subRes.data.data.find((sub: any) => sub.assignment?._id === id || sub.assignment === id);
          if (previous) {
            setExistingSubmission(previous);
            setSubmission({
              repoUrl: previous.repoUrl || "",
              liveUrl: previous.liveUrl || "",
              comment: previous.comment || ""
            });
          }
        }
      } catch (error) {
        toast.error("Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
               <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-purple-400" />
                     </div>
                     <h3 className="text-sm md:text-lg font-black text-white uppercase tracking-widest">Task Instructions</h3>
                  </div>
                  <button 
                     onClick={getAIHelp}
                     disabled={isExplaining}
                     className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black text-purple-400 hover:text-purple-300 uppercase tracking-widest bg-purple-500/10 hover:bg-purple-500/20 px-3 py-2 rounded-xl transition-all active:scale-95"
                  >
                     {isExplaining ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />} 
                     AI Assistant Help
                  </button>
               </div>
               
               {aiExplanation && (
                  <div className="bg-purple-900/20 border border-purple-500/30 p-5 rounded-2xl space-y-2 mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                     <h4 className="text-[10px] md:text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5" /> AI Explanation & Tips
                     </h4>
                     <p className="text-xs md:text-sm text-purple-200/80 font-medium leading-relaxed whitespace-pre-wrap">
                        {aiExplanation}
                     </p>
                  </div>
               )}
               
               <div className="prose prose-invert max-w-none">
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                     {assignment?.description ? renderDescriptionWithLinks(assignment.description) : null}
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
                  <h3 className="text-sm md:text-lg font-black text-white uppercase tracking-widest">
                    {existingSubmission ? "Your Submission" : "Submit Your Work"}
                  </h3>
                  <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest">
                    {existingSubmission 
                      ? `Current Status: ${existingSubmission.status.replace('-', ' ')}` 
                      : "Enter your project details below"}
                  </p>
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
                     {existingSubmission?.status === 'accepted' ? (
                       <div className="w-full bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-2xl text-center font-black uppercase tracking-widest text-xs">
                          Your work has been accepted. No further changes needed.
                       </div>
                     ) : (
                       <Button 
                          type="submit"
                          disabled={submitting}
                          className={`w-full h-14 md:h-16 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.2em] shadow-2xl transition-all active:scale-[0.98] group border-0 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-70
                            ${existingSubmission 
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-purple-500/20' 
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/20'
                            }`}
                       >
                          {submitting ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                             <span className="flex items-center gap-3">
                                {existingSubmission ? "Update Submission" : "Finalize Submission"} <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                             </span>
                          )}
                       </Button>
                     )}
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
