'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Zap, TrendingUp, ArrowRight, Clock, HardDrive, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { OptimizationData } from '@/hooks/use-optimize-code';

interface Props {
    data: OptimizationData;
}

export default function OptimizationPanel({ data }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(data.optimizedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Optimized code copied');
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <h3 className="text-sm font-semibold">Code Optimization</h3>
            </div>

            {/* Complexity Comparison */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center"
            >
                {/* Before */}
                <div className="p-4 rounded-xl bg-red-500/[0.04] border border-red-500/10 text-center">
                    <span className="text-[10px] text-red-300/60 uppercase tracking-widest font-medium block mb-3">Before</span>
                    <div className="space-y-2">
                        <div className="flex items-center justify-center gap-1.5">
                            <Clock className="w-3 h-3 text-red-400/60" />
                            <span className="text-lg font-bold font-mono text-red-400">{data.originalComplexity.time}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5">
                            <HardDrive className="w-3 h-3 text-red-400/40" />
                            <span className="text-sm font-mono text-red-400/70">{data.originalComplexity.space}</span>
                        </div>
                    </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                </div>

                {/* After */}
                <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10 text-center">
                    <span className="text-[10px] text-emerald-300/60 uppercase tracking-widest font-medium block mb-3">After</span>
                    <div className="space-y-2">
                        <div className="flex items-center justify-center gap-1.5">
                            <Clock className="w-3 h-3 text-emerald-400/60" />
                            <span className="text-lg font-bold font-mono text-emerald-400">{data.newComplexity.time}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5">
                            <HardDrive className="w-3 h-3 text-emerald-400/40" />
                            <span className="text-sm font-mono text-emerald-400/70">{data.newComplexity.space}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Overview */}
            {data.overview && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                >
                    <p className="text-sm text-foreground/80 leading-relaxed">{data.overview}</p>
                </motion.div>
            )}

            {/* Improvements */}
            {data.improvements && data.improvements.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Improvements</span>
                    </div>
                    <ul className="space-y-2">
                        {data.improvements.map((imp, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 + i * 0.05 }}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                                <ChevronRight className="w-3.5 h-3.5 text-emerald-400/60 mt-0.5 flex-shrink-0" />
                                <span>{imp}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            )}

            {/* Optimized Code */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="rounded-xl border border-white/[0.06] bg-black/30 backdrop-blur-xl overflow-hidden"
            >
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04] bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        </div>
                        <span className="text-[11px] text-emerald-400/80 font-medium ml-2">✦ Optimized</span>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-white/[0.04]"
                    >
                        {copied ? (
                            <><Check className="w-3 h-3 text-emerald-400" /> Copied</>
                        ) : (
                            <><Copy className="w-3 h-3" /> Copy</>
                        )}
                    </button>
                </div>
                <pre className="p-5 overflow-x-auto text-sm font-mono text-foreground/80 leading-relaxed">
                    <code>{data.optimizedCode}</code>
                </pre>
            </motion.div>
        </div>
    );
}
