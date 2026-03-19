'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { useGenerateExplanation } from '@/hooks/use-generate-explanation';
import { useOptimizeCode } from '@/hooks/use-optimize-code';
import { useGenerateFlowchart } from '@/hooks/use-generate-flowchart';
import CodeExplanationPanel from '@/components/code-explanation-panel';
import OptimizationPanel from '@/components/optimization-panel';
import FlowchartPanel from '@/components/flowchart-panel';
import { CodeInput } from '@/components/code-input';
import { Navbar } from '@/components/navbar';
import { Loader2, Zap, Sparkles, Code2, GitBranch } from 'lucide-react';
import { toast } from 'sonner';
import { ExplanationSkeleton } from '@/components/explanation-skeleton';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showOptimization, setShowOptimization] = useState(false);
  const [showFlowchart, setShowFlowchart] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center animate-pulse">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-violet-500/20 animate-ping" />
          </div>
          <p className="text-xs text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleExplain = async (codeInput: string, lang: string, m: string) => {
    setCode(codeInput);
    setLanguage(lang as Language);
    setMode(m as ExplanationMode);
    setShowOptimization(false);
    setShowFlowchart(false);
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
      toast.error('Please enter some code first');
      return;
    }
    setShowOptimization(true);
    setShowFlowchart(false);
    await optimizeCode(code, language);
  };

  const handleVisualize = async () => {
    if (!code) {
      toast.error('Please enter some code first');
      return;
    }
    setShowFlowchart(true);
    setShowOptimization(false);
    await generateFlowchart(code, language);
  };

  const handleCopyExplanation = () => {
    if (explanationData) {
      const text = `Overview: ${explanationData.overview}\n\nSteps:\n${explanationData.steps
        .map((s, i) => `${i + 1}. ${s.title}: ${s.description}`)
        .join('\n')}`;
      navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Subtle ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold tracking-tight mb-1">Code Workspace</h1>
          <p className="text-sm text-muted-foreground">
            Paste your code below to get AI-powered explanations and optimizations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Code Input & Actions */}
          <div className="space-y-6 sticky top-24">
            {/* Code Input */}
            <CodeInput onExplain={handleExplain} isLoading={isLoading} />

            {/* Optimize / Visualize Actions */}
            <AnimatePresence>
              {!isLoading && (explanationData || optimizationData || flowchartData) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-end gap-3"
                >
                  <Button
                    onClick={handleVisualize}
                    disabled={isGeneratingFlowchart}
                    className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] h-10 px-5 text-sm w-full"
                  >
                    {isGeneratingFlowchart ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <GitBranch className="w-4 h-4 mr-2" />
                    )}
                    Visualize Flow
                  </Button>
                  <Button
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] h-10 px-5 text-sm w-full"
                  >
                    {isOptimizing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4 mr-2" />
                    )}
                    Optimize Code
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Results Panel */}
          <div className="space-y-6">
            {/* Empty State */}
            <AnimatePresence>
              {!isLoading && !explanationData && !optimizationData && !flowchartData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[500px] flex items-center justify-center border border-white/[0.04] rounded-2xl bg-white/[0.01] border-dashed"
                >
                  <div className="text-center text-muted-foreground">
                    <Sparkles className="w-10 h-10 mx-auto mb-4 opacity-20" />
                    <p className="font-medium text-foreground/50">AI output will appear here</p>
                    <p className="text-xs mt-1 opacity-60">Paste code and click Explain to start</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading State */}
            <AnimatePresence>
              {isLoading && !explanationData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <ExplanationSkeleton />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Flowchart Panel */}
            <AnimatePresence>
              {!isLoading && showFlowchart && flowchartData && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <FlowchartPanel
                    data={flowchartData}
                    onRegenerate={() => generateFlowchart(code, language)}
                    isRegenerating={isGeneratingFlowchart}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Optimization Panel */}
            <AnimatePresence>
              {!isLoading && showOptimization && optimizationData && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <OptimizationPanel data={optimizationData} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Explanation Panel */}
            <AnimatePresence>
              {!isLoading && explanationData && !showOptimization && !showFlowchart && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <CodeExplanationPanel
                    data={explanationData}
                    onCopy={handleCopyExplanation}
                    docId={currentDocId}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
