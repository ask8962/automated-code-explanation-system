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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');

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

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.explanationData?.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.explanation?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLanguage = filterLanguage === 'all' || item.language === filterLanguage;

    return matchesSearch && matchesLanguage;
  });

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search code or explanations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          />
          <div className="absolute left-3 top-2.5 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          </div>
        </div>
        <select
          value={filterLanguage}
          onChange={(e) => setFilterLanguage(e.target.value)}
          className="px-4 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-w-[200px]"
        >
          <option value="all">All Languages</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
        </select>
      </div>

      {filteredHistory.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No matching explanations found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <Card key={item.id} className="border-border bg-card">
              <Collapsible open={expandedId === item.id} onOpenChange={(open) => setExpandedId(open ? item.id : null)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CollapsibleTrigger asChild>
                        <div className="cursor-pointer flex items-center justify-between w-full">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="inline-block px-2 py-1 bg-secondary text-xs font-medium text-accent-foreground rounded uppercase">
                                {item.language}
                              </span>
                              <span className="inline-block px-2 py-1 bg-secondary text-xs font-medium text-muted-foreground rounded capitalize">
                                {item.mode}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 font-mono truncate max-w-md">
                              {item.code.substring(0, 50)}...
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
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
                      <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm text-foreground font-mono border border-border">
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
                        <p className="bg-muted rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap border border-border">
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
      )}
    </div>
  );
}
