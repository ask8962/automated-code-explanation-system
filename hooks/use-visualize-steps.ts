'use client';

import { useState } from 'react';

interface VisualizerStep {
  step: number;
  line: number;
  variables: Record<string, unknown>;
  explanation: string;
}

interface VisualizerData {
  steps: VisualizerStep[];
  totalSteps: number;
  summary: string;
}

export function useVisualizeSteps() {
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [stepsData, setStepsData] = useState<VisualizerData | null>(null);

  const visualizeSteps = async (code: string, language: string) => {
    setIsVisualizing(true);
    setStepsData(null);

    try {
      const response = await fetch('/api/visualize-steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to visualize');
      }

      setStepsData(data);
    } catch (error) {
      console.error('Error visualizing steps:', error);
    } finally {
      setIsVisualizing(false);
    }
  };

  const clearSteps = () => setStepsData(null);

  return { visualizeSteps, isVisualizing, stepsData, clearSteps };
}
