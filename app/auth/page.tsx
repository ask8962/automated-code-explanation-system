'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { AlertCircle, Terminal, ArrowRight } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirebase } from '@/lib/firebase';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Scene = dynamic(() => import('@/components/Scene'), { ssr: false });

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
        const demoUser = {
          uid: 'demo-' + Date.now(),
          email: email,
        };
        localStorage.setItem('demo-user-session', JSON.stringify(demoUser));
        toast.success(`Welcome, ${email}!`);
      } else {
        try {
          const { auth } = await initializeFirebase();

          if (isSignUp) {
            const { createUserWithEmailAndPassword } = await import('firebase/auth');
            if (!auth) throw new Error('Firebase not configured');
            await createUserWithEmailAndPassword(auth, email, password);
            toast.success('Account created!');
          } else {
            const { signInWithEmailAndPassword } = await import('firebase/auth');
            if (!auth) throw new Error('Firebase not configured');
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Welcome back!');
          }
        } catch (firebaseError: any) {
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
      const demoUser = {
        uid: 'demo-user-123',
        email: 'demo@example.com',
      };
      localStorage.setItem('demo-user-session', JSON.stringify(demoUser));
      toast.success('Welcome to demo mode!');
      router.push('/dashboard');
    } catch {
      toast.error('Failed to start demo');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { auth } = await initializeFirebase();
      if (!auth) throw new Error('Firebase not configured');
      await signInWithPopup(auth, googleAuthProvider);
      toast.success('Signed in with Google!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left Side — 3D Scene */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
          <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 text-center px-12"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-violet-500/20">
            <Terminal className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-3">AI Code Explain</h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
            Understand any code with AI-powered explanations, complexity analysis, and smart optimizations.
          </p>
        </motion.div>
      </div>

      {/* Right Side — Auth Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background relative">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm space-y-6 relative z-10"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Terminal className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              {isSignUp ? 'Create account' : 'Welcome back'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isSignUp ? 'Start explaining code with AI' : 'Sign in to continue'}
            </p>
          </div>

          {isDemo && (
            <Alert className="border-amber-500/20 bg-amber-500/[0.05] rounded-xl">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
              <AlertDescription className="text-xs text-amber-500/80">
                Demo mode — Firebase not configured.
              </AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground/70">Email</label>
              <Input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-white/[0.03] border-white/[0.06] rounded-xl text-sm placeholder:text-white/15 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground/70">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-white/[0.03] border-white/[0.06] rounded-xl text-sm placeholder:text-white/15 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-white text-black hover:bg-white/90 font-semibold rounded-xl text-sm shadow-lg shadow-white/5 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="px-3 bg-background text-muted-foreground uppercase tracking-widest">
                {isDemo ? 'or try demo' : 'or continue with'}
              </span>
            </div>
          </div>

          {/* Social / Demo */}
          {isDemo ? (
            <Button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              variant="outline"
              className="w-full h-11 border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] rounded-xl text-sm transition-all"
            >
              Continue as Demo User
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              variant="outline"
              className="w-full h-11 border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] rounded-xl text-sm transition-all"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg>
              Sign in with Google
            </Button>
          )}

          {/* Toggle Sign Up / Sign In */}
          <p className="text-center text-xs text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
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

          <p className="text-center text-[10px] text-muted-foreground/50">
            By signing in, you agree to our terms and privacy policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
