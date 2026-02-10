'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Code2,
  BarChart3,
  Sparkles,
  Terminal,
  Cpu,
  Layers,
  Github,
  Globe,
  Brain,
  FileCode2,
  Lightbulb,
  TrendingUp,
  Zap,
  Shield,
  Download,
  Search,
  Moon,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

const Scene = dynamic(() => import('@/components/Scene'), { ssr: false });

/* ============================================
   TYPEWRITER HOOK
   ============================================ */
function useTypewriter(texts: string[], speed = 50, pause = 2000) {
  const [display, setDisplay] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplay(current.slice(0, charIndex + 1));
        if (charIndex + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), pause);
        } else {
          setCharIndex(charIndex + 1);
        }
      } else {
        setDisplay(current.slice(0, charIndex - 1));
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
          setCharIndex(0);
        } else {
          setCharIndex(charIndex - 1);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, textIndex, texts, speed, pause]);

  return display;
}

/* ============================================
   ANIMATED COUNTER
   ============================================ */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let s = 0;
    const step = target / 125; // Slower animation
    const t = setInterval(() => {
      s += step;
      if (s >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(s));
    }, 16);
    return () => clearInterval(t);
  }, [visible, target]);

  return <span ref={ref} className="tabular-nums">{count.toLocaleString()}{suffix}</span>;
}

/* ============================================
   MARQUEE
   ============================================ */
function Marquee({ items }: { items: string[] }) {
  return (
    <div className="relative overflow-hidden py-6">
      <div className="flex animate-[marquee_30s_linear_infinite] gap-8 whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/[0.06] bg-white/[0.02] text-white/50 text-sm font-medium shrink-0">
            <div className="w-2 h-2 rounded-full bg-violet-500/50" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   MAIN PAGE
   ============================================ */
export default function Page() {
  const typedText = useTypewriter(['fibonacci(n)', 'quickSort(arr)', 'bfs(graph)', 'mergeSort(data)'], 80, 1500);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] text-white relative overflow-x-hidden font-sans">
      {/* Mouse Cursor Glow */}
      <div
        className="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-[2] opacity-[0.08]"
        style={{
          background: 'radial-gradient(circle, #7c3aed 0%, transparent 60%)',
          left: cursorPos.x - 300,
          top: cursorPos.y - 300,
          transition: 'left 0.1s ease-out, top 0.1s ease-out',
        }}
      />

      {/* 3D Background */}
      <div className="fixed inset-0 z-0 opacity-80 pointer-events-none">
        <Scene />
      </div>

      {/* Top gradient overlay for readability */}
      <div className="fixed top-0 left-0 right-0 h-[400px] z-[1] pointer-events-none bg-gradient-to-b from-[#030303]/90 via-[#030303]/30 to-transparent" />

      {/* ==================== NAV ==================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030303]/60 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl blur-sm opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight">
              AI Code<span className="text-violet-400">.</span>Explain
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {['Features', 'Process', 'Stack'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="px-5 py-2 text-sm text-white/40 hover:text-white hover:bg-white/[0.04] rounded-full transition-all duration-200">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth">
              <Button variant="ghost" className="text-white/50 hover:text-white hover:bg-white/[0.04] h-11 px-5 text-sm rounded-full">
                Sign In
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-white text-black hover:bg-white/90 font-semibold h-11 px-7 rounded-full text-sm hover:scale-[1.03] transition-all shadow-xl shadow-white/5">
                Get Started <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center items-center pt-[72px] px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md mb-12"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
            <span className="text-sm font-medium text-white/50">Powered by Llama 3 &amp; Groq</span>
            <span className="text-white/20">·</span>
            <span className="text-sm font-medium text-violet-400">Version 2.0</span>
          </motion.div>

          {/* Main heading */}
          <h1 className="text-[clamp(3.5rem,9vw,8rem)] font-black leading-[0.9] tracking-[-0.04em] mb-10">
            <span className="block text-white drop-shadow-[0_0_60px_rgba(124,58,237,0.15)]">Understand Code</span>
            <span className="block mt-3 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 animate-[gradient-x_3s_ease_infinite] bg-[length:200%_auto]">
              Like Never Before.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-xl md:text-2xl text-white/30 max-w-2xl mx-auto leading-relaxed mb-14 font-light">
            Paste any snippet and get <span className="text-white/60 font-medium">crystal-clear explanations</span>, complexity analysis, and AI-powered optimizations.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/auth">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button className="h-[64px] px-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-lg shadow-[0_0_80px_-20px_rgba(124,58,237,0.6)] transition-all duration-300">
                  <Sparkles className="w-5 h-5 mr-3" />
                  Start Explaining
                  <ArrowRight className="w-5 h-5 ml-2.5" />
                </Button>
              </motion.div>
            </Link>
            <a
              href="https://github.com/ask8962/automated-code-explanation-system"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-[64px] px-12 rounded-full border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] flex items-center justify-center gap-3 font-semibold text-lg text-white/50 hover:text-white transition-all duration-300 cursor-pointer"
              >
                <Github className="w-5 h-5" />
                Star on GitHub
              </motion.div>
            </a>
          </div>
        </motion.div>

        {/* Code Preview with Animated Gradient Border */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-32 w-full max-w-4xl"
        >
          {/* Gradient border wrapper */}
          <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-violet-500/30 via-indigo-500/30 to-purple-500/30 shadow-2xl shadow-violet-500/[0.08]">
            <div className="rounded-2xl overflow-hidden bg-[#0a0a0a]">
              {/* Window Chrome */}
              <div className="flex items-center gap-2 px-5 py-4 bg-white/[0.02] border-b border-white/[0.04]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-12 py-1.5 rounded-lg bg-white/[0.03] text-xs text-white/20 font-mono border border-white/[0.04]">
                    ai-code-explain ~/dashboard
                  </div>
                </div>
              </div>

              {/* Code with typewriter */}
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="px-3 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-400 uppercase tracking-wider">Python</div>
                  <div className="px-3 py-1 rounded-md bg-white/[0.03] border border-white/[0.04] text-xs font-medium text-white/25">Auto-detected</div>
                </div>

                <pre className="font-mono text-[16px] leading-[2] overflow-x-auto">
                  <code>
                    <span className="text-white/20 select-none mr-6">1</span>
                    <span className="text-violet-400 font-medium">def</span>{' '}
                    <span className="text-blue-300">{typedText}</span>
                    <span className="text-white/40">(</span>
                    <span className="text-orange-300">n</span>
                    <span className="text-white/40">):</span>{'\n'}

                    <span className="text-white/20 select-none mr-6">2</span>
                    {'    '}<span className="text-violet-400">if</span>{' '}
                    <span className="text-white/80">n</span>{' '}
                    <span className="text-violet-400">&lt;=</span>{' '}
                    <span className="text-emerald-300">1</span>
                    <span className="text-white/40">:</span>{'\n'}

                    <span className="text-white/20 select-none mr-6">3</span>
                    {'        '}<span className="text-violet-400">return</span>{' '}
                    <span className="text-white/80">n</span>{'\n'}

                    <span className="text-white/20 select-none mr-6">4</span>
                    {'    '}<span className="text-violet-400">return</span>{' '}
                    <span className="text-blue-300">solve</span>
                    <span className="text-white/40">(</span>
                    <span className="text-white/80">n</span>
                    <span className="text-violet-400">-</span>
                    <span className="text-emerald-300">1</span>
                    <span className="text-white/40">)</span>{' '}
                    <span className="text-violet-400">+</span>{' '}
                    <span className="text-blue-300">solve</span>
                    <span className="text-white/40">(</span>
                    <span className="text-white/80">n</span>
                    <span className="text-violet-400">-</span>
                    <span className="text-emerald-300">2</span>
                    <span className="text-white/40">)</span>
                    <span className="inline-block w-[2px] h-5 bg-violet-400 ml-1 animate-pulse" />
                  </code>
                </pre>

                {/* AI Analysis */}
                <div className="mt-8 pt-8 border-t border-white/[0.04]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
                      <Brain className="w-3.5 h-3.5 text-violet-400" />
                      <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">AI Insight</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <Zap className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-xs font-bold text-orange-400">O(2ⁿ)</span>
                    </div>
                  </div>
                  <p className="text-[16px] text-white/30 leading-relaxed">
                    This function uses <span className="text-white/70 font-medium">naive recursion</span> to compute values, leading to redundant calculations.
                    <br className="hidden md:block" />
                    AI Suggestion: Use <span className="text-emerald-400 font-medium">dynamic programming</span> or <span className="text-blue-400 font-medium">memoization</span> to optimize to <span className="text-emerald-300 font-mono">O(n)</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==================== TECH MARQUEE ==================== */}
      <section id="stack" className="relative z-10 border-y border-white/[0.03] py-8 overflow-hidden bg-white/[0.01]">
        <Marquee items={['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Firestore', 'Groq API', 'Llama 3', 'Shadcn/UI', 'Vercel', 'Three.js', 'Framer Motion']} />
      </section>

      {/* ==================== STATS ==================== */}
      <section className="relative z-10 py-32">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { val: 100, suffix: '%', label: 'Accuracy' },
            { val: 5, suffix: '+', label: 'Languages' },
            { val: 24, suffix: '/7', label: 'Availability' },
            { val: 10, suffix: 'x', label: 'Faster' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-6xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-4">
                <AnimatedCounter target={s.val} suffix={s.suffix} />
              </div>
              <div className="text-sm text-white/20 font-bold uppercase tracking-[0.3em]">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== BENTO FEATURES ==================== */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20 text-center md:text-left">
            <p className="text-sm font-bold text-violet-400 uppercase tracking-[0.3em] mb-4">Features</p>
            <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-tight">
              Everything You Need.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">Nothing You Don&apos;t.</span>
            </h2>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large card */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="md:col-span-2 p-12 rounded-3xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-violet-500/20 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <Code2 className="w-64 h-64 text-white" />
              </div>
              <Code2 className="w-12 h-12 text-blue-400 mb-8 group-hover:scale-110 transition-transform relative z-10" />
              <h3 className="text-3xl font-bold mb-4 text-white/90 relative z-10">Multi-Language Support</h3>
              <p className="text-white/30 text-xl leading-relaxed max-w-lg relative z-10">
                Python, JavaScript, Java, C++, and C. Paste code in any supported language and get instant, detailed explanations.
              </p>
              <div className="flex gap-3 mt-8 relative z-10">
                {['Python', 'Java', 'C++', 'JS', 'C'].map((l) => (
                  <span key={l} className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm font-mono text-white/40 group-hover:text-white/80 transition-colors">{l}</span>
                ))}
              </div>
            </motion.div>

            {/* Small card */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="p-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-violet-500/20 transition-all duration-500 group"
            >
              <Brain className="w-12 h-12 text-violet-400 mb-8 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold mb-4 text-white/90">Deep AI Analysis</h3>
              <p className="text-white/30 text-lg leading-relaxed">Break down complex algorithms into clear, simple steps anyone can understand.</p>
            </motion.div>

            {/* Small card */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
              className="p-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-violet-500/20 transition-all duration-500 group"
            >
              <BarChart3 className="w-12 h-12 text-orange-400 mb-8 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold mb-4 text-white/90">Complexity Stats</h3>
              <p className="text-white/30 text-lg leading-relaxed">Visual Big-O time and space complexity analysis with clear explanations.</p>
            </motion.div>

            {/* Large card */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="md:col-span-2 p-12 rounded-3xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-violet-500/20 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="w-64 h-64 text-white" />
              </div>
              <TrendingUp className="w-12 h-12 text-emerald-400 mb-8 group-hover:scale-110 transition-transform relative z-10" />
              <h3 className="text-3xl font-bold mb-4 text-white/90 relative z-10">Code Optimizer</h3>
              <p className="text-white/30 text-xl leading-relaxed max-w-lg relative z-10">
                AI suggests optimized versions of your code. See before/after comparisons with highlighted improvements.
              </p>
              <div className="flex gap-3 mt-8 relative z-10">
                {['Performance', 'Readability', 'Best Practices'].map((t) => (
                  <span key={t} className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/15 text-sm font-medium text-emerald-400/80">{t}</span>
                ))}
              </div>
            </motion.div>

            {/* Bottom row — 3 equal */}
            {[
              { icon: Lightbulb, title: '3 Learning Modes', desc: 'Beginner, Exam, Interview.', color: 'text-yellow-400' },
              { icon: Search, title: 'History Search', desc: 'Search & filter past analyses.', color: 'text-cyan-400' },
              { icon: Download, title: 'PDF Export', desc: 'Download explanations as PDF.', color: 'text-pink-400' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}
                className="p-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-violet-500/20 transition-all duration-500 group"
              >
                <f.icon className={`w-10 h-10 ${f.color} mb-6 group-hover:scale-110 transition-transform`} />
                <h3 className="text-xl font-bold mb-3 text-white/90">{f.title}</h3>
                <p className="text-lg text-white/30">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section id="process" className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-24">
            <p className="text-xs font-bold text-violet-400 uppercase tracking-[0.3em] mb-4">Process</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              Three Steps.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">Zero Confusion.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '01', icon: FileCode2, title: 'Paste Code', desc: 'Drop any code snippet. We auto-detect the language.' },
              { n: '02', icon: Cpu, title: 'Pick Mode', desc: 'Choose Beginner, Exam Prep, or Interview mode.' },
              { n: '03', icon: Sparkles, title: 'Get Insights', desc: 'Receive structured AI explanations with examples.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="relative text-center group"
              >
                <div className="text-[160px] font-black text-white/[0.015] absolute -top-12 left-1/2 -translate-x-1/2 select-none pointer-events-none leading-none">
                  {item.n}
                </div>
                <div className="relative z-10 p-12 rounded-3xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-violet-500/20 transition-all duration-500">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/15 to-indigo-500/5 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform border border-violet-500/10">
                    <item.icon className="w-10 h-10 text-violet-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white/90">{item.title}</h3>
                  <p className="text-[16px] text-white/30 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="relative z-10 py-48 px-6">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[600px] rounded-full bg-violet-600/[0.08] blur-[150px]" />
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10">
            <h2 className="text-5xl md:text-8xl font-black tracking-tight mb-10 leading-[0.9]">
              Ready to{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
                Master Code?
              </span>
            </h2>
            <p className="text-2xl text-white/30 max-w-xl mx-auto mb-16 font-light">
              Stop staring at confusing code. Let AI break it down in seconds.
            </p>
            <Link href="/auth">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="inline-block">
                <Button className="h-[72px] px-16 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xl shadow-[0_0_100px_-25px_rgba(124,58,237,0.6)] transition-all duration-300">
                  <Sparkles className="w-7 h-7 mr-3.5" />
                  Get Started — It&apos;s Free
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="relative z-10 border-t border-white/[0.03] bg-[#030303] py-24 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center border border-white/[0.06]">
                  <Terminal className="w-6 h-6 text-white/60" />
                </div>
                <span className="text-2xl font-bold">AI Code Explain</span>
              </div>
              <p className="text-white/20 max-w-sm text-base leading-relaxed">
                A Mini Project by GLA University<br />B.Tech CSE · Section AA
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-8">Team Members</h3>
              <div className="grid grid-cols-2 gap-x-16 gap-y-4 text-sm">
                <span className="text-white/60">Anukalp Gupta</span><span className="text-white/20 font-mono text-xs">2315000373</span>
                <span className="text-white/60">Nishant Singh</span><span className="text-white/20 font-mono text-xs">2315001492</span>
                <span className="text-white/60">Prince Kumar</span><span className="text-white/20 font-mono text-xs">2315001678</span>
                <span className="text-white/60">Utpal Kumar</span><span className="text-white/20 font-mono text-xs">2315002369</span>
                <span className="text-white/60">Jatin Chauhan</span><span className="text-white/20 font-mono text-xs">2315001014</span>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/[0.03] flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/15">&copy; 2025 AI Code Explain · GLA University Mini Project</p>
            <div className="flex gap-6">
              <a href="https://github.com/ask8962/automated-code-explanation-system" target="_blank" rel="noopener noreferrer" className="text-white/15 hover:text-white/50 transition-colors"><Github className="w-6 h-6" /></a>
              <a href="#" className="text-white/15 hover:text-white/50 transition-colors"><Globe className="w-6 h-6" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
