'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import { createPortal } from 'react-dom';
import {
  ChevronDown,
  LogOut,
  User,
  Layers
} from 'lucide-react';

interface NavbarProps {
  showDashboardLink?: boolean;
  hideUserDropdown?: boolean;
}

export default function Navbar({ showDashboardLink = false, hideUserDropdown = false }: NavbarProps) {
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const supabase = createBrowserClient();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user);
      if (session?.user) {
        setIsAuthModalOpen(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    router.refresh();
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[var(--bg)]/60 backdrop-blur-2xl border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Link href="/" className="font-bold text-sm tracking-tight text-[var(--text)]">
            Make<span className="grad-text">My</span>Posts
          </Link>
        </div>
        
        {showDashboardLink && (
          <div className="hidden md:flex items-center gap-6 text-[13px] text-[var(--text-muted)]">
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-[var(--text)] transition-colors">Features</a>
            <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="hover:text-[var(--text)] transition-colors">Pricing</a>
            <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="hover:text-[var(--text)] transition-colors">FAQ</a>
            <Link href="/privacy" className="hover:text-[var(--text)] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--text)] transition-colors">Terms</Link>
          </div>
        )}
        
        <div className="flex items-center gap-3">
          {!hideUserDropdown && (
            <>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full border border-[var(--border)] hover:bg-white/5 transition-colors cursor-pointer overflow-hidden"
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[var(--accent-1)]/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-[var(--accent-1)]" />
                      </div>
                    )}
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-raised)] border border-[var(--border)] rounded-xl shadow-2xl z-20 overflow-hidden fade-up py-1">
                        <div className="px-4 py-2 border-b border-[var(--border)] mb-1">
                          <p className="text-[11px] text-[var(--text-muted)] truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          className="w-full text-left px-4 py-2 text-[13px] hover:bg-white/5 transition-colors flex items-center gap-2"
                        >
                          <Layers className="w-3.5 h-3.5" /> Dashboard
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-[13px] text-red-400 hover:bg-red-400/10 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-[13px] text-[var(--text-dim)] hover:text-[var(--text)] transition-colors cursor-pointer"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-[13px] font-medium bg-white text-[var(--bg)] px-4 py-1.5 rounded-lg hover:bg-white/90 transition-colors cursor-pointer"
                  >
                    Start Free
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Auth Modal - Rendered at document body level */}
      {isMounted && createPortal(
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />,
        document.body
      )}
    </nav>
  );
}
