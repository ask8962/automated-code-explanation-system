'use client';

import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
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
    Menu,
    X,
    ChevronUp,
    ChevronDown,
    Linkedin,
    Twitter,
    Users,
    Clock,
    Globe,
    Heart,
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/theme-toggle';

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

function TypewriterText({ words, className }: { words: string[]; className?: string }) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentWord = words[currentWordIndex];
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                setDisplayText(currentWord.slice(0, displayText.length + 1));
                if (displayText.length === currentWord.length) {
                    setTimeout(() => setIsDeleting(true), 2000);
                    return;
                }
            } else {
                setDisplayText(currentWord.slice(0, displayText.length - 1));
                if (displayText.length === 0) {
                    setIsDeleting(false);
                    setCurrentWordIndex((prev) => (prev + 1) % words.length);
                }
            }
        }, isDeleting ? 50 : 100);
        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentWordIndex, words]);

    return (
        <span className={className}>
            {displayText}
            <span className="animate-pulse">|</span>
        </span>
    );
}

/* =============================================
   MAIN LANDING PAGE
   ============================================= */
export default function Page() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeMode, setActiveMode] = useState(0);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [currentVideoPart, setCurrentVideoPart] = useState<1 | 2>(1);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const features = [
        { icon: Code2, title: "Multi-Language", desc: "Python, JavaScript, Java, C, C++ — all supported out of the box.", span: "md:col-span-1", iconBg: "from-blue-500/20 to-blue-500/5", iconColor: "text-blue-400" },
        { icon: Zap, title: "Instant Analysis", desc: "Get step-by-step explanations with time and space complexity in seconds.", span: "md:col-span-1", iconBg: "from-amber-500/20 to-amber-500/5", iconColor: "text-amber-400" },
        { icon: Sparkles, title: "AI Optimization", desc: "Auto-refactor your code for better performance with one click.", span: "md:col-span-1", iconBg: "from-violet-500/20 to-violet-500/5", iconColor: "text-violet-400" },
        { icon: BookOpen, title: "Three Learning Modes", desc: "Beginner-friendly, exam prep, or technical interview — pick your style.", span: "md:col-span-2", iconBg: "from-emerald-500/20 to-emerald-500/5", iconColor: "text-emerald-400" },
        { icon: Share2, title: "Export & Share", desc: "Download explanations as PDF or copy to clipboard instantly.", span: "md:col-span-1", iconBg: "from-cyan-500/20 to-cyan-500/5", iconColor: "text-cyan-400" },
    ];

    const modes = [
        { icon: GraduationCap, title: "Beginner", desc: "Simple language with analogies", color: "from-emerald-500/20 to-emerald-500/5", accent: "text-emerald-400", border: "border-emerald-500/20" },
        { icon: Brain, title: "Exam Prep", desc: "Key concepts & definitions", color: "from-blue-500/20 to-blue-500/5", accent: "text-blue-400", border: "border-blue-500/20" },
        { icon: Briefcase, title: "Interview", desc: "Approach & complexity focus", color: "from-amber-500/20 to-amber-500/5", accent: "text-amber-400", border: "border-amber-500/20" },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-primary/30 selection:text-white">

            {/* Skip to content — accessibility */}
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:font-medium focus:text-sm">
                Skip to main content
            </a>

            {/* Scroll Progress */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
                style={{
                    scaleX,
                    background: 'linear-gradient(90deg, #8b5cf6, #6366f1, #22d3ee)',
                }}
            />

            {/* 3D Background - Kept intact but color adjusted underneath */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-[#050510]">
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
                {/* Extreme Depth Layers */}
                <div className="absolute inset-0 bg-[#0d0d19]/80 backdrop-blur-[2px]" />
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#7C3AED]/10 via-[#06B6D4]/5 to-transparent blur-[100px]" />
            </div>

            {/* =============================================
                NAVIGATION (Neon Protocol)
               ============================================= */}
            <nav className={`fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 rounded-2xl transition-all duration-300 ${scrolled
                ? 'border border-[#4a4455]/30 bg-[#0d0d19]/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)]'
                : 'border border-transparent bg-transparent'
                }`}>
                <div className="px-6 h-16 flex items-center justify-between">
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-9 h-9 rounded-xl border border-[#4a4455]/50 bg-[#1a1a27]/80 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#7C3AED]/40 to-[#06B6D4]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <Terminal className="w-4 h-4 text-[#e3e0f3] z-10" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-[#e3e0f3] font-[family-name:var(--font-space-grotesk)]">
                            AI Code Explain
                        </span>
                    </Link>

                    {/* Links */}
                    <div className="hidden md:flex items-center gap-12 text-sm font-medium text-[#ccc3d8]">
                        {[{ href: '#features', label: 'Features' }, { href: '#how-it-works', label: 'Engine' }, { href: '#modes', label: 'Docs' }].map((link) => (
                            <Link key={link.href} href={link.href} className="relative hover:text-[#e3e0f3] transition-colors duration-200 py-1 group">
                                {link.label}
                                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-1 bg-[#06B6D4] rounded-t-full opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-300 shadow-[0_0_10px_#06B6D4]" />
                            </Link>
                        ))}
                    </div>

                    {/* Auth & CTA */}
                    <div className="flex items-center gap-4">
                        <Link href="https://github.com/ask8962/automated-code-explanation-system" target="_blank" className="hidden sm:flex text-[#ccc3d8] hover:text-[#e3e0f3] transition-colors p-2 rounded-lg hover:bg-[#292936]/50">
                             <Github className="w-5 h-5" />
                        </Link>
                        <ThemeToggle />
                        <Link href="/auth" className="hidden sm:block">
                            <Button className="relative bg-gradient-to-br from-[#7c3aed] to-[#5a00c6] text-white hover:from-[#d2bbff] hover:to-[#7c3aed] hover:text-[#25005a] border-none shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] rounded-xl px-6 font-semibold transition-all duration-300 overflow-hidden group">
                                <span className="relative z-10 flex items-center">
                                    Get Started Free
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Button>
                        </Link>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-xl text-[#ccc3d8] hover:text-[#e3e0f3] hover:bg-[#292936]/50">
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="md:hidden border-t border-[#4a4455]/30 bg-[#0d0d19]/95 backdrop-blur-3xl absolute top-full left-0 w-full mt-2 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="px-6 py-4 space-y-1">
                                {[{ href: '#features', label: 'Features' }, { href: '#how-it-works', label: 'Engine' }, { href: '#modes', label: 'Docs' }].map((link) => (
                                    <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-[#ccc3d8] hover:text-[#e3e0f3] hover:bg-[#292936]/50 rounded-xl">
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* =============================================
                HERO SECTION (Neon Protocol)
               ============================================= */}
            <motion.section
                className="relative min-h-[100svh] flex flex-col justify-center pt-32 pb-20 px-6 overflow-hidden"
                style={{ scale: heroScale }}
                id="main-content"
            >
                <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
                    
                    {/* Left Copy Column */}
                    <div className="text-left flex flex-col items-start pr-4">
                        <RevealText delay={0.1}>
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#4a4455]/40 bg-[#1a1a27]/60 backdrop-blur-xl mb-6 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06B6D4] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#03b5d3]"></span>
                                </span>
                                <span className="text-xs font-semibold text-[#4cd7f6] tracking-widest uppercase font-[family-name:var(--font-space-grotesk)]">System Protocol Active</span>
                            </div>
                        </RevealText>

                        <RevealText delay={0.2}>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.95] font-[family-name:var(--font-space-grotesk)] text-[#e3e0f3]">
                                Understand
                                <br />
                                Code.
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#d2bbff] to-[#06B6D4] glitch-text-4d" data-text="Instantly.">
                                    Instantly.
                                </span>
                            </h1>
                        </RevealText>

                        <RevealText delay={0.35}>
                            <p className="text-lg md:text-xl text-[#ccc3d8] mb-10 leading-relaxed max-w-xl">
                                AI-powered code explanations, live execution, and step-by-step algorithmic visualization — built for developers and students.
                            </p>
                        </RevealText>

                        <RevealText delay={0.45}>
                            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto mt-4">
                                <Link href="/auth" className="w-full sm:w-auto">
                                    <Button size="lg" className="w-full h-14 px-8 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#5a00c6] text-white hover:from-[#d2bbff] hover:to-[#7C3AED] hover:text-[#25005a] border-none shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] text-base font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95">
                                        Get Started Free
                                    </Button>
                                </Link>
                                <Button onClick={() => setIsVideoModalOpen(true)} size="lg" className="extreme-4d-button w-full sm:w-auto h-14 px-8 text-[#e3e0f3] text-base font-bold group border-none">
                                    <span className="relative z-10 flex items-center">
                                        <Play className="w-4 h-4 mr-2 text-[#06B6D4] group-hover:scale-110 shadow-black drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-transform" />
                                        Watch Demo
                                    </span>
                                </Button>
                            </div>
                        </RevealText>
                        
                        <RevealText delay={0.55}>
                            <div className="mt-12 flex items-center gap-8 border-t border-[#4a4455]/30 pt-6">
                                <div>
                                    <div className="text-2xl font-bold text-[#e3e0f3] font-[family-name:var(--font-space-grotesk)]">10,000+</div>
                                    <div className="text-xs text-[#958da1] uppercase tracking-wider font-semibold mt-1">Users</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[#e3e0f3] font-[family-name:var(--font-space-grotesk)]">8</div>
                                    <div className="text-xs text-[#958da1] uppercase tracking-wider font-semibold mt-1">Languages</div>
                                </div>
                                <div className="hidden sm:block">
                                    <div className="text-2xl font-bold text-[#06B6D4] font-[family-name:var(--font-space-grotesk)]">500ms</div>
                                    <div className="text-xs text-[#958da1] uppercase tracking-wider font-semibold mt-1">Response Time</div>
                                </div>
                            </div>
                        </RevealText>
                    </div>

                    {/* Right Visual Column (Extreme 4D Floating Editor) */}
                    <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-auto lg:h-[600px] perspective-[1000px]">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#7C3AED]/30 via-[#03b5d3]/10 to-[#06B6D4]/30 blur-[100px] rounded-full animate-glow-pulse" />
                        
                        {/* 4D Editor Card */}
                        <motion.div 
                            initial={{ rotateX: 0, rotateY: 0, z: 0 }}
                            animate={{ 
                                rotateX: [2, -2, 2], 
                                rotateY: [-3, 3, -3],
                                y: [-10, 10, -10],
                                z: [0, 20, 0]
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-y-4 right-0 left-4 md:left-12 border border-[#4a4455]/40 bg-[#1a1a27]/50 backdrop-blur-3xl rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden flex flex-col transform-style-3d group hover:shadow-[0_40px_80px_rgba(124,58,237,0.3)] duration-700"
                        >
                            {/* Editor Header */}
                            <div className="h-12 border-b border-[#4a4455]/30 bg-[#0d0d19]/80 flex items-center px-4 justify-between">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#ffb4ab]" />
                                    <div className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
                                    <div className="w-3 h-3 rounded-full bg-[#4cd7f6]" />
                                </div>
                                <div className="px-3 py-1 rounded border border-[#4a4455]/50 bg-[#292936]/50 text-[#ccc3d8] text-xs font-mono">
                                    visualizer.ts
                                </div>
                            </div>
                            
                            {/* Editor Body */}
                            <div className="flex-1 p-6 font-mono text-sm leading-relaxed overflow-hidden relative">
                                <div className="text-[#958da1] absolute left-4 select-none text-right w-4">
                                    1<br/>2<br/>3<br/>4<br/>5
                                </div>
                                <div className="pl-8">
                                    <span className="text-[#ffafd3]">const</span> <span className="text-[#4cd7f6]">optimizeAlgorithm</span> <span className="text-[#ccc3d8]">= (</span><span className="text-[#d2bbff]">data</span><span className="text-[#ccc3d8]">)</span> <span className="text-[#ffafd3]">=&gt;</span> <span className="text-[#ccc3d8]">{'{'}</span><br/>
                                    &nbsp;&nbsp;<span className="text-[#ffafd3]">return</span> data.<span className="text-[#4cd7f6]">map</span>(node <span className="text-[#ffafd3]">=&gt;</span> <span className="text-[#ccc3d8]">{'{'}</span><br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#ffafd3]">await</span> <span className="text-[#4cd7f6]">resolveComplexity</span>(node);<br/>
                                    &nbsp;&nbsp;<span className="text-[#ccc3d8]">{'}'}</span>);<br/>
                                    <span className="text-[#ccc3d8]">{'}'}</span>
                                </div>

                                {/* Floating AI Overlay (3D Popout) */}
                                <motion.div 
                                    initial={{ y: 20, opacity: 0, z: 0, rotateX: 0 }}
                                    animate={{ 
                                        y: [0, -5, 0], 
                                        opacity: 1, 
                                        z: [50, 60, 50],
                                        rotateX: [0, 5, 0]
                                    }}
                                    transition={{ 
                                        opacity: { delay: 1, duration: 0.6 },
                                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                        z: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                        rotateX: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                    className="absolute bottom-6 right-6 left-12 border border-[#4a4455]/60 bg-[#292936]/80 backdrop-blur-2xl p-4 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] border-l-4 border-l-[#7C3AED] transform-style-3d translate-z-[50px] group-hover:translate-z-[80px] duration-500"
                                >
                                    <div className="flex gap-3 mb-2">
                                        <Sparkles className="w-4 h-4 text-[#d2bbff] mt-0.5" />
                                        <div className="text-sm text-[#e3e0f3] font-medium">Optimization Found</div>
                                    </div>
                                    <div className="text-xs text-[#ccc3d8] pl-7">
                                        Time complexity can be reduced from <span className="text-[#ffb4ab]">O(N²)</span> to <span className="text-[#4cd7f6]">O(N)</span> using memoization.
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                    
                </div>
            </motion.section>

            {/* =============================================
                LANGUAGE SHOWCASE STRIP
               ============================================= */}
            <section className="relative z-10 py-12 overflow-hidden border-y border-white/[0.04]">
                <div className="max-w-6xl mx-auto px-6 mb-6 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Supported Languages</p>
                </div>
                <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                    <div className="animate-marquee flex gap-12 items-center whitespace-nowrap">
                        {[...Array(2)].map((_, setIndex) => (
                            <div key={setIndex} className="flex gap-12 items-center">
                                {[
                                    { name: 'Python', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                                    { name: 'JavaScript', color: 'text-amber-400', bg: 'bg-amber-500/10' },
                                    { name: 'Java', color: 'text-orange-400', bg: 'bg-orange-500/10' },
                                    { name: 'C', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                                    { name: 'C++', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                                    { name: 'TypeScript', color: 'text-blue-500', bg: 'bg-blue-600/10' },
                                    { name: 'Go', color: 'text-teal-400', bg: 'bg-teal-500/10' },
                                    { name: 'Rust', color: 'text-orange-500', bg: 'bg-orange-600/10' },
                                ].map((lang, i) => (
                                    <div key={i} className="flex items-center gap-3 group">
                                        <div className={`w-10 h-10 rounded-xl ${lang.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <Code2 className={`w-5 h-5 ${lang.color}`} />
                                        </div>
                                        <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{lang.name}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =============================================
                VIDEO MODAL (Extreme 4D Player)
               ============================================= */}
            <AnimatePresence>
                {isVideoModalOpen && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 bg-[#050510]/80"
                    >
                        <div className="absolute inset-0" onClick={() => { setIsVideoModalOpen(false); setCurrentVideoPart(1); }} />
                        
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, rotateX: 10, y: 30 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, rotateX: -10, y: 30 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-5xl aspect-video extreme-4d-button overflow-hidden rounded-2xl flex items-center justify-center bg-black shadow-[0_0_100px_rgba(6,182,212,0.4)]"
                        >
                            <button 
                                onClick={() => { setIsVideoModalOpen(false); setCurrentVideoPart(1); }}
                                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-[#1a1a27]/80 border border-[#4a4455]/50 hover:bg-[#292936] text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            {/* Two-Part Video Sequence */}
                            {currentVideoPart === 1 ? (
                                <video 
                                    src="/part1.mp4" 
                                    className="absolute inset-0 w-full h-full object-cover"
                                    autoPlay 
                                    playsInline
                                    onEnded={() => setCurrentVideoPart(2)}
                                />
                            ) : (
                                <>
                                    <video 
                                        src="/part2.mp4" 
                                        className="absolute inset-0 w-full h-full object-cover z-10"
                                        autoPlay 
                                        playsInline
                                        loop
                                        controls
                                    />
                                    {/* Cyberpunk BGM for Part 2 */}
                                    <audio src="/bgm.mp3" autoPlay loop />
                                </>
                            )}
                            
                            {/* Inner glow mask to make it look like part of our engine */}
                            <div className="absolute inset-0 shadow-[inset_0_0_100px_#050510] pointer-events-none" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* =============================================
                FEATURES — Extreme 4D Bento Grid
               ============================================= */}
            <section id="features" className="py-32 relative z-10">
                <div className="max-w-6xl mx-auto px-6">
                    <RevealText className="text-center max-w-3xl mx-auto mb-20">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#06B6D4] mb-4 font-[family-name:var(--font-space-grotesk)]">System Capabilities</p>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight font-[family-name:var(--font-space-grotesk)] text-[#e3e0f3]">
                            Everything you need to<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#d2bbff] to-[#06B6D4]">master your code.</span>
                        </h2>
                        <p className="text-[#ccc3d8] text-lg font-light">Powerful AI analysis meets brutalist, hardware-accelerated design.</p>
                    </RevealText>

                    <div className="grid md:grid-cols-3 gap-6 perspective-[1000px]">
                        {features.map((f, i) => (
                            <FloatingCard key={i} delay={0.1 * i} className={`${f.span}`}>
                                <div className="absolute -inset-[2px] bg-gradient-to-br from-[#7C3AED]/30 via-transparent to-[#06B6D4]/30 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />
                                <div className="relative bg-[#1a1a27]/40 backdrop-blur-3xl border border-[#4a4455]/30 h-full p-8 rounded-2xl group cursor-default overflow-hidden transform-style-3d hover:rotate-x-[2deg] hover:rotate-y-[-2deg] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                                    {/* Extreme Shimmer overlay */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                                        <div className="absolute top-0 bottom-0 -left-[100%] w-[50%] bg-gradient-to-r from-transparent via-[#06B6D4]/10 to-transparent skew-x-[-20deg] animate-[shimmer_3s_infinite]" />
                                    </div>
                                    <div className={`relative w-14 h-14 rounded-xl border border-[#4a4455]/40 bg-[#0d0d19]/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_0_10px_rgba(124,58,237,0.2)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]`}>
                                        <f.icon className={`w-6 h-6 ${f.iconColor} drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]`} />
                                    </div>
                                    <h3 className="relative text-xl font-bold mb-3 tracking-tight text-[#e3e0f3]">{f.title}</h3>
                                    <p className="relative text-sm text-[#958da1] leading-relaxed font-mono">{f.desc}</p>
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
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7C3AED] mb-4 font-[family-name:var(--font-space-grotesk)]">Execution Engine</p>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)] text-[#e3e0f3]">
                            Three steps to<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#d2bbff] to-[#06B6D4] glitch-text-4d" data-text="total clarity.">total clarity.</span>
                        </h2>
                    </RevealText>

                    <div className="relative perspective-[1000px]">
                        {/* Connecting line (desktop only) - Laser beam */}
                        <div className="hidden md:block absolute top-[3.25rem] left-[calc(16.67%+1.25rem)] right-[calc(16.67%+1.25rem)] h-[2px] bg-gradient-to-r from-[#7C3AED] via-[#06B6D4] to-[#F472B6] shadow-[0_0_15px_#06B6D4] animate-glow-pulse" />

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { step: "01", title: "Paste Your Code", desc: "Drop any snippet — Python, Java, JS. The Engine detects context.", icon: Terminal, color: "from-[#7C3AED] to-[#5a00c6]", border: "border-[#7C3AED]" },
                                { step: "02", title: "Choose Protocol", desc: "Beginner, Exam, or Interview — select processing mode.", icon: Layers, color: "from-[#06B6D4] to-[#038b9e]", border: "border-[#06B6D4]" },
                                { step: "03", title: "Data Extraction", desc: "Instantly receive algorithmic breakdown & O(N) optimizations.", icon: Sparkles, color: "from-[#F472B6] to-[#db2777]", border: "border-[#F472B6]" },
                            ].map((item, i) => (
                                <FloatingCard key={i} delay={0.15 * i}>
                                    <div className="relative bg-[#1a1a27]/30 backdrop-blur-2xl border border-[#4a4455]/40 hover:border-white/20 p-8 rounded-2xl h-full text-center group transform-style-3d hover:-translate-y-2 hover:rotate-x-2 transition-all duration-500 shadow-xl">
                                        {/* Step number badge - Extreme Glow */}
                                        <div className="relative mx-auto mb-8">
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
                                            <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/20 z-10 group-hover:scale-110 transition-transform duration-300`}>
                                                <item.icon className="w-7 h-7 text-white drop-shadow-md" />
                                            </div>
                                            <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-xl bg-[#0a0a14] border-2 ${item.border} flex items-center justify-center z-20 shadow-[0_0_15px_rgba(255,255,255,0.1)]`}>
                                                <span className="text-xs font-bold text-[#e3e0f3] font-mono">{item.step}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 tracking-tight text-[#e3e0f3]">{item.title}</h3>
                                        <p className="text-sm text-[#958da1] leading-relaxed font-mono">{item.desc}</p>
                                    </div>
                                </FloatingCard>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section id="modes" className="py-32 relative z-10">
                <div className="max-w-5xl mx-auto px-6">
                    <RevealText className="text-center mb-16">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F472B6] mb-4 font-[family-name:var(--font-space-grotesk)]">Processing Directive</p>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)] text-[#e3e0f3]">
                            Tailored to your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F472B6] via-[#7C3AED] to-[#06B6D4]">learning style.</span>
                        </h2>
                    </RevealText>

                    {/* Mode Tabs (Cyber Switches) */}
                    <div className="flex flex-wrap justify-center gap-4 mb-16 relative z-10">
                        {modes.map((mode, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveMode(i)}
                                className={`relative flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 text-sm font-bold font-mono overflow-hidden ${activeMode === i
                                    ? `border-none text-black scale-110 shadow-[0_0_30px_rgba(6,182,212,0.4)]`
                                    : 'border border-[#4a4455]/50 bg-[#1a1a27]/50 text-[#ccc3d8] hover:bg-[#292936] hover:text-white'
                                    }`}
                            >
                                {activeMode === i && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] animate-shimmer opacity-90" />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <mode.icon className="w-5 h-5 flex-shrink-0" />
                                    {mode.title}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Mode Preview Card (Hologram Screen) */}
                    <motion.div
                        key={activeMode}
                        initial={{ opacity: 0, y: 20, rotateX: -10 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="max-w-3xl mx-auto perspective-[1200px]"
                    >
                        <div className="relative bg-[#0d0d19]/80 backdrop-blur-3xl p-10 rounded-2xl border border-[#4a4455]/50 shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.1)] transform-style-3d hover:rotate-y-[2deg] hover:rotate-x-[2deg] transition-transform duration-700">
                            {/* Ambient internal light */}
                            <div className="absolute inset-x-20 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#06B6D4] to-transparent opacity-50 shadow-[0_0_20px_#06B6D4]" />
                            
                            <div className="flex items-start md:items-center gap-4 mb-8">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center border border-white/10 bg-gradient-to-br ${modes[activeMode].color} shadow-lg`}>
                                    {React.createElement(modes[activeMode].icon, { className: `w-6 h-6 ${modes[activeMode].accent} drop-shadow-md` })}
                                </div>
                                <div>
                                    <h3 className="font-bold text-2xl text-[#e3e0f3] tracking-tighter">{modes[activeMode].title} Protocol</h3>
                                    <p className="text-[#958da1] text-sm font-mono mt-1">{modes[activeMode].desc}</p>
                                </div>
                            </div>
                            
                            {/* Holographic Console */}
                            <div className="p-6 rounded-xl bg-black/60 border border-[#4a4455]/30 font-mono text-sm leading-relaxed relative overflow-hidden">
                                {/* Scanline effect */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-20" />
                                
                                {activeMode === 0 && (
                                    <div className="space-y-4 text-[#ccc3d8] relative z-10">
                                        <div className="flex gap-4"><span className="text-[#5eead4] min-w-[120px] font-bold">» DIRECTIVE:</span> A recipe with step-by-step instructions</div>
                                        <div className="flex gap-4"><span className="text-[#5eead4] min-w-[120px] font-bold">» EXECUTION:</span> Takes a number and returns Fibonacci value</div>
                                        <div className="flex gap-4"><span className="text-[#5eead4] min-w-[120px] font-bold">» ANALOGY:</span> Like counting rabbits each generation 🐰</div>
                                    </div>
                                )}
                                {activeMode === 1 && (
                                    <div className="space-y-4 text-[#ccc3d8] relative z-10">
                                        <div className="flex gap-4"><span className="text-[#93c5fd] min-w-[120px] font-bold">» CONCEPT:</span> Recursion — function calling itself</div>
                                        <div className="flex gap-4"><span className="text-[#93c5fd] min-w-[120px] font-bold">» COMPLEXITY:</span> O(2^n) — exponential overload</div>
                                        <div className="flex gap-4"><span className="text-[#93c5fd] min-w-[120px] font-bold">» CRITICAL:</span> Base case prevents infinite system crash</div>
                                    </div>
                                )}
                                {activeMode === 2 && (
                                    <div className="space-y-4 text-[#ccc3d8] relative z-10">
                                        <div className="flex gap-4"><span className="text-[#fcd34d] min-w-[120px] font-bold">» ARCHITECTURE:</span> Recursive decomposition</div>
                                        <div className="flex gap-4"><span className="text-[#fcd34d] min-w-[120px] font-bold">» OVERRIDE:</span> Memoization reduces to O(n) compute</div>
                                        <div className="flex gap-4"><span className="text-[#fcd34d] min-w-[120px] font-bold">» FOLLOW-UP:</span> Iterative approach uses O(1) memory space</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-24 relative z-10 border-y border-white/[0.04]">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: 5, suffix: '+', label: 'Languages', icon: Globe },
                            { value: 3, suffix: '', label: 'Learning Modes', icon: BookOpen },
                            { value: 99, suffix: '%', label: 'Accuracy', icon: Cpu },
                            { value: 500, suffix: 'ms', label: 'Avg Response', icon: Clock },
                        ].map((stat, i) => (
                            <RevealText key={i} delay={0.1 * i}>
                                <div className="space-y-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mx-auto mb-2">
                                        <stat.icon className="w-5 h-5 text-primary" />
                                    </div>
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

            <section className="py-40 relative z-10 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
                </div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-20">
                    <RevealText>
                        {/* Social proof */}
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl mb-10">
                            <div className="flex -space-x-2">
                                {[...'🧑‍💻👩‍💻👨‍💻'].map((e, i) => (
                                    <span key={i} className="text-lg">{e}</span>
                                ))}
                            </div>
                            <span className="text-xs text-muted-foreground">Trusted by students at GLA University</span>
                        </div>

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
                FAQ
               ============================================= */}
            <section id="faq" className="py-32 relative z-10">
                <div className="max-w-3xl mx-auto px-6">
                    <RevealText className="text-center mb-16">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">FAQ</p>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Common <span className="gradient-text">questions.</span>
                        </h2>
                    </RevealText>

                    <div className="space-y-3">
                        {[
                            { q: 'What programming languages are supported?', a: 'We support Python, JavaScript, Java, C, and C++ with more languages coming soon.' },
                            { q: 'Is the tool free to use?', a: 'Yes! AI Code Explain is completely free for students and developers. Sign up and start analyzing code immediately.' },
                            { q: 'How accurate are the AI explanations?', a: 'Our AI is powered by LLaMA 3.3 via Groq, providing highly accurate explanations with 99%+ accuracy on standard code patterns.' },
                            { q: 'Can I use it for exam preparation?', a: 'Absolutely! The Exam Prep mode is specifically designed to highlight key concepts, definitions, and important patterns commonly asked in exams.' },
                            { q: 'How does the optimization feature work?', a: 'Our AI analyzes your code and suggests refactored versions with improved time/space complexity, cleaner syntax, and best practices.' },
                        ].map((faq, i) => (
                            <div key={i} className="glass-card rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                                    aria-expanded={openFaq === i}
                                >
                                    <span className="font-medium text-sm pr-4">{faq.q}</span>
                                    {openFaq === i ? (
                                        <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    )}
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =============================================
                FOOTER
               ============================================= */}
            <footer className="border-t border-white/[0.04] py-16 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-10 mb-12">
                        {/* Brand */}
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center">
                                    <Terminal className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-base font-bold">AI Code Explain</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Understand any code with AI-powered explanations. Built for students and developers.
                            </p>
                        </div>
                        {/* Links */}
                        {[
                            { title: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'How it Works', href: '#how-it-works' }, { label: 'Modes', href: '#modes' }] },
                            { title: 'Resources', links: [{ label: 'FAQ', href: '#faq' }, { label: 'GitHub', href: 'https://github.com/ask8962/automated-code-explanation-system' }] },
                            { title: 'Team', links: [{ label: 'Anukalp', href: '#' }, { label: 'Nishant', href: '#' }, { label: 'Prince', href: '#' }, { label: 'Utpal', href: '#' }, { label: 'Jatin', href: '#' }] },
                        ].map((col, i) => (
                            <div key={i}>
                                <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground/70 mb-4">{col.title}</h4>
                                <ul className="space-y-2.5">
                                    {col.links.map((link, j) => (
                                        <li key={j}>
                                            <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    {/* Bottom bar */}
                    <div className="border-t border-white/[0.04] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-muted-foreground">
                            © 2024 GLA University Mini Project • Built with <Heart className="w-3 h-3 inline text-red-400" /> by the team
                        </p>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Scroll to top"
                        >
                            Back to top
                            <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
