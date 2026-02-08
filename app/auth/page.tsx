'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirebase } from '@/lib/firebase';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isDemo } = useAuth();
  const googleAuthProvider = new GoogleAuthProvider();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email.includes('@')) {
        toast.error('Please enter a valid email');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      if (isDemo) {
        // Demo mode - accept any email/password combination
        const demoUser = {
          uid: 'demo-' + Date.now(),
          email: email,
        };
        localStorage.setItem('demo-user-session', JSON.stringify(demoUser));
        toast.success(`Welcome to demo mode, ${email}!`);
      } else {
        // Firebase mode - try to authenticate
        try {
          const { auth } = await initializeFirebase();

          if (isSignUp) {
            const { createUserWithEmailAndPassword } = await import('firebase/auth');

            if (!auth) {
              throw new Error('Firebase not configured');
            }

            const result = await createUserWithEmailAndPassword(auth, email, password);
            toast.success('Account created successfully!');
          } else {
            const { signInWithEmailAndPassword } = await import('firebase/auth');

            if (!auth) {
              throw new Error('Firebase not configured');
            }

            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Logged in successfully!');
          }
        } catch (firebaseError: any) {
          console.error('[Auth] Firebase error:', firebaseError.message);
          toast.error(firebaseError.message || 'Authentication failed');
          setLoading(false);
          return;
        }
      }

      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const demoEmail = 'demo@example.com';
      const demoUser = {
        uid: 'demo-user-123',
        email: demoEmail,
      };
      localStorage.setItem('demo-user-session', JSON.stringify(demoUser));
      toast.success('Welcome to demo mode!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error('Failed to start demo');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { auth } = await initializeFirebase();

      if (!auth) {
        throw new Error('Firebase not configured');
      }

      const result = await signInWithPopup(auth, googleAuthProvider);
      toast.success('Logged in with Google successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('[Auth] Google sign-in error:', error.message);
      toast.error(error.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-4">
        {isDemo && (
          <Alert className="border-amber-500/50 bg-amber-500/10">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              Running in demo mode. Firebase not configured. <a href="/QUICKSTART.md" className="underline font-medium">Setup Firebase here.</a>
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-border bg-card">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">{'</>'}</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-foreground">AI Code Explainer</CardTitle>
            <CardDescription className="text-muted-foreground">
              {isSignUp ? 'Create an account to get started' : 'Sign in to your account'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </form>

            {isDemo && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">Or try demo</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  variant="outline"
                  className="w-full border-border hover:bg-secondary text-foreground bg-transparent"
                >
                  Continue as Demo User
                </Button>
              </>
            )}

            {!isDemo && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  variant="outline"
                  className="w-full border-border hover:bg-secondary text-foreground bg-transparent"
                >
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                  Sign in with Google
                </Button>
              </>
            )}

            <p className="text-center text-sm text-muted-foreground">
              {isSignUp ? 'Already have an account?' : `Don't have an account?`}{' '}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setEmail('');
                  setPassword('');
                }}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          By signing in, you agree to our terms and privacy policy
        </p>
      </div>
    </div>
  );
}
