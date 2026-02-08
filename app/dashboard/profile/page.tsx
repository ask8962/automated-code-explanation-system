'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { ArrowLeft, LogOut, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface UserStats {
  totalExplanations: number;
  languages: { [key: string]: number };
  modes: { [key: string]: number };
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout, isDemo } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalExplanations: 0,
    languages: {},
    modes: {},
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    if (!user) return;

    // In demo mode, skip Firebase calls
    if (isDemo) {
      setStats({
        totalExplanations: 0,
        languages: {},
        modes: {},
      });
      setStatsLoading(false);
      return;
    }

    try {
      // Try to load from Firebase only if configured
      try {
        const { initializeFirebase } = await import('@/lib/firebase');
        const { db } = await initializeFirebase();
        
        if (!db) {
          setStatsLoading(false);
          return;
        }

        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const q = query(collection(db, 'codeExplanations'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const languages: { [key: string]: number } = {};
        const modes: { [key: string]: number } = {};

        querySnapshot.forEach((doc: any) => {
          const data = doc.data();
          languages[data.language] = (languages[data.language] || 0) + 1;
          modes[data.mode] = (modes[data.mode] || 0) + 1;
        });

        setStats({
          totalExplanations: querySnapshot.size,
          languages,
          modes,
        });
      } catch (firebaseError) {
        console.warn('Firebase not available for stats');
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/auth');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground flex-1">Profile</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {isDemo && (
          <Alert className="border-amber-500/50 bg-amber-500/10">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              You are in demo mode. Connect Firebase to save your profile data permanently.
            </AlertDescription>
          </Alert>
        )}

        {/* Account Info */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-foreground mt-1">{user.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Account Status</label>
              <p className="text-foreground mt-1">Active</p>
            </div>

            <Button onClick={handleLogout} variant="outline" className="border-border hover:bg-secondary text-foreground bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {statsLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-secondary rounded-lg p-4 border border-border">
                    <p className="text-sm text-muted-foreground">Total Explanations</p>
                    <p className="text-3xl font-bold text-primary mt-2">{stats.totalExplanations}</p>
                  </div>
                </div>

                {Object.keys(stats.languages).length > 0 && (
                  <div>
                    <h3 className="font-medium text-foreground mb-3">Languages Used</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(stats.languages).map(([lang, count]) => (
                        <div key={lang} className="bg-input rounded-lg p-3 border border-border text-center">
                          <p className="text-sm font-medium text-accent uppercase">{lang}</p>
                          <p className="text-lg font-bold text-foreground mt-1">{count}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {Object.keys(stats.modes).length > 0 && (
                  <div>
                    <h3 className="font-medium text-foreground mb-3">Modes Used</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(stats.modes).map(([mode, count]) => (
                        <div key={mode} className="bg-input rounded-lg p-3 border border-border text-center">
                          <p className="text-sm font-medium text-accent capitalize">{mode}</p>
                          <p className="text-lg font-bold text-foreground mt-1">{count}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
