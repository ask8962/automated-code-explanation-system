'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Copy, Trash2, ChevronDown, Search, Code2, Clock, Filter } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import CodeExplanationPanel from '@/components/code-explanation-panel';
import { ExplanationData } from '@/hooks/use-generate-explanation';
import { motion, AnimatePresence } from 'framer-motion';

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

const langColors: Record<string, string> = {
  python: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  javascript: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  java: 'bg-red-500/10 text-red-400 border-red-500/20',
  cpp: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  c: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  typescript: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const modeLabels: Record<string, string> = {
  beginner: '🎓 Beginner',
  exam: '📝 Exam',
  interview: '💼 Interview',
};

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
    if (confirm('Delete this analysis?')) {
      try {
        await deleteDoc(doc(db, 'codeExplanations', id));
        setHistory(history.filter((item) => item.id !== id));
        toast.success('Deleted');
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleCopyStructured = (data: ExplanationData) => {
    const text = `Overview: ${data.overview}\n\nSteps:\n${data.steps
      .map((s, i) => `${i + 1}. ${s.title}: ${s.description}`)
      .join('\n')}`;
    navigator.clipboard.writeText(text);
    toast.success('Explanation copied');
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
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center animate-pulse">
            <Clock className="w-5 h-5 text-white" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search code or explanations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30 text-sm text-foreground placeholder:text-white/15 transition-all"
          />
        </div>
        <div className="relative">
          <select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            className="appearance-none px-4 py-2.5 pl-9 pr-8 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer min-w-[160px] transition-all"
          >
            <option value="all" className="bg-[#0a0a0a]">All Languages</option>
            <option value="python" className="bg-[#0a0a0a]">Python</option>
            <option value="javascript" className="bg-[#0a0a0a]">JavaScript</option>
            <option value="java" className="bg-[#0a0a0a]">Java</option>
            <option value="cpp" className="bg-[#0a0a0a]">C++</option>
            <option value="c" className="bg-[#0a0a0a]">C</option>
          </select>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Results Count */}
      <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
        {filteredHistory.length} {filteredHistory.length === 1 ? 'result' : 'results'}
      </div>

      {/* Content */}
      {filteredHistory.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
            <Code2 className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No matching analyses found.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Try adjusting your search or filters.</p>
        </motion.div>
      ) : (
        <div className="grid gap-3">
          {filteredHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
            >
              <Collapsible
                open={expandedId === item.id}
                onOpenChange={(open) => setExpandedId(open ? item.id : null)}
              >
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.03] transition-all overflow-hidden group">
                  <CollapsibleTrigger asChild>
                    <button className="w-full text-left p-4 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-md border ${langColors[item.language] || 'bg-white/5 text-white/60 border-white/10'
                              } uppercase tracking-wider`}>
                              {item.language}
                            </span>
                            <span className="text-[10px] text-muted-foreground/60">
                              {modeLabels[item.mode] || item.mode}
                            </span>
                          </div>
                          <p className="text-xs font-mono text-foreground/60 truncate max-w-lg">
                            {item.code.substring(0, 80)}{item.code.length > 80 ? '...' : ''}
                          </p>
                          <p className="text-[10px] text-muted-foreground/40 mt-1.5">
                            {item.createdAt?.toDate?.().toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            }) || 'Recently'}
                          </p>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedId === item.id ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-4"
                        >
                          <ChevronDown className="w-4 h-4 text-muted-foreground/40" />
                        </motion.div>
                      </div>
                    </button>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-4 border-t border-white/[0.04] pt-4">
                      {/* Code Preview */}
                      <div className="rounded-xl border border-white/[0.04] bg-black/30 overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.04] bg-white/[0.01]">
                          <span className="text-[10px] text-muted-foreground font-mono">{item.language}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCopy(item.code); }}
                            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" /> Copy
                          </button>
                        </div>
                        <pre className="p-4 overflow-x-auto text-xs font-mono text-foreground/70 leading-relaxed max-h-48">
                          {item.code}
                        </pre>
                      </div>

                      {/* Explanation */}
                      {item.explanationData ? (
                        <div className="space-y-4">
                          <CodeExplanationPanel
                            data={item.explanationData}
                            onCopy={() => handleCopyStructured(item.explanationData!)}
                          />
                        </div>
                      ) : item.explanation ? (
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {item.explanation}
                        </div>
                      ) : null}

                      {/* Delete */}
                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleDelete(item.id)}
                          size="sm"
                          variant="ghost"
                          className="h-7 text-[11px] text-destructive/60 hover:text-destructive hover:bg-destructive/5 rounded-lg"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
