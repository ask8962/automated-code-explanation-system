'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Copy, Check, Code2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';

interface CodeInputProps {
  onExplain: (code: string, language: string, mode: string) => void;
  isLoading: boolean;
}

const languages = [
  { id: 'python', name: 'Python', color: 'text-yellow-400' },
  { id: 'javascript', name: 'JavaScript', color: 'text-amber-400' },
  { id: 'java', name: 'Java', color: 'text-red-400' },
  { id: 'cpp', name: 'C++', color: 'text-blue-400' },
  { id: 'c', name: 'C', color: 'text-cyan-400' },
  { id: 'typescript', name: 'TypeScript', color: 'text-blue-400' },
];

const modes = [
  { id: 'beginner', name: 'Beginner', emoji: '🎓' },
  { id: 'exam', name: 'Exam Prep', emoji: '📝' },
  { id: 'interview', name: 'Interview', emoji: '💼' },
];

export function CodeInput({ onExplain, isLoading }: CodeInputProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [mode, setMode] = useState('beginner');
  const [copied, setCopied] = useState(false);

  const handleCodeChange = (value: string) => {
    setCode(value);
  };

  const handleExplain = () => {
    if (code.trim()) {
      onExplain(code, language, mode);
    }
  };

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
            {/* Traffic Lights */}
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            </div>

            {/* Language Selector */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
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
          <span className="text-foreground/60 font-medium">Tip:</span> Beginner mode uses analogies, Exam mode highlights key concepts, and Interview mode focuses on approach & complexity.
        </p>
      </div>
    </motion.div>
  );
}
