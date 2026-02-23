'use client';

import React from 'react';
import { LogIn, X } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    if (!isOpen) return null;

    const supabase = createBrowserClient();

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) {
            console.error('Error logging in:', error.message);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-md gradient-border shadow-2xl animate-fade-up">
                <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-white/10">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors p-2"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="text-center mb-8 pt-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-[var(--accent-1)] to-[var(--accent-2)] rounded-2xl shadow-lg mb-4">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2 uppercase italic tracking-tighter">Login <span className="grad-text">Session</span></h2>
                        <p className="text-[var(--text-dim)] text-xs font-black uppercase tracking-widest">Access your brand commands center.</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3.5 px-4 rounded-xl hover:bg-white/90 transition-all duration-200 shadow-lg shadow-white/5 active:scale-[0.98]"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                            Continue with Google
                        </button>
                    </div>

                    <div className="mt-8 text-center text-sm text-[var(--text-muted)]">
                        By continuing, you agree to our Terms of Service.
                    </div>
                </div>
            </div>
        </div>
    );
}
