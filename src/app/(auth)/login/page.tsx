"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, ArrowLeft, Mail, Lock, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast, Toaster } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await axios.post(`${apiUrl}/auth/login`, formData);
      
      if (response.data.success) {
        toast.success("Login successful! Welcome back.");
        
        // Save user data and token to localStorage
        const { token, user } = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect based on role
        setTimeout(() => {
          if (user.role === 'instructor') {
            router.push("/instructor");
          } else {
            router.push("/student"); // Fallback or student dashboard
          }
        }, 1500);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Invalid email or password. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <Toaster position="top-center" richColors theme="dark" />
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-purple-600/10 blur-[120px] -z-0 pointer-events-none" />
      
      <Link href="/" className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group z-20">
         <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
         <span className="text-sm font-medium">Back</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[440px] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl my-10"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-purple-500/10">
            <GraduationCap className="h-6 w-6 md:h-8 md:w-8 text-purple-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-[13px] md:text-sm">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
              <Link href="#" className="text-[11px] font-bold text-purple-400 hover:text-purple-300 transition-colors">Forgot Password?</Link>
            </div>
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
          </div>

          <Button 
            disabled={isLoading}
            type="submit"
            className="cursor-pointer w-full h-12 rounded-xl bg-gradient-to-r from-purple-900 to-slate-900 hover:from-purple-800 hover:to-slate-800 text-slate-200 font-bold text-sm shadow-xl shadow-black/40 mt-2 border border-white/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In to EduFlow"
            )}
          </Button>

          <div className="relative py-4">
             <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5"></span>
             </div>
             <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-transparent px-2 text-slate-600 font-bold">New to platform?</span>
             </div>
          </div>

          <Button 
            render={<Link href="/register" />}
            nativeButton={false}
            variant="outline" 
            className="cursor-pointer w-full h-12 rounded-xl border-white/10 text-white hover:bg-white/5 font-bold text-sm"
          >
             Create an Account
          </Button>
        </form>

        <div className="mt-10 flex items-center justify-center gap-2 text-[10px] text-slate-600 font-medium">
           <Sparkles className="h-3 w-3 text-purple-500/50" />
           <span>Secure & Encrypted Authentication</span>
        </div>
      </motion.div>
    </div>
  );
}
