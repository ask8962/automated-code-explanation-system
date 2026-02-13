'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
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
                NAVIGATION
               ============================================= */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-background/50 backdrop-blur-2xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300 group-hover:scale-105">
                            <Terminal className="w-4 h-4 text-white" />
                            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">AI Code Explain</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <Link href="#features" className="hover:text-foreground transition-colors duration-200">Features</Link>
                        <Link href="#how-it-works" className="hover:text-foreground transition-colors duration-200">How it Works</Link>
                        <Link href="#modes" className="hover:text-foreground transition-colors duration-200">Modes</Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/auth">
                            <Button variant="ghost" className="text-sm font-medium hover:bg-white/5 rounded-full">Sign In</Button>
                        </Link>
                        <Link href="/auth">
                            <Button className="bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10 rounded-full px-6 text-sm font-semibold hover:scale-105 transition-all">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* =============================================
                HERO SECTION
               ============================================= */}
            <motion.section
                className="relative pt-36 pb-24 md:pt-52 md:pb-40 px-6"
                style={{ opacity: heroOpacity, scale: heroScale }}
            >
                <div className="max-w-5xl mx-auto text-center relative z-10">

                    <RevealText delay={0.1}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Powered by LLaMA 3.3 & Groq</span>
                        </div>
                    </RevealText>

                    <RevealText delay={0.2}>
                        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight mb-8 leading-[1.05]">
                            Understand code
                            <br />
                            <span className="gradient-text">in seconds.</span>
                        </h1>
                    </RevealText>

                    <RevealText delay={0.35}>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-14 leading-relaxed font-light">
                            Paste any code snippet and get instant AI-powered explanations,
                            complexity analysis, and performance optimizations.
                        </p>
                    </RevealText>

                    <RevealText delay={0.45}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/auth">
                                <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-white/90 text-base font-semibold shadow-xl shadow-white/10 hover:shadow-white/20 transition-all hover:scale-[1.03] active:scale-[0.98]">
                                    Start Analyzing
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="https://github.com/ask8962/automated-code-explanation-system" target="_blank">
                                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md text-base font-medium transition-all hover:scale-[1.03] active:scale-[0.98]">
                                    <Github className="w-5 h-5 mr-2" />
                                    View on GitHub
                                </Button>
                            </Link>
                        </div>
                    </RevealText>
                </div>

                {/* Hero Visual — Dashboard Preview */}
                <RevealText delay={0.6} className="mt-28 max-w-6xl mx-auto relative z-10">
                    <div className="rounded-2xl border border-white/[0.06] bg-black/30 backdrop-blur-xl shadow-2xl shadow-violet-500/5 p-1.5 relative overflow-hidden group">
                        {/* Animated glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-indigo-600/10 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

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
                FEATURES — Bento Grid
               ============================================= */}
            <section id="features" className="py-32 relative z-10">
                <div className="max-w-6xl mx-auto px-6">
                    <RevealText className="text-center max-w-3xl mx-auto mb-20">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">Features</p>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                            Everything you need to<br />
                            <span className="gradient-text">master your code.</span>
                        </h2>
                        <p className="text-muted-foreground text-lg font-light">Powerful AI analysis meets beautiful developer experience.</p>
                    </RevealText>

                    <div className="grid md:grid-cols-3 gap-4">
                        {features.map((f, i) => (
                            <FloatingCard key={i} delay={0.1 * i} className={`${f.span}`}>
                                <div className="glass-card h-full p-7 rounded-2xl group cursor-default">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                        <f.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 tracking-tight">{f.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                                </div>
                            </FloatingCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* =============================================
                HOW IT WORKS
               ============================================= */}
            <section id="how-it-works" className="py-32 relative z-10">
                <div className="max-w-5xl mx-auto px-6">
                    <RevealText className="text-center mb-20">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">How it Works</p>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Three steps to<br />
                            <span className="gradient-text">total clarity.</span>
                        </h2>
                    </RevealText>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { step: "01", title: "Paste Your Code", desc: "Drop any code snippet — Python, Java, JS, C, or C++. Select your preferred language.", icon: Terminal },
                            { step: "02", title: "Choose a Mode", desc: "Beginner, Exam, or Interview — get explanations tailored to your exact needs.", icon: Layers },
                            { step: "03", title: "Get AI Insights", desc: "Receive step-by-step breakdown, complexity analysis, key concepts, and optimization.", icon: Sparkles },
                        ].map((item, i) => (
                            <FloatingCard key={i} delay={0.15 * i}>
                                <div className="relative glass-card p-8 rounded-2xl h-full">
                                    <div className="text-6xl font-black text-white/[0.03] absolute top-4 right-6 select-none">{item.step}</div>
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                                        <item.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 tracking-tight">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                            </FloatingCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* =============================================
                LEARNING MODES
               ============================================= */}
            <section id="modes" className="py-32 relative z-10">
                <div className="max-w-5xl mx-auto px-6">
                    <RevealText className="text-center mb-20">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">Learning Modes</p>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Tailored to your<br />
                            <span className="gradient-text">learning style.</span>
                        </h2>
                    </RevealText>

                    <div className="grid md:grid-cols-3 gap-6">
                        {modes.map((mode, i) => (
                            <FloatingCard key={i} delay={0.1 * i}>
                                <div className={`relative p-8 rounded-2xl border ${mode.border} bg-gradient-to-b ${mode.color} backdrop-blur-xl h-full group hover:scale-[1.02] transition-all duration-300`}>
                                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <mode.icon className={`w-6 h-6 ${mode.accent}`} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{mode.title}</h3>
                                    <p className="text-sm text-muted-foreground">{mode.desc}</p>
                                </div>
                            </FloatingCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* =============================================
                STATS
               ============================================= */}
            <section className="py-24 relative z-10 border-y border-white/[0.04]">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: 5, suffix: '+', label: 'Languages' },
                            { value: 3, suffix: '', label: 'Learning Modes' },
                            { value: 99, suffix: '%', label: 'Accuracy' },
                            { value: 500, suffix: 'ms', label: 'Avg Response' },
                        ].map((stat, i) => (
                            <RevealText key={i} delay={0.1 * i}>
                                <div className="space-y-2">
                                    <div className="text-4xl md:text-5xl font-black tracking-tight gradient-text">
                                        <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                                    </div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-medium">{stat.label}</div>
                                </div>
                            </RevealText>
                        ))}
                    </div>
                </div>
            </section>

            {/* =============================================
                CTA
               ============================================= */}
            <section className="py-40 relative z-10 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
                </div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-20">
                    <RevealText>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
                            Ready to level
                            <br />
                            <span className="gradient-text">up?</span>
                        </h2>
                        <p className="text-xl text-muted-foreground mb-14 font-light max-w-xl mx-auto">
                            Join developers using AI Code Explain to write better, faster code.
                        </p>
                        <Link href="/auth">
                            <Button size="lg" className="h-16 px-12 rounded-full bg-white text-black hover:bg-white/90 text-lg font-bold shadow-2xl shadow-violet-500/15 hover:scale-[1.03] active:scale-[0.98] transition-all">
                                Get Started — It&apos;s Free
                                <ArrowRight className="w-5 h-5 ml-3" />
                            </Button>
                        </Link>
                    </RevealText>
                </div>
            </section>

            {/* =============================================
                FOOTER
               ============================================= */}
            <footer className="border-t border-white/[0.04] py-10 relative z-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center">
                            <Terminal className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-foreground/80">AI Code Explain</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center md:text-right">
                        © 2024 GLA University Mini Project • Built by Anukalp, Nishant, Prince, Utpal, Jatin
                    </p>
                </div>
            </footer>
        </div>
    );
}
