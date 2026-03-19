'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, GitBranch, RefreshCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { FlowchartData } from '@/hooks/use-generate-flowchart';
import { toast } from 'sonner';

interface FlowchartPanelProps {
    data: FlowchartData;
    onRegenerate?: () => void;
    isRegenerating?: boolean;
}

export default function FlowchartPanel({ data, onRegenerate, isRegenerating }: FlowchartPanelProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useState(1);
    const [rendered, setRendered] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const renderDiagram = async () => {
            if (!containerRef.current || !data.mermaidCode) return;

            try {
                // Dynamic import to avoid SSR issues
                const mermaid = (await import('mermaid')).default;
                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'dark',
                    themeVariables: {
                        primaryColor: '#7c3aed',
                        primaryTextColor: '#f5f3ff',
                        primaryBorderColor: '#8b5cf6',
                        lineColor: '#6366f1',
                        secondaryColor: '#1e1b4b',
                        tertiaryColor: '#0f0f23',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        nodeBorder: '#8b5cf6',
                        mainBkg: '#1a1a2e',
                        nodePadding: '12',
                    },
                    flowchart: {
                        htmlLabels: true,
                        curve: 'basis',
                        padding: 20,
                        useMaxWidth: false,
                    },
                });

                // Clear previous render
                containerRef.current.innerHTML = '';

                const id = `flowchart-${Date.now()}`;
                const { svg } = await mermaid.render(id, data.mermaidCode);
                containerRef.current.innerHTML = svg;
                setRendered(true);
                setError(null);
            } catch (err: any) {
                console.error('Mermaid render error:', err);
                setError('Could not render flowchart. The AI output may have syntax issues.');
                if (containerRef.current) {
                    containerRef.current.innerHTML = `<pre class="text-xs text-red-400 p-4 whitespace-pre-wrap">${data.mermaidCode}</pre>`;
                }
            }
        };

        renderDiagram();
    }, [data.mermaidCode]);

    const handleCopyMermaid = () => {
        navigator.clipboard.writeText(data.mermaidCode);
        toast.success('Mermaid code copied!');
    };

    const handleDownloadSVG = () => {
        if (!containerRef.current) return;
        const svg = containerRef.current.querySelector('svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'flowchart.svg';
        a.click();
        URL.revokeObjectURL(url);
        toast.success('SVG downloaded!');
    };

    const handleDownloadPNG = async () => {
        if (!containerRef.current) return;
        const svg = containerRef.current.querySelector('svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        // Use base64 data URL instead of blob URL to avoid tainted canvas
        const svgBase64 = btoa(unescape(encodeURIComponent(svgData)));
        const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;

        img.onload = () => {
            canvas.width = img.width * 2;
            canvas.height = img.height * 2;
            if (ctx) {
                ctx.fillStyle = '#0a0a0a';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
            const pngUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = 'flowchart.png';
            a.click();
            toast.success('PNG downloaded!');
        };
        img.src = dataUrl;
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-500/10 rounded-full">
                        <GitBranch className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Visual Logic Flow</h2>
                        <p className="text-xs text-muted-foreground">AI-generated flowchart of your code</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {onRegenerate && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRegenerate}
                            disabled={isRegenerating}
                            className="h-8 text-xs"
                        >
                            <RefreshCw className={`w-3 h-3 mr-1.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                            Regenerate
                        </Button>
                    )}
                </div>
            </div>

            {/* Flowchart Display */}
            <Card className="border-border bg-card/50 backdrop-blur overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-black/20">
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setZoom(z => Math.max(0.3, z - 0.15))} className="h-7 w-7 p-0">
                            <ZoomOut className="w-3.5 h-3.5" />
                        </Button>
                        <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
                        <Button variant="ghost" size="sm" onClick={() => setZoom(z => Math.min(2, z + 0.15))} className="h-7 w-7 p-0">
                            <ZoomIn className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setZoom(1)} className="h-7 w-7 p-0">
                            <Maximize2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={handleCopyMermaid} className="h-7 text-xs px-2">
                            <Copy className="w-3 h-3 mr-1" /> Code
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleDownloadSVG} className="h-7 text-xs px-2">
                            <Download className="w-3 h-3 mr-1" /> SVG
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleDownloadPNG} className="h-7 text-xs px-2">
                            <Download className="w-3 h-3 mr-1" /> PNG
                        </Button>
                    </div>
                </div>

                {/* Render Area */}
                <CardContent className="p-0">
                    <div className="overflow-auto max-h-[500px] bg-[#0a0a1a] relative">
                        {error && (
                            <div className="absolute top-2 left-2 right-2 z-10 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-300">
                                ⚠️ {error}
                            </div>
                        )}
                        <div
                            ref={containerRef}
                            className="flex items-center justify-center min-h-[300px] p-8 transition-transform duration-200"
                            style={{ transform: `scale(${zoom})`, transformOrigin: 'center top' }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Raw Mermaid Code (Collapsible) */}
            <details className="group">
                <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    View raw Mermaid code
                </summary>
                <pre className="mt-2 p-4 rounded-lg bg-black/50 border border-border text-xs font-mono text-violet-300 overflow-x-auto whitespace-pre-wrap">
                    {data.mermaidCode}
                </pre>
            </details>
        </div>
    );
}
