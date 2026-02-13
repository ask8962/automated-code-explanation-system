'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export interface FlowchartData {
    mermaidCode: string;
}

export function useGenerateFlowchart() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [flowchartData, setFlowchartData] = useState<FlowchartData | null>(null);

    const generateFlowchart = async (code: string, language: string) => {
        setIsGenerating(true);
        setFlowchartData(null);

        try {
            const response = await fetch('/api/flowchart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, language }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate flowchart');
            }

            const data: FlowchartData = await response.json();
            setFlowchartData(data);
            toast.success('Flowchart generated! 🎨');
        } catch (error: any) {
            console.error('Flowchart error:', error);
            toast.error('Failed to generate flowchart. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const clearFlowchart = () => setFlowchartData(null);

    return {
        generateFlowchart,
        isGenerating,
        flowchartData,
        clearFlowchart,
    };
}
