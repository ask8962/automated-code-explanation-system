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
    <div className="min-h-screen flex relative overflow-hidden bg-[#020205]">
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </div>

      {/* Left Side — Floating Hero Copy */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.2, type: 'spring' }}
          className="relative text-center px-12"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-violet-600 to-fuchsia-500 flex items-center justify-center mx-auto mb-8 shadow-[0_0_80px_rgba(139,92,246,0.3)] animate-pulse-slow">
            <Terminal className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl font-extrabold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 drop-shadow-2xl">
            Neon Protocol
          </h2>
          <p className="text-white/60 text-lg max-w-md mx-auto leading-relaxed font-light">
            Initialize the quantum engine. Decode reality with artificial intelligence.
          </p>
        </motion.div>
      </div>

      {/* Right Side — High-End Glassmorphism Auth Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        {/* Core glow behind the glass card for maximum depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotateY: 15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
          style={{ transformPerspective: 1000 }}
          className="w-full max-w-[420px] space-y-6 relative p-8 sm:p-10 rounded-[2.5rem] border border-white/10 bg-[#0a0a14]/60 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(255,255,255,0.02)] extreme-4d-button"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.4)]">
              <Terminal className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-white drop-shadow-md">
              {isSignUp ? 'Initialize Profile' : 'Access Terminal'}
            </h1>
            <p className="text-sm text-white/50">
              {isSignUp ? 'Generate your unique access keys' : 'Authenticate to enter the grid'}
            </p>
          </div>

          {isDemo && (
            <Alert className="border-amber-500/30 bg-amber-500/[0.08] rounded-2xl backdrop-blur-md">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              <AlertDescription className="text-xs text-amber-400/90 font-medium">
                Simulation Mode Active. Data will not be preserved globally.
              </AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-5">
            <div className="space-y-2 relative group">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider ml-1">Email Node</label>
              <Input
                type="email"
                placeholder="operator@grid.net"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-black/40 border-white/10 rounded-2xl text-sm text-white placeholder:text-white/20 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-2 relative group">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider ml-1">Encryption Key</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-black/40 border-white/10 rounded-2xl text-sm text-white placeholder:text-white/20 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-4 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold tracking-wide rounded-2xl text-sm shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:-translate-y-1"
            >
              {loading ? 'Processing...' : isSignUp ? 'Engage Uplink' : 'Bypass Security'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="px-4 py-1 rounded-full bg-[#0a0a14] border border-white/10 text-white/50 uppercase tracking-widest backdrop-blur-md">
                {isDemo ? 'or execute demo protocol' : 'or bridge connection via'}
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
              className="w-full h-12 border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 rounded-2xl text-sm text-white transition-all duration-300"
            >
              Load Demo State
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              variant="outline"
              className="w-full h-12 border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 rounded-2xl text-sm text-white transition-all duration-300 group"
            >
              <svg className="mr-3 h-5 w-5 opacity-80 group-hover:opacity-100 transition-opacity" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg>
              Google Auth Node
            </Button>
          )}

          {/* Toggle Sign Up / Sign In */}
          <p className="text-center text-sm text-white/50 mt-6 pt-4 border-t border-white/10">
            {isSignUp ? 'Already mapped?' : "No node ID?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setEmail('');
                setPassword('');
              }}
              className="text-cyan-400 hover:text-cyan-300 font-semibold tracking-wide transition-colors"
            >
              {isSignUp ? 'Re-sync' : 'Initialize'}
            </button>
          </p>

        </motion.div>
      </div>
    </div>
  );
}
