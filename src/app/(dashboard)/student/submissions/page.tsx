// Force re-compile to fix any stale route issues
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  Loader2, 
  ExternalLink,
  Globe,
  MessageCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import axios from "axios";

export default function StudentSubmissions() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await axios.get(`${apiUrl}/submissions/my-submissions`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setSubmissions(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [router]);

  if (!mounted || loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
        <p className="text-slate-500 font-medium">Tracking your progress...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 md:space-y-6">
      
      {/* Header */}
      <div className="px-4 pt-2 md:pt-4 shrink-0 text-center md:text-left">
        <h1 className="text-xl md:text-3xl font-black tracking-tight text-white uppercase leading-none">My Submissions</h1>
        <p className="text-[9px] md:text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mt-1.5">Check the status of your work</p>
      </div>

      {/* Content Grid */}
      <div className="px-4 py-2 flex-1 overflow-y-auto custom-scrollbar pb-10 md:pb-6">
        {submissions.length === 0 ? (
          <Card className="border-none bg-slate-950/20 backdrop-blur-md p-16 text-center border-dashed border border-white/10 rounded-[2rem]">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-3xl bg-white/5 flex items-center justify-center">
                 <CheckCircle2 className="h-8 w-8 text-slate-800" />
              </div>
              <p className="text-slate-500 font-medium">You haven't submitted any assignments yet.</p>
              <Button onClick={() => router.push("/student/assignments")} className="mt-2 h-10 rounded-xl px-6 font-bold uppercase text-[10px] tracking-widest">
                 Start a Challenge
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {submissions.map((sub) => (
              <Card key={sub._id} className="group bg-slate-950/40 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all duration-500 overflow-hidden shadow-2xl rounded-[1.5rem] md:rounded-[2rem]">
                <CardContent className="p-4 md:p-6 space-y-4 md:space-y-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="space-y-1 w-full sm:w-auto">
                       <h3 className="text-[14px] md:text-lg font-black text-white group-hover:text-purple-300 transition-colors uppercase truncate max-w-full sm:max-w-[180px] md:max-w-md">
                          {sub.assignment?.title}
                       </h3>
                       <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-slate-600" />
                          <span className="text-[9px] md:text-[10px] font-bold text-slate-500">Submitted on {new Date(sub.createdAt).toLocaleDateString()}</span>
                       </div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shrink-0 ${
                      sub.status === 'accepted' ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]' :
                      sub.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]' :
                      'bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                    }`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${sub.status === 'accepted' ? 'bg-green-400' : sub.status === 'pending' ? 'bg-yellow-400 animate-pulse' : 'bg-orange-400'}`} />
                      {sub.status === 'needs-improvement' ? 'Needs Improvement' : sub.status}
                    </div>
                  </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4 shrink-0">
                      <a href={sub.repoUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="outline" className="w-full h-10 md:h-11 rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-slate-400 font-black text-[9px] uppercase tracking-widest gap-2">
                          <Globe className="h-3.5 w-3.5" /> Repo Link
                        </Button>
                      </a>
                      {sub.liveUrl && (
                        <a href={sub.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button className="w-full h-10 md:h-11 rounded-xl font-black text-[9px] uppercase tracking-widest gap-2 shadow-xl shadow-purple-500/10">
                            <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                          </Button>
                        </a>
                      )}
                   </div>

                   {sub.comment && (
                      <div className="p-3 md:p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                        <div className="flex items-center gap-2 opacity-40">
                           <MessageCircle className="h-3 w-3" />
                           <span className="text-[8px] font-black uppercase tracking-widest">My Comment</span>
                        </div>
                        <p className="text-[10px] md:text-xs text-slate-400 italic font-medium line-clamp-2">"{sub.comment}"</p>
                      </div>
                   )}

                  {sub.feedback && (
                    <div className={`p-4 rounded-xl space-y-3 border ${
                      sub.status === 'needs-improvement' ? 'bg-orange-500/5 border-orange-500/10' : 'bg-green-500/5 border-green-500/10'
                    }`}>
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                             <CheckCircle2 className={`h-3.5 w-3.5 ${sub.status === 'needs-improvement' ? 'text-orange-500' : 'text-green-500'}`} />
                             <span className={`text-[9px] font-black uppercase tracking-widest ${sub.status === 'needs-improvement' ? 'text-orange-500' : 'text-green-500'}`}>Instructor Feedback</span>
                          </div>
                          {sub.status === 'needs-improvement' && (
                             <Button 
                                onClick={() => router.push(`/student/assignments/${sub.assignment?._id}`)}
                                className="h-7 w-full sm:w-auto px-3 bg-orange-600 hover:bg-orange-700 text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg"
                             >
                                Fix & Re-submit
                             </Button>
                          )}
                       </div>
                       <p className={`text-[11px] font-medium leading-relaxed ${sub.status === 'needs-improvement' ? 'text-orange-400/70' : 'text-green-400/70'}`}>
                          {sub.feedback}
                       </p>
                    </div>
                  )}
                </CardContent>
                <div className="p-2 border-t border-white/5 bg-white/[0.02]">
                  <Button 
                    onClick={() => router.push(`/student/assignments/${sub.assignment?._id}`)}
                    className="w-full h-12 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-purple-600 group/btn cursor-pointer"
                  >
                    View Submission <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
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
