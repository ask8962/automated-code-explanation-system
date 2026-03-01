'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Copy, Check, Download, ChevronDown, ChevronUp, Sparkles,
  Clock, HardDrive, BookOpen, Code2, Lightbulb, Layers, Share2
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ExplanationData } from '@/hooks/use-generate-explanation';

interface Props {
  data: ExplanationData;
  onCopy: () => void;
  docId?: string | null;
}

export default function CodeExplanationPanel({ data, onCopy, docId }: Props) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]));
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const toggleStep = (index: number) => {
    const newSet = new Set(expandedSteps);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setExpandedSteps(newSet);
  };

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text('Code Explanation', 20, 20);

      doc.setFontSize(12);
      doc.text('Overview:', 20, 35);
      doc.setFontSize(10);
      const overviewLines = doc.splitTextToSize(data.overview, 170);
      doc.text(overviewLines, 20, 42);

      let yPos = 42 + overviewLines.length * 5 + 10;

      doc.setFontSize(12);
      doc.text('Steps:', 20, yPos);
      yPos += 7;

      data.steps.forEach((step, i) => {
        doc.setFontSize(10);
        doc.text(`${i + 1}. ${step.title}`, 20, yPos);
        yPos += 5;
        const descLines = doc.splitTextToSize(step.description, 165);
        doc.text(descLines, 25, yPos);
        yPos += descLines.length * 5 + 5;

        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
      });

      doc.save('code-explanation.pdf');
      toast.success('PDF downloaded');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <h3 className="text-sm font-semibold">AI Explanation</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCopy}
            variant="ghost"
            size="sm"
            className="h-7 text-[11px] text-muted-foreground hover:text-foreground hover:bg-white/[0.04] rounded-lg"
          >
            {copied ? <Check className="w-3 h-3 mr-1 text-emerald-400" /> : <Copy className="w-3 h-3 mr-1" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            onClick={handleDownloadPDF}
            variant="ghost"
            size="sm"
            className="h-7 text-[11px] text-muted-foreground hover:text-foreground hover:bg-white/[0.04] rounded-lg"
          >
            <Download className="w-3 h-3 mr-1" />
            PDF
          </Button>
          {docId && (
            <Button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/share/${docId}`);
                setShareCopied(true);
                toast.success('Share link copied!');
                setTimeout(() => setShareCopied(false), 2000);
              }}
              variant="ghost"
              size="sm"
              className="h-7 text-[11px] text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-lg border border-violet-500/20"
            >
              {shareCopied ? <Check className="w-3 h-3 mr-1" /> : <Share2 className="w-3 h-3 mr-1" />}
              {shareCopied ? 'Copied' : 'Share'}
            </Button>
          )}
        </div>
      </div>

      {/* Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Overview</span>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">{data.overview}</p>
      </motion.div>

      {/* Steps */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1 mb-1">
          <Layers className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Step-by-Step</span>
        </div>
        {data.steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <button
              onClick={() => toggleStep(i)}
              className="w-full text-left p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium group-hover:text-foreground transition-colors">{step.title}</span>
                </div>
                <motion.div
                  animate={{ rotate: expandedSteps.has(i) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              </div>

              <AnimatePresence>
                {expandedSteps.has(i) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed mt-3 pl-9">{step.description}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Key Concepts */}
      {data.keyConcepts && data.keyConcepts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Key Concepts</span>
          </div>
          <div className="space-y-3">
            {data.keyConcepts.map((concept, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-xs font-semibold text-foreground/80 flex-shrink-0">
                  {concept.title}
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed pt-1">{concept.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Complexity */}
      {data.timeComplexity && data.spaceComplexity && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center group hover:border-red-500/20 transition-colors">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <Clock className="w-3 h-3 text-red-400" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Time</span>
            </div>
            <div className="text-xl font-bold font-mono text-red-400">{data.timeComplexity.value}</div>
            <p className="text-[10px] text-muted-foreground mt-1">{data.timeComplexity.reason}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center group hover:border-emerald-500/20 transition-colors">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <HardDrive className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Space</span>
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400">{data.spaceComplexity.value}</div>
            <p className="text-[10px] text-muted-foreground mt-1">{data.spaceComplexity.reason}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
