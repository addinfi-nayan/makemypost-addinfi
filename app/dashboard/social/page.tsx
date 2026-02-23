'use client';

import React, { useState, useEffect } from 'react';
import {
    Instagram,
    Facebook,
    Linkedin,
    Settings,
    CheckCircle2,
    ExternalLink,
    ShieldCheck,
    Zap,
    Loader2,
    Sparkles
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createBrowserClient } from '@/lib/supabase';
import { saveSocialToken } from '@/lib/encryption';
import { generateOAuthUrl, generateState, storeOAuthState, verifyToken, SOCIAL_PLATFORMS } from '@/lib/social-auth';
import { useRouter, useSearchParams } from 'next/navigation';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function SocialConnectionPage() {
    const supabase = createBrowserClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [connectingId, setConnectingId] = useState<string | null>(null);
    const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
    const [syncProgress, setSyncProgress] = useState<number>(0);
    const [syncStatus, setSyncStatus] = useState<string>('');
    const [connectionError, setConnectionError] = useState<string | null>(null);

    // Handle OAuth callback on mount
    useEffect(() => {
        const success = searchParams.get('success');
        const error = searchParams.get('error');
        const profileParam = searchParams.get('profile');

        if (success) {
            setConnectedPlatforms(prev => [...prev, success]);
            setConnectionError(null);
            
            // Clear URL parameters
            router.replace('/dashboard/social');
        }

        if (error) {
            setConnectionError(decodeURIComponent(error));
            // Clear URL parameters
            router.replace('/dashboard/social');
        }

        // Load existing connections
        loadExistingConnections();
    }, [searchParams, router]);

    const loadExistingConnections = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: tokens } = await supabase
                .from('social_tokens')
                .select('platform')
                .eq('user_id', user.id);

            const platforms = tokens?.map(t => t.platform) || [];
            setConnectedPlatforms(platforms);
        } catch (error) {
            console.error('Error loading connections:', error);
        }
    };

    const handleConnect = async (platformId: string) => {
        setConnectingId(platformId);
        setConnectionError(null);
        
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Auth required');

            // Generate OAuth state and URL
            const state = generateState();
            const platform = SOCIAL_PLATFORMS[platformId];
            
            if (!platform) {
                throw new Error('Platform not supported');
            }

            // Store state for verification
            storeOAuthState(state, platformId);

            // Generate OAuth URL
            const redirectUri = `${window.location.origin}/api/oauth/callback`;
            const oauthUrl = generateOAuthUrl(platform, redirectUri, state);

            // Redirect to OAuth provider
            window.location.href = oauthUrl;

        } catch (err: any) {
            setConnectionError(err.message);
            setConnectingId(null);
        }
    };

    const handleDisconnect = async (platformId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Remove token from database
            await supabase
                .from('social_tokens')
                .delete()
                .eq('user_id', user.id)
                .eq('platform', platformId);

            // Update local state
            setConnectedPlatforms(prev => prev.filter(id => id !== platformId));
        } catch (err: any) {
            setConnectionError(err.message);
        }
    };

    const platforms = [
        {
            id: 'instagram',
            name: 'Instagram',
            icon: Instagram,
            color: 'from-purple-600 via-pink-600 to-orange-500',
            description: 'Automate your posts and sync your brand identity in one click.',
            features: [
                { title: 'Auto Post', desc: 'Schedule & publish automatically', icon: Zap },
                { title: 'Magic Sync', desc: 'Match your last 5 post styles', icon: Sparkles },
                { title: 'Secure', desc: 'Encrypted token storage', icon: ShieldCheck },
            ],
            requires: 'Direct connection via official Graph API.'
        },
        {
            id: 'facebook',
            name: 'Facebook',
            icon: Facebook,
            color: 'from-blue-600 to-blue-800',
            description: 'Connect your Facebook Page to sync cross-platform content.',
            features: [
                { title: 'Cross Posting', desc: 'Share from IG to FB instantly', icon: Zap },
                { title: 'Page Manager', desc: 'Automate multiple FB pages', icon: Sparkles },
                { title: 'Insights', desc: 'Track performance stats', icon: ShieldCheck },
            ],
            requires: 'Direct connection for Page management.'
        },
        {
            id: 'linkedin',
            name: 'LinkedIn',
            icon: Linkedin,
            color: 'from-blue-700 to-blue-900',
            description: 'Establish thought leadership with automated professional updates.',
            features: [
                { title: 'B2B Reach', desc: 'Target professional audiences', icon: Zap },
                { title: 'Auto Articles', desc: 'Pulse-ready content generation', icon: Sparkles },
                { title: 'Network Link', desc: 'Sync with your company page', icon: ShieldCheck },
            ],
            requires: 'Direct connection via LinkedIn API.'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-[900] text-[var(--text)] tracking-tighter uppercase italic">Social <span className="grad-text">Connections</span></h1>
                <p className="text-[var(--text-dim)] mt-2 font-[900] text-xs uppercase tracking-widest">Link your Instagram and Meta accounts to enable direct scheduling.</p>
                
                {connectionError && (
                    <div className="mt-4 p-3 bg-red-400/10 border border-red-400/20 rounded-xl text-red-400 text-xs">
                        {connectionError}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {platforms.map((platform) => {
                    const isConnected = connectedPlatforms.includes(platform.id);
                    const isConnecting = connectingId === platform.id;

                    if (isConnected) {
                        return (
                            <div key={platform.id} className="bg-[var(--bg-card)]/40 p-6 rounded-[2rem] border border-[var(--accent-1)]/20 shadow-xl flex flex-col justify-between gap-6 transition-all animate-in fade-in zoom-in-95 h-full relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <platform.icon className="w-12 h-12" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative shrink-0">
                                        <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg", platform.color)}>
                                            <platform.icon className="w-6 h-6" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-[var(--bg-card)] rounded-full flex items-center justify-center shadow-lg">
                                            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-[900] text-[var(--text)] tracking-tight uppercase italic leading-none">{platform.name} Active</h3>
                                        <p className="text-[var(--text-dim)] font-[900] text-[9px] uppercase tracking-widest opacity-60 mt-1">Live Sync Enabled</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button className="w-full py-3 bg-white text-[var(--bg)] font-[900] uppercase tracking-widest text-[9px] rounded-xl shadow-lg transition-all hover:bg-white/90 active:scale-95">
                                        Refresh Connection
                                    </button>
                                    <button
                                        onClick={() => handleDisconnect(platform.id)}
                                        className="w-full py-3 bg-white/5 hover:bg-red-400/10 text-red-400 font-[900] uppercase tracking-widest text-[9px] rounded-xl transition-all border border-white/5 hover:border-red-400/20 active:scale-95"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={platform.id} className="bg-[var(--bg-card)]/40 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden transition-all group hover:border-white/10 flex flex-col h-full">
                            <div className="p-6 md:p-8 text-center space-y-4 flex flex-col flex-1">
                                <div className={cn("inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr rounded-2xl shadow-xl mb-2 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500 mx-auto", platform.color)}>
                                    <platform.icon className="w-8 h-8 text-white" />
                                </div>

                                <div className="flex-1 space-y-2">
                                    <h2 className="text-xl font-[900] text-[var(--text)] uppercase tracking-tight italic">Connect {platform.name}</h2>
                                    <p className="text-xs font-[900] uppercase tracking-widest text-[var(--text-dim)] leading-relaxed max-w-[200px] mx-auto">
                                        {platform.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-2 py-4 pt-6 border-t border-white/5 mt-auto">
                                    {platform.features.map((feature, i) => (
                                        <div key={i} className="space-y-1 flex flex-col items-center text-center">
                                            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-[var(--accent-1)] border border-white/5 shrink-0">
                                                <feature.icon className="w-4 h-4" />
                                            </div>
                                            <h4 className="font-[900] text-[var(--text)] text-[9px] uppercase tracking-tight">{feature.title}</h4>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleConnect(platform.id)}
                                    disabled={!!connectingId}
                                    className="w-full h-14 bg-white text-[var(--bg)] font-[900] uppercase tracking-[0.15em] text-xs rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center gap-1 disabled:opacity-50 group relative overflow-hidden shrink-0 mt-4"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

                                    {isConnecting && (
                                        <div
                                            className="absolute bottom-0 left-0 h-1 bg-[var(--accent-1)] transition-all duration-500 ease-out"
                                            style={{ width: `${syncProgress}%` }}
                                        />
                                    )}

                                    <div className="flex items-center gap-2">
                                        {isConnecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <platform.icon className="w-3 h-3" />}
                                        <span>{isConnecting ? 'Syncing...' : 'Connect Now'}</span>
                                    </div>

                                    {isConnecting && (
                                        <span className="text-[8px] font-[900] opacity-80 tracking-widest">{syncStatus}</span>
                                    )}
                                </button>
                                <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-tight font-[900] opacity-60">{platform.requires}</p>
                            </div>
                        </div>
                    );
                })}

                {/* GMB Card Integrated into Grid */}
                <div className="bg-white/[0.05] p-8 rounded-[2.5rem] border border-dashed border-white/20 flex flex-col items-center justify-center gap-4 opacity-80 relative overflow-hidden group hover:bg-white/[0.08] transition-all">
                    <div className="absolute inset-0 bg-grid-white/[0.03] [mask-image:linear-gradient(0deg,white,transparent)]" />
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-[var(--text)] border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                        <Settings className="w-8 h-8" />
                    </div>
                    <div className="text-center relative">
                        <h3 className="text-lg font-[900] text-[var(--text)] uppercase tracking-tight italic">GMB Local</h3>
                        <p className="text-[var(--text-dim)] font-[900] text-[9px] uppercase tracking-widest opacity-80 mt-1">Coming Soon</p>
                    </div>
                    <div className="px-5 py-2 text-[var(--text-dim)] font-[900] uppercase tracking-[0.2em] text-[8px] bg-white/10 rounded-full border border-white/10 mt-2">
                        Waitlist Only
                    </div>
                </div>
            </div>
        </div>
    );
}
