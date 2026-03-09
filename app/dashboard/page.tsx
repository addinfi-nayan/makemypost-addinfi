'use client';

import React, { useState, useEffect } from 'react';
import {
    Sparkles,
    Send,
    Image as ImageIcon,
    Palette,
    Layers,
    Zap,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ChevronRight,
    Plus
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase';
import { triggerN8NWorkflow } from '@/lib/actions';

const THEMES = [
    {
        id: 'minimal',
        name: 'Clean Minimal',
        desc: 'High-contrast typography with spacious layouts.',
        color: '#818CF8',
        preview: 'bg-indigo-500/10'
    },
    {
        id: 'vibrant',
        name: 'Vibrant Pop',
        desc: 'Bolder colors and dynamic geometric shapes.',
        color: '#F472B6',
        preview: 'bg-pink-500/10'
    },
    {
        id: 'elegant',
        name: 'Modern Elegant',
        desc: 'Serif fonts with sophisticated, muted tones.',
        color: '#C084FC',
        preview: 'bg-purple-500/10'
    },
    {
        id: 'tech',
        name: 'Cyber Tech',
        desc: 'Neon accents and dark technical aesthetics.',
        color: '#34D399',
        preview: 'bg-emerald-500/10'
    }
];

export default function DashboardPage() {
    const [selectedTheme, setSelectedTheme] = useState(THEMES[0].id);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
    const [user, setUser] = useState<any>(null);

    const supabase = createBrowserClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setStatus({ type: 'error', message: 'Please enter what your post is about.' });
            return;
        }

        setIsGenerating(true);
        setStatus({ type: null, message: '' });

        try {
            // For now, using a placeholder webhook URL or user's env if available
            const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';

            const payload = {
                userId: user?.id,
                userEmail: user?.email,
                theme: selectedTheme,
                prompt: prompt,
                timestamp: new Date().toISOString()
            };

            console.log('Triggering n8n with:', payload);

            // If no webhook URL is set, we simulate a success for UI demonstration
            if (!webhookUrl) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                setStatus({
                    type: 'success',
                    message: 'Generation request sent! Check your social connections to see the result.'
                });
            } else {
                await triggerN8NWorkflow(webhookUrl, payload);
                setStatus({ type: 'success', message: 'AI is crafting your post. It will appear in your schedule shortly!' });
            }

            setPrompt('');
        } catch (error) {
            console.error('Generation error:', error);
            setStatus({ type: 'error', message: 'Failed to start generation. Please check your connection.' });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            {/* ─── Header ─── */}
            <section className="fade-up">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                    Create <span className="grad-text">Magic</span>
                </h1>
                <p className="text-white/50">Describe your vision, and let AI handle the design and branding.</p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ─── Main Creation Area ─── */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Theme Selection */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 flex items-center gap-2">
                                <Palette className="w-4 h-4" /> 1. Choose a Theme
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {THEMES.map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => setSelectedTheme(theme.id)}
                                    className={`relative p-5 rounded-2xl border text-left transition-all duration-300 group ${selectedTheme === theme.id
                                            ? 'bg-white/5 border-[var(--accent-1)] shadow-[0_0_20px_rgba(129,140,248,0.1)]'
                                            : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl ${theme.preview} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                                        <Sparkles className="w-5 h-5" style={{ color: theme.color }} />
                                    </div>
                                    <h4 className="font-semibold mb-1">{theme.name}</h4>
                                    <p className="text-xs text-white/40 leading-relaxed">{theme.desc}</p>

                                    {selectedTheme === theme.id && (
                                        <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-300">
                                            <CheckCircle2 className="w-5 h-5 text-[var(--accent-1)]" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Prompt Input */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 flex items-center gap-2">
                            <Layers className="w-4 h-4" /> 2. Post Branding & Content
                        </h3>
                        <div className="gradient-border p-1">
                            <div className="bg-[var(--bg-raised)] rounded-[14px] p-6 space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-white/70">What should the AI create?</label>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="e.g., A promotional post for our new summer coffee blend with a discount code SUMMER24"
                                        className="w-full h-32 bg-white/5 border border-white/5 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-1)]/50 transition-all resize-none placeholder:text-white/20"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <button
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                        className="w-full sm:w-auto px-8 py-3.5 bg-white text-black rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-white/5"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                Generate with AI
                                                <Zap className="w-4 h-4 fill-black group-hover:scale-110 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                    <div className="flex items-center gap-2 text-[11px] text-white/30">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        Uses 1 credit per post generated
                                    </div>
                                </div>

                                {status.type && (
                                    <div className={`p-4 rounded-xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' : 'bg-red-500/10 text-red-400 border border-red-500/10'
                                        }`}>
                                        {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                        <p>{status.message}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                {/* ─── Sidebar / Preview ─── */}
                <div className="space-y-6">
                    {/* Quick Tips */}
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[var(--accent-2)]" />
                            Pro Tips
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "Mention your target audience",
                                "Include any specific text or slogans",
                                "Specify if you want a discount code included",
                                "Describe the 'vibe' (e.g., energetic, calm)"
                            ].map((tip, i) => (
                                <li key={i} className="text-xs text-white/50 flex items-start gap-2">
                                    <ChevronRight className="w-3 h-3 mt-0.5 text-[var(--accent-1)]" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Preview Placeholder */}
                    <div className="relative group">
                        <div className="gradient-border">
                            <div className="p-6 space-y-4">
                                <h3 className="text-sm font-semibold">Recent Generations</h3>
                                <div className="aspect-square rounded-xl bg-white/5 flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 group-hover:border-[var(--accent-1)]/30 transition-colors">
                                    <ImageIcon className="w-10 h-10 text-white/10 mb-4" />
                                    <p className="text-xs text-white/30">Your generated posts will appear here once ready.</p>
                                </div>
                                <button className="w-full py-2.5 rounded-lg border border-white/5 text-[11px] font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                                    View Full History <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
