'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">&lt;/&gt;</span>
            </div>
            <span className="font-bold text-foreground hidden sm:inline">AI Code Explainer</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-foreground hover:bg-secondary">
                Explain Code
              </Button>
            </Link>
            <Link href="/dashboard/history">
              <Button variant="ghost" className="text-foreground hover:bg-secondary">
                History
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button variant="ghost" className="text-foreground hover:bg-secondary">
                Profile
              </Button>
            </Link>
          </div>

          {/* User Menu / Mobile */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
              {user && <span className="text-sm text-muted-foreground">{user.email}</span>}
              <Button
                onClick={logout}
                variant="outline"
                className="border-border text-foreground hover:bg-secondary bg-transparent"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:bg-secondary rounded-md transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-secondary">
                Explain Code
              </Button>
            </Link>
            <Link href="/dashboard/history">
              <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-secondary">
                History
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-secondary">
                Profile
              </Button>
            </Link>
            <div className="pt-2 border-t border-border mt-2">
              {user && <p className="px-4 py-2 text-sm text-muted-foreground">{user.email}</p>}
              <Button
                onClick={logout}
                variant="outline"
                className="w-full justify-start border-border text-foreground hover:bg-secondary bg-transparent"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
