'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function ExplanationSkeleton() {
    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header skeleton */}
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg skeleton-shimmer" />
                <div className="h-4 w-28 rounded skeleton-shimmer" />
            </div>

            {/* Overview skeleton */}
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-3.5 h-3.5 rounded skeleton-shimmer" />
                    <div className="h-3 w-16 rounded skeleton-shimmer" />
                </div>
                <div className="space-y-2">
                    <div className="h-3 w-full rounded skeleton-shimmer" />
                    <div className="h-3 w-5/6 rounded skeleton-shimmer" />
                    <div className="h-3 w-4/6 rounded skeleton-shimmer" />
                </div>
            </div>

            {/* Steps skeleton */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 px-1 mb-1">
                    <div className="w-3.5 h-3.5 rounded skeleton-shimmer" />
                    <div className="h-3 w-20 rounded skeleton-shimmer" />
                </div>
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-lg skeleton-shimmer flex-shrink-0" />
                            <div className="h-3.5 w-40 rounded skeleton-shimmer" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Key Concepts skeleton */}
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-3.5 h-3.5 rounded skeleton-shimmer" />
                    <div className="h-3 w-24 rounded skeleton-shimmer" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="h-7 rounded-lg skeleton-shimmer" style={{ width: `${60 + i * 15}px` }} />
                    ))}
                </div>
            </div>

            {/* Complexity skeleton */}
            <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                        <div className="w-3 h-3 rounded skeleton-shimmer" />
                        <div className="h-2.5 w-8 rounded skeleton-shimmer" />
                    </div>
                    <div className="h-6 w-16 mx-auto rounded skeleton-shimmer" />
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                        <div className="w-3 h-3 rounded skeleton-shimmer" />
                        <div className="h-2.5 w-8 rounded skeleton-shimmer" />
                    </div>
                    <div className="h-6 w-16 mx-auto rounded skeleton-shimmer" />
                </div>
            </div>
        </div>
    );
}
