'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Copy, Check } from 'lucide-react';

interface CodeInputProps {
  onExplain: (code: string, language: string, mode: string) => void;
  isLoading: boolean;
}

const languages = ['python', 'javascript', 'java', 'cpp', 'c', 'typescript', 'sql', 'go', 'rust', 'php'];
const modes = ['beginner', 'exam', 'interview'];

export function CodeInput({ onExplain, isLoading }: CodeInputProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [mode, setMode] = useState('beginner');
  const [copied, setCopied] = useState(false);

  const handleExplain = () => {
    if (code.trim()) {
      onExplain(code, language, mode);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <div className="p-6 space-y-4">
          {/* Language and Mode Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Learning Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {modes.map((m) => (
                  <option key={m} value={m}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Code Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-foreground">Code Snippet</label>
              <button
                onClick={copyToClipboard}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="w-full h-64 px-4 py-3 bg-input border border-border rounded-md text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <div className="flex justify-end gap-4 mt-2 text-xs text-muted-foreground">
              <span>{code.length} characters</span>
              <span>{code.split('\n').length} lines</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleExplain}
            disabled={isLoading || !code.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 font-medium"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isLoading ? 'Explaining...' : 'Explain Code'}
          </Button>
        </div>
      </Card>

      {/* Info Box */}
      <div className="bg-secondary border border-border rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Tip:</strong> Different learning modes provide different explanation styles. Beginner mode uses simpler language,
          Exam mode focuses on important concepts, and Interview mode emphasizes implementation details.
        </p>
      </div>
    </div>
  );
}
