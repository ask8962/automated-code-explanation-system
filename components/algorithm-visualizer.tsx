'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Zap,
  Variable,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VisualizerStep {
  step: number;
  line: number;
  variables: Record<string, unknown>;
  explanation: string;
}

interface AlgorithmVisualizerProps {
  data: {
    steps: VisualizerStep[];
    totalSteps: number;
    summary: string;
  };
  code: string;
}

export default function AlgorithmVisualizer({ data, code }: AlgorithmVisualizerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1500); // ms per step
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const codeLines = code.split('\n');

  const step = data.steps[currentStep];
  const progress = ((currentStep + 1) / data.steps.length) * 100;

  // Auto-play logic
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= data.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playSpeed);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, playSpeed, data.steps.length]);

  const goToStep = (index: number) => {
    setCurrentStep(Math.max(0, Math.min(index, data.steps.length - 1)));
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  // Format variable values for display
  const formatValue = (value: unknown): string => {
    if (Array.isArray(value)) return `[${value.join(', ')}]`;
    if (typeof value === 'object' && value !== null) return JSON.stringify(value);
    if (typeof value === 'string') return `"${value}"`;
    return String(value);
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/30 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04] bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-medium text-foreground/70">Algorithm Visualizer</span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          Step {currentStep + 1} of {data.steps.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-white/[0.03]">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main Content: Code + Variables side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-white/[0.04]">
        {/* Code Panel (Left) */}
        <div className="border-r border-white/[0.04] bg-[#0a0a0a] max-h-[350px] overflow-auto">
          <div className="px-2 py-1 border-b border-white/[0.04] bg-white/[0.02]">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Source Code</span>
          </div>
          <div className="py-2">
            {codeLines.map((line, idx) => {
              const lineNum = idx + 1;
              const isActive = step && step.line === lineNum;
              return (
                <div
                  key={idx}
                  className={`flex items-stretch text-xs font-mono transition-colors duration-200 ${
                    isActive
                      ? 'bg-amber-500/15 border-l-2 border-amber-400'
                      : 'border-l-2 border-transparent hover:bg-white/[0.02]'
                  }`}
                >
                  <span className={`w-10 text-right pr-3 py-0.5 select-none flex-shrink-0 ${
                    isActive ? 'text-amber-400 font-bold' : 'text-muted-foreground/40'
                  }`}>
                    {lineNum}
                  </span>
                  <span className={`py-0.5 ${isActive ? 'text-amber-100' : 'text-foreground/70'}`}>
                    {line || ' '}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Variables Panel (Right) */}
        <div className="bg-[#0a0a0a] max-h-[350px] overflow-auto">
          <div className="px-3 py-1 border-b border-white/[0.04] bg-white/[0.02]">
            <div className="flex items-center gap-1.5">
              <Variable className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Variables</span>
            </div>
          </div>
          <div className="p-3 space-y-1.5">
            {step && step.variables && Object.keys(step.variables).length > 0 ? (
              Object.entries(step.variables).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <span className="text-xs font-mono text-cyan-400 font-semibold">{key}</span>
                  <span className="text-xs font-mono text-foreground/70">{formatValue(value)}</span>
                </motion.div>
              ))
            ) : (
              <div className="text-xs text-muted-foreground/40 text-center py-8">
                No variables tracked yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Explanation */}
      {step && (
        <div className="px-4 py-3 border-b border-white/[0.04] bg-white/[0.01]">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-violet-400 mt-0.5 flex-shrink-0" />
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-foreground/80 leading-relaxed"
            >
              {step.explanation}
            </motion.p>
          </div>
        </div>
      )}

      {/* Playback Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          {/* Speed Selector */}
          <select
            value={playSpeed}
            onChange={(e) => setPlaySpeed(Number(e.target.value))}
            className="text-[10px] font-mono px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-foreground/70 focus:outline-none"
          >
            <option value={2500}>0.5x</option>
            <option value={1500}>1x</option>
            <option value={800}>2x</option>
            <option value={400}>4x</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          {/* Skip to Start */}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={reset}>
            <SkipBack className="w-3.5 h-3.5" />
          </Button>

          {/* Previous */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => goToStep(currentStep - 1)}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* Play / Pause */}
          <Button
            onClick={togglePlay}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl h-9 w-9 p-0 shadow-lg shadow-amber-500/20"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          {/* Next */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => goToStep(currentStep + 1)}
            disabled={currentStep >= data.steps.length - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Skip to End */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => goToStep(data.steps.length - 1)}
          >
            <SkipForward className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Summary */}
        <div className="text-[10px] text-muted-foreground max-w-[180px] text-right truncate">
          {data.summary}
        </div>
      </div>
    </div>
  );
}
