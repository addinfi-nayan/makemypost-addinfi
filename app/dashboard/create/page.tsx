'use client';

import React, { useState } from 'react';
import {
    Sparkles,
    Layers,
    Maximize,
    Send,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createBrowserClient } from '@/lib/supabase';
import { deductCredits, triggerN8NWorkflow } from '@/lib/actions';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function CreatePostPage() {
    const supabase = createBrowserClient();
    const [topic, setTopic] = useState('');
    const [theme, setTheme] = useState('Minimalist');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const themes = [
        { name: 'Minimalist', description: 'Clean and modern', icon: Layers },
        { name: 'Bold', description: 'High contrast and energy', icon: Sparkles },
        { name: 'Festive', description: 'Celebrate the moment', icon: Send },
    ];

    const aspectRatios = ['1:1', '4:5', '9:16'];

    const handleMagicSync = async () => {
        setSyncing(true);
        setError(null);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Auth required');

            // Professional n8n Trigger Point
            const result = await triggerN8NWorkflow(
                process.env.NEXT_PUBLIC_N8N_MAGIC_SYNC_URL!,
                { userId: user.id }
            ).catch(() => ({ suggestedTheme: 'Bold' })); // Fallback for demo

            setTheme(result.suggestedTheme || 'Bold');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSyncing(false);
        }
    };

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        setError(null);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Auth required');

            // Deduct 1 Credit
            await deductCredits(user.id, 1);

            // Trigger Generation
            const result = await triggerN8NWorkflow(
                process.env.NEXT_PUBLIC_N8N_GENERATE_URL!,
                {
                    topic,
                    theme,
                    aspectRatio,
                    userId: user.id
                }
            ).catch(() => ({ success: true, url: '#' })); // Fallback for demo

            alert('Content generated successfully! (Demo Mode)');
        } catch (err: any) {
            setError(err.message === 'Insufficient credits'
                ? 'You do not have enough credits. Please top up.'
                : 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h1 className="text-4xl font-[900] text-[var(--text)] tracking-tighter uppercase italic">
                    Creative <span className="grad-text animate-glow">Engine</span>
                </h1>
                <p className="text-[var(--text-dim)] font-[900] text-xs uppercase tracking-widest">Phase: Aesthetic Synthesis</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Controls */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Topic Input */}
                    <section className="bg-[var(--bg-card)]/40 p-6 rounded-2xl border border-white/5 shadow-2xl">
                        <label className="block text-xs font-[900] text-[var(--text-dim)] uppercase tracking-widest italic mb-4">
                            Input Signal (Topic)
                        </label>
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. Launching our new summer collection with a 20% discount..."
                            className="w-full min-h-[140px] p-4 bg-white/[0.03] border border-white/5 rounded-xl focus:ring-1 focus:ring-[var(--accent-1)] focus:border-transparent transition-all outline-none resize-none text-[var(--text)] text-sm placeholder:text-white/30"
                        />
                    </section>

                    {/* Theme Selector */}
                    <section className="glass-morphism p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <label className="text-xs font-[900] text-[var(--text-dim)] uppercase tracking-widest italic">Core Theme</label>
                            <button
                                onClick={handleMagicSync}
                                disabled={syncing}
                                className="flex items-center gap-2 text-[11px] font-[900] uppercase tracking-widest text-[var(--accent-1)] hover:text-[var(--text)] bg-white/5 px-4 py-2 rounded-full transition-all hover:scale-105 active:scale-95 border border-white/5"
                            >
                                {syncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 animate-glow text-[var(--accent-1)]" />}
                                Quantum Sync
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {themes.map((t) => (
                                <button
                                    key={t.name}
                                    onClick={() => setTheme(t.name)}
                                    className={cn(
                                        "p-6 rounded-2xl border transition-all duration-500 group relative overflow-hidden",
                                        theme === t.name
                                            ? "border-[var(--accent-1)]/30 bg-[var(--accent-1)]/5 shadow-[0_0_25px_rgba(129,140,248,0.1)]"
                                            : "border-white/5 bg-white/[0.02] hover:bg-white/5"
                                    )}
                                >
                                    {theme === t.name && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-1)]/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />}
                                    <t.icon className={cn("w-6 h-6 mb-4 transition-transform duration-500 group-hover:scale-110", theme === t.name ? "text-[var(--accent-1)]" : "text-white/30")} />
                                    <div className="font-[900] text-[var(--text)] text-xs uppercase tracking-widest">{t.name}</div>
                                    <div className="text-[11px] text-[var(--text-dim)] mt-1 uppercase font-[900] tracking-tight">{t.description}</div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Aspect Ratio */}
                    <section className="bg-[var(--bg-card)]/40 p-6 rounded-2xl border border-white/5 shadow-2xl">
                        <label className="block text-xs font-[900] text-[var(--text-dim)] uppercase tracking-widest italic mb-6">Aspect Ratio</label>
                        <div className="flex gap-4">
                            {aspectRatios.map((ratio) => (
                                <button
                                    key={ratio}
                                    onClick={() => setAspectRatio(ratio)}
                                    className={cn(
                                        "px-6 py-3 rounded-xl border font-[900] text-[11px] uppercase tracking-widest transition-all duration-200",
                                        aspectRatio === ratio
                                            ? "border-[var(--accent-1)] bg-white text-[var(--bg)] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                            : "border-white/5 bg-white/[0.03] text-[var(--text-dim)] hover:border-white/10 hover:text-[var(--text)]"
                                    )}
                                >
                                    {ratio}
                                </button>
                            ))}
                        </div>
                    </section>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !topic}
                        className="w-full py-6 bg-white text-[var(--bg)] font-[900] uppercase tracking-[0.2em] rounded-[2rem] shadow-2xl shadow-white/5 transition-all duration-500 lg:scale-[1.02] flex items-center justify-center gap-3 text-xs group relative overflow-hidden disabled:opacity-50 disabled:grayscale disabled:pointer-events-none hover:bg-white/90 active:scale-[0.98]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        {loading ? 'Synthesizing...' : 'Initialize Generation (1 unit)'}
                    </button>
                </div>

                {/* Right: Preview Mockup */}
                <div className="space-y-6">
                    <div className="glass-morphism p-1 rounded-[2.5rem] sticky top-8 border border-white/5">
                        <div className="bg-[var(--bg-card)] rounded-[2.3rem] p-8 space-y-8 h-full">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[11px] font-[900] text-[var(--accent-1)] uppercase tracking-widest">Artistic Design Preview</h3>
                                <div className="px-3 py-1 bg-[var(--accent-1)]/5 border border-[var(--accent-1)]/20 text-[var(--accent-1)] text-[9px] font-[900] rounded-full animate-pulse">Matrix Active</div>
                            </div>

                            <div className={cn(
                                "bg-white/[0.02] rounded-3xl flex flex-col items-center justify-center border border-white/5 text-[var(--text-dim)] overflow-hidden relative group",
                                aspectRatio === '1:1' ? 'aspect-square' : aspectRatio === '4:5' ? 'aspect-[4/5]' : 'aspect-[9/16]'
                            )}>
                                <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0))] -z-10" />
                                {loading ? (
                                    <div className="text-center p-10 space-y-6">
                                        <div className="relative flex items-center justify-center">
                                            <div className="absolute w-12 h-12 border border-[var(--accent-1)]/30 rounded-full animate-spin" />
                                            <div className="absolute w-8 h-8 border border-[var(--accent-2)]/20 rounded-full animate-[spin_2s_linear_infinite_reverse]" />
                                            <Sparkles className="w-5 h-5 text-[var(--accent-1)] animate-pulse" />
                                        </div>
                                        <p className="text-[11px] font-[900] text-[var(--accent-1)] uppercase tracking-[0.3em] animate-pulse">Merging Art DNA...</p>
                                    </div>
                                ) : (
                                    <div className="text-center p-10 group-hover:scale-110 transition-transform duration-700">
                                        <div className="relative">
                                            <Maximize className="w-12 h-12 mx-auto mb-4 text-white/20 group-hover:text-[var(--accent-1)]/60 transition-colors" />
                                            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[var(--accent-1)]/60 animate-glow" />
                                        </div>
                                        <p className="text-[11px] font-[900] text-[var(--text-dim)] uppercase tracking-widest max-w-[150px] mx-auto">Standby for input signal</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                {[
                                    { label: 'Logo Overlay', status: 'Active' },
                                    { label: 'Brand DNA Match', status: 'Active' },
                                    { label: 'Resolution', status: '2048px' }
                                ].map((s, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <span className="text-[11px] font-[900] text-[var(--text-dim)] uppercase tracking-widest">{s.label}</span>
                                        <span className="text-[11px] font-[900] text-[var(--accent-1)] uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-1 h-1 bg-[var(--accent-1)] rounded-full animate-pulse" />
                                            {s.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
