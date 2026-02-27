'use client';

import React, { useState, useEffect } from 'react';
import {
    Sparkles,
    Plus,
    History,
    TrendingUp,
    Instagram,
    Calendar as CalendarIcon,
    ChevronRight,
    ArrowUpRight,
    Clock,
    MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function DashboardPage() {
    const supabase = createBrowserClient();
    const [loading, setLoading] = useState(true);
    const [recentPosts, setRecentPosts] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalPosts: 0,
        scheduledPosts: 0,
        remainingCredits: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('credits')
                .single();

            const { data: posts, count: postsCount } = await supabase
                .from('scheduled_posts')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })
                .limit(5);

            const { count: scheduledCount } = await supabase
                .from('scheduled_posts')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending');

            setRecentPosts(posts || []);
            setStats({
                totalPosts: postsCount || 0,
                scheduledPosts: scheduledCount || 0,
                remainingCredits: profile?.credits || 0
            });
            setLoading(false);
        };

        fetchDashboardData();
    }, [supabase]);

    const quickActions = [
        { title: 'Create Post', href: '/dashboard/create', icon: Plus, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { title: 'Magic Sync', href: '/dashboard/social', icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50' },
        { title: 'Schedule', href: '/dashboard/schedule', icon: CalendarIcon, color: 'text-pink-600', bg: 'bg-pink-50' },
    ];

    if (loading) return null;

    return (
        <div className="space-y-10 pt-24 pb-20 animate-in fade-in duration-700">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-[900] text-white tracking-tighter uppercase italic">
                        Design <span className="grad-text animate-glow">Matrix</span>
                    </h1>
                    <p className="text-white/70 font-[900] text-xs uppercase tracking-widest">Studio: Active Aesthetic Operations</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard/create"
                        className="flex items-center gap-2 bg-white text-[var(--bg)] px-8 py-4 rounded-2xl font-[900] uppercase tracking-widest text-xs transition-all shadow-xl hover:bg-white/90 transform hover:scale-[1.05] active:scale-95 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                        <Plus className="w-4 h-4" />
                        Init Synthesis
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[
                    { label: 'Artistic Assets', value: stats.totalPosts, icon: History, trend: '+12%', accent: 'var(--accent-1)' },
                    { label: 'Design Pipeline', value: stats.scheduledPosts, icon: CalendarIcon, trend: '+3', accent: 'var(--accent-2)' },
                    { label: 'Creative Units', value: stats.remainingCredits, icon: Sparkles, trend: 'REFILL', accent: 'var(--accent-3)' },
                ].map((stat, i) => (
                    <div key={i} className="glass-morphism p-8 rounded-[2.5rem] border border-white/5 hover:border-[var(--accent-1)]/30 transition-all duration-700 group relative animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-[2.5rem]" />
                        <div className="relative z-10 flex justify-between items-start">
                            <div className="p-4 bg-white/5 rounded-2xl text-white group-hover:animate-float border border-white/5">
                                <stat.icon className="w-6 h-6" style={{ color: stat.accent }} />
                            </div>
                        </div>
                        <div className="relative z-10 mt-8">
                            <div className="text-5xl font-[900] text-white tracking-tighter group-hover:grad-text transition-all duration-500">{stat.value}</div>
                            <div className="text-[11px] font-[900] text-white/70 uppercase tracking-widest mt-2">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2 glass-morphism rounded-[2.5rem] border border-white/5 p-8 md:p-12 shadow-2xl">
                <div className="flex items-center justify-between mb-12">
                    <h3 className="text-2xl font-[900] text-white uppercase tracking-tighter italic">Data <span className="text-white/50">Feed</span></h3>
                    <Link href="/dashboard/schedule" className="text-[11px] font-[900] uppercase tracking-widest text-white/50 hover:text-white flex items-center gap-2 group">
                        Expand All <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="space-y-8">
                    {recentPosts.length > 0 ? (
                        recentPosts.map((post, i) => (
                            <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all duration-500 border border-transparent hover:border-indigo-100 group relative overflow-hidden">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-2xl overflow-hidden relative border border-white/5 group-hover:border-[var(--accent-1)]/30 transition-all">
                                        <div className="absolute inset-0 bg-[var(--accent-1)]/5 animate-pulse" />
                                        <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-white/20 group-hover:text-white/50 animate-glow" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-[900] text-white text-sm md:text-lg tracking-tight line-clamp-1">{post.caption}</h4>
                                        <p className="text-[11px] font-[900] text-white uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-[var(--accent-1)] rounded-full" />
                                            Synced {new Date(post.scheduled_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-5 py-2 glass-morphism text-[11px] font-[900] rounded-full uppercase tracking-widest border border-white/5 group-hover:border-[var(--accent-1)]/30 group-hover:text-white transition-all">
                                    {post.status}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 space-y-6">
                            <div className="w-24 h-24 glass-morphism rounded-full flex items-center justify-center mx-auto border border-white/5 animate-float">
                                <History className="w-10 h-10 text-white/10" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-white font-[900] uppercase tracking-widest text-xs">No active nodes detected</p>
                                <Link href="/dashboard/create" className="inline-block text-white/50 font-[900] uppercase tracking-widest text-[11px] hover:underline">Begin Sequence</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
