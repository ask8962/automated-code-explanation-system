'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, Code2, History, User, Terminal, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Explain', icon: Code2 },
    { href: '/dashboard/history', label: 'History', icon: History },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-white/[0.04] bg-background/60 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/15 group-hover:shadow-violet-500/30 transition-all duration-300">
              <Terminal className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight hidden sm:inline">AI Code Explain</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    className={`text-sm h-8 px-3 rounded-lg transition-all ${isActive
                        ? 'text-foreground bg-white/[0.06]'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
                      }`}
                  >
                    <link.icon className="w-3.5 h-3.5 mr-1.5" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden md:block text-xs text-muted-foreground truncate max-w-[160px]">
                {user.email}
              </span>
            )}
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="hidden md:flex h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.04] rounded-lg"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Sign Out
            </Button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-foreground hover:bg-white/[0.04] rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/[0.04] py-3 space-y-1 overflow-hidden"
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-sm rounded-lg ${isActive ? 'text-foreground bg-white/[0.06]' : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      <link.icon className="w-4 h-4 mr-2" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-white/[0.04] mt-2">
                {user && <p className="px-4 py-1.5 text-xs text-muted-foreground">{user.email}</p>}
                <Button
                  onClick={logout}
                  variant="ghost"
                  className="w-full justify-start text-sm text-muted-foreground hover:text-foreground rounded-lg"
                  size="sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
