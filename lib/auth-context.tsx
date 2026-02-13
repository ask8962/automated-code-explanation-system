'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { initializeFirebase } from './firebase';

interface DemoUser {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: DemoUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isDemo: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const setupAuth = async () => {
      try {
        const { auth } = await initializeFirebase();
        
        if (auth) {
          // Firebase is configured and ready
          try {
            const { onAuthStateChanged } = await import('firebase/auth');
            
            const unsubscribe = onAuthStateChanged(
              auth,
              (currentUser: any) => {
                if (currentUser) {
                  setUser({
                    uid: currentUser.uid,
                    email: currentUser.email || 'user@example.com',
                  });
                } else {
                  setUser(null);
                }
                setLoading(false);
              },
              (error: any) => {
                console.warn('[Auth] Error checking auth state:', error?.message);
                setUser(null);
                setLoading(false);
              }
            );

            return () => unsubscribe();
          } catch (error) {
            console.warn('[Auth] Failed to setup Firebase listener');
            setLoading(false);
          }
        } else {
          // Firebase not configured - use demo mode
          setIsDemo(true);
          
          // Check localStorage for existing demo user
          try {
            const saved = localStorage.getItem('demo-user-session');
            if (saved) {
              setUser(JSON.parse(saved));
            }
          } catch (e) {
            // Ignore parse errors
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.warn('[Auth] Setup failed, using demo mode');
        setIsDemo(true);
        setLoading(false);
      }
    };

    setupAuth();
  }, []);

  const logout = async () => {
    try {
      if (!isDemo) {
        try {
          const { signOut } = await import('firebase/auth');
          const { auth } = await initializeFirebase();
          if (auth) {
            await signOut(auth);
          }
        } catch (error) {
          console.warn('[Auth] Firebase logout failed');
        }
      }
      
      // Clear demo session
      localStorage.removeItem('demo-user-session');
      setUser(null);
    } catch (error) {
      console.error('[Auth] Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, isAuthenticated: !!user, isDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
