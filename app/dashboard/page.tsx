'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { useGenerateExplanation } from '@/hooks/use-generate-explanation';
import { useOptimizeCode } from '@/hooks/use-optimize-code';
import CodeExplanationPanel from '@/components/code-explanation-panel';
import OptimizationPanel from '@/components/optimization-panel';
import { CodeInput } from '@/components/code-input';
import { Navbar } from '@/components/navbar';
import { Loader2, Zap, Sparkles, Code2 } from 'lucide-react';
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
  const { generateExplanation, isLoading, explanationData } = useGenerateExplanation();
  const { optimizeCode, isOptimizing, optimizationData } = useOptimizeCode();
  const [showOptimization, setShowOptimization] = useState(false);

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
    await optimizeCode(code, language);
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
          <h1 className="text-3xl font-bold tracking-tight mb-2">Code Workspace</h1>
          <p className="text-base text-muted-foreground">
            Paste your code on the left to get instant AI-powered explanations and optimizations on the right.
          </p>
        </motion.div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Code Input */}
          <div className="space-y-4">
            <div className="sticky top-20 z-30">
              <CodeInput onExplain={handleExplain} isLoading={isLoading} />
            </div>
          </div>

          {/* Right Column: Analysis Results */}
          <div className="analysis-scroll-container rounded-lg p-1">
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

            {/* Optimize Action */}
            <AnimatePresence>
              {!isLoading && explanationData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3"
                >
                  <Button
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] h-10 text-sm"
                  >
                    {isOptimizing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4 mr-2" />
                    )}
                    Optimize Code
                  </Button>
                  <Button
                    onClick={handleCopyExplanation}
                    variant="outline"
                    className="h-10 px-5 rounded-xl text-sm font-medium"
                  >
                    Copy
                  </Button>
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
              {!isLoading && explanationData && !showOptimization && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <CodeExplanationPanel
                    data={explanationData}
                    onCopy={handleCopyExplanation}
                  />
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
