"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { LandingNav } from "@/components/layout/landing-nav";
import { Footer } from "@/components/layout/footer";
import { ArrowRight, ShieldCheck, Zap, Lock, Terminal, Activity, ChevronRight, Globe, Server } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

// --- Animations ---
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.1 }
  }
};

const float = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function HomePage() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <LandingNav />
      
      <main className="flex-1">
        {/* --- HERO SECTION --- */}
        <section ref={targetRef} className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden">
          
          {/* 1. Animated Cyber Grid Background */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]">
            <motion.div 
              animate={{ 
                backgroundPosition: ["0% 0%", "100% 100%"] 
              }}
              transition={{ 
                duration: 40, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute inset-0 opacity-20"
            />
          </div>

          {/* 2. Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />

          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Column: Text Content */}
              <motion.div 
                initial="initial"
                animate="animate"
                variants={stagger}
                className="flex flex-col items-start text-left"
              >
                <motion.div variants={fadeUp} className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                  System Operational v2.0
                </motion.div>

                <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-6 leading-[1.1]">
                  Defense that <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-500 to-primary bg-[length:200%_auto] animate-gradient">
                    Educates.
                  </span>
                </motion.h1>

                <motion.p variants={fadeUp} className="text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
                  The first "Cognitive Firewall" for universities. We don't just block threats; we explain them in real-time, raising the digital IQ of your entire campus.
                </motion.p>

                <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                  <Link href="/get-started" className="h-12 px-8 rounded-lg bg-primary text-primary-foreground font-medium flex items-center gap-2 hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/20">
                    Deploy Aegis <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/features" className="group h-12 px-8 rounded-lg border border-border bg-background/50 hover:bg-muted backdrop-blur-sm transition-all flex items-center justify-center font-medium">
                    Live Demo <Terminal className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>

                {/* <motion.div variants={fadeUp} className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex -space-x-2">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-zinc-800 flex items-center justify-center text-[10px] text-white font-bold">
                           {String.fromCharCode(64+i)}
                        </div>
                     ))}
                  </div>
                  <p>Trusted by 40+ Institutions</p>
                </motion.div> */}
              </motion.div>

              {/* Right Column: Interactive Visual */}
              <motion.div 
                style={{ opacity, scale }}
                variants={float}
                animate="animate"
                className="relative hidden lg:block"
              >
                {/* Abstract Glass Cards Stack */}
                <div className="relative w-full aspect-square max-w-[500px] mx-auto perspective-1000">
                  
                  {/* Card 1: The Threat (Back) */}
                  <motion.div 
                    animate={{ y: [0, 10, 0], rotate: [0, -2, 0] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                    className="absolute top-0 right-0 w-3/4 h-3/4 bg-red-500/10 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm z-0 transform translate-x-12 -translate-y-8"
                  >
                     <div className="flex items-center gap-3 mb-4">
                        <div className="h-3 w-3 rounded-full bg-red-500/50" />
                        <div className="h-2 w-20 bg-red-500/20 rounded-full" />
                     </div>
                     <div className="space-y-2 opacity-50">
                        <div className="h-2 w-full bg-red-500/10 rounded-full" />
                        <div className="h-2 w-2/3 bg-red-500/10 rounded-full" />
                     </div>
                  </motion.div>

                  {/* Card 2: The Aegis Analysis (Middle) */}
                  <motion.div 
                    animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                    transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
                    className="absolute top-12 left-4 w-3/4 h-3/4 bg-background/80 border border-border/50 rounded-2xl shadow-2xl p-6 backdrop-blur-md z-10"
                  >
                     <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            <span className="font-mono text-xs font-bold text-primary">ANALYSIS_ACTIVE</span>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                     </div>
                     <div className="space-y-4">
                        <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
                            <div className="text-xs text-muted-foreground mb-1">Target URL</div>
                            <div className="font-mono text-xs text-red-400">login.microsoft-security-update.com</div>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                            <div className="text-xs text-primary font-bold mb-1">Aegis AI Insight</div>
                            <div className="text-xs text-muted-foreground leading-relaxed">
                                "This domain was registered 2 hours ago. It mimics an official Microsoft page but uses a different registrar."
                            </div>
                        </div>
                     </div>
                  </motion.div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* --- SOCIAL PROOF TICKER --- */}
        <section className="border-y border-border bg-muted/20 overflow-hidden py-8">
            <div className="container mx-auto px-6 mb-4 text-center">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Securing the next generation at</p>
            </div>
            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex items-center gap-16 px-16">
                    {["MIT", "Stanford", "Oxford", "Cambridge", "ETH Zurich", "NUS Singapore", "IIT Bombay", "Tsinghua"].map((uni) => (
                        <span key={uni} className="text-2xl font-bold text-muted-foreground/40 font-serif">{uni}</span>
                    ))}
                    {["MIT", "Stanford", "Oxford", "Cambridge", "ETH Zurich", "NUS Singapore", "IIT Bombay", "Tsinghua"].map((uni) => (
                        <span key={`${uni}-dup`} className="text-2xl font-bold text-muted-foreground/40 font-serif">{uni}</span>
                    ))}
                </div>
            </div>
        </section>

        {/* --- VALUE PROP (BENTO GRID) --- */}
        <section className="py-32">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20 max-w-3xl mx-auto">
               <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Engineered for the Open Web.</h2>
               <p className="text-lg text-muted-foreground">Traditional security tools break the internet. Aegis heals it.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 auto-rows-[300px]">
               {/* Large Card */}
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="md:col-span-2 row-span-1 bg-gradient-to-br from-background to-muted/30 border border-border rounded-3xl p-8 relative overflow-hidden group"
               >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                     <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Zap className="h-6 w-6 text-primary" />
                     </div>
                     <div>
                        <h3 className="text-2xl font-bold mb-2">Real-Time Explainability</h3>
                        <p className="text-muted-foreground max-w-md">Our edge-compute engine doesn't just return a 403 Forbidden. It generates a dynamic HTML overlay explaining the specific threat vectors found on the page.</p>
                     </div>
                  </div>
               </motion.div>

               {/* Tall Card */}
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="md:col-span-1 row-span-2 bg-background border border-border rounded-3xl p-8 relative overflow-hidden group"
               >
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                  
                  <div className="relative z-10 h-full flex flex-col">
                     <div className="h-12 w-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6">
                        <ShieldCheck className="h-6 w-6 text-indigo-500" />
                     </div>
                     <h3 className="text-2xl font-bold mb-4">Identity Guard</h3>
                     <p className="text-muted-foreground mb-8">Prevent credential reuse across domains.</p>
                     
                     {/* Mini Visualization */}
                     <div className="mt-auto bg-muted/50 rounded-xl p-4 border border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                           <Lock className="w-3 h-3 text-muted-foreground" />
                           <span className="text-[10px] uppercase font-bold text-muted-foreground">Secure Vault</span>
                        </div>
                        <div className="space-y-2">
                           <div className="h-2 bg-foreground/10 rounded w-full" />
                           <div className="h-2 bg-foreground/10 rounded w-2/3" />
                        </div>
                     </div>
                  </div>
               </motion.div>

               {/* Small Card */}
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="md:col-span-1 row-span-1 bg-background border border-border rounded-3xl p-8 flex flex-col justify-between"
               >
                 <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <Globe className="h-6 w-6 text-emerald-500" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold mb-2">Global Threat Intel</h3>
                    <p className="text-sm text-muted-foreground">Synced with Google Safe Browsing & VirusTotal APIs.</p>
                 </div>
               </motion.div>

               {/* Small Card */}
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="md:col-span-1 row-span-1 bg-background border border-border rounded-3xl p-8 flex flex-col justify-between"
               >
                 <div className="h-12 w-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <Server className="h-6 w-6 text-amber-500" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold mb-2">Privacy Core</h3>
                    <p className="text-sm text-muted-foreground">Differential privacy ensures student anonymity in admin reports.</p>
                 </div>
               </motion.div>

            </div>
          </div>
        </section>

        {/* --- HOW IT WORKS (Step by Step) --- */}
        <section className="py-24 bg-muted/10 border-t border-border">
            <div className="container mx-auto px-6">
               <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold mb-4">The Intervention Loop</h2>
                  <p className="text-muted-foreground">How Aegis turns a threat into a lesson.</p>
               </div>

               <div className="relative">
                  {/* Connecting Line (Desktop) */}
                  <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />

                  <div className="grid md:grid-cols-3 gap-8 relative z-10">
                     {[
                        { step: "01", title: "Intercept", desc: "User clicks a malicious link. Aegis DNS halts the request instantly." },
                        { step: "02", title: "Analyze", desc: "Edge AI scans the page content for semantic threats and mimicry." },
                        { step: "03", title: "Educate", desc: "User sees a warning with a micro-lesson explaining the specific risk." }
                     ].map((item, i) => (
                        <div key={i} className="bg-background border border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors shadow-sm">
                           <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-primary/20">
                              {item.step}
                           </div>
                           <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                           <p className="text-muted-foreground text-sm">{item.desc}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}