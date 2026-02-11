'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
    ArrowRight,
    Code2,
    Zap,
    BookOpen,
    Sparkles,
    Terminal,
    ChevronRight,
    Github,
    Share2,
    Lock,
    Cpu,
    BarChart3,
    Layers,
    Play,
    Brain,
    GraduationCap,
    Briefcase,
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';

const Scene = dynamic(() => import('@/components/Scene'), { ssr: false });

/* =============================================
   ANIMATED COMPONENTS
   ============================================= */
function RevealText({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.9, delay, ease: [0.25, 0.4, 0.25, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

function FloatingCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const duration = 2000;
        const startTime = Date.now();
        const step = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [isInView, target]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* =============================================
   MAIN LANDING PAGE
   ============================================= */
export default function Page() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

    const features = [
        { icon: Code2, title: "Multi-Language", desc: "Python, JavaScript, Java, C, C++ — all supported out of the box.", span: "md:col-span-1" },
        { icon: Zap, title: "Instant Analysis", desc: "Get step-by-step explanations with time and space complexity in seconds.", span: "md:col-span-1" },
        { icon: Sparkles, title: "AI Optimization", desc: "Auto-refactor your code for better performance with one click.", span: "md:col-span-1" },
        { icon: BookOpen, title: "Three Learning Modes", desc: "Beginner-friendly, exam prep, or technical interview — pick your style.", span: "md:col-span-2" },
        { icon: Share2, title: "Export & Share", desc: "Download explanations as PDF or copy to clipboard instantly.", span: "md:col-span-1" },
    ];

    const modes = [
        { icon: GraduationCap, title: "Beginner", desc: "Simple language with analogies", color: "from-emerald-500/20 to-emerald-500/5", accent: "text-emerald-400", border: "border-emerald-500/20" },
        { icon: Brain, title: "Exam Prep", desc: "Key concepts & definitions", color: "from-blue-500/20 to-blue-500/5", accent: "text-blue-400", border: "border-blue-500/20" },
        { icon: Briefcase, title: "Interview", desc: "Approach & complexity focus", color: "from-amber-500/20 to-amber-500/5", accent: "text-amber-400", border: "border-amber-500/20" },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-primary/30 selection:text-white">

            {/* Scroll Progress */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
                style={{
                    scaleX,
                    background: 'linear-gradient(90deg, #8b5cf6, #6366f1, #22d3ee)',
                }}
            />

            {/* 3D Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
                <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
            </div>

            {/* =============================================
                PREMIUM NAVIGATION
               ============================================= */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-3xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 group-hover:scale-110 transition-all duration-300">
                            <Terminal className="w-5 h-5 text-white" />
                            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <span className="font-bold text-lg tracking-tight dark:bg-gradient-to-r dark:from-white dark:to-white/80 dark:bg-clip-text dark:text-transparent text-foreground">AI Code Explain</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-10 text-sm font-medium">
                        <Link href="#features" className="text-foreground/70 hover:text-foreground transition-colors duration-300">Features</Link>
                        <Link href="#how-it-works" className="text-foreground/70 hover:text-foreground transition-colors duration-300">How it Works</Link>
                        <Link href="#modes" className="text-foreground/70 hover:text-foreground transition-colors duration-300">Modes</Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link href="/auth">
                            <Button variant="ghost" className="text-sm font-semibold hover:bg-white/10 rounded-full transition-colors duration-300">Sign In</Button>
                        </Link>
                        <Link href="/auth">
                            <Button className="bg-white text-black hover:bg-white/90 shadow-lg shadow-white/15 rounded-full px-6 text-sm font-bold hover:scale-110 transition-all duration-300">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* =============================================
                HERO SECTION — LEGENDARY DESIGN
               ============================================= */}
            <motion.section
                className="relative pt-40 pb-32 md:pt-64 md:pb-48 px-6"
                style={{ opacity: heroOpacity, scale: heroScale }}
            >
                <div className="max-w-6xl mx-auto relative z-10">
                    {/* Hero Badge */}
                    <RevealText delay={0.1} className="flex justify-center mb-12">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-emerald-500/30 bg-gradient-to-r from-emerald-500/[0.08] to-emerald-500/[0.02] backdrop-blur-xl">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-semibold text-emerald-300 tracking-wider uppercase">Powered by Groq LLaMA 3.3</span>
                        </div>
                    </RevealText>

                    {/* Main Headline */}
                    <RevealText delay={0.2} className="text-center mb-10">
                        <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tight leading-[0.95] mb-6">
                            <span className="text-foreground">Understand</span><br />
                            <span className="gradient-text">Any Code. Instantly.</span>
                        </h1>
                    </RevealText>

                    {/* Subheading */}
                    <RevealText delay={0.35} className="text-center mb-16 max-w-3xl mx-auto">
                        <p className="text-xl md:text-2xl text-foreground/70 font-light leading-relaxed">
                            AI-powered code explanations, complexity analysis, and optimizations. Paste. Analyze. Master.
                        </p>
                    </RevealText>

                    {/* CTA Buttons */}
                    <RevealText delay={0.45} className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20">
                        <Link href="/auth">
                            <Button size="lg" className="h-16 px-10 rounded-full bg-white text-black hover:bg-white/90 text-base font-bold shadow-2xl shadow-white/20 hover:shadow-white/30 transition-all hover:scale-[1.05] active:scale-[0.97]">
                                Start Analyzing
                                <ArrowRight className="w-5 h-5 ml-2.5" />
                            </Button>
                        </Link>
                        <Link href="https://github.com/ask8962/automated-code-explanation-system" target="_blank">
                            <Button size="lg" variant="outline" className="h-16 px-10 rounded-full border border-white/20 bg-white/[0.05] hover:bg-white/[0.08] hover:border-white/30 backdrop-blur-md text-base font-semibold transition-all hover:scale-[1.05] active:scale-[0.97]">
                                <Github className="w-5 h-5 mr-2.5" />
                                GitHub
                            </Button>
                        </Link>
                    </RevealText>
                </div>

                {/* Hero Visual — Dashboard Preview */}
                <RevealText delay={0.6} className="mt-32 max-w-6xl mx-auto relative z-10">
                    <div className="rounded-3xl border border-white/[0.1] bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-2xl shadow-2xl shadow-violet-600/10 p-2 relative overflow-hidden group">
                        {/* Animated premium glow */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-violet-600/30 via-indigo-600/20 to-cyan-500/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                        {/* Browser Chrome */}
                        <div className="relative h-10 border-b border-white/[0.06] bg-white/[0.02] flex items-center px-4 gap-2 rounded-t-xl">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                            </div>
                            <div className="ml-4 h-5 flex-1 max-w-md rounded-md bg-white/[0.03] hidden md:flex items-center px-3">
                                <span className="text-[10px] text-muted-foreground font-mono">gla-code-aa.vercel.app/dashboard</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="relative p-6 md:p-8 grid md:grid-cols-2 gap-8">
                            {/* Code Side */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                        <span>fibonacci.py</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px]">Python 3.10</span>
                                </div>
                                <div className="p-5 rounded-xl bg-black/60 border border-white/[0.04] font-mono text-sm leading-[1.8] overflow-x-auto">
                                    <div className="flex">
                                        <div className="pr-4 text-white/15 select-none text-right text-xs leading-[1.8]">
                                            1<br />2<br />3<br />4
                                        </div>
                                        <div>
                                            <span className="text-purple-400">def</span> <span className="text-blue-300">fibonacci</span><span className="text-white/60">(</span><span className="text-orange-300">n</span><span className="text-white/60">):</span><br />
                                            &nbsp;&nbsp;<span className="text-purple-400">if</span> n <span className="text-white/60">{"<="}</span> <span className="text-emerald-300">1</span><span className="text-white/60">:</span><br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> n<br />
                                            &nbsp;&nbsp;<span className="text-purple-400">return</span> fibonacci(n<span className="text-white/60">-</span><span className="text-emerald-300">1</span>) <span className="text-white/60">+</span> fibonacci(n<span className="text-white/60">-</span><span className="text-emerald-300">2</span>)
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                                        <div className="text-xl font-bold text-red-400 font-mono">O(2^n)</div>
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Time</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                                        <div className="text-xl font-bold text-emerald-400 font-mono">O(n)</div>
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Space</div>
                                    </div>
                                </div>
                            </div>

                            {/* Analysis Side */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                    </div>
                                    <h3 className="text-sm font-semibold">AI Analysis</h3>
                                    <div className="ml-auto px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                        <span className="text-[10px] text-emerald-400 font-medium">Live</span>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                                    <p className="text-foreground/80">Recursive Fibonacci implementation with exponential time complexity.</p>
                                    <div className="p-3 rounded-lg bg-yellow-500/[0.05] border border-yellow-500/10">
                                        <p className="text-yellow-300/80 text-xs font-medium mb-1">⚠ Performance Warning</p>
                                        <p className="text-xs text-muted-foreground">Redundant calculations grow exponentially. Not suitable for n {'>'} 30.</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-emerald-500/[0.05] border border-emerald-500/10">
                                        <p className="text-emerald-300/80 text-xs font-medium mb-1">✦ Optimization Available</p>
                                        <p className="text-xs text-muted-foreground">Memoization reduces complexity to O(n) time, O(n) space.</p>
                                    </div>
                                </div>
                                <Button className="w-full bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.06] text-white text-sm rounded-xl h-10 transition-all hover:border-violet-500/30">
                                    <Zap className="w-3.5 h-3.5 mr-2 text-yellow-400" />
                                    Auto-Optimize Code
                                </Button>
                            </div>
                        </div>
                    </div>
                </RevealText>
            </motion.section>

            {/* =============================================
                FEATURES — Premium Bento Grid
               ============================================= */}
            <section id="features" className="py-40 relative z-10 border-t border-white/[0.04]">
                <div className="max-w-6xl mx-auto px-6">
                    <RevealText className="text-center max-w-3xl mx-auto mb-24">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-6">Capabilities</p>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tight leading-[1.1]">
                            Built for<br />
                            <span className="gradient-text">Every Developer.</span>
                        </h2>
                        <p className="text-foreground/60 text-lg font-light">Powerful analysis. Beautiful experience.</p>
                    </RevealText>

                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <FloatingCard key={i} delay={0.12 * i} className={`${f.span}`}>
                                <div className="relative h-full p-8 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-white/[0.12] hover:from-white/[0.05] hover:to-white/[0.02] backdrop-blur-lg transition-all duration-300 group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <f.icon className="w-6 h-6 text-violet-400" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 tracking-tight text-foreground">{f.title}</h3>
                                        <p className="text-sm text-foreground/60 leading-relaxed">{f.desc}</p>
                                    </div>
                                </div>
                            </FloatingCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* =============================================
                HOW IT WORKS — Premium Steps
               ============================================= */}
            <section id="how-it-works" className="py-40 relative z-10">
                <div className="max-w-6xl mx-auto px-6">
                    <RevealText className="text-center mb-24">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-6">Process</p>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                            Three Simple Steps<br />
                            <span className="gradient-text">to Code Mastery.</span>
                        </h2>
                    </RevealText>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { step: "01", title: "Paste Your Code", desc: "Drop any snippet from Python, Java, JavaScript, C, or C++. The AI instantly recognizes the language.", icon: Terminal },
                            { step: "02", title: "Pick Your Mode", desc: "Choose Beginner for analogies, Exam for concepts, or Interview for approach & complexity.", icon: Layers },
                            { step: "03", title: "Get Deep Insights", desc: "Receive step-by-step breakdown, complexity analysis, key concepts, optimization tips & more.", icon: Sparkles },
                        ].map((item, i) => (
                            <FloatingCard key={i} delay={0.15 * i}>
                                <div className="relative p-8 rounded-3xl h-full border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-white/[0.12] hover:from-white/[0.05] hover:to-white/[0.02] backdrop-blur-lg transition-all duration-300 group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                    <div className="text-8xl font-black text-foreground/10 absolute -top-8 right-4 select-none">{item.step}</div>
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <item.icon className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 tracking-tight text-foreground">{item.title}</h3>
                                        <p className="text-sm text-foreground/60 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            </FloatingCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* =============================================
                LEARNING MODES — Premium Display
               ============================================= */}
            <section id="modes" className="py-40 relative z-10 border-t border-white/[0.04]">
                <div className="max-w-6xl mx-auto px-6">
                    <RevealText className="text-center mb-24">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-6">Three Modes</p>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                            Learn Your Way<br />
                            <span className="gradient-text">Beginner to Pro.</span>
                        </h2>
                    </RevealText>

                    <div className="grid md:grid-cols-3 gap-6">
                        {modes.map((mode, i) => (
                            <FloatingCard key={i} delay={0.12 * i}>
                                <div className={`relative p-8 rounded-3xl border border-white/[0.08] bg-gradient-to-br ${mode.color} backdrop-blur-xl h-full group hover:border-white/[0.12] transition-all duration-300`}>
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <mode.icon className={`w-6 h-6 ${mode.accent}`} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-foreground">{mode.title}</h3>
                                    <p className="text-sm text-foreground/60">{mode.desc}</p>
                                </div>
                            </FloatingCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* =============================================
                STATS — Premium Metrics
               ============================================= */}
            <section className="py-32 relative z-10 border-y border-white/[0.04]">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { value: 5, suffix: '+', label: 'Languages', icon: Code2, color: 'from-violet-500/20 to-violet-500/5' },
                            { value: 3, suffix: '', label: 'Learning Modes', icon: Brain, color: 'from-blue-500/20 to-blue-500/5' },
                            { value: 99, suffix: '%', label: 'Accuracy', icon: Zap, color: 'from-emerald-500/20 to-emerald-500/5' },
                            { value: 500, suffix: 'ms', label: 'Avg Response', icon: Terminal, color: 'from-cyan-500/20 to-cyan-500/5' },
                        ].map((stat, i) => (
                            <RevealText key={i} delay={0.12 * i}>
                                <div className="p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-lg text-center group hover:border-white/[0.12] transition-all duration-300">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                                        <stat.icon className="w-5 h-5 text-foreground/50" />
                                    </div>
                                    <div className="text-4xl md:text-5xl font-black tracking-tight gradient-text mb-2">
                                        <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                                    </div>
                                    <div className="text-xs text-foreground/60 uppercase tracking-[0.15em] font-semibold">{stat.label}</div>
                                </div>
                            </RevealText>
                        ))}
                    </div>
                </div>
            </section>

            {/* =============================================
                CTA — Final Call to Action
               ============================================= */}
            <section className="py-48 relative z-10 overflow-hidden border-t border-white/[0.04]">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-violet-600/15 via-indigo-600/10 to-cyan-500/15 blur-[160px]" />
                </div>
                <div className="max-w-5xl mx-auto px-6 text-center relative z-20">
                    <RevealText>
                        <h2 className="text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight mb-10 leading-[1.05]">
                            Start Mastering
                            <br />
                            <span className="gradient-text">Code Today</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-foreground/60 mb-16 font-light max-w-2xl mx-auto leading-relaxed">
                            Join thousands of developers who are already writing better code with AI Code Explain. It&apos;s free. No credit card required.
                        </p>
                        <Link href="/auth">
                            <Button size="lg" className="h-18 px-14 rounded-full bg-white text-black hover:bg-white/90 text-lg font-bold shadow-2xl shadow-white/20 hover:shadow-white/30 hover:scale-[1.05] active:scale-[0.97] transition-all">
                                Get Started Free
                                <ArrowRight className="w-6 h-6 ml-3" />
                            </Button>
                        </Link>
                    </RevealText>
                </div>
            </section>

            {/* =============================================
                PREMIUM FOOTER
               ============================================= */}
            <footer className="border-t border-white/[0.05] py-12 relative z-10 bg-gradient-to-b from-white/[0.01] to-transparent">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <Terminal className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-bold dark:bg-gradient-to-r dark:from-white dark:to-white/80 dark:bg-clip-text dark:text-transparent text-foreground">AI Code Explain</span>
                    </div>
                    <p className="text-xs text-foreground/50 text-center md:text-right font-light">
                        © 2024 GLA University • Built with passion by Anukalp, Nishant, Prince, Utpal, Jatin
                    </p>
                </div>
            </footer>
        </div>
    );
}
