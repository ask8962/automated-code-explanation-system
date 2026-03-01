'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import { Clock, Code2, Sparkles, ChevronRight, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ExplanationData } from '@/hooks/use-generate-explanation';
import { Button } from '@/components/ui/button';

interface HistoryItem {
    id: string;
    code: string;
    language: string;
    mode: string;
    explanationData: ExplanationData;
    createdAt: any;
}

export default function HistoryPage() {
    const { user, loading } = useAuth();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        async function fetchHistory() {
            if (!user) {
                setIsFetching(false);
                return;
            }

            try {
                const q = query(
                    collection(db, 'codeExplanations'),
                    where('userId', '==', user.uid),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const items: HistoryItem[] = [];
                querySnapshot.forEach((doc) => {
                    items.push({ id: doc.id, ...doc.data() } as HistoryItem);
                });
                setHistory(items);
            } catch (error) {
                console.error('Error fetching history:', error);
            } finally {
                setIsFetching(false);
            }
        }

        if (!loading) {
            fetchHistory();
        }
    }, [user, loading]);

    if (loading || isFetching) {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-violet-500 animate-spin" />
                    <p className="text-muted-foreground text-sm font-medium">Loading your history...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen pt-24 px-4 max-w-3xl mx-auto">
                <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Sign in to view history
                    </h2>
                    <p className="text-muted-foreground max-w-md">
                        Create an account or sign in to save your explanations and review them later.
                    </p>
                    <Link href="/dashboard" className="mt-4 text-sm text-violet-400 hover:text-violet-300 transition-colors">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
            {/* Subtle ambient glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/[0.04] rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <Link href="/dashboard" className="inline-block mb-8">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </Link>

                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-2 bg-white/[0.02] rounded-2xl border border-white/[0.06] mb-6 backdrop-blur-sm">
                        <div className="bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 p-2.5 rounded-xl">
                            <Clock className="w-5 h-5 text-violet-400" />
                        </div>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
                        Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">History</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Review your previously generated code explanations and share them.
                    </p>
                </div>
            </motion.div>

            {history.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-[300px] flex items-center justify-center border border-white/[0.04] rounded-3xl bg-white/[0.01] border-dashed"
                >
                    <div className="text-center text-muted-foreground">
                        <Sparkles className="w-10 h-10 mx-auto mb-4 opacity-20" />
                        <p className="font-medium text-foreground/50">Your history is empty</p>
                        <p className="text-sm mt-1 opacity-60">Generate some explanations in the dashboard first.</p>
                    </div>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative flex flex-col p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-violet-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-1 cursor-pointer overflow-hidden backdrop-blur-sm"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-xs font-semibold uppercase tracking-wider text-foreground/80 flex-shrink-0">
                                            {item.language}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-400 text-xs font-semibold capitalize tracking-wider flex-shrink-0">
                                            {item.mode}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-foreground/90 line-clamp-2 mb-3">
                                        {item.explanationData?.overview || 'Code Explanation'}
                                    </h3>

                                    <div className="p-3 rounded-xl bg-black/40 border border-white/[0.04] font-mono text-[10px] text-white/50 line-clamp-3 leading-relaxed mb-4">
                                        {item.code}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.04]">
                                    <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
                                        <Clock className="w-3 h-3" />
                                        {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric'
                                        }) : 'Recently'}
                                    </span>

                                    <Link
                                        href={`/share/${item.id}`}
                                        className="flex items-center gap-1 text-[11px] font-semibold text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-violet-300"
                                    >
                                        View Details <ChevronRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
