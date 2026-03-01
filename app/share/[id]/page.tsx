import React from 'react';
import { getServerDb } from '@/lib/firebase-server';
import { doc, getDoc } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, Code2 } from 'lucide-react';
import CodeExplanationPanel from '@/components/code-explanation-panel';

export const revalidate = 60; // Revalidate cache every minute if needed

async function getExplanation(id: string) {
    try {
        const db = getServerDb();

        if (!db) {
            console.error("Firebase DB not initialized.");
            return null;
        }

        const docRef = doc(db, 'codeExplanations', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching explanation:", error);
        return null;
    }
}

export default async function SharedExplanationPage({ params }: { params: { id: string } }) {
    const data: any = await getExplanation(params.id);

    if (!data || !data.explanationData) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Premium Ambient Glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/[0.04] rounded-full blur-[120px] pointer-events-none" />

            {/* Navigation Bar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/[0.04] bg-background/60 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all group-hover:scale-105">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                            AI Code Explain
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button className="bg-white text-black hover:bg-white/90 rounded-full h-9 px-6 text-sm font-semibold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95">
                                Explain Your Own Code
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 relative z-10">

                {/* Header Section */}
                <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.04] mb-4">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Shared Snippet</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 text-white">
                        {data.explanationData.overview?.split('.')[0] || "Code Explanation"}
                    </h1>
                    <div className="flex items-center justify-center gap-3">
                        <span className="px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-xs font-semibold uppercase tracking-wider text-white/80 flex-shrink-0">
                            {data.language}
                        </span>
                        <span className="px-3 py-1 rounded-md bg-violet-500/10 text-violet-400 text-xs font-semibold capitalize tracking-wider flex-shrink-0">
                            {data.mode} Mode
                        </span>
                    </div>
                </div>

                {/* Dual Pane Layout (Same as Dashboard) */}
                <div className="grid lg:grid-cols-2 gap-8 items-start animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">

                    {/* Left Column: Read-Only Code Viewer */}
                    <div className="space-y-4 sticky top-24">
                        <div className="flex items-center gap-2 px-1">
                            <Code2 className="w-4 h-4 text-white/60" />
                            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Original Code</h2>
                        </div>
                        <div className="rounded-2xl border border-white/[0.06] bg-[#1e1e1e] overflow-hidden shadow-2xl shadow-black/20">
                            <div className="flex gap-1.5 px-4 py-3 border-b border-white/[0.04] bg-white/[0.02]">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                            </div>
                            <div className="p-4 overflow-x-auto text-sm font-mono text-white/80 leading-relaxed max-h-[500px]">
                                <pre><code>{data.code}</code></pre>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Beautiful AI Results */}
                    <div className="space-y-6">
                        <CodeExplanationPanel
                            data={data.explanationData}
                        />
                    </div>

                </div>
            </main>
        </div>
    );
}
