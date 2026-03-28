'use client';

import React, { useState } from 'react';
import { motion} from 'framer-motion';
import { Play, Terminal, Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExecutionResult {
  stdout: string;
  stderr: string;
  output: string;
  exitCode: number;
  signal: string | null;
  compile: {
    stdout: string;
    stderr: string;
    exitCode: number;
  } | null;
  language: string;
  version: string;
  executionTime: number;
}

interface CodeOutputPanelProps {
  data: ExecutionResult;
  onRunAgain?: () => void;
  isRunning?: boolean;
  onStdinSubmit?: (stdin: string) => void;
}

export default function CodeOutputPanel({ data, onRunAgain, isRunning }: CodeOutputPanelProps) {
  const [showStdin, setShowStdin] = useState(false);
  const [stdinInput, setStdinInput] = useState('');
  const isSuccess = data.exitCode === 0;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/30 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/20">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04] bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-foreground/70">Console Output</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Execution Time */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{data.executionTime}ms</span>
          </div>

          {/* Exit Code Badge */}
          <div className={`flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-md ${
            isSuccess
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {isSuccess ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            <span>exit {data.exitCode}</span>
          </div>

          {/* Runtime Version */}
          {data.language && (
            <span className="text-[10px] text-muted-foreground font-mono">
              {data.language} {data.version}
            </span>
          )}
        </div>
      </div>

      {/* Compile Errors (if any) */}
      {data.compile && data.compile.stderr && (
        <div className="px-4 py-3 border-b border-red-500/10 bg-red-500/[0.03]">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs font-semibold text-red-400">Compilation Error</span>
          </div>
          <pre className="text-xs font-mono text-red-300/80 whitespace-pre-wrap overflow-auto max-h-[150px] leading-relaxed">
            {data.compile.stderr}
          </pre>
        </div>
      )}

      {/* Main Output Area */}
      <div className="bg-[#0a0a0a] min-h-[200px] max-h-[400px] overflow-auto">
        {/* stdout */}
        {data.stdout && (
          <pre className="px-4 py-3 text-sm font-mono text-emerald-300/90 whitespace-pre-wrap leading-relaxed">
            {data.stdout}
          </pre>
        )}

        {/* stderr */}
        {data.stderr && (
          <pre className="px-4 py-3 text-sm font-mono text-red-400/90 whitespace-pre-wrap leading-relaxed">
            {data.stderr}
          </pre>
        )}

        {/* Empty output */}
        {!data.stdout && !data.stderr && (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
            <span className="opacity-40">Program produced no output</span>
          </div>
        )}
      </div>

      {/* Stdin Section (Collapsible) */}
      <div className="border-t border-white/[0.04]">
        <button
          onClick={() => setShowStdin(!showStdin)}
          className="w-full flex items-center justify-between px-4 py-2 text-xs text-muted-foreground hover:bg-white/[0.02] transition-colors"
        >
          <span>Standard Input (stdin)</span>
          {showStdin ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        {showStdin && (
          <div className="px-4 pb-3">
            <textarea
              value={stdinInput}
              onChange={(e) => setStdinInput(e.target.value)}
              placeholder="Enter input for your program here..."
              className="w-full h-20 bg-[#0a0a0a] border border-white/[0.06] rounded-lg px-3 py-2 text-sm font-mono text-foreground/80 placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            />
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-end px-4 py-3 border-t border-white/[0.04] bg-white/[0.02]">
        {onRunAgain && (
          <Button
            onClick={onRunAgain}
            disabled={isRunning}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl h-9 px-5 text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isRunning ? (
              <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 mr-2" />
            )}
            {isRunning ? 'Running...' : 'Run Again'}
          </Button>
        )}
      </div>
    </div>
  );
}
