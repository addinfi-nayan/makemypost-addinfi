'use client';

import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    PlusCircle,
    Calendar,
    Settings,
    CreditCard,
    LogOut,
    ChevronRight,
    Sparkles,
    Instagram,
    Home
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Navbar from '@/components/Navbar';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createBrowserClient();
    const [credits, setCredits] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('credits')
                .single();

            if (profile) {
                setCredits(profile.credits);
            }
            setLoading(false);
        };

        fetchProfile();
    }, [supabase, router]);

    const navItems = [
        { title: 'Home', icon: Home, href: '/' },
        { title: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { title: 'Create Post', icon: PlusCircle, href: '/dashboard/create' },
        { title: 'Schedule', icon: Calendar, href: '/dashboard/schedule' },
        { title: 'Connect IG', icon: Instagram, href: '/dashboard/social' },
        { title: 'Settings', icon: Settings, href: '/dashboard/settings' },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] overflow-hidden relative">
                {/* 1. Rotating Background Grid & Matrix Base */}
                <div className="absolute inset-0 opacity-[0.03] animate-[spin_120s_linear_infinite] pointer-events-none">
                    <div className="absolute inset-[-100%] bg-grid-white/[0.1]" />
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(129,140,248,0.08),transparent_70%)] animate-pulse" />

                {/* 2. Floating Aesthetic Matrix Particles */}
                <div className="absolute inset-0 pointer-events-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-[var(--accent-1)]/20 rounded-full animate-float"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDuration: `${4 + Math.random() * 8}s`,
                                animationDelay: `${-Math.random() * 10}s`
                            }}
                        />
                    ))}
                </div>

                {/* 3. Dynamic Vertical Scanning Beam */}
                <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                    <div className="w-full h-40 bg-gradient-to-b from-transparent via-[var(--accent-1)] to-transparent animate-[scan_4s_ease-in-out_infinite] blur-2xl" />
                </div>

                <div className="relative flex items-center justify-center w-56 h-56 group">
                    {/* 4. Multi-Layer Technical Rings */}
                    <div className="absolute inset-0 border-[0.5px] border-[var(--accent-1)]/40 rounded-full animate-[spin_8s_linear_infinite]" />
                    <div className="absolute inset-4 border-[0.5px] border-dashed border-[var(--accent-2)]/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                    <div className="absolute inset-10 border-[1px] border-[var(--accent-1)]/10 rounded-full animate-[ping_4s_linear_infinite] opacity-30" />
                    <div className="absolute inset-14 border-[0.5px] border-[var(--accent-3)]/20 rounded-full animate-[spin_20s_linear_infinite]" />

                    {/* Core Matrix Core */}
                    <div className="relative">
                        {/* Layered Glows */}
                        <div className="absolute -inset-16 bg-[var(--accent-1)]/10 blur-[80px] rounded-full animate-pulse" />
                        <div className="absolute -inset-10 bg-[var(--accent-2)]/5 blur-[40px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
                        <Sparkles className="w-12 h-12 text-[var(--accent-1)] animate-glow relative z-10" />
                    </div>

                    {/* Technical Orbital Indicators */}
                    <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--accent-1)] rounded-full shadow-[0_0_15px_var(--accent-1)]" />
                    </div>
                </div>

                {/* 5. Thematic Loading Feedback */}
                <div className="mt-20 space-y-5 text-center z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex flex-col items-center">
                        <p className="text-[10px] font-black text-[var(--accent-1)] uppercase tracking-[0.6em] animate-[pulse_3s_infinite]">Aesthetic Engine</p>
                        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-[var(--accent-1)]/40 to-transparent mt-3 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/40 translate-x-[-100%] animate-[shimmer_2.5s_infinite]" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 justify-center">
                        <div className="w-1.5 h-1.5 bg-[var(--accent-1)] rounded-full animate-bounce [animation-delay:-0.4s]" />
                        <div className="w-1.5 h-1.5 bg-[var(--accent-2)] rounded-full animate-bounce [animation-delay:-0.2s]" />
                        <div className="w-1.5 h-1.5 bg-[var(--accent-3)] rounded-full animate-bounce" />
                    </div>

                    <div className="space-y-1">
                        <p className="text-[11px] font-black text-[var(--text-dim)] uppercase tracking-widest opacity-40">Synchronizing Design Matrix</p>
                        <p className="text-[8px] font-black text-[var(--accent-1)]/30 uppercase tracking-[0.3em]">Phase 01: Brand DNA Synthesis</p>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex overflow-hidden relative">
            <Navbar showDashboardLink={false} hideUserDropdown={false} />
            
            {/* Background Effects */}
            <div className="absolute inset-0 mesh-gradient opacity-40 pointer-events-none" />

            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden fixed top-20 right-6 z-[60] p-3 bg-[var(--bg-card)]/80 backdrop-blur-xl rounded-2xl border border-[var(--border)] shadow-2xl text-[var(--text)] group active:scale-95 transition-all"
            >
                <div className="w-6 h-5 flex flex-col justify-between items-center">
                    <span className={cn("w-full h-0.5 bg-current rounded-full transition-all", isSidebarOpen && "rotate-45 translate-y-[9px]")} />
                    <span className={cn("w-full h-0.5 bg-current rounded-full transition-all", isSidebarOpen && "opacity-0")} />
                    <span className={cn("w-full h-0.5 bg-current rounded-full transition-all", isSidebarOpen && "-rotate-45 -translate-y-[9px]")} />
                </div>
            </button>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 md:hidden animate-in fade-in duration-300"
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed md:static inset-y-0 left-0 w-80 glass-morphism p-8 flex flex-col z-50 transition-transform duration-500 ease-out md:translate-x-0 outline-none border-r border-[var(--border)] mt-14",
                isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
            )}>
                {/* Credit Card at the top */}
                <div className="mb-10">
                    <div className="gradient-border overflow-hidden">
                        <div className="bg-[var(--bg-card)] p-6 rounded-[1rem] relative group border border-white/5">
                            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                                <Sparkles className="w-24 h-24" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[var(--text-muted)] text-[11px] font-black uppercase tracking-widest">Available Credits</p>
                                <div className="text-4xl font-black mt-2 flex items-baseline gap-2 grad-text">
                                    {credits ?? 0}
                                    <span className="text-[11px] font-black text-[var(--accent-1)] tracking-widest opacity-80">Credits</span>
                                </div>
                                <Link
                                    href="/dashboard/billing"
                                    className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-white text-[var(--bg)] rounded-xl text-[11px] font-black uppercase tracking-widest transition-all hover:bg-white/90 active:scale-[0.98]"
                                >
                                    Re-Charge <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 px-5 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all group relative overflow-hidden",
                                    isActive
                                        ? "bg-[var(--accent-1)]/10 text-[var(--accent-1)] border border-[var(--accent-1)]/20 shadow-[0_0_20px_rgba(129,140,248,0.1)]"
                                        : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5"
                                )}
                            >
                                {isActive && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-1)]/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />}
                                <item.icon className={cn("w-4 h-4 transition-transform duration-500 group-hover:scale-110", isActive ? "text-[var(--accent-1)]" : "group-hover:text-[var(--accent-1)]")} />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 mt-14">
                <div className="max-w-6xl mx-auto pb-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
