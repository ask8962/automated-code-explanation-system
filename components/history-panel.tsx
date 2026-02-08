'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Copy, Trash2, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import CodeExplanationPanel from '@/components/code-explanation-panel';
import { ExplanationData } from '@/hooks/use-generate-explanation';

interface CodeExplanationHistory {
  id: string;
  code: string;
  language: string;
  mode: string;
  explanation?: string;
  explanationData?: ExplanationData;
  createdAt: any;
}

interface HistoryPanelProps {
  userId: string;
}

export default function HistoryPanel({ userId }: HistoryPanelProps) {
  const [history, setHistory] = useState<CodeExplanationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, [userId]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'codeExplanations'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const historyData: CodeExplanationHistory[] = [];

      querySnapshot.forEach((doc) => {
        historyData.push({
          id: doc.id,
          ...doc.data(),
        } as CodeExplanationHistory);
      });

      setHistory(historyData);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, 'codeExplanations', id));
        setHistory(history.filter((item) => item.id !== id));
        toast.success('Item deleted successfully');
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleCopyStructured = (data: ExplanationData) => {
    const text = `Overview: ${data.overview}\n\nSteps:\n${data.steps
      .map((s, i) => `${i + 1}. ${s.title}: ${s.description}`)
      .join('\n')}`;
    navigator.clipboard.writeText(text);
    toast.success('Explanation copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No explanations yet. Start by explaining some code!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <Card key={item.id} className="border-border bg-card">
          <Collapsible open={expandedId === item.id} onOpenChange={(open) => setExpandedId(open ? item.id : null)}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CollapsibleTrigger asChild>
                    <div className="cursor-pointer flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="inline-block px-2 py-1 bg-secondary text-xs font-medium text-accent rounded">
                            {item.language.toUpperCase()}
                          </span>
                          <span className="inline-block px-2 py-1 bg-secondary text-xs font-medium text-accent rounded">
                            {item.mode}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {item.createdAt?.toDate?.().toLocaleDateString() || 'Recently'}
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </CollapsibleTrigger>
                </div>
              </div>
            </CardHeader>

            <CollapsibleContent>
              <CardContent className="space-y-4 pt-0">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Code</h4>
                  <pre className="bg-input rounded-lg p-4 overflow-x-auto text-sm text-foreground font-mono border border-border">
                    {item.code}
                  </pre>
                </div>

                {item.explanationData ? (
                  <div className="space-y-4">
                    <CodeExplanationPanel
                      data={item.explanationData}
                      onCopy={() => handleCopyStructured(item.explanationData!)}
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleDelete(item.id)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Item
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Explanation</h4>
                    <p className="bg-input rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap border border-border">
                      {item.explanation}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => handleCopy(item.explanation || '')}
                        size="sm"
                        variant="outline"
                        className="border-border hover:bg-secondary text-foreground"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id)}
                        size="sm"
                        variant="outline"
                        className="border-border hover:bg-destructive hover:text-destructive-foreground text-foreground ml-auto"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
}
