'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export interface OptimizationData {
    optimizedCode: string;
    originalComplexity: {
        time: string;
        space: string;
    };
    newComplexity: {
        time: string;
        space: string;
    };
    improvements: string[];
    overview: string;
}

export function useOptimizeCode() {
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [optimizationData, setOptimizationData] = useState<OptimizationData | null>(null);

    const optimizeCode = async (code: string, language: string) => {
        setIsOptimizing(true);
        setOptimizationData(null);

        try {
            const response = await fetch('/api/optimize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, language }),
            });

            if (!response.ok) {
                throw new Error('Failed to optimize code');
            }

            const data: OptimizationData = await response.json();
            setOptimizationData(data);
            toast.success('Code optimized successfully! ⚡');
        } catch (error: any) {
            console.error('Optimization error:', error);
            toast.error('Failed to optimize code. Please try again.');
        } finally {
            setIsOptimizing(false);
        }
    };

    return {
        optimizeCode,
        isOptimizing,
        optimizationData,
    };
}
