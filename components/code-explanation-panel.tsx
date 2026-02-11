'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Download, Lightbulb, Clock, Database, ChevronRight, Activity, Zap } from 'lucide-react';
import { ExplanationData } from '@/hooks/use-generate-explanation';
import { toast } from 'sonner';

interface CodeExplanationPanelProps {
  data: ExplanationData;
  onCopy: () => void;
}

export default function CodeExplanationPanel({
  data,
  onCopy,
}: CodeExplanationPanelProps) {
  const handleDownload = async () => {
    try {
      const jsPDFModule = await import('jspdf');
      const doc = new jsPDFModule.default();

      doc.setFontSize(20);
      doc.text('AI Code Explanation', 20, 20);

      doc.setFontSize(12);
      doc.text(`Overview:\n${data.overview}`, 20, 35, { maxWidth: 170 });

      doc.addPage();
      doc.text('Steps:', 20, 20);

      let y = 30;
      data.steps.forEach((step, i) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(14);
        doc.text(`${i + 1}. ${step.title}`, 20, y);
        y += 7;
        doc.setFontSize(10);
        const splitDesc = doc.splitTextToSize(step.description, 170);
        doc.text(splitDesc, 20, y);
        y += (splitDesc.length * 5) + 10;
      });

      doc.save('explanation.pdf');
      toast.success('PDF Downloaded successfully!');
    } catch (error) {
      console.error('PDF Export Failed:', error);
      toast.error('Failed to export PDF');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Actions */}
      <div className="flex justify-end gap-2">
        <Button
          onClick={onCopy}
          size="sm"
          variant="outline"
          className="border-border hover:bg-secondary text-foreground bg-background/50 backdrop-blur"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
        <Button
          onClick={handleDownload}
          size="sm"
          variant="outline"
          className="border-border hover:bg-secondary text-foreground bg-background/50 backdrop-blur"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      {/* Overview Card */}
      <Card className="border-l-4 border-l-primary bg-card/50 backdrop-blur border-y border-r border-border shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2 text-primary">
            <Activity className="w-5 h-5" />
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {data.overview}
          </p>
        </CardContent>
      </Card>

      {/* How It Works & Key Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Step-by-Step (Spans 2 columns) */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
            <Zap className="w-5 h-5 text-yellow-500" />
            How It Works
          </h3>
          <div className="space-y-4">
            {data.steps.map((step, index) => (
              <div
                key={index}
                className="bg-secondary/30 rounded-lg p-4 border border-border/50 hover:border-primary/50 transition-colors"
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">
                      {step.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Key Concepts */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Key Concepts
          </h3>
          <div className="space-y-3">
            {data.keyConcepts.map((concept, index) => (
              <Card key={index} className="bg-card border-border shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-primary mb-1 text-sm">
                    {concept.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {concept.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Complexity Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <Card className="bg-secondary/10 border-border">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                Time Complexity
              </h4>
              <p className="text-2xl font-bold text-primary mb-1">
                {data.timeComplexity.value}
              </p>
              <p className="text-sm text-muted-foreground">
                {data.timeComplexity.reason}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/10 border-border">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                Space Complexity
              </h4>
              <p className="text-2xl font-bold text-primary mb-1">
                {data.spaceComplexity.value}
              </p>
              <p className="text-sm text-muted-foreground">
                {data.spaceComplexity.reason}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
