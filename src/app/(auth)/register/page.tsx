"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, ArrowLeft, Mail, Lock, User, Sparkles, Loader2, UserCircle2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast, Toaster } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "student"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRole = (role: string) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      const response = await axios.post(`${apiUrl}/auth/register`, payload);
      
      if (response.data.success) {
        toast.success("Account created successfully!");
        // Save token if needed, or redirect to login
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <Toaster position="top-center" richColors theme="dark" />
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-indigo-600/10 blur-[120px] -z-0 pointer-events-none" />
      
      <Link href="/" className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group z-20">
         <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
         <span className="text-sm font-medium">Back</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[500px] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl my-10"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-purple-500/10">
            <GraduationCap className="h-6 w-6 md:h-8 md:w-8 text-purple-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Create Account</h1>
          <p className="text-slate-400 text-[13px] md:text-sm px-4">Join EduFlow and start managing assignments with precision</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
             <button 
               type="button"
               onClick={() => setRole("student")}
               className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                 formData.role === 'student' 
                 ? 'bg-purple-600/20 border-purple-500/50 text-purple-400' 
                 : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'
               }`}
             >
                <UserCircle2 className="h-6 w-6 mb-2" />
                <span className="text-xs font-bold uppercase tracking-widest">Student</span>
             </button>
             <button 
               type="button"
               onClick={() => setRole("instructor")}
               className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                 formData.role === 'instructor' 
                 ? 'bg-purple-600/20 border-purple-500/50 text-purple-400' 
                 : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'
               }`}
             >
                <Briefcase className="h-6 w-6 mb-2" />
                <span className="text-xs font-bold uppercase tracking-widest">Instructor</span>
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">First Name</label>
                <div className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                   <Input 
                     required
                     name="firstName"
                     value={formData.firstName}
                     onChange={handleChange}
                     placeholder="John" 
                     className="bg-black/20 border-white/5 h-12 pl-12 rounded-xl focus-visible:ring-purple-500/50 transition-all focus:bg-black/40 text-white"
                   />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Last Name</label>
                <div className="relative">
                   <Input 
                     required
                     name="lastName"
                     value={formData.lastName}
                     onChange={handleChange}
                     placeholder="Doe" 
                     className="bg-black/20 border-white/5 h-12 px-5 rounded-xl focus-visible:ring-purple-500/50 transition-all focus:bg-black/40 text-white"
                   />
                </div>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
            <div className="relative">
               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-600" />
               <Input 
                 required
                 name="email"
                 type="email" 
                 value={formData.email}
                 onChange={handleChange}
                 placeholder="name@example.com" 
                 className="bg-black/20 border-white/5 h-12 pl-12 rounded-xl focus-visible:ring-purple-500/50 transition-all focus:bg-black/40 text-white"
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
            <div className="relative">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-600" />
               <Input 
                 required
                 name="password"
                 type="password" 
                 value={formData.password}
                 onChange={handleChange}
                 placeholder="••••••••" 
                 className="bg-black/20 border-white/5 h-12 pl-12 rounded-xl focus-visible:ring-purple-500/50 transition-all focus:bg-black/40 text-white"
               />
            </div>
            <p className="text-[9px] text-slate-500 ml-1 leading-relaxed">
               Min. 8 chars, incl. uppercase, lowercase, number & special char (@$!%*?&).
            </p>
          </div>

          <div className="flex items-start gap-2 px-1 pt-2 pb-2">
             <input required type="checkbox" className="mt-1 h-4 w-4 rounded border-white/10 bg-white/5 accent-purple-600 shrink-0 cursor-pointer" id="terms" />
             <label htmlFor="terms" className="text-[11px] text-slate-500 leading-tight cursor-pointer">
                I agree to the <Link href="#" className="text-purple-400 font-bold hover:underline">Terms of Service</Link> and <Link href="#" className="text-purple-400 font-bold hover:underline">Privacy Policy</Link>
             </label>
          </div>

          <Button 
            disabled={isLoading}
            type="submit"
            className="cursor-pointer w-full h-12 rounded-xl bg-gradient-to-r from-purple-900 to-slate-900 hover:from-purple-800 hover:to-slate-800 text-slate-200 font-bold text-sm shadow-xl shadow-black/40 border border-white/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Account...</span>
              </div>
            ) : (
              "Create Free Account"
            )}
          </Button>

          <div className="pt-4 text-center">
             <p className="text-xs text-slate-500 font-medium">
                Already have an account?{" "}
                <Link href="/login" className="text-purple-400 font-bold hover:text-purple-300 transition-colors">Sign In here</Link>
             </p>
          </div>
        </form>

        <div className="mt-10 flex items-center justify-center gap-2 text-[10px] text-slate-600 font-medium uppercase tracking-[0.2em]">
           <Sparkles className="h-3 w-3 text-purple-500/50" />
           <span>Trusted by 10k+ Learners</span>
        </div>
      </motion.div>
    </div>
  );
}
