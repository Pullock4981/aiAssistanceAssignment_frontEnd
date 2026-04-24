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
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-6">
      <Toaster position="top-center" richColors theme="dark" />
      
      {/* Header */}
      <div className="px-4 pt-4 shrink-0">
        <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase leading-none">My Submissions</h1>
        <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">Check the status of your work</p>
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
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <h3 className="text-lg md:text-xl font-black text-white group-hover:text-purple-300 transition-colors uppercase truncate max-w-[200px] md:max-w-md">
                          {sub.assignment?.title}
                       </h3>
                       <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-slate-600" />
                          <span className="text-[10px] font-bold text-slate-500">Submitted on {new Date(sub.createdAt).toLocaleDateString()}</span>
                       </div>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                      sub.status === 'accepted' ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]' :
                      sub.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]' :
                      'bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                    }`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${sub.status === 'accepted' ? 'bg-green-400' : sub.status === 'pending' ? 'bg-yellow-400 animate-pulse' : 'bg-orange-400'}`} />
                      {sub.status === 'needs-improvement' ? 'Needs Improvement' : sub.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <a href={sub.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group/link">
                        <Globe className="h-4 w-4 text-slate-400 group-hover/link:text-white" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/link:text-white">Repo Link</span>
                     </a>
                     {sub.liveUrl && (
                        <a href={sub.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 hover:bg-purple-600/20 transition-all group/link">
                           <ExternalLink className="h-4 w-4 text-purple-400" />
                           <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Live Demo</span>
                        </a>
                     )}
                  </div>

                  {sub.comment && (
                    <div className="bg-white/5 p-4 rounded-xl space-y-2 border border-white/5">
                       <div className="flex items-center gap-2">
                          <MessageCircle className="h-3.5 w-3.5 text-slate-600" />
                          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">My Comment</span>
                       </div>
                       <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic line-clamp-2">
                          "{sub.comment}"
                       </p>
                    </div>
                  )}

                  {sub.feedback && (
                    <div className={`p-4 rounded-xl space-y-3 border ${
                      sub.status === 'needs-improvement' ? 'bg-orange-500/5 border-orange-500/10' : 'bg-green-500/5 border-green-500/10'
                    }`}>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <CheckCircle2 className={`h-3.5 w-3.5 ${sub.status === 'needs-improvement' ? 'text-orange-500' : 'text-green-500'}`} />
                             <span className={`text-[9px] font-black uppercase tracking-widest ${sub.status === 'needs-improvement' ? 'text-orange-500' : 'text-green-500'}`}>Instructor Feedback</span>
                          </div>
                          {sub.status === 'needs-improvement' && (
                             <Button 
                               onClick={() => router.push(`/student/assignments/${sub.assignment?._id}`)}
                               className="h-7 px-3 bg-orange-600 hover:bg-orange-700 text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg"
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
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
