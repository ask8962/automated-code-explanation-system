'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGenerateExplanation } from '@/hooks/use-generate-explanation';
import { useOptimizeCode } from '@/hooks/use-optimize-code';
import CodeExplanationPanel from '@/components/code-explanation-panel';
import OptimizationPanel from '@/components/optimization-panel';
import { CodeInput } from '@/components/code-input';
import { Navbar } from '@/components/navbar';
import { Loader2, Zap } from 'lucide-react';
import { toast } from 'sonner';

export type ExplanationMode = 'beginner' | 'exam' | 'interview';
export type Language = 'python' | 'javascript' | 'java' | 'cpp' | 'c';

const LANGUAGES = [
  { id: 'python', name: 'Python' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'c', name: 'C' },
];

const MODES = [
  { id: 'beginner', name: 'Beginner Friendly' },
  { id: 'exam', name: 'Exam Preparation' },
  { id: 'interview', name: 'Technical Interview' },
];

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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const handleExplain = async (codeInput: string) => {
    setCode(codeInput);
    setShowOptimization(false); // Reset optimization view on new explanation

    await generateExplanation({
      code: codeInput,
      language: language,
      mode: mode,
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
      toast.success('Explanation copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Explain Code Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Explain Code</h2>
              <p className="text-muted-foreground">
                Paste your code snippet below to get an AI-powered explanation.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Language
                </label>
                <Select
                  value={language}
                  onValueChange={(val) => setLanguage(val as Language)}
                >
                  <SelectTrigger className="w-full bg-input border-border text-foreground">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border text-popover-foreground">
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Explanation Mode
                </label>
                <Select
                  value={mode}
                  onValueChange={(val) => setMode(val as ExplanationMode)}
                >
                  <SelectTrigger className="w-full bg-input border-border text-foreground">
                    <SelectValue placeholder="Select Mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border text-popover-foreground">
                    {MODES.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <CodeInput onExplain={handleExplain} isLoading={isLoading} />

            {/* Actions Bar */}
            {explanationData && (
              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold shadow-lg shadow-yellow-500/20 transition-all hover:scale-105"
                >
                  {isOptimizing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 mr-2" />
                  )}
                  Make it Faster (Optimize)
                </Button>
              </div>
            )}

            {/* Optimization Output */}
            {showOptimization && optimizationData && (
              <OptimizationPanel data={optimizationData} />
            )}

            {/* Explanation Output */}
            {explanationData && !showOptimization && (
              <CodeExplanationPanel
                data={explanationData}
                onCopy={handleCopyExplanation}
              />
            )}

            {/* Show both if optimized? Or toggle? Let's show optimize panel ABOVE explanation if active */}
          </div>
        </div>
      </main>
    </div>
  );
}
