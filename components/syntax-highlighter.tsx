'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

interface SyntaxHighlighterProps {
  code: string;
  language: string;
}

// Simple syntax highlighting for demo
const highlightCode = (code: string, language: string): string => {
  let highlighted = code;

  // Basic Python highlighting
  if (language === 'python') {
    highlighted = highlighted
      .replace(/\b(def|class|if|else|elif|for|while|return|import|from|as|try|except|finally|with|lambda|async|await)\b/g, '<span class="text-primary">$1</span>')
      .replace(/["']([^"']*?)["']/g, '<span class="text-green-400">"$1"</span>')
      .replace(/#.*/g, '<span class="text-muted-foreground">$&</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-yellow-400">$1</span>');
  }

  // Basic JavaScript/TypeScript highlighting
  if (language === 'javascript' || language === 'typescript') {
    highlighted = highlighted
      .replace(/\b(function|const|let|var|if|else|for|while|return|class|import|export|async|await|new|this)\b/g, '<span class="text-primary">$1</span>')
      .replace(/["'`]([^"'`]*?)["'`]/g, '<span class="text-green-400">"$1"</span>')
      .replace(/\/\/.*/g, '<span class="text-muted-foreground">$&</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-yellow-400">$1</span>');
  }

  // Basic Java highlighting
  if (language === 'java') {
    highlighted = highlighted
      .replace(/\b(public|private|protected|class|interface|extends|implements|new|return|if|else|for|while|import)\b/g, '<span class="text-primary">$1</span>')
      .replace(/["']([^"']*?)["']/g, '<span class="text-green-400">"$1"</span>')
      .replace(/\/\/.*/g, '<span class="text-muted-foreground">$&</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-yellow-400">$1</span>');
  }

  return highlighted;
};

export function SyntaxHighlighter({ code, language }: SyntaxHighlighterProps) {
  const highlightedCode = highlightCode(code, language);

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="bg-secondary p-3 border-b border-border flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{language.toUpperCase()}</span>
        <span className="text-xs text-muted-foreground">{code.split('\n').length} lines</span>
      </div>
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-sm text-foreground whitespace-pre-wrap break-words">
          <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </pre>
      </div>
    </Card>
  );
}
