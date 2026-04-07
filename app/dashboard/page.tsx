'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { useGenerateExplanation } from '@/hooks/use-generate-explanation';
import { useOptimizeCode } from '@/hooks/use-optimize-code';
import { useGenerateFlowchart } from '@/hooks/use-generate-flowchart';
import { useExecuteCode } from '@/hooks/use-execute-code';
import { useVisualizeSteps } from '@/hooks/use-visualize-steps';
import CodeExplanationPanel from '@/components/code-explanation-panel';
import OptimizationPanel from '@/components/optimization-panel';
import FlowchartPanel from '@/components/flowchart-panel';
import CodeOutputPanel from '@/components/code-output-panel';
import AlgorithmVisualizer from '@/components/algorithm-visualizer';
import { CodeInput } from '@/components/code-input';
import { Navbar } from '@/components/navbar';
import { Loader2, Zap, Sparkles, Code2, GitBranch, Play, Footprints } from 'lucide-react';
import { toast } from 'sonner';
import { ExplanationSkeleton } from '@/components/explanation-skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('@/components/Scene'), { ssr: false });

export type ExplanationMode = 'beginner' | 'exam' | 'interview';
export type Language = 'python' | 'javascript' | 'java' | 'cpp' | 'c';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('python');
  const [mode, setMode] = useState<ExplanationMode>('beginner');
  const { generateExplanation, isLoading, explanationData, currentDocId } = useGenerateExplanation();
  const { optimizeCode, isOptimizing, optimizationData } = useOptimizeCode();
  const { generateFlowchart, isGenerating: isGeneratingFlowchart, flowchartData, clearFlowchart } = useGenerateFlowchart();
  const { executeCode, isExecuting, executionResult, clearResult: clearExecution } = useExecuteCode();
  const { visualizeSteps, isVisualizing, stepsData, clearSteps } = useVisualizeSteps();
  const [showOptimization, setShowOptimization] = useState(false);
  const [showFlowchart, setShowFlowchart] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [activeView, setActiveView] = useState<'explain' | 'optimize' | 'flowchart' | 'output' | 'visualizer'>('explain');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020205]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center animate-pulse">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-cyan-500/30 animate-ping" />
          </div>
          <p className="text-xs text-white/50 tracking-widest uppercase">Initializing Neural Link...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const switchView = (view: typeof activeView) => {
    setActiveView(view);
    setShowOptimization(view === 'optimize');
    setShowFlowchart(view === 'flowchart');
    setShowOutput(view === 'output');
    setShowVisualizer(view === 'visualizer');
  };

  const handleExplain = async (codeInput: string, lang: string, m: string) => {
    setCode(codeInput);
    setLanguage(lang as Language);
    setMode(m as ExplanationMode);
    switchView('explain');
    clearFlowchart();
    await generateExplanation({
      code: codeInput,
      language: lang,
      mode: m as ExplanationMode,
      userId: user.uid,
    });
  };

  const handleOptimize = async () => {
    if (!code) {
      toast.error('Matrix error: Inject source code first.');
      return;
    }
    switchView('optimize');
    await optimizeCode(code, language);
  };

  const handleVisualize = async () => {
    if (!code) {
      toast.error('Matrix error: Inject source code first.');
      return;
    }
    switchView('flowchart');
    await generateFlowchart(code, language);
  };

  const handleRunCode = async () => {
    if (!code) {
      toast.error('Matrix error: Inject source code first.');
      return;
    }
    switchView('output');
    await executeCode(code, language);
  };

  const handleStepThrough = async () => {
    if (!code) {
      toast.error('Matrix error: Inject source code first.');
      return;
    }
    switchView('visualizer');
    await visualizeSteps(code, language);
  };

  const handleCopyExplanation = () => {
    if (explanationData) {
      const text = `Overview: ${explanationData.overview}\n\nSteps:\n${explanationData.steps
        .map((s, i) => `${i + 1}. ${s.title}: ${s.description}`)
        .join('\n')}`;
      navigator.clipboard.writeText(text);
      toast.success('Data synchronized to clipboard.');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#020205]">
      {/* High-End Spatial 3D Environment Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </div>
      
      {/* Advanced Vignette so the UI reads clearly */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#020205]/40 via-[#020205]/20 to-[#020205]/80 pointer-events-none" />

      {/* Main Glass Workspace */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="bg-[#0a0a14]/60 backdrop-blur-2xl border-b border-white/5 shadow-2xl">
          <Navbar />
        </div>

        <main className="max-w-[90rem] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
          {/* Spatial Header */}
          <motion.div
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="mb-10 text-center lg:text-left"
          >
            <h1 className="text-4xl font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white via-white/80 to-white/20 drop-shadow-2xl">
              Spatial Workspace
            </h1>
            <p className="text-sm text-white/50 uppercase tracking-widest font-semibold flex items-center justify-center lg:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Neural Link Established
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8 items-start flex-1">
            {/* Left Spatial Panel: Code Injection */}
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="rounded-[2.5rem] border border-white/10 bg-[#0a0a14]/60 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(255,255,255,0.02)] overflow-hidden extreme-4d-button"
              >
                {/* MacOS Glass Header */}
                <div className="h-10 bg-white/[0.02] border-b border-white/10 flex items-center px-4 gap-2 backdrop-blur-xl">
                  <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  <span className="ml-4 text-[10px] uppercase font-bold tracking-widest text-white/30">Input.Terminal</span>
                </div>
                
                <div className="p-4 sm:p-6">
                  <CodeInput
                    onExplain={handleExplain}
                    isLoading={isLoading}
                    onCodeChange={(newCode, newLang) => {
                      setCode(newCode);
                      setLanguage(newLang as Language);
                    }}
                  />
                </div>
              </motion.div>

              {/* Action Grid */}
              <AnimatePresence>
                {!isLoading && (explanationData || optimizationData || flowchartData || executionResult || stepsData) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    {[
                      { onClick: handleRunCode, disabled: isExecuting, icon: Play, text: 'Run Code', gradient: 'from-emerald-500 to-teal-600', loading: isExecuting },
                      { onClick: handleStepThrough, disabled: isVisualizing, icon: Footprints, text: 'Visualizer', gradient: 'from-cyan-500 to-blue-600', loading: isVisualizing },
                      { onClick: handleVisualize, disabled: isGeneratingFlowchart, icon: GitBranch, text: 'Flowchart', gradient: 'from-violet-500 to-purple-600', loading: isGeneratingFlowchart },
                      { onClick: handleOptimize, disabled: isOptimizing, icon: Zap, text: 'Optimize', gradient: 'from-amber-500 to-red-600', loading: isOptimizing },
                    ].map((btn, idx) => (
                      <Button
                        key={idx}
                        onClick={btn.onClick}
                        disabled={btn.disabled}
                        className={`bg-gradient-to-br ${btn.gradient} hover:brightness-125 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 transform hover:-translate-y-1 h-12 border border-white/10`}
                      >
                        {btn.loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <btn.icon className="w-5 h-5 mr-2 drop-shadow-md" />}
                        <span className="drop-shadow-md">{btn.text}</span>
                      </Button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Spatial Panel: The Holographic Display */}
            <div className="lg:col-span-7 space-y-6 h-full min-h-[600px] flex flex-col">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, type: 'spring', delay: 0.1 }}
                className="flex-1 rounded-[2.5rem] border border-white/10 bg-[#0a0a14]/60 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(255,255,255,0.02)] overflow-hidden extreme-4d-button relative"
              >
                {/* Secondary Holographic Glow behind the container contents */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />
                
                {/* MacOS Glass Header */}
                <div className="h-10 bg-white/[0.02] border-b border-white/10 flex items-center px-4 gap-2 backdrop-blur-xl relative z-10 w-full">
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <span className="ml-4 text-[10px] uppercase font-bold tracking-widest text-[#06b6d4]">Output.Hologram</span>
                </div>

                <div className="p-4 sm:p-6 lg:p-10 relative z-10 h-[calc(100%-2.5rem)] overflow-y-auto custom-scrollbar">
                  {/* Empty State */}
                  <AnimatePresence mode="wait">
                    {!isLoading && !explanationData && !optimizationData && !flowchartData && !executionResult && !stepsData && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="h-full min-h-[400px] flex items-center justify-center"
                      >
                        <div className="text-center group">
                          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-tr from-cyan-500/20 to-violet-600/20 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/50 transition-colors shadow-[0_0_50px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_100px_rgba(6,182,212,0.3)]">
                            <Sparkles className="w-10 h-10 text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity animate-pulse-slow" />
                          </div>
                          <p className="text-xl font-bold text-white/80 mb-2">Awaiting Computation</p>
                          <p className="text-sm font-medium text-white/40 max-w-sm mx-auto">
                            The engine is idle. Supply raw source code and trigger an execution directive to begin.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Loading State */}
                  <AnimatePresence>
                    {isLoading && !explanationData && (
                      <motion.div
                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, filter: 'blur(10px)' }}
                      >
                        <ExplanationSkeleton />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Code Output Panel (Run Code) */}
                  <AnimatePresence>
                    {!isLoading && activeView === 'output' && executionResult && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <CodeOutputPanel data={executionResult} onRunAgain={handleRunCode} isRunning={isExecuting} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Algorithm Visualizer (Step-Through) */}
                  <AnimatePresence>
                    {!isLoading && activeView === 'visualizer' && stepsData && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <AlgorithmVisualizer data={stepsData} code={code} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Flowchart Panel */}
                  <AnimatePresence>
                    {!isLoading && activeView === 'flowchart' && flowchartData && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <FlowchartPanel data={flowchartData} onRegenerate={() => generateFlowchart(code, language)} isRegenerating={isGeneratingFlowchart} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Optimization Panel */}
                  <AnimatePresence>
                    {!isLoading && activeView === 'optimize' && optimizationData && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <OptimizationPanel data={optimizationData} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Explanation Panel */}
                  <AnimatePresence>
                    {!isLoading && activeView === 'explain' && explanationData && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <CodeExplanationPanel data={explanationData} onCopy={handleCopyExplanation} docId={currentDocId} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
