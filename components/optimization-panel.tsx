'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight, CheckCircle2, Copy } from 'lucide-react';
import { OptimizationData } from '@/hooks/use-optimize-code';
import { toast } from 'sonner';

interface OptimizationPanelProps {
    data: OptimizationData;
}

export default function OptimizationPanel({ data }: OptimizationPanelProps) {
    const handleCopy = () => {
        navigator.clipboard.writeText(data.optimizedCode);
        toast.success('Optimized code copied! ⚡');
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-yellow-500/10 rounded-full">
                    <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-foreground">Performance Optimization</h2>
                    <p className="text-sm text-muted-foreground">AI-enhanced efficiency check</p>
                </div>
            </div>

            {/* Complexity Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-destructive/10 border-destructive/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Zap className="w-24 h-24" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-destructive">Original Complexity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Time</span>
                                <span className="font-mono text-lg font-bold text-destructive">{data.originalComplexity.time}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Space</span>
                                <span className="font-mono text-lg font-bold text-destructive">{data.originalComplexity.space}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-green-500/10 border-green-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <CheckCircle2 className="w-24 h-24" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-500">New Complexity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Time</span>
                                <span className="font-mono text-lg font-bold text-green-500">{data.newComplexity.time}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Space</span>
                                <span className="font-mono text-lg font-bold text-green-500">{data.newComplexity.space}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Overview & Improvements */}
            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        Key Improvements
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{data.overview}</p>
                    <ul className="space-y-2">
                        {data.improvements.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Optimized Code Display */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Optimized Solution</h3>
                    <Button variant="outline" size="sm" onClick={handleCopy} className="h-8">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Code
                    </Button>
                </div>
                <pre className="bg-zinc-950 rounded-lg p-4 overflow-x-auto border border-border/50 text-sm font-mono text-zinc-100 shadow-inner">
                    {data.optimizedCode}
                </pre>
            </div>
        </div>
    );
}
