'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code2, Zap, BookOpen, BarChart3 } from 'lucide-react';

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">&lt;/&gt;</span>
            </div>
            <span className="font-bold text-foreground">AI Code Explainer</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
                Sign In
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary border border-border">
              <Zap className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm text-foreground">Powered by AI</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-foreground tracking-tight">
              Understand Any Code <span className="text-primary">Instantly</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Paste your code and get AI-powered explanations tailored to your learning style. Perfect for
              beginners, exam preparation, and interview prep.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/auth">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base">
                  Start Explaining Code
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground">Powerful Features</h2>
            <p className="text-muted-foreground mt-4">Everything you need to understand code better</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Code2,
                title: 'Multiple Languages',
                description: 'Support for Python, Java, C++, and C',
              },
              {
                icon: BookOpen,
                title: 'Learning Modes',
                description: 'Beginner-friendly, Exam, and Interview modes',
              },
              {
                icon: Zap,
                title: 'AI-Powered',
                description: 'Advanced AI models for accurate explanations',
              },
              {
                icon: BarChart3,
                title: 'Complexity Analysis',
                description: 'Time and space complexity breakdowns',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="p-6 rounded-lg border border-border bg-background">
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Paste Code', description: 'Copy and paste any code snippet' },
              { step: '2', title: 'Select Mode', description: 'Choose your learning style' },
              { step: '3', title: 'Get Explanation', description: 'Receive AI-powered insights instantly' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Ready to understand code better?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join hundreds of students and professionals learning to code with AI-powered explanations.
          </p>

          <Link href="/auth">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-4">
              <h3 className="font-semibold text-foreground mb-4">Team (GLA University Mini Project - B.Tech CSE)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-muted-foreground">
                  <thead className="text-xs text-foreground uppercase bg-secondary/50">
                    <tr>
                      <th className="px-3 py-2 rounded-l-md">Name</th>
                      <th className="px-3 py-2">Class Roll</th>
                      <th className="px-3 py-2">Uni Roll</th>
                      <th className="px-3 py-2 rounded-r-md">Sec</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="px-3 py-2 font-medium text-foreground">Anukalp Gupta</td>
                      <td className="px-3 py-2">12</td>
                      <td className="px-3 py-2">2315000373</td>
                      <td className="px-3 py-2">AA</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="px-3 py-2 font-medium text-foreground">Nishant Singh</td>
                      <td className="px-3 py-2">47</td>
                      <td className="px-3 py-2">2315001492</td>
                      <td className="px-3 py-2">AA</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="px-3 py-2 font-medium text-foreground">Prince Kumar</td>
                      <td className="px-3 py-2">54</td>
                      <td className="px-3 py-2">2315001678</td>
                      <td className="px-3 py-2">AA</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-medium text-foreground">Utpal Kumar</td>
                      <td className="px-3 py-2">69</td>
                      <td className="px-3 py-2">2315002369</td>
                      <td className="px-3 py-2">AA</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">© 2024 AI Code Explainer. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground text-sm">
                Twitter
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground text-sm">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
