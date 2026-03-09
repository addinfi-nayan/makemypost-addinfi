'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    PenTool,
    Share2,
    Calendar,
    Settings,
    CreditCard,
    LogOut,
    Menu,
    X,
    PlusCircle,
    Sparkles
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    href: string;
    active: boolean;
    collapsed: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active, collapsed }: SidebarItemProps) => (
    <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${active
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
    >
        <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
        {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
        {active && !collapsed && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent-1)] shadow-[0_0_8px_var(--accent-1)]" />
        )}
    </Link>
);

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [credits, setCredits] = useState<number>(0);
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createBrowserClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/');
                return;
            }
            setUser(user);

            // Fetch credits
            const { data: profile } = await supabase
                .from('profiles')
                .select('credits')
                .eq('id', user.id)
                .single();

            if (profile) setCredits(profile.credits || 0);
        };
        getUser();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: Sparkles, label: 'Create Post', href: '/dashboard/create' },
        { icon: Share2, label: 'Social Accounts', href: '/dashboard/social' },
        { icon: Calendar, label: 'Schedule', href: '/dashboard/schedule' },
        { icon: CreditCard, label: 'Billing', href: '/dashboard/billing' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg)] text-white flex overflow-hidden">
            {/* ─── Desktop Sidebar ─── */}
            <aside
                className={`hidden md:flex flex-col border-r border-white/5 bg-[var(--bg-raised)] transition-all duration-300 relative z-30 ${isCollapsed ? 'w-20' : 'w-64'
                    }`}
            >
                <div className="p-6 flex items-center justify-between">
                    {!isCollapsed && (
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-lg font-bold tracking-tight">Make<span className="grad-text">My</span>Posts</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors ml-auto"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 px-3 py-4 space-y-1.5">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.href}
                            {...item}
                            active={pathname === item.href}
                            collapsed={isCollapsed}
                        />
                    ))}
                </div>

                {/* Credit Display */}
                {!isCollapsed && (
                    <div className="px-6 py-4 mx-3 mb-4 rounded-2xl bg-gradient-to-br from-[var(--accent-1)]/10 to-[var(--accent-2)]/5 border border-[var(--accent-1)]/10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Credits</span>
                            <CreditCard className="w-3.5 h-3.5 text-[var(--accent-1)]" />
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold">{credits}</span>
                            <span className="text-xs text-white/40">Posts</span>
                        </div>
                        <button className="w-full mt-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-medium transition-colors border border-white/5">
                            Top Up
                        </button>
                    </div>
                )}

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleSignOut}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-red-500/10 transition-all group`}
                    >
                        <LogOut className="w-5 h-5 text-white/40 group-hover:text-red-400 transition-colors" />
                        {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* ─── Mobile Header ─── */}
            <div className="flex flex-col flex-1 h-screen overflow-hidden">
                <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[var(--bg-raised)]">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-lg font-bold">Make<span className="grad-text">My</span>Posts</span>
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 text-white/70"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                {/* ─── Main Content ─── */}
                <main className="flex-1 overflow-y-auto mesh-gradient relative">
                    <div className="max-w-7xl mx-auto p-4 md:p-8 pt-6 md:pt-10">
                        {children}
                    </div>
                </main>
            </div>

            {/* ─── Mobile Menu Overlay ─── */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden overflow-hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="absolute inset-y-0 right-0 w-72 bg-[var(--bg-raised)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-6 flex items-center justify-between border-b border-white/5">
                            <span className="font-bold">Menu</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-1 px-4 py-6 space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl ${pathname === item.href ? 'bg-white/10 text-white' : 'text-white/50'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                        <div className="p-6 border-t border-white/5">
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 bg-red-400/5 font-medium"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
