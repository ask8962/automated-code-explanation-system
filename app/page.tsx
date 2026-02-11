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
    BarChart3,
    Sparkles,
    Terminal,
    Cpu,
    Layers,
    ChevronRight,
    Github,
    Globe,
    Monitor,
    Check,
    Play,
    Share2,
    Lock,
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

// Dynamically import Scene to avoid SSR issues with Three.js
const Scene = dynamic(() => import('@/components/Scene'), { ssr: false });

/* ============================================
   ANIMATED TEXT COMPONENT
   ============================================ */
function AnimatedText({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.8, delay, ease: [0.2, 0.65, 0.3, 0.9] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ============================================
   MAIN LANDING PAGE
   ============================================ */
export default function Page() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-primary/30 selection:text-white">

            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[100]"
                style={{ scaleX }}
            />

            {/* 3D Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
                <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow duration-300">
                            <Terminal className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">AI Code Explain</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                        <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
                        <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
                        <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/auth">
                            <Button variant="ghost" className="text-sm font-medium hover:bg-white/5">Sign In</Button>
                        </Link>
                        <Link href="/auth">
                            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-full px-6">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
                <div className="max-w-5xl mx-auto text-center relative z-10">

                    <AnimatedText delay={0.1}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">AI-Powered Code Analysis</span>
                        </div>
                    </AnimatedText>

                    <AnimatedText delay={0.2}>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
                            Unlock the metrics <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400">
                                behind your code.
                            </span>
                        </h1>
                    </AnimatedText>

                    <AnimatedText delay={0.3}>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                            Don't just write code. Understand it. Get instant explanations, complexity analysis, and optimization suggestions powered by state-of-the-art AI.
                        </p>
                    </AnimatedText>

                    <AnimatedText delay={0.4}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/auth">
                                <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-white/90 text-base font-semibold shadow-xl shadow-white/10 hover:shadow-white/20 transition-all hover:scale-105">
                                    Start Analyzing
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="https://github.com/ask8962/automated-code-explanation-system" target="_blank">
                                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md text-base font-medium transition-all hover:scale-105">
                                    <Github className="w-5 h-5 mr-2" />
                                    Star on GitHub
                                </Button>
                            </Link>
                        </div>
                    </AnimatedText>
                </div>

                {/* Hero Visual aka "The Dashboard Preview" */}
                <AnimatedText delay={0.6} className="mt-24 max-w-6xl mx-auto relative z-10">
                    <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl p-2 relative overflow-hidden group">
                        {/* Glow effect behind the image */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 via-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        {/* Mock Browser Header */}
                        <div className="h-10 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2 rounded-t-lg">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="ml-4 h-6 w-96 rounded bg-white/5 hidden md:block" />
                        </div>

                        {/* Code Preview Content */}
                        <div className="p-8 grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
                                    <span>fibonacci.py</span>
                                    <span>Python 3.10</span>
                                </div>
                                <div className="p-6 rounded-lg bg-black/50 border border-white/5 font-mono text-sm leading-relaxed overflow-x-auto text-blue-300">
                                    <span className="text-purple-400">def</span> fibonacci(n):<br />
                                    &nbsp;&nbsp;<span className="text-purple-400">if</span> n {"<="} 1:<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> n<br />
                                    &nbsp;&nbsp;<span className="text-purple-400">return</span> fibonacci(n-1) + fibonacci(n-2)
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                                        <div className="text-2xl font-bold text-white mb-1">O(2^n)</div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Time Complexity</div>
                                    </div>
                                    <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                                        <div className="text-2xl font-bold text-white mb-1">O(n)</div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Space Complexity</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold">AI Analysis</h3>
                                </div>
                                <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
                                    <p>The code implements a standard recursive solution for the Fibonacci sequence.</p>
                                    <p className="pl-4 border-l-2 border-yellow-500/50">
                                        <strong className="text-yellow-200 block mb-1">Warning: Performance Issue</strong>
                                        The recursive approach has exponential time complexity <code className="text-white bg-white/10 px-1 rounded">O(2^n)</code> which is inefficient for large inputs.
                                    </p>
                                    <p>
                                        <strong className="text-emerald-300 block mb-1">Optimization Suggestion</strong>
                                        Use <strong>Memoization</strong> or an <strong>Iterative Approach</strong> to reduce complexity to <code className="text-white bg-white/10 px-1 rounded">O(n)</code>.
                                    </p>
                                </div>
                                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-0">
                                    Auto-Optimize Code
                                </Button>
                            </div>
                        </div>
                    </div>
                </AnimatedText>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 relative z-10 bg-background/50 backdrop-blur-3xl border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <AnimatedText className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for developers,<br />designed for learners.</h2>
                        <p className="text-muted-foreground text-lg">Every feature you need to master your codebase, all in one place.</p>
                    </AnimatedText>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: Code2, title: "Multi-Language Support", desc: "Python, Java, C++, JS equivalent support." },
                            { icon: Zap, title: "Instant Analysis", desc: "Get complexity analysis in milliseconds." },
                            { icon: Sparkles, title: "AI Optimizations", desc: "Auto-refactor code for better performance." },
                            { icon: BookOpen, title: "Learning Modes", desc: "Explanations tailored to your skill level." },
                            { icon: Share2, title: "Easy Sharing", desc: "Export to PDF or share via link." },
                            { icon: Lock, title: "Secure & Private", desc: "Your code is encrypted and never stored tailored." }
                        ].map((feature, i) => (
                            <AnimatedText key={i} delay={0.1 * i}>
                                <div className="group h-full p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <feature.icon className="w-6 h-6 text-violet-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                                </div>
                            </AnimatedText>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 to-transparent pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-20">
                    <AnimatedText>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8">Ready to level up?</h2>
                        <p className="text-xl text-muted-foreground mb-12">
                            Join thousands of developers using AI Code Explain to write better, faster code tailored to your needs.
                        </p>
                        <Link href="/auth">
                            <Button size="lg" className="h-16 px-10 rounded-full bg-white text-black hover:bg-white/90 text-lg font-bold shadow-2xl shadow-violet-500/20 hover:scale-105 transition-all">
                                Get Started for Free
                            </Button>
                        </Link>
                    </AnimatedText>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 relative z-10 bg-black">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-muted-foreground" />
                        <span className="text-muted-foreground font-medium">AI Code Explain</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        © 2024 GLA University Mini Project. Built by Anukalp, Nishant, Prince, Utpal, Jatin.
                    </p>
                </div>
            </footer>
        </div>
    );
}
