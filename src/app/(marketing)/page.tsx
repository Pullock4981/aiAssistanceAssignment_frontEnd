"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  BarChart3,
  CheckCircle2,
  Users2,
  Menu,
  FileText,
  BookOpen,
  PieChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Premium Floating Element Component
const FloatingElement = ({ children, delay = 0, x = 0, y = 0 }) => (
  <motion.div
    animate={{
      y: [y, y - 20, y],
      x: [x, x + 10, x],
      rotate: [0, 5, 0],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
    className="absolute z-0 opacity-20 pointer-events-none"
    style={{ left: `${50 + x}%`, top: `${40 + y}%` }}
  >
    {children}
  </motion.div>
);

// Enhanced Background Animation Component
const HeroBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Stronger Animated Mesh Gradients */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-purple-600/30 blur-[120px] rounded-full"
      />
      <motion.div 
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[100px] rounded-full"
      />
      <motion.div 
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute bottom-[-10%] left-[10%] w-[70%] h-[50%] bg-purple-900/30 blur-[130px] rounded-full"
      />

      {/* Floating Icons for Context */}
      <FloatingElement x={-40} y={-20} delay={0}>
         <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <FileText className="h-10 w-10 text-purple-400" />
         </div>
      </FloatingElement>
      <FloatingElement x={35} y={-25} delay={1}>
         <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <BookOpen className="h-12 w-12 text-indigo-400" />
         </div>
      </FloatingElement>
      <FloatingElement x={-30} y={30} delay={2}>
         <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <PieChart className="h-8 w-8 text-purple-400" />
         </div>
      </FloatingElement>
      <FloatingElement x={40} y={25} delay={3}>
         <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <Zap className="h-10 w-10 text-indigo-400" />
         </div>
      </FloatingElement>

      {/* Animated Particles/Stars - Render only on client to avoid hydration mismatch */}
      {mounted && [...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.2]" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};

export default function HomePage() {
  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden selection:bg-purple-500/30 scroll-smooth">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-4 md:px-12 border-b border-white/5 backdrop-blur-xl bg-slate-950/80 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger render={
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Menu className="h-6 w-6" />
                </button>
              } />
              <SheetContent side="left" className="bg-slate-950 border-r-white/5 p-8 flex flex-col gap-8 w-72 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/30">
                    <GraduationCap className="h-5 w-5 text-purple-400" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">EduFlow</span>
                </div>
                <nav className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link key={link.name} href={link.href} className="text-lg font-medium text-slate-400 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  ))}
                  <div className="h-px bg-white/5 my-2" />
                  <Link href="/login" className="text-lg font-medium text-slate-400 hover:text-white transition-colors">Sign In</Link>
                </nav>
                <Button 
                  render={<Link href="/register" />}
                  nativeButton={false}
                  className="w-full mt-auto bg-gradient-to-r from-purple-900 to-slate-900 text-white font-bold h-12 rounded-xl"
                >
                  Get Started
                </Button>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/30">
              <GraduationCap className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              EduFlow
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-slate-400">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:text-white transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
           <Link href="/login" className="hidden sm:block text-[13px] font-medium text-slate-400 hover:text-white transition-colors mr-2">Sign In</Link>
           <Button 
             render={<Link href="/register" />}
             nativeButton={false}
             className="cursor-pointer h-9 bg-gradient-to-r from-purple-900 to-slate-900 hover:from-purple-800 hover:to-slate-800 text-slate-200 rounded-full px-4 md:px-6 shadow-xl shadow-black/40 font-bold transition-all duration-300 border border-white/5 text-[11px] md:text-[12px]"
           >
              Get Started
           </Button>
        </div>
      </header>

      {/* Hero Section - Extra Compact for Visibility */}
      <main className="relative z-10 px-4 md:px-6">
        <section className="relative pt-24 md:pt-28 pb-12 overflow-hidden">
          <HeroBackground />
          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-[10px] md:text-[11px] font-medium border border-white/10 backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-slate-300 uppercase tracking-widest">Next Gen Learning Platform</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight"
            >
              Manage Assignments <br />
              <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                With Intelligence.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-md md:max-w-xl mx-auto text-[13px] md:text-sm text-slate-400 leading-relaxed"
            >
              The ultimate platform for instructors and students to track progress, 
              submit assignments, and analyze performance with absolute precision.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-4"
            >
              <Button 
                render={<Link href="/instructor" className="flex items-center" />}
                nativeButton={false}
                size="lg" 
                className="cursor-pointer w-full sm:w-auto h-12 px-10 rounded-full bg-gradient-to-r from-purple-900 to-slate-900 hover:from-purple-800 hover:to-slate-800 text-slate-200 font-bold text-xs shadow-xl shadow-black/40 transition-all group border border-white/5"
              >
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="cursor-pointer w-full sm:w-auto h-12 px-10 rounded-full border-white/10 text-white hover:bg-white/5 font-bold text-xs transition-all">
                 Watch Demo
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 scroll-mt-20">
          <div className="text-center space-y-3 mb-12 px-4">
             <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Core Features</h2>
             <p className="text-slate-400 text-sm max-w-xl mx-auto">Everything you need to manage your academic workflow efficiently.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
             {[
               { icon: Zap, title: "Fast Submissions", desc: "Upload and review assignments in seconds with our optimized engine." },
               { icon: BarChart3, title: "Rich Analytics", desc: "Get deep insights into student performance with interactive charts." },
               { icon: ShieldCheck, title: "Secure Portal", desc: "Your data is protected with enterprise-grade encryption and auth." }
             ].map((feature, i) => (
               <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-xl text-left hover:border-purple-500/30 transition-all group">
                  <div className="h-12 w-12 rounded-2xl bg-purple-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <feature.icon className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
               </div>
             ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 scroll-mt-20">
           <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 px-4">
                 <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">Designed for the <br className="hidden md:block" /> Future of Learning</h2>
                 <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                   Built by educators, for educators. We bridge the gap between instructors 
                   and students with powerful analytics and feedback systems.
                 </p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-3">
                       <CheckCircle2 className="h-5 w-5 text-purple-500" />
                       <span className="text-sm font-medium text-slate-300">Modern Technology</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Users2 className="h-5 w-5 text-purple-500" />
                       <span className="text-sm font-medium text-slate-300">Active Community</span>
                    </div>
                 </div>
              </div>
              <div className="relative aspect-video rounded-3xl bg-gradient-to-br from-purple-600/20 to-indigo-900/20 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl mx-4">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1),transparent)]" />
                 <GraduationCap className="h-16 md:h-24 w-16 md:w-24 text-purple-500/40" />
              </div>
           </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 scroll-mt-20 text-center">
           <div className="space-y-4 mb-12 px-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Simple Pricing</h2>
              <p className="text-slate-400">Choose the plan that fits your needs.</p>
           </div>
           <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 px-4">
              <div className="p-10 rounded-[40px] bg-white/5 border border-white/5 backdrop-blur-md text-left hover:border-purple-500/20 transition-all">
                 <h4 className="text-lg font-bold mb-1">Academic Free</h4>
                 <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-slate-500 text-sm">/month</span>
                 </div>
                 <ul className="space-y-4 mb-10">
                    {["1 Instructor", "50 Students"].map(f => (
                       <li key={f} className="flex items-center gap-3 text-sm text-slate-400">
                          <CheckCircle2 className="h-4 w-4 text-purple-500" /> {f}
                       </li>
                    ))}
                 </ul>
                 <Button variant="outline" className="w-full h-12 rounded-2xl border-white/10 hover:bg-white/5 text-sm">Start Free</Button>
              </div>
              <div className="p-10 rounded-[40px] bg-gradient-to-b from-purple-900/20 to-slate-900/40 border border-purple-500/30 backdrop-blur-md text-left relative overflow-hidden">
                 <div className="absolute top-4 right-8 px-3 py-1 rounded-full bg-purple-600 text-[10px] font-bold uppercase tracking-widest text-white">Popular</div>
                 <h4 className="text-lg font-bold mb-1">Pro Institution</h4>
                 <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-bold">$49</span>
                    <span className="text-slate-500 text-sm">/month</span>
                 </div>
                 <ul className="space-y-4 mb-10">
                    {["Unlimited", "AI Analytics Pro"].map(f => (
                       <li key={f} className="flex items-center gap-3 text-sm text-slate-200">
                          <CheckCircle2 className="h-4 w-4 text-purple-500" /> {f}
                       </li>
                    ))}
                 </ul>
                 <Button className="w-full h-12 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm">Go Pro</Button>
              </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 text-center text-slate-500 text-[10px] uppercase tracking-[0.2em]">
         <p>© 2026 EduFlow Learning Systems.</p>
      </footer>
    </div>
  );
}
