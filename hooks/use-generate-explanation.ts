'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { initializeFirebase } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface GenerateExplanationParams {
  code: string;
  language: string;
  mode: 'beginner' | 'exam' | 'interview';
  userId: string;
}

export interface ExplanationData {
  overview: string;
  steps: { title: string; description: string }[];
  keyConcepts: { title: string; description: string }[];
  timeComplexity: { value: string; reason: string };
  spaceComplexity: { value: string; reason: string };
}

export function useGenerateExplanation() {
  const [isLoading, setIsLoading] = useState(false);
  const [explanationData, setExplanationData] = useState<ExplanationData | null>(null);
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);

  const generateExplanation = async (params: GenerateExplanationParams) => {
    setIsLoading(true);
    setExplanationData(null);

    try {
      // Call your backend API to generate explanation
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to generate explanation');
      }

      const data: ExplanationData = await response.json();

      setExplanationData(data);

      // Save to Firestore history
      try {
        const { db } = await initializeFirebase();
        if (db) {
          const docRef = await addDoc(collection(db, 'codeExplanations'), {
            userId: params.userId,
            code: params.code,
            language: params.language,
            mode: params.mode,
            explanationData: data, // Store the full object
            createdAt: serverTimestamp(),
          });
          setCurrentDocId(docRef.id);
        }
      } catch (error) {
        console.error('Failed to save to history:', error);
      }

      toast.success('Code explained successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to explain code');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateExplanation,
    isLoading,
    explanationData,
    currentDocId,
  };
}
