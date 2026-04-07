'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Copy, Check, Code2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';

interface CodeInputProps {
  onExplain: (code: string, language: string, mode: string) => void;
  isLoading: boolean;
  onCodeChange?: (code: string, language: string) => void;
}

const languages = [
  { id: 'python', name: 'Python', color: 'text-yellow-400' },
  { id: 'javascript', name: 'JavaScript', color: 'text-amber-400' },
  { id: 'java', name: 'Java', color: 'text-red-400' },
  { id: 'cpp', name: 'C++', color: 'text-blue-400' },
  { id: 'c', name: 'C', color: 'text-cyan-400' },
  { id: 'typescript', name: 'TypeScript', color: 'text-blue-400' },
  { id: 'go', name: 'Go', color: 'text-sky-400' },
  { id: 'rust', name: 'Rust', color: 'text-orange-400' },
];

// Simple heuristic to auto-detect programming language from code
function detectLanguage(code: string): string | null {
  const trimmed = code.trim();
  // Java, C++, C, Go, Rust have strong unique keywords
  if (/(public\s+static\s+void\s+main|System\.out\.println|import\s+java\.)/.test(trimmed)) return 'java';
  if (/(#include\s*<.*>|using\s+namespace\s+std|cout\s*<<|cin\s*>>)/.test(trimmed)) return 'cpp';
  if (/(#include\s*<(stdio|stdlib)\.h>|printf\s*\(|scanf\s*\()/.test(trimmed)) return 'c';
  if (/^(package\s+main|func\s+\w+|import\s+"fmt")/.test(trimmed)) return 'go';
  if (/^(fn\s+\w+|let\s+mut\s+|use\s+std::)/.test(trimmed)) return 'rust';
  
  // Web languages
  if (/(interface\s+\w+|:\s*(string|number|boolean)\b|<\w+>)/.test(trimmed) && /^(import|export|const|let|function|class)/.test(trimmed)) return 'typescript';
  if (/^(import\s+.*from\s+['"]|const\s+\w+\s*=\s*require|export\s+(default|const|function))/.test(trimmed)) return 'javascript';
  
  // Python has def, from x import, or simple imports without semicolons
  if (/(def\s+\w+|class\s+\w+.*:|if\s+__name__\s*==|from\s+\w+\s+import)/.test(trimmed)) return 'python';
  // Check simple python import without semicolon
  if (/^import\s+[a-zA-Z0-9_,\s]+$/m.test(trimmed)) return 'python';
  
  return null;
}

const modes = [
  { id: 'beginner', name: 'Beginner', emoji: '🎓' },
  { id: 'exam', name: 'Exam Prep', emoji: '📝' },
  { id: 'interview', name: 'Interview', emoji: '💼' },
  { id: 'roast', name: 'Roast My Code', emoji: '🧐' },
];

export function CodeInput({ onExplain, isLoading, onCodeChange }: CodeInputProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [mode, setMode] = useState('beginner');
  const [copied, setCopied] = useState(false);

  const handleCodeChange = (value: string) => {
    setCode(value);

    // Auto-detect language when code changes significantly
    let currentLang = language;
    if (value.trim().length > 20) {
      const detected = detectLanguage(value);
      if (detected) {
        setLanguage(detected);
        currentLang = detected;
      }
    }

    // Sync code to parent so Run/Step-Through always use latest code
    onCodeChange?.(value, currentLang);
  };

  const handleExplain = useCallback(() => {
    if (code.trim()) {
      onExplain(code, language, mode);
    }
  }, [code, language, mode, onExplain]);

  // Ctrl+Enter keyboard shortcut to trigger explanation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleExplain();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleExplain]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* IDE-Style Editor Card */}
      <div className="rounded-2xl border border-white/[0.06] bg-black/30 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/20">

        {/* Editor Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            {/* Removed duplicated Traffic Lights as they already exist in the Spatial Dashboard Outer Container */}

            {/* Language Selector */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  onCodeChange?.(code, e.target.value);
                }}
                className="appearance-none text-xs font-medium px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-foreground/80 cursor-pointer hover:bg-white/[0.06] transition-colors pr-7 focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id} className="bg-[#0a0a0a]">
                    {lang.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Mode Selector */}
            <div className="relative">
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="appearance-none text-xs font-medium px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-foreground/80 cursor-pointer hover:bg-white/[0.06] transition-colors pr-7 focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                {modes.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#0a0a0a]">
                    {m.emoji} {m.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-white/[0.04]"
            >
              {copied ? (
                <><Check className="w-3 h-3 text-emerald-400" /> Copied</>
              ) : (
                <><Copy className="w-3 h-3" /> Copy</>
              )}
            </button>
          </div>
        </div>

        {/* Code Editor Area */}
        <div className="h-[400px] w-full border-y border-white/[0.04] bg-[#1e1e1e]">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => handleCodeChange(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: 'smooth',
            }}
            loading={<div className="flex items-center justify-center h-full text-white/50 text-sm">Loading editor...</div>}
          />
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.04] bg-white/[0.02]">
          <div className="text-[10px] text-muted-foreground font-mono">
            {code.length > 0 ? `${code.split('\n').length} lines · ${code.length} chars` : 'Ready'}
          </div>

          <Button
            onClick={handleExplain}
            disabled={isLoading || !code.trim()}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl h-9 px-6 text-sm font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100"
          >
            <Sparkles className="w-3.5 h-3.5 mr-2" />
            {isLoading ? 'Analyzing...' : 'Explain Code'}
          </Button>
        </div>
      </div>

      {/* Tip */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
        <Code2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-foreground/60 font-medium">Tip:</span> Press <span className="text-violet-400 font-semibold">Ctrl+Enter</span> to explain instantly. Language is auto-detected. Try <span className="text-amber-400 font-semibold">Roast My Code</span> for a brutal code review.
        </p>
      </div>
    </motion.div>
  );
}
